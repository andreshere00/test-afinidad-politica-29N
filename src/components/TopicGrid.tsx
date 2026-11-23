import { Check } from "lucide-react"
import { motion } from "motion/react"

import { TOPICS, type TopicId } from "@/data/topics"
import { cn } from "@/lib/utils"

interface Props {
  selected: TopicId[]
  /** Devuelve true si el tema no se puede seleccionar. */
  isDisabled: (id: TopicId) => boolean
  /** Texto corto que se muestra en un tema deshabilitado (p. ej. "Importante"). */
  disabledLabel?: (id: TopicId) => string | undefined
  onToggle: (id: TopicId) => void
  label: string
}

export function TopicGrid({ selected, isDisabled, disabledLabel, onToggle, label }: Props) {
  return (
    <div
      role="group"
      aria-label={label}
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
    >
      {TOPICS.map((topic, i) => {
        const on = selected.includes(topic.id)
        const disabled = isDisabled(topic.id)
        const Icon = topic.icon
        const tag = disabled ? disabledLabel?.(topic.id) : undefined
        return (
          <motion.button
            key={topic.id}
            type="button"
            aria-pressed={on}
            disabled={disabled}
            onClick={() => onToggle(topic.id)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.03, ease: "easeOut" }}
            whileHover={disabled ? undefined : { y: -2 }}
            whileTap={disabled ? undefined : { scale: 0.96 }}
            className={cn(
              "relative flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center text-sm leading-snug font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              on
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-muted",
              disabled && "cursor-not-allowed opacity-40 hover:bg-card"
            )}
          >
            <motion.span
              animate={on ? { scale: 1.15, rotate: -6 } : { scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="flex"
            >
              <Icon className="size-7" strokeWidth={1.75} aria-hidden />
            </motion.span>
            <span>{topic.name}</span>
            {tag && (
              <span className="absolute top-1.5 left-2 text-[10px] tracking-wide text-muted-foreground uppercase">
                {tag}
              </span>
            )}
            {on && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-primary-foreground text-primary"
              >
                <Check className="size-3.5" strokeWidth={3} aria-hidden />
              </motion.span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
