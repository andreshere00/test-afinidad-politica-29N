const pct1 = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})
const pct0 = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 })

/** 0-100 → "63,4 %" */
export function formatPercent(value: number, digits: 0 | 1 = 1): string {
  return `${(digits === 0 ? pct0 : pct1).format(value)} %`
}

/** 0-1 → "7,7 %" */
export function formatWeight(fraction: number): string {
  return `${new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(fraction * 100)} %`
}
