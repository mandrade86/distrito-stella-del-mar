const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join("src", "data", "stores.ts"), "utf8");
const matches = [...src.matchAll(/hotspot:\s*\{\s*x:\s*([\d.]+),\s*y:\s*([\d.]+),\s*w:\s*([\d.]+),\s*h:\s*([\d.]+)\s*\}/g)];
const stores = matches.map((m) => ({
  hotspot: { x: +m[1], y: +m[2], w: +m[3], h: +m[4] },
}));

const W = 470;
const H = 400;
const rects = stores
  .map((s) => {
    const x = (s.hotspot.x / 100) * W;
    const y = (s.hotspot.y / 100) * H;
    const w = (s.hotspot.w / 100) * W;
    const h = (s.hotspot.h / 100) * H;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="rgba(14,116,144,0.28)" stroke="rgb(8,47,83)" stroke-width="1.5"/>`;
  })
  .join("");

const svg = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`,
);

sharp("public/images/masterplan/planta-2n-crop.png")
  .composite([{ input: svg, top: 0, left: 0 }])
  .png()
  .toFile("public/images/masterplan/planta-2n-preview.png")
  .then(() => console.log("preview", stores.length, "hotspots"));
