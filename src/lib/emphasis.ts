export interface Segment {
  text: string
  bold: boolean
}

/**
 * Divide un texto con marcas `**…**` en tramos normales y en negrita.
 * Se usa en las medidas (`options`) para resaltar sus palabras clave.
 */
export function parseEmphasis(text: string): Segment[] {
  return text
    .split("**")
    .map((part, i) => ({ text: part, bold: i % 2 === 1 }))
    .filter((s) => s.text.length > 0)
}
