import { PARTY_BY_ID, type PartyId } from "@/data/parties"
import { cn } from "@/lib/utils"

const SIZES = {
  sm: "size-7 text-[8px]",
  md: "size-10 text-[10px]",
  lg: "size-12 text-xs",
} as const

/** Distintivo neutro (monograma en escala de grises) o logotipo del partido si está configurado. */
export function PartyMark({
  party,
  size = "md",
  className,
}: {
  party: PartyId
  size?: keyof typeof SIZES
  className?: string
}) {
  const p = PARTY_BY_ID[party]

  if (p.logo) {
    return (
      <img
        src={p.logo}
        alt=""
        aria-hidden
        className={cn("shrink-0 rounded-full bg-card object-contain grayscale", SIZES[size], className)}
      />
    )
  }

  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-foreground font-heading font-bold tracking-tight text-background ring-2 ring-background",
        SIZES[size],
        className
      )}
    >
      {p.short}
    </span>
  )
}
