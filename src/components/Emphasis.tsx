import { parseEmphasis } from "@/lib/emphasis"

/** Muestra un texto con marcas `**…**` poniendo en negrita lo marcado. */
export function Emphasis({ text }: { text: string }) {
  return parseEmphasis(text).map((s, i) =>
    s.bold ? (
      <strong key={i} className="font-bold">
        {s.text}
      </strong>
    ) : (
      s.text
    )
  )
}
