/**
 * Dump SQL compatible con phpMyAdmin / cPanel / GoDaddy.
 * Uso: npx tsx scripts/export-sql-dump.ts
 */
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile();

// Hosting Secrets (DB_*) → DATABASE_URL para Prisma
{
  const host = process.env.DB_HOST?.trim();
  const user = process.env.DB_USER?.trim();
  const database = process.env.DB_NAME?.trim();
  if (host && user && database) {
    const password = process.env.DB_PASSWORD ?? "";
    const port = process.env.DB_PORT?.trim() || "3306";
    process.env.DATABASE_URL = `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(database)}`;
  }
}

const prisma = new PrismaClient();

function sqlLiteral(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "NULL";
  }
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "boolean") return value ? "1" : "0";
  if (value instanceof Date) {
    const iso = value.toISOString().slice(0, 19).replace("T", " ");
    return `'${iso}'`;
  }
  if (Buffer.isBuffer(value)) {
    return `X'${value.toString("hex")}'`;
  }
  // Objects (JSON columns from Prisma) → JSON string
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }
  const s = String(value)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "''")
    .replace(/\0/g, "");
  return `'${s}'`;
}

function quoteIdent(name: string) {
  return `\`${name.replace(/`/g, "``")}\``;
}

/** Suaviza DDL para hosts compartidos (GoDaddy / MariaDB antiguos). */
function softenCreateSql(createSql: string): string {
  return createSql
    .replace(/datetime\(3\)/gi, "datetime")
    .replace(/CURRENT_TIMESTAMP\(3\)/gi, "CURRENT_TIMESTAMP")
    .replace(/\bjson\b/gi, "longtext")
    .replace(/ COLLATE utf8mb4_unicode_ci/gi, "")
    .replace(
      /`updatedAt` datetime NOT NULL(?!\s+DEFAULT)/gi,
      "`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP",
    );
}

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("Falta DATABASE_URL en .env");
    process.exit(1);
  }

  const dbName = decodeURIComponent(
    new URL(url).pathname.replace(/^\//, "").split("?")[0],
  );

  const tables = await prisma.$queryRawUnsafe<Record<string, string>[]>(
    "SHOW TABLES",
  );
  const tableKey = Object.keys(tables[0] || {})[0];
  const tableNames = tables.map((t) => String(t[tableKey]));

  const lines: string[] = [
    `-- Distrito Stella del Mar CMS dump (GoDaddy / phpMyAdmin compatible)`,
    `-- Database: ${dbName}`,
    `-- Generated: ${new Date().toISOString()}`,
    `--`,
    `-- IMPORTANTE phpMyAdmin:`,
    `-- 1) Seleccione la base de datos vacía ${dbName} (o créela antes)`,
    `-- 2) Importar → elegir este archivo → Continuar`,
    `-- 3) Charset: utf8mb4`,
    `--`,
    `-- CLI: mysql -u USER -p ${dbName} < distrito-cms-godaddy.sql`,
    ``,
    `SET NAMES utf8mb4;`,
    `SET FOREIGN_KEY_CHECKS=0;`,
    ``,
  ];

  for (const table of tableNames) {
    const createRows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SHOW CREATE TABLE ${quoteIdent(table)}`,
    );
    const createValues = Object.values(createRows[0] || {});
    let createSql = String(createValues[1] ?? "");
    if (!createSql.startsWith("CREATE TABLE")) continue;
    createSql = softenCreateSql(createSql);

    lines.push(`DROP TABLE IF EXISTS ${quoteIdent(table)};`);
    lines.push(`${createSql};`);
    lines.push(``);

    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT * FROM ${quoteIdent(table)}`,
    );
    if (!rows.length) {
      lines.push(`-- ${table}: 0 rows`);
      lines.push(``);
      continue;
    }

    const cols = Object.keys(rows[0]);
    const colList = cols.map(quoteIdent).join(", ");

    // Una fila por INSERT → más compatible con límites de phpMyAdmin
    for (const row of rows) {
      const values = cols.map((c) => sqlLiteral(row[c])).join(", ");
      lines.push(
        `INSERT INTO ${quoteIdent(table)} (${colList}) VALUES (${values});`,
      );
    }
    lines.push(`-- ${table}: ${rows.length} rows`);
    lines.push(``);
  }

  lines.push(`SET FOREIGN_KEY_CHECKS=1;`);
  lines.push(``);

  const outDir = path.join(process.cwd(), "dumps");
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const outFile = path.join(outDir, `distrito-cms-godaddy-${stamp}.sql`);
  const latest = path.join(outDir, "distrito-cms-godaddy.sql");
  const alsoLatest = path.join(outDir, "distrito-cms-latest.sql");
  const body = lines.join("\n");
  fs.writeFileSync(outFile, body, "utf8");
  fs.copyFileSync(outFile, latest);
  fs.copyFileSync(outFile, alsoLatest);

  console.log(`OK: ${latest}`);
  console.log(`Tamaño: ${(Buffer.byteLength(body) / 1024).toFixed(1)} KB`);
  console.log(`Tablas: ${tableNames.length}`);

  // Aviso: el SQL no incluye archivos de public/uploads
  const uploadRefs = body.match(/\/uploads\/[A-Za-z0-9._-]+/g) || [];
  const uniqueUploads = [...new Set(uploadRefs)];
  if (uniqueUploads.length) {
    console.log("");
    console.log(
      `AVISO: el dump referencia ${uniqueUploads.length} archivo(s) en /uploads/.`,
    );
    console.log(
      "El SQL NO copia esos archivos. En el servidor suba public/uploads/",
    );
    console.log("  npm run db:pack-uploads  →  dumps/distrito-uploads-latest.zip");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
