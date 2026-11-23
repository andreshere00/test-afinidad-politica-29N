import { QUESTIONS, type Question } from "./questions"

export type TestMode = "quick" | "full"

/**
 * Selección del test rápido: 2 preguntas por tema (26 en total). Se descarta en cada tema la
 * pregunta en la que las medidas se parecen más entre sí o que es más de detalle, para quedarse
 * con las que mejor diferencian a los partidos.
 */
const QUICK_IDS = new Set([
  "viv-1", "viv-3",
  "inm-1", "inm-3",
  "eco-1", "eco-3",
  "san-1", "san-3",
  "edu-1", "edu-3",
  "geo-1", "geo-2",
  "inf-1", "inf-2",
  "der-2", "der-3",
  "imp-1", "imp-2",
  "seg-1", "seg-2",
  "idi-1", "idi-2",
  "ecol-1", "ecol-3",
  "pri-1", "pri-2",
])

export interface ModeInfo {
  id: TestMode
  name: string
  duration: string
  description: string
  questions: Question[]
}

export const MODES: Record<TestMode, ModeInfo> = {
  quick: {
    id: "quick",
    name: "Test rápido",
    duration: "5-10 min",
    description: "2 preguntas por tema.",
    questions: QUESTIONS.filter((q) => QUICK_IDS.has(q.id)),
  },
  full: {
    id: "full",
    name: "Test completo",
    duration: "unos 12-15 min",
    description: "3 preguntas por tema (2 en sector primario). Resultado más preciso.",
    questions: QUESTIONS,
  },
}

export const MODE_LIST: ModeInfo[] = [MODES.quick, MODES.full]
