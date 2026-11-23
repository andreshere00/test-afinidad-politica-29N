import { Check, ChevronDown, ExternalLink } from "lucide-react"
import { motion } from "motion/react"
import { useMemo } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { PARTIES, PARTY_BY_ID, type PartyId } from "@/data/parties"
import { QUESTIONS, type Question } from "@/data/questions"
import { TOPICS, type TopicId } from "@/data/topics"
import { formatPercent, formatWeight } from "@/lib/format"
import {
  computeResults,
  HIGH_LABEL,
  LOW_LABEL,
  type Answer,
  type Answers,
  type Weights,
} from "@/lib/scoring"
import { cn } from "@/lib/utils"

import { PartyMark } from "./PartyMark"

interface Props {
  answers: Answers
  weights: Weights
  high: TopicId[]
  low: TopicId[]
  onRestart: () => void
}

export function Results({ answers, weights, high, low, onRestart }: Props) {
  const results = useMemo(() => computeResults(answers, weights), [answers, weights])
  const answered = QUESTIONS.filter((q) => Array.isArray(answers[q.id])).length
  const top = results[0]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">Tu afinidad</CardTitle>
          <CardDescription>
            Has respondido {answered} de {QUESTIONS.length} preguntas. La afinidad es el
            porcentaje de medidas de cada partido que has apoyado, ponderado por tema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-5">
            {results.map((r, i) => (
              <motion.li
                key={r.partyId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.3 }}
                className="flex items-center gap-4"
              >
                <PartyMark party={r.partyId} size="lg" className={cn(i > 0 && "opacity-70")} />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <span
                      className={cn(
                        "font-heading text-lg sm:text-xl",
                        i === 0 ? "font-semibold" : "font-medium"
                      )}
                    >
                      <span className="mr-2 text-sm text-muted-foreground tabular-nums">
                        {i + 1}.
                      </span>
                      {PARTY_BY_ID[r.partyId].name}
                    </span>
                    <span
                      className={cn(
                        "font-heading text-xl font-bold tabular-nums sm:text-2xl",
                        i > 0 && "text-foreground/70"
                      )}
                    >
                      {formatPercent(r.affinity)}
                    </span>
                  </div>
                  <Progress
                    value={r.affinity}
                    aria-label={`Afinidad con ${PARTY_BY_ID[r.partyId].name}`}
                    className={cn(
                      "h-2.5",
                      i > 0 && "[&_[data-slot=progress-indicator]]:bg-foreground/45"
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    Has apoyado {r.supported} de sus {r.answered} medidas.
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
          {answered > 0 && (
            <p className="mt-6 rounded-lg bg-muted px-4 py-3 text-sm">
              Tus respuestas coinciden más con las medidas de{" "}
              <strong className="font-medium">{PARTY_BY_ID[top.partyId].name}</strong>. El
              resultado es orientativo y depende de las medidas incluidas en el test.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Afinidad por tema</CardTitle>
          <CardDescription>
            Porcentaje de medidas de cada partido que has apoyado en cada tema. «—» = tema sin
            respuestas.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-3 font-medium">Tema</th>
                <th className="px-2 py-2 text-right font-medium">Peso</th>
                {PARTIES.map((p) => (
                  <th key={p.id} className="px-2 py-2 text-right font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <PartyMark party={p.id} size="sm" />
                      <span className="sr-only">{p.name}</span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOPICS.map((t) => {
                const scores = Object.fromEntries(
                  results.map((r) => [r.partyId, r.topics[t.id].score])
                ) as Record<PartyId, number | null>
                const best = Math.max(...Object.values(scores).map((s) => s ?? -1))
                return (
                  <tr key={t.id} className="border-b border-border/60">
                    <td className="py-2 pr-3">
                      <span className="flex flex-wrap items-center gap-2">
                        <t.icon className="size-4 text-muted-foreground" aria-hidden />
                        {t.name}
                        {high.includes(t.id) && <Badge>{HIGH_LABEL}</Badge>}
                        {low.includes(t.id) && <Badge variant="outline">{LOW_LABEL}</Badge>}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-right text-muted-foreground tabular-nums">
                      {formatWeight(weights[t.id])}
                    </td>
                    {PARTIES.map((p) => {
                      const s = scores[p.id]
                      return (
                        <td
                          key={p.id}
                          className={cn(
                            "px-2 py-2 text-right tabular-nums",
                            s === null && "text-muted-foreground",
                            s !== null && s > 0 && s === best && "font-semibold"
                          )}
                        >
                          {s === null ? "—" : formatPercent(s * 100, 0)}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">De quién era cada medida</CardTitle>
          <CardDescription>
            Ahora sí: el partido que propone cada una de las medidas que has valorado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {TOPICS.map((t) => (
            <Collapsible key={t.id} className="rounded-lg border">
              <CollapsibleTrigger className="group flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-heading font-medium">
                <span className="flex items-center gap-2">
                  <t.icon className="size-4 text-muted-foreground" aria-hidden />
                  {t.name}
                </span>
                <ChevronDown className="size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="divide-y border-t">
                  {QUESTIONS.filter((q) => q.topic === t.id).map((q) => (
                    <QuestionReveal key={q.id} question={q} answer={answers[q.id]} />
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Cómo se calcula</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          <p>
            Cada pregunta muestra una medida concreta de cada partido, sin indicar de quién es y en
            orden aleatorio. Cada medida que marcas suma un punto a su partido.
          </p>
          <p>
            En cada tema se calcula qué porcentaje de las medidas de cada partido has apoyado, y la
            afinidad final es la media de los temas con tus pesos. «Ninguna me convence» cuenta
            como no apoyar ninguna; «Prefiero no responder» no cuenta.
          </p>
          <p>
            Las medidas proceden del listado de medidas de cada programa. Las que se han
            completado con otras fuentes llevan su enlace en este apartado.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" className="h-10 px-5" onClick={onRestart}>
          Repetir el test
        </Button>
      </div>
    </div>
  )
}

function QuestionReveal({ question, answer }: { question: Question; answer: Answer | undefined }) {
  const status =
    answer === undefined
      ? "Sin responder"
      : answer === null
        ? "Prefieres no responder"
        : answer.length === 0
          ? "Ninguna te convence"
          : null

  return (
    <li className="space-y-3 px-4 py-4 text-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-heading font-medium">{question.prompt}</p>
        {status && <span className="text-xs text-muted-foreground">{status}</span>}
      </div>
      <ul className="space-y-2">
        {PARTIES.map((p) => {
          const supported = Array.isArray(answer) && answer.includes(p.id)
          const source = question.sources?.[p.id]
          return (
            <li
              key={p.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3",
                supported ? "border-foreground/60 bg-muted" : "border-border/60"
              )}
            >
              <PartyMark party={p.id} size="sm" />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="leading-snug">{question.options[p.id]}</p>
                {source && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
                  >
                    Fuente: {source.label}
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                )}
              </div>
              {supported && (
                <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium">
                  <Check className="size-3.5" aria-hidden />
                  Apoyada
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </li>
  )
}
