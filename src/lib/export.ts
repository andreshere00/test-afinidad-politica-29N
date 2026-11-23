import { PARTIES, PARTY_BY_ID } from "@/data/parties"
import { MODES, type TestMode } from "@/data/modes"
import type { Question } from "@/data/questions"
import { TOPICS } from "@/data/topics"
import { formatPercent } from "@/lib/format"
import type { Answers, PartyResult } from "@/lib/scoring"

/**
 * Texto plano con el resultado y, para cada pregunta, la respuesta del usuario y de qué partido
 * es cada medida. Se genera en el navegador; no se envía a ningún sitio.
 */
export function answersText(
  results: PartyResult[],
  questions: Question[],
  answers: Answers,
  mode: TestMode
): string {
  const date = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const out: string[] = [
    "TEST DE AFINIDAD · 29N",
    `${MODES[mode].name} · ${date}`,
    "",
    "AFINIDAD POR PARTIDO",
    ...results.map(
      (r, i) =>
        `${i + 1}. ${PARTY_BY_ID[r.partyId].name}: ${formatPercent(r.affinity, 0)} ` +
        `(has apoyado ${r.supported} de sus ${r.answered} medidas)`
    ),
    "",
    "TUS RESPUESTAS",
    "[x] = medida que has apoyado · [ ] = medida que no has apoyado",
  ]

  let n = 0
  for (const t of TOPICS) {
    const qs = questions.filter((q) => q.topic === t.id)
    if (qs.length === 0) continue
    out.push("", "", t.name.toUpperCase(), "=".repeat(t.name.length))
    for (const q of qs) {
      n++
      const a = answers[q.id]
      const status =
        a === undefined
          ? "Sin responder"
          : a === null
            ? "Prefieres no responder"
            : a.length === 0
              ? "Ninguna te convence"
              : null
      out.push("", `${n}. ${q.prompt}`, `   ${q.question}`)
      if (status) out.push(`   Respuesta: ${status}`)
      for (const p of PARTIES) {
        const mark = Array.isArray(a) && a.includes(p.id) ? "[x]" : "[ ]"
        out.push(`   ${mark} ${p.name}: ${q.options[p.id]}`)
      }
    }
  }

  out.push(
    "",
    "",
    "Resultado orientativo: depende de las medidas incluidas en el test.",
    `${window.location.origin}${window.location.pathname}`,
    ""
  )
  return out.join("\n")
}

/** Descarga un texto como archivo .txt (UTF-8 con BOM para que el Bloc de notas lo lea bien). */
export function downloadText(text: string, filename: string) {
  const blob = new Blob(["﻿", text], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
