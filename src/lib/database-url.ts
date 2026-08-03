/**
 * Resuelve la URL de MySQL para Prisma.
 *
 * En hosting con BD adjunta (Secrets), suelen existir:
 * DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
 *
 * Prisma usa DATABASE_URL; si hay DB_*, se construye automáticamente.
 */

export type DatabaseUrlSource = "DB_*" | "DATABASE_URL" | "none";

export type ResolvedDatabaseUrl = {
  url: string | undefined;
  source: DatabaseUrlSource;
  host?: string;
  port?: string;
  database?: string;
};

function hasHostedDbSecrets() {
  return Boolean(
    process.env.DB_HOST?.trim() &&
      process.env.DB_USER?.trim() &&
      process.env.DB_NAME?.trim(),
  );
}

/** Codifica usuario/password para URL mysql:// */
function enc(value: string) {
  return encodeURIComponent(value);
}

export function buildDatabaseUrlFromDbSecrets(): string | undefined {
  if (!hasHostedDbSecrets()) return undefined;
  const host = process.env.DB_HOST!.trim();
  const user = process.env.DB_USER!.trim();
  const password = process.env.DB_PASSWORD ?? "";
  const database = process.env.DB_NAME!.trim();
  const port = (process.env.DB_PORT?.trim() || "3306").replace(/^:/, "");
  return `mysql://${enc(user)}:${enc(password)}@${host}:${port}/${enc(database)}`;
}

/**
 * Asegura `process.env.DATABASE_URL` antes de crear PrismaClient.
 * Prioriza DB_* del hosting cuando están presentes.
 */
export function ensureDatabaseUrl(): ResolvedDatabaseUrl {
  const fromSecrets = buildDatabaseUrlFromDbSecrets();
  if (fromSecrets) {
    process.env.DATABASE_URL = fromSecrets;
    return {
      url: fromSecrets,
      source: "DB_*",
      host: process.env.DB_HOST?.trim(),
      port: process.env.DB_PORT?.trim() || "3306",
      database: process.env.DB_NAME?.trim(),
    };
  }

  const existing = process.env.DATABASE_URL?.trim();
  if (existing) {
    try {
      const u = new URL(existing);
      return {
        url: existing,
        source: "DATABASE_URL",
        host: u.hostname,
        port: u.port || "3306",
        database: decodeURIComponent(
          u.pathname.replace(/^\//, "").split("?")[0] || "",
        ),
      };
    } catch {
      return { url: existing, source: "DATABASE_URL" };
    }
  }

  return { url: undefined, source: "none" };
}
