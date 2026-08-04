/**
 * Empaqueta public/uploads para subirlos al servidor junto con el dump SQL.
 * Uso: npx tsx scripts/pack-uploads.ts
 *
 * El SQL solo guarda rutas (/uploads/archivo.png). Sin estos archivos
 * en el servidor, las imágenes del CMS no se ven.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const uploadsDir = path.join(root, "public", "uploads");
const outDir = path.join(root, "dumps");

function main() {
  if (!fs.existsSync(uploadsDir)) {
    console.error("No existe public/uploads");
    process.exit(1);
  }

  const files = fs
    .readdirSync(uploadsDir)
    .filter((f) => f !== ".gitkeep" && !f.startsWith("."));
  if (!files.length) {
    console.warn("public/uploads está vacío — nada que empaquetar.");
    process.exit(0);
  }

  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const zipName = `distrito-uploads-${stamp}.zip`;
  const zipPath = path.join(outDir, zipName);
  const latest = path.join(outDir, "distrito-uploads-latest.zip");

  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
  if (fs.existsSync(latest)) fs.unlinkSync(latest);

  // PowerShell Compress-Archive (Windows) o zip (Unix)
  try {
    if (process.platform === "win32") {
      execFileSync(
        "powershell.exe",
        [
          "-NoProfile",
          "-Command",
          `Compress-Archive -Path '${uploadsDir}\\*' -DestinationPath '${zipPath}' -Force`,
        ],
        { stdio: "inherit" },
      );
    } else {
      execFileSync("zip", ["-r", zipPath, "."], {
        cwd: uploadsDir,
        stdio: "inherit",
      });
    }
  } catch (e) {
    console.error("No se pudo crear el zip:", e);
    process.exit(1);
  }

  fs.copyFileSync(zipPath, latest);
  console.log(`OK: ${latest}`);
  console.log(`Archivos: ${files.length}`);
  console.log(
    "En el servidor descomprima dentro de public/uploads/ (o .next/standalone/public/uploads/).",
  );
}

main();
