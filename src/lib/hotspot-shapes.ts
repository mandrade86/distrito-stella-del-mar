/** Formas de pads AS según el masterplan (no rectángulos simples). */
export function hotspotShapeClass(unitLabel?: string) {
  const label = (unitLabel || "").toUpperCase().trim();
  if (label === "AS-01") {
    // Rectángulo; solo esquina inferior derecha redondeada
    return "rounded-none [border-radius:0_0_48%_0]";
  }
  if (label === "AS-02" || label === "AS-03") {
    // Cápsula / U: lado derecho semi-circular
    return "rounded-none rounded-r-full";
  }
  if (label === "AS-04") {
    // Cápsula: lado izquierdo semi-circular
    return "rounded-none rounded-l-full";
  }
  return "rounded-[2px]";
}
