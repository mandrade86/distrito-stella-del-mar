export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatArea(m2: number) {
  return `${m2.toLocaleString("es-HN", {
    minimumFractionDigits: Number.isInteger(m2) ? 0 : 2,
    maximumFractionDigits: 2,
  })} m²`;
}
