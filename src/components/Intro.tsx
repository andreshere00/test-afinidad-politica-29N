import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { QUESTIONS } from "@/data/questions"
import { TOPICS } from "@/data/topics"

export function Intro({ onStart }: { onStart: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl">¿Con qué programa coincides más?</CardTitle>
        <CardDescription className="text-base">
          Test de afinidad basado en las medidas de los programas para el 29N.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed sm:text-base">
        <p>
          Responderás a {QUESTIONS.length} preguntas repartidas en {TOPICS.length} áreas
          temáticas. En cada una verás{" "}
          <strong className="font-medium">cuatro medidas, una de cada partido</strong>, en
          orden aleatorio y sin indicar de quién es cada una. Marca las que apoyarías.
        </p>
        <ol className="list-decimal space-y-1 pl-5 marker:text-muted-foreground">
          <li>Elige qué temas te importan más y cuáles menos.</li>
          <li>Marca las medidas que apoyarías (unos 12 minutos).</li>
          <li>Descubre tu afinidad con cada partido y de quién era cada medida.</li>
        </ol>
        <p className="text-muted-foreground">
          No guardamos ni enviamos tus respuestas: todo se calcula en tu navegador.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="lg" className="h-10 px-5" onClick={onStart}>
          Empezar
        </Button>
      </CardFooter>
    </Card>
  )
}
