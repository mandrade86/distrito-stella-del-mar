#Requires -Version 5.1
<#
  Sube index.html, styles.css, assets/ (y .htaccess si existe) por FTP/FTPS.

  Consejos:
  - Muchos hostings exigen FTPS: usa -UseSsl
  - Contraseña con # u otros símbolos: usa comillas simples: -Password 'tu#clave'
  - Si .NET falla, prueba: -UseCurl (usa curl.exe del sistema)

  Uso:
    .\deploy-ftp.ps1 -FtpHost "ftp.dominio.com" -RemoteBasePath "/public_html" -Username "user" -Password 'clave' -UseSsl
#>

param(
  [Parameter(Mandatory = $true)]
  [string]$FtpHost,

  [string]$RemoteBasePath = "/public_html",

  [string]$Username = $env:FTP_USER,

  [string]$Password = $env:FTP_PASS,

  [int]$FtpPort = 0,

  [switch]$UseSsl,

  [switch]$SkipCertCheck,

  [switch]$UseCurl,

  [switch]$SkipConnectionTest,

  [switch]$WhatIf,

  [switch]$VerboseLog,

  # Tiempo máximo de espera por operación FTP (ms). Por defecto 120 s.
  [int]$TimeoutMs = 120000,

  # Modo activo FTP (UsePassive=$false). Prueba si el pasivo falla por firewall/NAT.
  [switch]$UseActive
)

$ErrorActionPreference = "Stop"

$script:FtpTimeoutMs = $TimeoutMs
$script:FtpUsePassive = -not $UseActive

function Write-Diag {
  param([string]$Message)
  if ($VerboseLog) { Write-Host "[diag] $Message" -ForegroundColor DarkGray }
}

if ([string]::IsNullOrWhiteSpace($Username) -or [string]::IsNullOrWhiteSpace($Password)) {
  throw "Define FTP_USER y FTP_PASS (entorno) o -Username y -Password."
}

# TLS 1.2 (muchas APIs FTP lo exigen)
try {
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls11 -bor [Net.SecurityProtocolType]::Tls
} catch {}

if ($SkipCertCheck -and $UseSsl) {
  $callback = { param($sender, $cert, $chain, $errors) return $true }
  [System.Net.ServicePointManager]::ServerCertificateValidationCallback = $callback
}

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = (Resolve-Path -LiteralPath $projectRoot).Path

$itemsToUpload = @(
  "index.html",
  "styles.css",
  ".htaccess",
  "assets"
)

function Get-FtpAuthority {
  if ($FtpPort -gt 0) { return "${FtpHost}:${FtpPort}" }
  return $FtpHost
}

