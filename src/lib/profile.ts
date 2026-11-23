import { PARTY_BY_ID, type PartyId } from "@/data/parties"
import type { Question } from "@/data/questions"
import { TOPICS, type TopicId } from "@/data/topics"
import { formatPercent } from "@/lib/format"
import type { Answers, PartyResult } from "@/lib/scoring"

/**
 * Ubicación habitual de cada partido en el eje izquierda (-1) – derecha (+1). Solo se usa para
 * situar aproximadamente el perfil; no forma parte del cálculo de afinidad.
 */
const AXIS: Record<PartyId, number> = { fa: -1, psoe: -0.35, pp: 0.35, vox: 1 }
const LEFT: PartyId[] = ["fa", "psoe"]

export interface TopicLead {
  topicId: TopicId
  /** Partidos con la afinidad más alta en el tema (más de uno si hay empate). */
  leaders: PartyId[]
  /** Afinidad del líder, 0-100. */
  value: number
}

export interface Profile {
  paragraphs: { title: string; text: string }[]
  /** Posición aproximada en el eje izquierda–derecha, de -1 a 1 (null sin apoyos). */
  axis: number | null
  axisLabel: string
  stats: { label: string; value: string }[]
  leads: TopicLead[]
}

const pct = (v: number) => formatPercent(v, 0)
const name = (id: PartyId) => PARTY_BY_ID[id].name
const topicName = (id: TopicId) => TOPICS.find((t) => t.id === id)!.name

function list(items: string[]): string {
  if (items.length <= 1) return items.join("")
  return `${items.slice(0, -1).join(", ")} y ${items.at(-1)}`
}

function axisLabel(x: number): string {
  if (x <= -0.5) return "izquierda"
  if (x <= -0.1) return "centroizquierda"
  if (x < 0.1) return "centro o transversal"
  if (x < 0.5) return "centroderecha"
  return "derecha"
}

/**
 * Análisis descriptivo del perfil a partir de las respuestas. Todo se deduce de los datos del test
 * (afinidades, temas y respuestas); los textos son neutrales y no valoran las opciones.
 */
