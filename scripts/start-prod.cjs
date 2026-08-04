/**
 * Arranque producción (GoDaddy panel, sin terminal):
 * 1) Arma DATABASE_URL desde DB_* si hace falta (Prisma CLI no lee DB_*)
 * 2) prisma db push
 * 3) next start
 */
const { spawnSync } = require("node:child_process");
const path = require("node:path");

function buildDatabaseUrlFromDbSecrets() {
  const host = process.env.DB_HOST?.trim();
  const user = process.env.DB_USER?.trim();
  const database = process.env.DB_NAME?.trim();
  if (!host || !user || !database) return null;
  const password = process.env.DB_PASSWORD ?? "";
  const port = (process.env.DB_PORT?.trim() || "3306").replace(/^:/, "");
  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(database)}`;
}

function ensureDatabaseUrl() {
  if (process.env.DATABASE_URL?.trim()) return process.env.DATABASE_URL.trim();
  const fromSecrets = buildDatabaseUrlFromDbSecrets();
  if (fromSecrets) {
    process.env.DATABASE_URL = fromSecrets;
    console.log(
      "[start-prod] DATABASE_URL armada desde DB_HOST/DB_USER/DB_NAME (Secrets).",
    );
    return fromSecrets;
  }
  console.error(
    "[start-prod] Falta DATABASE_URL o el set DB_HOST + DB_USER + DB_NAME + DB_PASSWORD.",
  );
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

ensureDatabaseUrl();

const prismaBin = path.join(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "prisma.cmd" : "prisma",
);
const nextBin = path.join(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.cmd" : "next",
);

run(prismaBin, ["db", "push", "--skip-generate"]);
run(nextBin, ["start", "-H", "0.0.0.0"]);
