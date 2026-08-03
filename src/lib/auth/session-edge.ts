/**
 * Verificación de sesión admin compatible con Edge Middleware (Web Crypto).
 * Debe coincidir con el HMAC-SHA256 base64url de src/lib/auth/session.ts
 */

export const ADMIN_SESSION_COOKIE = "distrito_admin_session";

function secret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    "dev-insecure-admin-secret-change-me"
  );
}

function bytesToBase64Url(bytes: ArrayBuffer) {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function timingSafeEqualStr(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function hasValidAdminSession(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const [body, signature] = token.split(".");
  if (!body || !signature) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(body),
  );
  const expected = bytesToBase64Url(sigBuf);
  if (!timingSafeEqualStr(signature, expected)) return false;

  try {
    const json = (() => {
      const pad =
        body.length % 4 === 0 ? "" : "=".repeat(4 - (body.length % 4));
      const b64 = body.replace(/-/g, "+").replace(/_/g, "/") + pad;
      return JSON.parse(atob(b64)) as { exp?: number };
    })();
    if (!json.exp || Date.now() > json.exp) return false;
    return true;
  } catch {
    return false;
  }
}

/** Rutas siempre accesibles aunque el sitio no esté en vivo. */
export function isSiteAccessExempt(pathname: string) {
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/api/admin")) return true;
  if (pathname === "/api/health") return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/images")) return true;
  if (pathname.startsWith("/uploads")) return true;
  if (pathname === "/favicon.ico") return true;
  if (pathname === "/robots.txt") return true;
  if (pathname === "/sitemap.xml") return true;
  return false;
}
