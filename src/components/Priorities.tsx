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
import {
  HIGH_MAX,
  HIGH_MIN,
  LOW_MAX,
  LOW_MIN,
  TOPICS,
  type TopicId,
} from "@/data/topics"
import { formatWeight } from "@/lib/format"
import { computeWeights, HIGH_LABEL, LOW_LABEL } from "@/lib/scoring"

import { TopicGrid } from "./TopicGrid"

interface Props {
  /** "high": paso 1 (más importantes). "low": paso 2 (menos importantes). */
  mode: "high" | "low"
  high: TopicId[]
  low: TopicId[]
  onChange: (high: TopicId[], low: TopicId[]) => void
  onBack: () => void
  onContinue: () => void
  /** Solo en el paso 1: salta la selección y usa pesos iguales (7,69 %). */
  onSkip?: () => void
}

/** «Elige hasta 5 (opcional).» o «Elige entre 3 y 5.» según el mínimo configurado. */
function range(min: number, max: number): string {
  return min === 0 ? `Elige hasta ${max} (opcional).` : `Elige entre ${min} y ${max}.`
}

function toggle(list: TopicId[], id: TopicId, max: number): TopicId[] {
  if (list.includes(id)) return list.filter((t) => t !== id)
  return list.length >= max ? list : [...list, id]
}

export function Priorities({ mode, high, low, onChange, onBack, onContinue, onSkip }: Props) {
  const isHigh = mode === "high"
  const selected = isHigh ? high : low
  const [min, max] = isHigh ? [HIGH_MIN, HIGH_MAX] : [LOW_MIN, LOW_MAX]
  const valid = selected.length >= min && selected.length <= max
  const weights = computeWeights(high, low)

  const hint = !valid
    ? `Elige al menos ${min - selected.length} más.`
    : selected.length === 0
      ? "Opcional: puedes continuar sin elegir ninguno."
      : "Listo. Puedes continuar."

  return (
    <Card>
      <CardHeader>
        <p className="text-sm text-muted-foreground">Paso {isHigh ? 1 : 2} de 2</p>
        <CardTitle className="text-2xl">
          {isHigh ? "¿Qué temas te importan más?" : "¿Qué temas te importan menos?"}
        </CardTitle>
        <CardDescription>
          {isHigh
            ? `${range(HIGH_MIN, HIGH_MAX)} Contarán el doble (${HIGH_LABEL}) en tu resultado. Si no eliges ninguno, todos los temas cuentan igual.`
            : `${range(LOW_MIN, LOW_MAX)} Contarán la mitad (${LOW_LABEL}). El resto cuenta de forma normal. Puedes continuar sin elegir ninguno.`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {selected.length}/{max} seleccionados
          </p>
          {isHigh ? (
            <TopicGrid
              label="Temas más importantes"
              selected={high}
              isDisabled={(id) =>
                low.includes(id) || (high.length >= HIGH_MAX && !high.includes(id))
              }
              disabledLabel={(id) => (low.includes(id) ? "Menos imp." : undefined)}
              onToggle={(id) =>
                onChange(
                  toggle(high, id, HIGH_MAX),
                  low.filter((t) => t !== id)
                )
              }
            />
          ) : (
            <TopicGrid
              label="Temas menos importantes"
              selected={low}
              isDisabled={(id) =>
                high.includes(id) || (low.length >= LOW_MAX && !low.includes(id))
              }
              disabledLabel={(id) => (high.includes(id) ? "Importante" : undefined)}
              onToggle={(id) => onChange(high, toggle(low, id, LOW_MAX))}
            />
          )}
        </div>

        {!isHigh && (
          <section aria-labelledby="weights-title" className="space-y-3">
            <h3 id="weights-title" className="text-lg font-semibold">
              Ponderación resultante
            </h3>
            <ul className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
              {TOPICS.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-3 border-b border-border/60 py-1"
                >
                  <span className="flex items-center gap-2">
                    <t.icon className="size-4 text-muted-foreground" aria-hidden />
                    {t.name}
                    {high.includes(t.id) && <Badge>{HIGH_LABEL}</Badge>}
                    {low.includes(t.id) && <Badge variant="outline">{LOW_LABEL}</Badge>}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatWeight(weights[t.id])}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onBack}>
            Atrás
          </Button>
          {isHigh && onSkip && (
            <Button variant="ghost" onClick={onSkip}>
              Usar pesos iguales (7,69 %)
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3 sm:justify-end">
          <span className="text-sm text-muted-foreground">{hint}</span>
          <Button size="lg" className="h-10 px-5" disabled={!valid} onClick={onContinue}>
            {isHigh ? "Siguiente" : "Comenzar test"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