function Get-RelativePathToProject {
  param([string]$FullPath)
  $root = $projectRoot.TrimEnd("\", "/")
  $full = $FullPath
  if (-not $full.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Ruta fuera del proyecto: $FullPath"
  }
  $rest = $full.Substring($root.Length).TrimStart("\", "/")
  return $rest -replace "\\", "/"
}

function Join-RemotePath {
  param([string]$Base, [string]$Relative)
  $b = ($Base -replace "\\", "/").TrimEnd("/")
  $r = ($Relative -replace "\\", "/").TrimStart("/")
  if ([string]::IsNullOrWhiteSpace($b)) { return "/$r" }
  return "$b/$r"
}

function Get-FtpParentPath {
  param([string]$UnixPath)
  $p = ($UnixPath -replace "\\", "/").TrimEnd("/")
  $i = $p.LastIndexOf("/")
  if ($i -le 0) { return "" }
  return $p.Substring(0, $i)
}

function Initialize-FtpRequest {
  param([System.Net.FtpWebRequest]$Request)
  $Request.Timeout = $script:FtpTimeoutMs
  try {
    $Request.ReadWriteTimeout = $script:FtpTimeoutMs
  } catch {}
  $Request.UsePassive = $script:FtpUsePassive
}

function Test-FtpList {
  param([string]$Path)
  $auth = Get-FtpAuthority
  $uri = "ftp://${auth}$Path"
  Write-Diag "Probando listado: $uri (SSL=$UseSsl)"
  $req = [System.Net.FtpWebRequest]::Create($uri)
  $req.Credentials = New-Object System.Net.NetworkCredential($Username, $Password)
  $req.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
  $req.UseBinary = $true
  $req.EnableSsl = $UseSsl
  $req.KeepAlive = $false
  Initialize-FtpRequest -Request $req
  $resp = $req.GetResponse()
  try {
    $null = $resp.StatusDescription
    Write-Host "Conexión FTP OK (listado en $Path)." -ForegroundColor Green
    return $true
  } finally {
    $resp.Close()
  }
}

function Ensure-RemoteDir {
  param([string]$DirPath)

  if ([string]::IsNullOrWhiteSpace($DirPath) -or $DirPath -eq "/") { return }

  $auth = Get-FtpAuthority
  $segments = ($DirPath.Trim("/") -split "/") | Where-Object { $_ }
  $current = ""
  foreach ($segment in $segments) {
    $current += "/$segment"
    $mkUri = "ftp://${auth}$current"
    try {
      $mkReq = [System.Net.FtpWebRequest]::Create($mkUri)
      $mkReq.Credentials = New-Object System.Net.NetworkCredential($Username, $Password)
      $mkReq.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
      $mkReq.UseBinary = $true
      $mkReq.EnableSsl = $UseSsl
      $mkReq.KeepAlive = $false
      Initialize-FtpRequest -Request $mkReq
      $r = $mkReq.GetResponse()
      $r.Close()
      Write-Diag "Carpeta creada: $current"
    } catch {
      Write-Diag "MKD $current : $($_.Exception.Message)"
    }
  }
}

function Write-FtpException {
  param($Ex, [string]$Uri)
  Write-Host "URI: $Uri" -ForegroundColor Yellow
  Write-Host "Error: $($Ex.Message)" -ForegroundColor Red
  if ($Ex.InnerException) {
    Write-Host "Inner: $($Ex.InnerException.Message)" -ForegroundColor Red
  }
  $w = $Ex -as [System.Net.WebException]
  if ($w -and $w.Response) {
    try {
      $rs = $w.Response.GetResponseStream()
      if ($rs) {
        $sr = New-Object System.IO.StreamReader($rs)
        $body = $sr.ReadToEnd()
        if ($body) { Write-Host "Respuesta servidor: $body" -ForegroundColor Yellow }
      }
    } catch {}
  }
}

function Upload-NetFtp {
  param([string]$LocalFile, [string]$UploadPath)

  $auth = Get-FtpAuthority
  $uploadUri = "ftp://${auth}$UploadPath"
  Write-Diag "Subiendo vía .NET: $uploadUri"

  $request = [System.Net.FtpWebRequest]::Create($uploadUri)
  $request.Credentials = New-Object System.Net.NetworkCredential($Username, $Password)
  $request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
  $request.UseBinary = $true
  $request.EnableSsl = $UseSsl
  $request.KeepAlive = $false
  Initialize-FtpRequest -Request $request

  $content = [System.IO.File]::ReadAllBytes($LocalFile)
  $request.ContentLength = $content.Length

  try {
    $stream = $request.GetRequestStream()
    try {
      $stream.Write($content, 0, $content.Length)
    } finally {
      $stream.Close()
    }
    $response = $request.GetResponse()
    try {
      $null = $response.StatusDescription
    } finally {
      $response.Close()
    }
  } catch {
    Write-FtpException -Ex $_ -Uri $uploadUri
    throw
  }
}

function Upload-CurlExe {
  param([string]$LocalFile, [string]$UploadPath)

  $curl = Get-Command curl.exe -ErrorAction SilentlyContinue
  if (-not $curl) {
    throw "curl.exe no está en PATH. Instala curl o quita -UseCurl."
  }

  $auth = Get-FtpAuthority
  $remoteUrl = "ftp://${auth}$UploadPath"
  Write-Diag "Subiendo vía curl: $remoteUrl"

  $curlArgs = New-Object System.Collections.Generic.List[string]
  if ($UseSsl) {
    [void]$curlArgs.Add("--ssl-reqd")
  }
  if ($SkipCertCheck -and $UseSsl) {
    [void]$curlArgs.Add("-k")
  }
  [void]$curlArgs.Add("-sS")
  [void]$curlArgs.Add("--show-error")
  [void]$curlArgs.Add("-T")
  [void]$curlArgs.Add($LocalFile)
  [void]$curlArgs.Add("-u")
  [void]$curlArgs.Add("${Username}:${Password}")
  [void]$curlArgs.Add($remoteUrl)

  & curl.exe @($curlArgs.ToArray())
  if ($LASTEXITCODE -ne 0) {
    throw "curl terminó con código $LASTEXITCODE"
  }
}

function Upload-OneFile {
  param(
    [string]$LocalFile,
    [string]$RemoteRelativePath
  )

  $remoteRelativePath = ($RemoteRelativePath -replace "\\", "/").TrimStart("/")
  $fullRemote = Join-RemotePath -Base $RemoteBasePath -Relative $remoteRelativePath
  $fullRemote = ($fullRemote -replace "\\", "/")
  if (-not $fullRemote.StartsWith("/")) { $fullRemote = "/$fullRemote" }

  $dirOnly = Get-FtpParentPath -UnixPath $fullRemote
  if ($dirOnly -and $dirOnly -ne "/") {
    Ensure-RemoteDir -DirPath $dirOnly
  }

  $uploadPath = $fullRemote

  if ($WhatIf) {
    Write-Host "[WhatIf] $LocalFile -> $uploadPath"
    return
  }

  if ($UseCurl) {
    Upload-CurlExe -LocalFile $LocalFile -UploadPath $uploadPath
  } else {
    Upload-NetFtp -LocalFile $LocalFile -UploadPath $uploadPath
  }

  Write-Host "OK: $remoteRelativePath -> $uploadPath" -ForegroundColor Green
}

# --- Recolectar archivos locales ---
$files = New-Object System.Collections.Generic.List[string]

foreach ($item in $itemsToUpload) {
  $fullPath = Join-Path $projectRoot $item
  if (-not (Test-Path -LiteralPath $fullPath)) {
    Write-Warning "No existe (omitido): $item"
    continue
  }

  if ((Get-Item -LiteralPath $fullPath).PSIsContainer) {
    Get-ChildItem -LiteralPath $fullPath -Recurse -File | ForEach-Object {
      $rel = Get-RelativePathToProject -FullPath $_.FullName
      $null = $files.Add($rel)
    }
  } else {
    $normalizedItem = $item -replace "\\", "/"
    $null = $files.Add($normalizedItem)
  }
}

if ($files.Count -eq 0) {
  Write-Warning "No hay archivos para subir. ¿Existen index.html, styles.css y la carpeta assets?"
  exit 1
}

Write-Host "Archivos locales a subir: $($files.Count)" -ForegroundColor Cyan
if ($VerboseLog) {
  foreach ($f in $files) {
    $lp = Join-Path $projectRoot ($f -replace "/", [IO.Path]::DirectorySeparatorChar)
    Write-Host "  - $f | existe=$(Test-Path -LiteralPath $lp)" -ForegroundColor DarkGray
  }
}

# --- Probar conexión (opcional) ---
if (-not $WhatIf -and -not $UseCurl -and -not $SkipConnectionTest) {
  try {
    $testPath = if ([string]::IsNullOrWhiteSpace($RemoteBasePath)) { "/" } else { $RemoteBasePath }
    $null = Test-FtpList -Path $testPath
  } catch {
    Write-Host "No se pudo listar la ruta remota '$testPath'." -ForegroundColor Red
    Write-FtpException -Ex $_ -Uri "ftp://$(Get-FtpAuthority)$testPath"
    $msg = $_.Exception.Message
    if ($msg -match "timed out|timeout|Timeout") {
      Write-Host ""
      Write-Host "Timeout: el servidor suele exigir FTPS o hay firewall/NAT." -ForegroundColor Yellow
      Write-Host "  1) Mismo comando pero con: -UseSsl" -ForegroundColor White
      Write-Host "  2) Si el certificado falla: -UseSsl -SkipCertCheck" -ForegroundColor White
      Write-Host "  3) Modo activo FTP: -UseActive" -ForegroundColor White
      Write-Host "  4) Saltar esta prueba e intentar subir: -SkipConnectionTest" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "Otras opciones:" -ForegroundColor Yellow
    Write-Host "  - Si al conectar ya estás en la carpeta del sitio: -RemoteBasePath ''"
    Write-Host "  - Subida con curl: -UseCurl -UseSsl"
    throw
  }
}

Write-Host "Host: $(Get-FtpAuthority) | Base: '$RemoteBasePath' | SSL: $UseSsl | Pasivo: $($script:FtpUsePassive) | Curl: $UseCurl | Timeout: ${TimeoutMs}ms" -ForegroundColor Cyan

foreach ($rel in $files) {
  $local = Join-Path $projectRoot ($rel -replace "/", [IO.Path]::DirectorySeparatorChar)
  if (-not (Test-Path -LiteralPath $local)) {
    Write-Warning "No encontrado local (omitido): $local"
    continue
  }
  Upload-OneFile -LocalFile $local -RemoteRelativePath $rel
}

Write-Host "Carga FTP finalizada ($($files.Count) archivos)." -ForegroundColor Cyan
