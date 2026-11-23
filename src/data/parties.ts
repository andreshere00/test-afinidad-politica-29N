import type { CSSProperties } from "react"

export type PartyId = "vox" | "pp" | "psoe" | "fa"

export interface Party {
  id: PartyId
  name: string
  /** Siglas que se muestran en el distintivo del partido. */
  short: string
  /**
   * Ruta opcional a un logotipo (p. ej. "/partidos/vox.svg" dentro de `public/`).
   * Si se indica, se muestra en lugar del monograma.
   */
  logo?: string
}

export const PARTIES: Party[] = [
  { id: "vox", name: "Vox", short: "VOX" },
  { id: "pp", name: "PP", short: "PP" },
  { id: "psoe", name: "PSOE", short: "PSOE" },
  { id: "fa", name: "Frente Amplio", short: "FA" },
]

export const PARTY_BY_ID = Object.fromEntries(
  PARTIES.map((p) => [p.id, p])
) as Record<PartyId, Party>

/**
 * Define `--party` con el color del partido (tokens `--party-*` de `src/index.css`, distintos en
 * modo claro y oscuro). Los hijos lo usan con clases como `text-(--party)` o `bg-(--party)/10`.
 * Solo se usa en los resultados: durante el test las medidas no deben delatar al partido.
 */
export function partyStyle(id: PartyId): CSSProperties {
  return { "--party": `var(--party-${id})` } as CSSProperties
}
