import { ListChecks, Timer } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MODE_LIST, MODES, type TestMode } from "@/data/modes"
import { TOPICS } from "@/data/topics"
import { cn } from "@/lib/utils"

const MODE_ICON = { quick: Timer, full: ListChecks } as const

interface Props {
  mode: TestMode
  onModeChange: (mode: TestMode) => void
  onStart: () => void
}

export function Intro({ mode, onModeChange, onStart }: Props) {
  const current = MODES[mode]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl">¿Con qué programa coincides más?</CardTitle>
        <CardDescription className="text-base">
          Test de afinidad basado en las medidas de los programas para el 29N.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 text-sm leading-relaxed sm:text-base">
        <p>
          Responderás a preguntas repartidas en {TOPICS.length} áreas temáticas. En cada una verás{" "}
          <strong className="font-medium">cuatro medidas, una de cada partido</strong>, en
          orden aleatorio y sin indicar de quién es cada una. Marca las que apoyarías.
        </p>

        <div className="space-y-2">
          <p className="font-heading font-medium">Elige la versión del test</p>
          <RadioGroup
            value={mode}
            onValueChange={(v) => onModeChange(v as TestMode)}
            className="grid gap-3 sm:grid-cols-2"
            aria-label="Versión del test"
          >
            {MODE_LIST.map((m) => {
              const Icon = MODE_ICON[m.id]
              const selected = m.id === mode
              return (
                <label
                  key={m.id}
                  htmlFor={`mode-${m.id}`}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors",
                    selected
                      ? "border-foreground bg-muted shadow-sm"
                      : "border-border bg-card hover:bg-muted/60"
                  )}
                >
                  <RadioGroupItem id={`mode-${m.id}`} value={m.id} className="mt-1" />
                  <span className="flex-1 space-y-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <Icon className="size-4 text-muted-foreground" aria-hidden />
                      <span className="font-heading font-semibold">{m.name}</span>
                      <Badge variant="secondary">{m.duration}</Badge>
                    </span>
                    <span className="block text-sm text-muted-foreground">
                      {m.questions.length} preguntas. {m.description}
                    </span>
                  </span>
                </label>
              )
            })}
          </RadioGroup>
        </div>

        <ol className="list-decimal space-y-1 pl-5 marker:text-muted-foreground">
          <li>Elige qué temas te importan más y cuáles menos.</li>
          <li>
            Marca las medidas que apoyarías ({current.questions.length} preguntas,{" "}
            {current.duration}).
          </li>
          <li>Descubre tu afinidad con cada partido y de quién era cada medida.</li>
        </ol>
        <p>
          Cada pregunta incluye un breve contexto y, en cada medida, un panel{" "}
          <strong className="font-medium">«¿Qué implica?»</strong> con qué cambiaría y los
          argumentos habituales a favor y en contra.
        </p>
        <p className="text-muted-foreground">
          No guardamos ni enviamos tus respuestas: todo se calcula en tu navegador.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="lg" className="h-10 px-5" onClick={onStart}>
          Empezar {current.name.toLowerCase()}
        </Button>
      </CardFooter>
    </Card>
  )
}
