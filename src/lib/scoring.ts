import { PARTIES, type PartyId } from "@/data/parties"
import { QUESTIONS, type Question } from "@/data/questions"
import { TOPICS, type TopicId } from "@/data/topics"

/**
 * Respuesta a una pregunta:
 * - lista de partidos cuyas medidas apoya el usuario (vacía = «ninguna me convence»)
 * - `null` = prefiere no responder (no cuenta)
 */
export type Answer = PartyId[] | null
export type Answers = Record<string, Answer>
export type Weights = Record<TopicId, number>

export const HIGH_FACTOR = 2
export const LOW_FACTOR = 0.5
/** Etiquetas para mostrar en la interfaz (coma decimal). */
export const HIGH_LABEL = "×2"
export const LOW_LABEL = "×0,5"

/**
 * Pondera los temas: normal = 1, importante = 2, menos importante = 0,5.
 * Se normaliza para que la suma sea 1 (sin selección → 1/13 = 7,69 % cada uno).
 */
export function computeWeights(high: TopicId[], low: TopicId[]): Weights {
  const raw = {} as Weights
  let total = 0
  for (const t of TOPICS) {
    const f = high.includes(t.id) ? HIGH_FACTOR : low.includes(t.id) ? LOW_FACTOR : 1
    raw[t.id] = f
    total += f
  }
  for (const t of TOPICS) raw[t.id] = raw[t.id] / total
  return raw
}

export interface TopicScore {
  /** Proporción 0-1 de medidas del partido apoyadas en el tema, o null si no hay respuestas. */
  score: number | null
  answered: number
  supported: number
}

export interface PartyResult {
  partyId: PartyId
  /** Afinidad global 0-100. */
  affinity: number
  /** Preguntas respondidas (las mismas para todos los partidos). */
  answered: number
  /** Medidas de este partido que el usuario ha apoyado. */
  supported: number
  topics: Record<TopicId, TopicScore>
}

/**
 * Afinidad con un partido = media ponderada, por tema, del porcentaje de sus medidas que el
 * usuario ha apoyado. Cada pregunta tiene una medida de cada partido, así que todos los partidos
 * se evalúan sobre las mismas preguntas.
 */
export function computeResults(
  answers: Answers,
  weights: Weights,
  questions: Question[] = QUESTIONS
): PartyResult[] {
  const results = PARTIES.map((party): PartyResult => {
    const topics = {} as Record<TopicId, TopicScore>
    let weighted = 0
    let weightUsed = 0
    let answeredTotal = 0
    let supportedTotal = 0

    for (const topic of TOPICS) {
      let answered = 0
      let supported = 0
      for (const q of questions) {
        if (q.topic !== topic.id) continue
        const a = answers[q.id]
        if (!Array.isArray(a)) continue
        answered += 1
        if (a.includes(party.id)) supported += 1
      }
      const score = answered > 0 ? supported / answered : null
      topics[topic.id] = { score, answered, supported }
      answeredTotal += answered
      supportedTotal += supported
      if (score !== null) {
        weighted += score * weights[topic.id]
        weightUsed += weights[topic.id]
      }
    }

    return {
      partyId: party.id,
      affinity: weightUsed > 0 ? (weighted / weightUsed) * 100 : 0,
      answered: answeredTotal,
      supported: supportedTotal,
      topics,
    }
  })

  return results.sort((a, b) => b.affinity - a.affinity)
}
