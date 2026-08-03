/**
 * Tras `next build` (output: standalone), copia `public/` (imágenes, uploads
 * estáticos) y `.next/static` dentro de `.next/standalone` para que el deploy
 * en cPanel / PM2 sirva logos, masterplan y renders.
 */
import fs from "node:fs";
import path from "node:path";

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`[copy-standalone-public] skip missing: ${src}`);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log(`[copy-standalone-public] ${src} → ${dest}`);
}

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");

if (!fs.existsSync(standalone)) {
  console.log(
    "[copy-standalone-public] no .next/standalone (¿output standalone?). Nada que copiar.",
  );
  process.exit(0);
}

copyDir(path.join(root, "public"), path.join(standalone, "public"));
copyDir(
  path.join(root, ".next", "static"),
  path.join(standalone, ".next", "static"),
);
