export type PartyId = "vox" | "pp" | "psoe" | "fa"

export interface Party {
  id: PartyId
  name: string
  /** Siglas que se muestran en el distintivo del partido. */
  short: string
  /**
   * Ruta opcional a un logotipo (p. ej. "/partidos/vox.svg" dentro de `public/`).
   * Si se indica, se muestra en escala de grises en lugar del monograma.
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
