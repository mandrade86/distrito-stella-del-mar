import { createHmac, timingSafeEqual } from "crypto";

/** Nombre de cookie de sesión admin (compartido con Edge middleware). */
export const ADMIN_SESSION_COOKIE = "distrito_admin_session";

function secret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    "dev-insecure-admin-secret-change-me"
  );
}

export function signSessionBody(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Verifica cookie de admin (Node runtime: layout, API). */
export function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = signSessionBody(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as {
      sub: string;
      email: string;
      exp: number;
    };
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}
