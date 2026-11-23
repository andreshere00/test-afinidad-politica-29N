import { ArrowRight, Info, Minus, Plus } from "lucide-react"
import { useEffect, useRef, useState, type PointerEvent } from "react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PARTY_BY_ID, partyStyle, type PartyId } from "@/data/parties"
import type { Implication } from "@/data/questions"
import { cn } from "@/lib/utils"

const OPEN_DELAY = 250
const CLOSE_DELAY = 150

/**
 * Botón «¿Qué implica?» con un panel que explica, en tono neutral, qué cambiaría
 * la medida y los argumentos habituales a favor y en contra.
 * Se abre al pasar el ratón (con un pequeño retardo) o al pulsar/tocar.
 */
export function ImplicationsPopover({
  implication,
  party,
  className,
}: {
  implication: Implication
  /** Solo en resultados: tiñe el panel con el color del partido. Nunca durante el test. */
  party?: PartyId
  className?: string
}) {
  const [open, setOpen] = useState(false)
  // Abierto con clic o toque: no se cierra al sacar el ratón.
  const pinned = useRef(false)
  const timer = useRef<number | undefined>(undefined)

  const clearTimer = () => window.clearTimeout(timer.current)
  useEffect(() => clearTimer, [])

  const onHoverStart = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return
    clearTimer()
    timer.current = window.setTimeout(() => setOpen(true), OPEN_DELAY)
  }
  const onHoverEnd = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || pinned.current) return
    clearTimer()
    timer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (!next) pinned.current = false
        setOpen(next)
      }}
    >
      <PopoverTrigger
        className={cn(
          "inline-flex items-center gap-1 rounded-md text-xs text-muted-foreground underline decoration-dotted underline-offset-2 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
          open && "text-foreground",
          className
        )}
        onPointerEnter={onHoverStart}
        onPointerLeave={onHoverEnd}
        onClick={(e) => {
          // Gestionamos el clic nosotros: si ya estaba abierto por hover, lo fija en vez de cerrarlo.
          e.preventDefault()
          clearTimer()
          if (open && !pinned.current) {
            pinned.current = true
          } else {
            pinned.current = !open
            setOpen(!open)
          }
        }}
      >
        <Info className="size-3.5" aria-hidden />
        ¿Qué implica?
      </PopoverTrigger>
      <PopoverContent
        align="start"
        collisionPadding={16}
        style={party ? partyStyle(party) : undefined}
        className={cn(
          "w-80 max-w-[calc(100vw-2rem)] gap-3 p-4 sm:w-96",
          party && "border-t-4 border-t-(--party)"
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerEnter={(e) => e.pointerType === "mouse" && clearTimer()}
        onPointerLeave={onHoverEnd}
      >
        {party && (
          <p className="font-heading text-sm font-semibold text-(--party)">
            Medida de {PARTY_BY_ID[party].name}
          </p>
        )}
        <Section icon={ArrowRight} title="Qué cambiaría">
          {implication.effect}
        </Section>
        <Section icon={Plus} title="A favor se argumenta">
          {implication.pros}
        </Section>
        <Section icon={Minus} title="En contra se argumenta">
          {implication.cons}
        </Section>
        <p className="border-t pt-2 text-[0.7rem] leading-snug text-muted-foreground">
          Resumen orientativo de los argumentos habituales en el debate público.
        </p>
      </PopoverContent>
    </Popover>
  )
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Info
  title: string
  children: string
}) {
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted">
        <Icon className="size-3" aria-hidden />
      </span>
      <div className="space-y-0.5">
        <p className="font-heading text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {title}
        </p>
        <p className="text-sm leading-snug">{children}</p>
      </div>
    </div>
  )
}
