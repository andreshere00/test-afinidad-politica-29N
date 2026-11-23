import { Lightbulb } from "lucide-react"
import { AnimatePresence, motion, useIsPresent } from "motion/react"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import type { PartyId } from "@/data/parties"
import type { Question } from "@/data/questions"
import { TOPIC_BY_ID } from "@/data/topics"
import type { Answer, Answers } from "@/lib/scoring"
import { cn } from "@/lib/utils"

import { ImplicationsPopover } from "./ImplicationsPopover"
import { QuestionSources } from "./QuestionSources"

const LETTERS = ["A", "B", "C", "D"]

interface Props {
  questions: Question[]
  /** Orden aleatorio de las medidas de cada pregunta (por id de pregunta). */
  optionOrder: Record<string, PartyId[]>
  answers: Answers
  onAnswer: (id: string, answer: Answer) => void
  onBack: () => void
  onFinish: () => void
}

export function Quiz({ questions, optionOrder, answers, onAnswer, onBack, onFinish }: Props) {
  const [index, setIndex] = useState(0)
  const total = questions.length
  const question = questions[index]
  const isLast = index === total - 1
  const answeredCount = questions.filter((q) => q.id in answers).length
  const Icon = TOPIC_BY_ID[question.topic].icon

  const goPrev = () => (index === 0 ? onBack() : setIndex(index - 1))
  const commit = (answer: Answer) => {
    onAnswer(question.id, answer)
    if (isLast) onFinish()
    else setIndex(index + 1)
  }

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>
            Pregunta {index + 1} de {total}
          </span>
          <Badge variant="secondary" className="gap-1.5">
            <Icon aria-hidden />
            {TOPIC_BY_ID[question.topic].name}
          </Badge>
        </div>
        <Progress value={(answeredCount / total) * 100} aria-label="Progreso del test" />
      </CardHeader>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <QuestionStep
            question={question}
            order={optionOrder[question.id]}
            saved={answers[question.id]}
            hasSaved={question.id in answers}
            isFirst={index === 0}
            isLast={isLast}
            onPrev={goPrev}
            onCommit={commit}
          />
        </motion.div>
      </AnimatePresence>
    </Card>
  )
}

function QuestionStep({
  question,
  order,
  saved,
  hasSaved,
  isFirst,
  isLast,
  onPrev,
  onCommit,
}: {
  question: Question
  order: PartyId[]
  saved: Answer | undefined
  hasSaved: boolean
  isFirst: boolean
  isLast: boolean
  onPrev: () => void
  onCommit: (answer: Answer) => void
}) {
  const [draft, setDraft] = useState<PartyId[]>(Array.isArray(saved) ? saved : [])
  // Mientras la pregunta sale animada no debe reaccionar a teclas ni clics.
  const isPresent = useIsPresent()
  const submit = (answer: Answer) => {
    if (isPresent) onCommit(answer)
  }
  const toggle = (id: PartyId) =>
    setDraft((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))

  const savedNone = hasSaved && Array.isArray(saved) && saved.length === 0 && draft.length === 0
  const savedSkip = hasSaved && saved === null && draft.length === 0

  // Atajos: 1-4 marcan medidas, Intro avanza, 0 omite, flecha izquierda retrocede.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isPresent || e.metaKey || e.ctrlKey || e.altKey) return
      // Con el foco en «¿Qué implica?», las fuentes o un enlace, Intro actúa sobre ellos en vez de avanzar.
      if (
        e.target instanceof Element &&
        e.target.closest("[data-slot^=popover], [data-slot^=collapsible], a")
      )
        return
      if (e.key >= "1" && e.key <= "4") toggle(order[Number(e.key) - 1])
      else if (e.key === "Enter" && draft.length > 0) onCommit(draft)
      else if (e.key === "0") onCommit(null)
      else if (e.key === "ArrowLeft") onPrev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [draft, order, onCommit, onPrev, isPresent])

  return (
    <>
      <CardContent className="space-y-5 pt-2">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {question.prompt}
          </p>
          <h2 className="font-heading text-xl leading-snug font-semibold sm:text-2xl">
            {question.question}
          </h2>
          {question.context && (
            <p className="flex gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm leading-relaxed text-muted-foreground">
              <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{question.context}</span>
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Marca las medidas que apoyarías (puedes elegir varias). Pulsa «¿Qué implica?» para ver
            qué cambiaría cada una.
          </p>
        </div>

        <ul className="grid gap-3" role="group" aria-label="Medidas propuestas">
          {order.map((partyId, i) => {
            const checked = draft.includes(partyId)
            const id = `${question.id}-${partyId}`
            return (
              <li
                key={partyId}
                className={cn(
                  "rounded-xl border transition-colors",
                  checked
                    ? "border-foreground bg-muted shadow-sm"
                    : "border-border bg-card hover:bg-muted/60"
                )}
              >
                <label
                  htmlFor={id}
                  className="flex cursor-pointer items-start gap-3 px-4 pt-4 pb-2 text-sm leading-relaxed sm:text-base"
                >
                  <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={() => toggle(partyId)}
                    className="mt-1"
                  />
                  <span className="flex-1">{question.options[partyId]}</span>
                  <kbd className="mt-0.5 font-heading text-xs text-muted-foreground">
                    {LETTERS[i]}
                  </kbd>
                </label>
                <div className="pr-4 pb-3 pl-11">
                  <ImplicationsPopover implication={question.implications[partyId]} />
                </div>
              </li>
            )
          })}
        </ul>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            aria-pressed={savedNone}
            className={cn(savedNone && "border-foreground bg-muted")}
            onClick={() => submit([])}
          >
            Ninguna me convence
          </Button>
          <Button
            variant="ghost"
            aria-pressed={savedSkip}
            className={cn("text-muted-foreground", savedSkip && "bg-muted text-foreground")}
            onClick={() => submit(null)}
          >
            Prefiero no responder
          </Button>
        </div>

        <QuestionSources question={question} />
      </CardContent>

      <CardFooter className="mt-6 justify-between">
        <Button variant="ghost" onClick={onPrev}>
          {isFirst ? "Volver a temas" : "Anterior"}
        </Button>
        <Button
          size="lg"
          className="h-10 px-5"
          disabled={draft.length === 0}
          onClick={() => submit(draft)}
        >
          {isLast ? "Ver resultados" : "Siguiente"}
        </Button>
      </CardFooter>
    </>
  )
}
