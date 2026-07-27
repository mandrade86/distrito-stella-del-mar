const sharp = require("sharp");

async function main() {
  const { data, info } = await sharp("public/images/masterplan/planta-2n-crop.png")
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const mask = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r >= 232 && r <= 248 && g >= 232 && g <= 248 && b >= 232 && b <= 248) {
        mask[y * width + x] = 1;
      }
    }
  }

  // erode 2px to break thin bridges between units
  const eroded = new Uint8Array(width * height);
  const erodeR = 2;
  for (let y = erodeR; y < height - erodeR; y++) {
    for (let x = erodeR; x < width - erodeR; x++) {
      let ok = true;
      for (let dy = -erodeR; dy <= erodeR && ok; dy++) {
        for (let dx = -erodeR; dx <= erodeR; dx++) {
          if (!mask[(y + dy) * width + (x + dx)]) {
            ok = false;
            break;
          }
        }
      }
      if (ok) eroded[y * width + x] = 1;
    }
  }

  const visited = new Uint8Array(width * height);
  const boxes = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const k = y * width + x;
      if (visited[k] || !eroded[k]) continue;

      let minX = x,
        maxX = x,
        minY = y,
        maxY = y,
        count = 0;
      const stack = [[x, y]];
      visited[k] = 1;

      while (stack.length) {
        const [cx, cy] = stack.pop();
        count++;
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;
        for (const [nx, ny] of [
          [cx + 1, cy],
          [cx - 1, cy],
          [cx, cy + 1],
          [cx, cy - 1],
        ]) {
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const nk = ny * width + nx;
          if (visited[nk] || !eroded[nk]) continue;
          visited[nk] = 1;
          stack.push([nx, ny]);
        }
      }

      // expand box by erosion radius
      minX = Math.max(0, minX - erodeR);
      minY = Math.max(0, minY - erodeR);
      maxX = Math.min(width - 1, maxX + erodeR);
      maxY = Math.min(height - 1, maxY + erodeR);

      const w = maxX - minX + 1;
      const h = maxY - minY + 1;
      if (count < 400) continue;
      if (w < 20 || h < 16) continue;

      boxes.push({
        x: minX,
        y: minY,
        w,
        h,
        count,
        xp: +((minX / width) * 100).toFixed(1),
        yp: +((minY / height) * 100).toFixed(1),
        wp: +((w / width) * 100).toFixed(1),
        hp: +((h / height) * 100).toFixed(1),
      });
    }
  }

  boxes.sort((a, b) => a.y - b.y || a.x - b.x);
  console.log(JSON.stringify({ n: boxes.length, boxes }, null, 2));

  const rects = boxes
    .map(
      (b, i) =>
        `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="rgba(14,116,144,0.28)" stroke="#082f53" stroke-width="1.5"/><text x="${b.x + 4}" y="${b.y + 14}" font-size="11" fill="#082f53">${i}</text>`,
    )
    .join("");
  const svg = Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`,
  );
  await sharp("public/images/masterplan/planta-2n-crop.png")
    .composite([{ input: svg, top: 0, left: 0 }])
    .png()
    .toFile("public/images/masterplan/planta-2n-preview.png");
}

main().catch(console.error);
