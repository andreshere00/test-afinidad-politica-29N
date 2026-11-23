import { AnimatePresence, MotionConfig, motion, type Variants } from "motion/react"
import { useMemo, useState } from "react"

import { Intro } from "@/components/Intro"
import { Priorities } from "@/components/Priorities"
import { Quiz } from "@/components/Quiz"
import { Results } from "@/components/Results"
import { ThemeToggle } from "@/components/ThemeToggle"
import { MODES, type TestMode } from "@/data/modes"
import { PARTIES, type PartyId } from "@/data/parties"
import { QUESTIONS, type Question } from "@/data/questions"
import type { TopicId } from "@/data/topics"
import { computeWeights, type Answer, type Answers } from "@/lib/scoring"

type Stage = "intro" | "high" | "low" | "quiz" | "results"

const STAGE_ORDER: Stage[] = ["intro", "high", "low", "quiz", "results"]

/** Las pantallas entran desde la derecha al avanzar y desde la izquierda al retroceder. */
const screenVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: 48 * dir, scale: 0.98 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: -48 * dir, scale: 0.98 }),
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function App() {
  const [stage, setStage] = useState<Stage>("intro")
  const [high, setHigh] = useState<TopicId[]>([])
  const [low, setLow] = useState<TopicId[]>([])
  const [answers, setAnswers] = useState<Answers>({})
  const [order, setOrder] = useState<Question[]>(QUESTIONS)
  const [optionOrder, setOptionOrder] = useState<Record<string, PartyId[]>>({})
  const [direction, setDirection] = useState(1)
  const [mode, setMode] = useState<TestMode>("quick")
  /** true cuando se completa el test rápido con las preguntas que faltan del completo. */
  const [extending, setExtending] = useState(false)

  const goTo = (next: Stage) => {
    setDirection(Math.sign(STAGE_ORDER.indexOf(next) - STAGE_ORDER.indexOf(stage)) || 1)
    setStage(next)
  }

  const weights = useMemo(() => computeWeights(high, low), [high, low])

  // Orden aleatorio de las cuatro medidas en cada pregunta, para no delatar al partido.
  const shuffleOptions = (questions: Question[]) =>
    Object.fromEntries(questions.map((q) => [q.id, shuffle(PARTIES.map((p) => p.id))]))

  const startQuiz = () => {
    const questions = MODES[mode].questions
    setOrder(shuffle(questions))
    setOptionOrder(shuffleOptions(questions))
    setAnswers({})
    setExtending(false)
    goTo("quiz")
  }

  /** Pasa del test rápido al completo conservando las respuestas: solo pregunta lo que falta. */
  const extendToFull = () => {
    const remaining = MODES.full.questions.filter((q) => !(q.id in answers))
    setMode("full")
    setOrder(shuffle(remaining))
    setOptionOrder((prev) => ({ ...prev, ...shuffleOptions(remaining) }))
    setExtending(true)
    goTo("quiz")
  }

  const restart = () => {
    setHigh([])
    setLow([])
    setAnswers({})
    goTo("intro")
  }

  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-svh bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <span className="font-heading text-lg font-bold tracking-tight">
            Test de afinidad · 29N
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Herramienta orientativa
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl overflow-x-clip px-4 py-8 sm:py-12">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={stage}
            custom={direction}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {stage === "intro" && (
              <Intro mode={mode} onModeChange={setMode} onStart={() => goTo("high")} />
            )}

            {stage === "high" && (
              <Priorities
                mode="high"
                high={high}
                low={low}
                onChange={(h, l) => {
                  setHigh(h)
                  setLow(l)
                }}
                onBack={() => goTo("intro")}
                onContinue={() => goTo("low")}
                onSkip={() => {
                  setHigh([])
                  setLow([])
                  startQuiz()
                }}
              />
            )}

            {stage === "low" && (
              <Priorities
                mode="low"
                high={high}
                low={low}
                onChange={(h, l) => {
                  setHigh(h)
                  setLow(l)
                }}
                onBack={() => goTo("high")}
                onContinue={startQuiz}
              />
            )}

            {stage === "quiz" && (
              <Quiz
                questions={order}
                optionOrder={optionOrder}
                answers={answers}
                onAnswer={(id: string, a: Answer) => setAnswers((prev) => ({ ...prev, [id]: a }))}
                onBack={() => goTo(extending ? "results" : "low")}
                onFinish={() => goTo("results")}
              />
            )}

            {stage === "results" && (
              <Results
                mode={mode}
                questions={MODES[mode].questions}
                answers={answers}
                weights={weights}
                high={high}
                low={low}
                onRestart={restart}
                onExtend={mode === "quick" ? extendToFull : undefined}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mx-auto max-w-3xl px-4 pb-10 text-xs text-muted-foreground">
        Basado en el listado de medidas de Vox, PP, PSOE y Frente Amplio. Los resultados no
        constituyen una recomendación de voto.
      </footer>
    </div>
    </MotionConfig>
  )
}
