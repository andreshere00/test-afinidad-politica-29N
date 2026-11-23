import { BookOpen, ChevronDown, ExternalLink } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { Question, Source } from "@/data/questions"
import { getReferences } from "@/data/references"
import { cn } from "@/lib/utils"

/**
 * Desplegable con las fuentes de una pregunta. No asocia ninguna fuente a una medida concreta,
 * para que no se pueda deducir de quién es cada medida.
 */
export function QuestionSources({ question, className }: { question: Question; className?: string }) {
  const { context, programs } = getReferences(question)

  return (
    <Collapsible className={cn("text-sm", className)}>
      <CollapsibleTrigger className="group inline-flex items-center gap-1.5 rounded-sm text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
        <BookOpen className="size-3.5" aria-hidden />
        Fuentes de esta pregunta
        <ChevronDown
          className="size-3.5 transition-transform group-data-[state=open]:rotate-180"
          aria-hidden
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 space-y-3 rounded-lg border px-3 py-3 text-xs">
          {context.length > 0 && <SourceList title="Contexto" sources={context} />}
          <SourceList title="Medidas: programas de los cuatro partidos" sources={programs} />
          <p className="text-muted-foreground">
            Las fuentes no indican qué medida corresponde a cada partido. Los argumentos de
            «¿Qué implica?» resumen el debate público habitual.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function SourceList({ title, sources }: { title: string; sources: Source[] }) {
  return (
    <div className="space-y-1">
      <p className="font-medium">{title}</p>
      <ul className="space-y-1">
        {sources.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-start gap-1 text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              <span>{s.label}</span>
              <ExternalLink className="mt-0.5 size-3 shrink-0" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
