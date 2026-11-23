import { pdf } from "@react-pdf/renderer"
import { createElement, type ReactElement } from "react"
import type { DocumentProps } from "@react-pdf/renderer"

import { AnswersDocument, type AnswersPdfInput } from "./AnswersDocument"

/** Genera el PDF en el navegador y lo descarga. No se envía nada a ningún servidor. */
export async function downloadAnswersPdf(input: AnswersPdfInput) {
  const date = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const url = `${window.location.host}${window.location.pathname}`
  const doc = createElement(AnswersDocument, { ...input, date, url }) as ReactElement<DocumentProps>
  const blob = await pdf(doc).toBlob()
  const href = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = href
  a.download = "test-afinidad-29N-respuestas.pdf"
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(href), 1000)
}
