import { motion } from "motion/react"
import { useState } from "react"

import { PARTY_BY_ID, partyStyle } from "@/data/parties"
import { TOPICS } from "@/data/topics"
import { formatPercent } from "@/lib/format"
import type { PartyResult } from "@/lib/scoring"

import { PartyMark } from "./PartyMark"

/**
 * Afinidad por tema = porcentaje de las medidas del partido en ese tema que el usuario ha apoyado.
 * `null` si el tema no tiene respuestas.
 */
function affinityByTopic(r: PartyResult): (number | null)[] {
  return TOPICS.map((t) => {
    const s = r.topics[t.id].score
    return s === null ? null : s * 100
  })
}

const SIZE = 300
const C = SIZE / 2
const R = 100
const RINGS = [25, 50, 75, 100]

/** Punto del eje i (empezando arriba, en sentido horario) a una distancia `v` (0-100). */
function point(i: number, v: number, radius = R): [number, number] {
  const a = (Math.PI * 2 * i) / TOPICS.length - Math.PI / 2
  const d = (v / 100) * radius
  return [C + d * Math.cos(a), C + d * Math.sin(a)]
}

const polygon = (values: number[]) => values.map((v, i) => point(i, v).join(",")).join(" ")

/** Radar de un partido: 13 ejes (uno por tema), de 0 % (centro) a 100 % de afinidad (borde). */
function Radar({ result, delay }: { result: PartyResult; delay: number }) {
  const [active, setActive] = useState<number | null>(null)
  const values = affinityByTopic(result)
  const plotted = values.map((v) => v ?? 0)
  const party = PARTY_BY_ID[result.partyId]
  const overall = result.affinity
  const answered = values.filter((v): v is number => v !== null)
  const max = answered.length > 0 ? Math.max(...answered) : null
  // Temas empatados en la máxima afinidad (si hay más de uno, se nombra el primero y se cuentan el resto).
  const tied = max === null ? [] : TOPICS.filter((_, i) => values[i] === max)
  const top = max !== null && max > 0 ? { v: max, name: tied[0].name, more: tied.length - 1 } : null

  const summary = `${party.name}: afinidad ${formatPercent(overall, 0)}. ${TOPICS.map(
    (t, i) => `${t.name} ${values[i] === null ? "sin respuestas" : formatPercent(values[i]!, 0)}`
  ).join("; ")}.`

  const tip = active !== null ? point(active, 100, R + 22) : null

  return (
    <motion.figure
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="rounded-xl border border-t-4 border-t-(--party) p-4"
      style={partyStyle(result.partyId)}
    >
      <figcaption className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 font-heading font-medium text-(--party)">
          <PartyMark party={result.partyId} size="sm" />
          {party.name}
        </span>
        <span className="text-right text-xs text-muted-foreground">
          Afinidad{" "}
          <strong className="font-heading text-base font-semibold text-foreground tabular-nums">
            {formatPercent(overall, 0)}
          </strong>
        </span>
      </figcaption>

      <div className="relative mx-auto mt-2 aspect-square w-full max-w-[19rem]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="size-full overflow-visible"
          role="img"
          aria-label={summary}
        >
          {/* Rejilla: anillos al 25/50/75/100 % y un radio por tema */}
          <g className="stroke-border" fill="none" strokeWidth={1}>
            {RINGS.map((ring) => (
              <polygon key={ring} points={polygon(TOPICS.map(() => ring))} />
            ))}
            {TOPICS.map((t, i) => {
              const [x, y] = point(i, 100)
              return <line key={t.id} x1={C} y1={C} x2={x} y2={y} />
            })}
          </g>
          {[50, 100].map((ring) => (
            <text
              key={ring}
              x={C + 4}
              y={C - (ring / 100) * R - 3}
              className="fill-muted-foreground text-[9px] tabular-nums"
            >
              {ring} %
            </text>
          ))}

          {/* Serie */}
          <motion.polygon
            points={polygon(plotted)}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: `${C}px ${C}px` }}
            className="fill-(--party)/15 stroke-(--party)"
            strokeWidth={2}
            strokeLinejoin="round"
          />
          {plotted.map((v, i) => {
            const [x, y] = point(i, v)
            const empty = values[i] === null
            return (
              <circle
                key={TOPICS[i].id}
                cx={x}
                cy={y}
                r={active === i ? 5.5 : 4}
                className={
                  empty ? "fill-background stroke-muted-foreground" : "fill-(--party) stroke-card"
                }
                strokeWidth={2}
              />
            )
          })}

          {/* Iconos de tema y zonas de interacción (más grandes que la marca) */}
          {TOPICS.map((t, i) => {
            const [ix, iy] = point(i, 100, R + 22)
            const [px, py] = point(i, plotted[i])
            const Icon = t.icon
            return (
              <g
                key={t.id}
                tabIndex={0}
                role="button"
                aria-label={`${t.name}: ${values[i] === null ? "sin respuestas" : `${formatPercent(values[i]!, 0)} de afinidad`}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="cursor-default outline-none"
              >
                <circle cx={ix} cy={iy} r={14} className="fill-transparent" />
                <circle cx={px} cy={py} r={12} className="fill-transparent" />
                <Icon
                  x={ix - 8}
                  y={iy - 8}
                  width={16}
                  height={16}
                  className={active === i ? "text-foreground" : "text-muted-foreground"}
                  aria-hidden
                />
              </g>
            )
          })}
        </svg>

        {active !== null && tip && (
          <div
            role="status"
            className="pointer-events-none absolute z-10 w-max max-w-44 -translate-x-1/2 -translate-y-full rounded-md border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md"
            style={{
              left: `${Math.min(Math.max((tip[0] / SIZE) * 100, 20), 80)}%`,
              top: `${(tip[1] / SIZE) * 100}%`,
              marginTop: -12,
            }}
          >
            <p className="font-medium">{TOPICS[active].name}</p>
            <p className="text-muted-foreground">
              {values[active] === null ? (
                "Sin respuestas en este tema"
              ) : (
                <>
                  Apoyas el{" "}
                  <strong className="font-medium text-foreground tabular-nums">
                    {formatPercent(values[active]!, 0)}
                  </strong>{" "}
                  de sus medidas
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {top && (
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Mayor afinidad: <span className="text-foreground">{top.name}</span>
          {top.more > 0 && ` y ${top.more} ${top.more === 1 ? "tema" : "temas"} más`} (
          {formatPercent(top.v, 0)})
        </p>
      )}
    </motion.figure>
  )
}

/** Cuadrícula de radares, uno por partido, en el mismo orden que la clasificación. */
export function AffinityRadars({ results }: { results: PartyResult[] }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {results.map((r, i) => (
          <Radar key={r.partyId} result={r} delay={0.05 + i * 0.08} />
        ))}
      </div>
      <ul
        className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs text-muted-foreground sm:grid-cols-2 md:grid-cols-3"
        aria-label="Leyenda de temas"
      >
        {TOPICS.map((t) => (
          <li key={t.id} className="flex items-center gap-2">
            <t.icon className="size-3.5 shrink-0" aria-hidden />
            {t.name}
          </li>
        ))}
      </ul>
    </div>
  )
}
