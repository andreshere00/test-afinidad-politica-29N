import {
  Briefcase,
  Cpu,
  GraduationCap,
  Globe,
  HeartHandshake,
  HeartPulse,
  House,
  Leaf,
  PiggyBank,
  Shield,
  Users,
  Wheat,
  Zap,
  type LucideIcon,
} from "lucide-react"

export type TopicId =
  | "vivienda"
  | "inmigracion"
  | "economia"
  | "sanidad"
  | "educacion"
  | "geopolitica"
  | "infraestructuras"
  | "derechos"
  | "impuestos"
  | "seguridad"
  | "idi"
  | "ecologismo"
  | "primario"

export interface Topic {
  id: TopicId
  name: string
  icon: LucideIcon
}

/** Orden y nombres tal y como se definieron en el enunciado. */
export const TOPICS: Topic[] = [
  { id: "vivienda", name: "Vivienda", icon: House },
  { id: "inmigracion", name: "Inmigración", icon: Users },
  { id: "economia", name: "Economía y empleo", icon: Briefcase },
  { id: "sanidad", name: "Sanidad", icon: HeartPulse },
  { id: "educacion", name: "Educación", icon: GraduationCap },
  { id: "geopolitica", name: "Geopolítica y relaciones internacionales", icon: Globe },
  { id: "infraestructuras", name: "Infraestructuras, energía y transportes", icon: Zap },
  { id: "derechos", name: "Derechos sociales y feminismo", icon: HeartHandshake },
  { id: "impuestos", name: "Jubilación, IRPF e impuestos", icon: PiggyBank },
  { id: "seguridad", name: "Seguridad y defensa", icon: Shield },
  { id: "idi", name: "I+D, ciencia y tecnología", icon: Cpu },
  { id: "ecologismo", name: "Ecologismo", icon: Leaf },
  { id: "primario", name: "Actividades del sector primario", icon: Wheat },
]

export const TOPIC_BY_ID = Object.fromEntries(
  TOPICS.map((t) => [t.id, t])
) as Record<TopicId, Topic>

/** Elegir temas es opcional: sin selección, todos cuentan igual (7,69 %). */
export const HIGH_MIN = 0
export const HIGH_MAX = 5
export const LOW_MIN = 0
export const LOW_MAX = 3