export function analyzeProfile(
  results: PartyResult[],
  questions: Question[],
  answers: Answers,
  high: TopicId[],
  low: TopicId[]
): Profile {
  const paragraphs: Profile["paragraphs"] = []
  const answeredQs = questions.filter((q) => Array.isArray(answers[q.id]))
  const skipped = questions.filter((q) => answers[q.id] === null).length
  const none = answeredQs.filter((q) => (answers[q.id] as PartyId[]).length === 0).length
  const totalSupported = answeredQs.reduce((n, q) => n + (answers[q.id] as PartyId[]).length, 0)
  const perQuestion = answeredQs.length > 0 ? totalSupported / answeredQs.length : 0

  // Liderazgo por tema
  const leads: TopicLead[] = []
  for (const t of TOPICS) {
    const scores = results
      .map((r) => ({ id: r.partyId, s: r.topics[t.id].score }))
      .filter((x): x is { id: PartyId; s: number } => x.s !== null)
    if (scores.length === 0) continue
    const max = Math.max(...scores.map((x) => x.s))
    if (max === 0) continue
    leads.push({ topicId: t.id, leaders: scores.filter((x) => x.s === max).map((x) => x.id), value: max * 100 })
  }

  // Eje
  const affTotal = results.reduce((n, r) => n + r.affinity, 0)
  const axis = affTotal > 0 ? results.reduce((n, r) => n + r.affinity * AXIS[r.partyId], 0) / affTotal : null

  if (answeredQs.length === 0 || totalSupported === 0) {
    paragraphs.push({
      title: "Resultado general",
      text:
        answeredQs.length === 0
          ? "No has respondido ninguna pregunta, así que no se puede trazar un perfil."
          : "No has apoyado ninguna medida: ninguna de las propuestas de los cuatro partidos te ha convencido en las preguntas respondidas. No se puede trazar un perfil de afinidad.",
    })
    return { paragraphs, axis: null, axisLabel: "sin datos", stats: [], leads }
  }

  // 1. Resultado general
  const [first, second] = results
  const gap = first.affinity - second.affinity
  const last = results.at(-1)!
  let general: string
  if (gap < 5) {
    general = `Tu afinidad está muy repartida en la parte alta: ${name(first.partyId)} (${pct(first.affinity)}) y ${name(second.partyId)} (${pct(second.affinity)}) quedan prácticamente empatados, con ${Math.round(gap)} puntos o menos de diferencia.`
  } else if (gap < 15) {
    general = `Coincides más con ${name(first.partyId)} (${pct(first.affinity)}), seguido de ${name(second.partyId)} (${pct(second.affinity)}), a ${Math.round(gap)} puntos: una preferencia moderada.`
  } else {
    general = `Tu perfil se inclina con claridad hacia ${name(first.partyId)} (${pct(first.affinity)}), con ${Math.round(gap)} puntos de ventaja sobre ${name(second.partyId)} (${pct(second.affinity)}).`
  }
  general += ` Con quien menos coincides es con ${name(last.partyId)} (${pct(last.affinity)}).`
  paragraphs.push({ title: "Resultado general", text: general })

  // 2. Bloques y eje
  const bloc = (ids: PartyId[]) =>
    results.filter((r) => ids.includes(r.partyId)).reduce((n, r) => n + r.affinity, 0) / ids.length
  const left = bloc(LEFT)
  const right = bloc(results.map((r) => r.partyId).filter((id) => !LEFT.includes(id)))
  const diff = Math.abs(left - right)
  const blocText =
    diff < 8
      ? `Tu afinidad media con los partidos de izquierda (PSOE y Frente Amplio, ${pct(left)}) y de derecha (PP y Vox, ${pct(right)}) es parecida: apoyas medidas de ambos lados.`
      : `Tu afinidad media es mayor con los partidos de ${left > right ? "izquierda (PSOE y Frente Amplio)" : "derecha (PP y Vox)"}: ${pct(Math.max(left, right))} frente a ${pct(Math.min(left, right))}.`
  paragraphs.push({
    title: "Orientación",
    text: `${blocText} Según la ubicación habitual de los partidos, tu perfil se sitúa aproximadamente en el espacio de ${axisLabel(axis!)}. Es solo una referencia: cada medida puede gustar a votantes de cualquier lado.`,
  })

  // 3. Transversalidad por tema
  // Partidos que encabezan (solos o empatados) al menos un tema.
  const leaderSet = new Set(leads.flatMap((l) => l.leaders))
  const firstLeads = leads.filter((l) => l.leaders.includes(first.partyId))
  const othersLead = leads.filter((l) => !l.leaders.includes(first.partyId))
  let topicText = `${name(first.partyId)} es tu partido más afín en ${firstLeads.length} de ${leads.length} temas con medidas apoyadas`
  topicText += firstLeads.length > 0 ? ` (${list(firstLeads.slice(0, 4).map((l) => topicName(l.topicId)))}${firstLeads.length > 4 ? "…" : ""}).` : "."
  if (othersLead.length > 0) {
    const byParty = new Map<PartyId, TopicId[]>()
    for (const l of othersLead) for (const id of l.leaders) byParty.set(id, [...(byParty.get(id) ?? []), l.topicId])
    const parts = [...byParty].map(([id, ts]) => `con ${name(id)} en ${list(ts.map(topicName))}`)
    topicText += ` En otros temas coincides más con otros partidos: ${list(parts)}.`
  }
  const share = leads.length > 0 ? firstLeads.length / leads.length : 0
  topicText +=
    share >= 0.75 && othersLead.length <= 2
      ? " Tu perfil es muy coherente: el mismo partido encabeza casi todos los temas."
      : share < 0.5
        ? " Tu perfil es transversal: tus preferencias cambian bastante según el tema."
        : ""
  paragraphs.push({ title: "Por temas", text: topicText })

  // 4. Prioridades
  if (high.length > 0) {
    const inHigh = leads.filter((l) => high.includes(l.topicId))
    const counts = new Map<PartyId, number>()
    for (const l of inHigh) for (const id of l.leaders) counts.set(id, (counts.get(id) ?? 0) + 1)
    const best = [...counts].sort((a, b) => b[1] - a[1])[0]
    let text = `Los temas que marcaste como más importantes son ${list(high.map(topicName))}.`
    if (best) {
      text += ` En ellos, ${name(best[0])} es el partido más afín en ${best[1]} de ${high.length}`
      text += best[0] === first.partyId ? ", lo que refuerza tu resultado general." : `, aunque en el conjunto del test el primero sea ${name(first.partyId)}.`
    }
    if (low.length > 0) text += ` Restaste peso a ${list(low.map(topicName))}.`
    paragraphs.push({ title: "Tus prioridades", text })
  }

  // 5. Estilo de respuesta
  const style =
    perQuestion < 1
      ? "Tu forma de responder es muy selectiva: de media apoyas menos de una medida por pregunta, así que solo te convencen propuestas concretas."
      : perQuestion < 2
        ? "Tu forma de responder es bastante selectiva: de media apoyas entre una y dos medidas por pregunta."
        : "Apoyas con facilidad propuestas diversas: de media apoyas más de dos medidas por pregunta, lo que tiende a igualar los porcentajes entre partidos."
  let styleText = `${style} En total has apoyado ${totalSupported} medidas en ${answeredQs.length} preguntas.`
  if (none > 0) styleText += ` En ${none} ${none === 1 ? "pregunta" : "preguntas"} ninguna medida te convenció.`
  if (skipped > 0) styleText += ` Preferiste no responder ${skipped} ${skipped === 1 ? "pregunta" : "preguntas"}, que no cuentan.`
  paragraphs.push({ title: "Cómo has respondido", text: styleText })

  const stats = [
    { label: "Preguntas respondidas", value: `${answeredQs.length} de ${questions.length}` },
    { label: "Medidas apoyadas", value: String(totalSupported) },
    { label: "Media por pregunta", value: perQuestion.toLocaleString("es-ES", { maximumFractionDigits: 1 }) },
    { label: "Partidos que lideran algún tema", value: String(leaderSet.size) },
  ]

  return { paragraphs, axis, axisLabel: axisLabel(axis!), stats, leads }
}
