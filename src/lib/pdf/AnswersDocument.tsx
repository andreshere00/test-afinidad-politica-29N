import {
  Circle,
  Document,
  Font,
  Line,
  Page,
  Polygon,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer"

import { Fragment } from "react"

import { PARTIES, PARTY_BY_ID, type PartyId } from "@/data/parties"
import { MODES, type TestMode } from "@/data/modes"
import type { Question } from "@/data/questions"
import { TOPICS, type TopicId } from "@/data/topics"
import { formatPercent, formatWeight } from "@/lib/format"
import { analyzeProfile, type Profile } from "@/lib/profile"
import type { Answers, PartyResult, Weights } from "@/lib/scoring"

import roboto400 from "@fontsource/roboto/files/roboto-latin-400-normal.woff?url"
import roboto500 from "@fontsource/roboto/files/roboto-latin-500-normal.woff?url"
import roboto700 from "@fontsource/roboto/files/roboto-latin-700-normal.woff?url"
import slab600 from "@fontsource/roboto-slab/files/roboto-slab-latin-600-normal.woff?url"
import slab700 from "@fontsource/roboto-slab/files/roboto-slab-latin-700-normal.woff?url"

Font.register({
  family: "Roboto",
  fonts: [
    { src: roboto400, fontWeight: 400 },
    { src: roboto500, fontWeight: 500 },
    { src: roboto700, fontWeight: 700 },
  ],
})
Font.register({
  family: "Roboto Slab",
  fonts: [
    { src: slab600, fontWeight: 600 },
    { src: slab700, fontWeight: 700 },
  ],
})
// Sin guiones automáticos (el corte por defecto está pensado para inglés).
Font.registerHyphenationCallback((word) => [word])

/** Mismos colores que el tema claro de la web (`src/index.css`). */
const C = {
  fg: "#0a0a0a",
  muted: "#737373",
  mutedBg: "#f5f5f5",
  border: "#e5e5e5",
  card: "#ffffff",
  party: { vox: "#367a0e", pp: "#1d4f9c", psoe: "#c8102e", fa: "#7a2e91" } as Record<PartyId, string>,
}

const s = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 9.5,
    color: C.fg,
    backgroundColor: "#fafafa",
    paddingTop: 40,
    paddingBottom: 48,
    paddingHorizontal: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingBottom: 8,
    marginBottom: 16,
  },
  brand: { fontFamily: "Roboto Slab", fontWeight: 700, fontSize: 12 },
  small: { fontSize: 8, color: C.muted, lineHeight: 1.35 },
  body: { fontSize: 9.5, lineHeight: 1.45 },
  card: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
  },
  h1: { fontFamily: "Roboto Slab", fontWeight: 700, fontSize: 22, lineHeight: 1.2, marginBottom: 4 },
  h2: { fontFamily: "Roboto Slab", fontWeight: 700, fontSize: 14, lineHeight: 1.25, marginBottom: 4 },
  h3: { fontFamily: "Roboto Slab", fontWeight: 600, fontSize: 10.5, lineHeight: 1.3, marginBottom: 2 },
  desc: { fontSize: 9.5, color: C.muted, marginBottom: 10, lineHeight: 1.4 },
  badge: {
    fontSize: 8,
    backgroundColor: C.mutedBg,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  row: { flexDirection: "row", alignItems: "center" },
  mark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  markText: { color: "#ffffff", fontFamily: "Roboto Slab", fontWeight: 700, fontSize: 6.5, lineHeight: 1 },
  bar: { height: 6, borderRadius: 3, marginTop: 4, overflow: "hidden" },
  footer: {
    position: "absolute",
    bottom: 22,
    left: 40,
    right: 40,
    fontSize: 7.5,
    color: C.muted,
  },
  callout: { backgroundColor: C.mutedBg, borderRadius: 8, padding: 10, marginTop: 6 },
  th: { fontWeight: 500, color: C.muted, fontSize: 8 },
  td: { paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: C.border },
})

function Mark({ id, size = 22 }: { id: PartyId; size?: number }) {
  return (
    <View
      style={[s.mark, { width: size, height: size, borderRadius: size / 2, backgroundColor: C.party[id] }]}
    >
      <Text style={[s.markText, { fontSize: size * 0.28 }]}>{PARTY_BY_ID[id].short}</Text>
    </View>
  )
}

function Header({ mode, date }: { mode: TestMode; date: string }) {
  return (
    <View style={s.header} fixed>
      <Text style={s.brand}>Test de afinidad · 29N</Text>
      <Text style={s.small}>
        {MODES[mode].name} · {date}
      </Text>
    </View>
  )
}

function Footer({ url }: { url: string }) {
  // Sin número de página: el texto dinámico de react-pdf (prop `render`) rompe la maquetación
  // cuando el documento tiene muchas páginas.
  return (
    <Text style={s.footer} fixed>
      Resultado orientativo · {url}
    </Text>
  )
}

function Ranking({ results }: { results: PartyResult[] }) {
  return (
    <View>
      {results.map((r, i) => (
        <View key={r.partyId} style={[s.row, { marginBottom: 10 }]}>
          <Mark id={r.partyId} size={28} />
          <View style={{ flex: 1 }}>
            <View style={[s.row, { justifyContent: "space-between" }]}>
              <Text
                style={{
                  fontFamily: "Roboto Slab",
                  fontWeight: i === 0 ? 700 : 600,
                  fontSize: 12,
                  color: C.party[r.partyId],
                }}
              >
                <Text style={{ color: C.muted, fontSize: 9 }}>{i + 1}. </Text>
                {PARTY_BY_ID[r.partyId].name}
              </Text>
              <Text style={{ fontFamily: "Roboto Slab", fontWeight: 700, fontSize: 14 }}>
                {formatPercent(r.affinity)}
              </Text>
            </View>
            <View style={[s.bar, { backgroundColor: `${C.party[r.partyId]}26` }]}>
              <View
                style={{
                  width: `${Math.max(r.affinity, 0.5)}%`,
                  height: "100%",
                  backgroundColor: C.party[r.partyId],
                  borderRadius: 3,
                }}
              />
            </View>
            <Text style={[s.small, { marginTop: 2 }]}>
              Has apoyado {r.supported} de sus {r.answered} medidas.
            </Text>
          </View>
        </View>
      ))}
    </View>
  )
}

/** Barra izquierda–derecha con la posición aproximada del perfil. */
function AxisBar({ profile }: { profile: Profile }) {
  if (profile.axis === null) return null
  const W = 300
  const x = ((profile.axis + 1) / 2) * W
  return (
    <View style={{ marginTop: 4, marginBottom: 10 }}>
      <Svg width={W + 12} height={22}>
        <Line x1={6} y1={11} x2={W + 6} y2={11} stroke={C.border} strokeWidth={4} />
        {(["fa", "psoe", "pp", "vox"] as PartyId[]).map((id, i) => (
          <Circle key={id} cx={6 + [0, 0.325, 0.675, 1][i] * W} cy={11} r={3.5} fill={C.party[id]} />
        ))}
        <Circle cx={x + 6} cy={11} r={7} fill={C.fg} stroke="#ffffff" strokeWidth={2} />
      </Svg>
      <View style={[s.row, { width: W + 12, justifyContent: "space-between" }]}>
        <Text style={s.small}>Izquierda</Text>
        <Text style={[s.small, { color: C.fg, fontWeight: 500 }]}>Tu posición: {profile.axisLabel}</Text>
        <Text style={s.small}>Derecha</Text>
      </View>
    </View>
  )
}

function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <View style={s.card}>
      <Text style={s.h2}>Análisis de tu perfil</Text>
      <Text style={s.desc}>
        Lectura descriptiva de tus respuestas. No valora las opciones ni recomienda el voto.
      </Text>
      {profile.stats.length > 0 && (
        <View style={[s.row, { marginBottom: 12 }]}>
          {profile.stats.map((st, i) => (
            <View
              key={st.label}
              style={{
                flex: 1,
                backgroundColor: C.mutedBg,
                borderRadius: 8,
                padding: 8,
                marginRight: i < profile.stats.length - 1 ? 6 : 0,
              }}
            >
              <Text style={{ fontFamily: "Roboto Slab", fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>
                {st.value}
              </Text>
              <Text style={s.small}>{st.label}</Text>
            </View>
          ))}
        </View>
      )}
      <AxisBar profile={profile} />
      {profile.paragraphs.map((p) => (
        <View key={p.title} style={{ marginBottom: 8 }} wrap={false}>
          <Text style={s.h3}>{p.title}</Text>
          <Text style={s.body}>{p.text}</Text>
        </View>
      ))}
    </View>
  )
}

function TopicTable({
  results,
  weights,
  high,
  low,
}: {
  results: PartyResult[]
  weights: Weights
  high: TopicId[]
  low: TopicId[]
}) {
  return (
    <View style={s.card}>
      <Text style={s.h2}>Afinidad por tema</Text>
      <Text style={s.desc}>
        Porcentaje de medidas de cada partido que has apoyado en cada tema. «—» = sin respuestas.
      </Text>
      <View style={[s.row, s.td]}>
        <Text style={[s.th, { flex: 1 }]}>Tema</Text>
        <Text style={[s.th, { width: 44, textAlign: "right" }]}>Peso</Text>
        {PARTIES.map((p) => (
          <View key={p.id} style={{ width: 52, alignItems: "flex-end" }}>
            <Mark id={p.id} size={16} />
          </View>
        ))}
      </View>
      {TOPICS.map((t, n) => {
        const scores = PARTIES.map((p) => results.find((r) => r.partyId === p.id)!.topics[t.id].score)
        const best = Math.max(...scores.map((x) => x ?? -1))
        return (
          <View key={t.id} style={[s.row, s.td]}>
            <Text style={{ flex: 1 }}>
              <Text style={{ color: C.muted }}>{n + 1}. </Text>
              {t.name}
              {high.includes(t.id) && <Text style={{ color: C.muted }}> (×2)</Text>}
              {low.includes(t.id) && <Text style={{ color: C.muted }}> (×0,5)</Text>}
            </Text>
            <Text style={{ width: 44, textAlign: "right", color: C.muted }}>
              {formatWeight(weights[t.id])}
            </Text>
            {PARTIES.map((p, i) => {
              const v = scores[i]
              const top = v !== null && v > 0 && v === best
              return (
                <Text
                  key={p.id}
                  style={{
                    width: 52,
                    textAlign: "right",
                    color: v === null ? C.muted : top ? C.party[p.id] : C.fg,
                    fontWeight: top ? 700 : 400,
                  }}
                >
                  {v === null ? "—" : formatPercent(v * 100, 0)}
                </Text>
              )
            })}
          </View>
        )
      })}
    </View>
  )
}

const RS = 150
const RC = RS / 2
const RR = 52

function rp(i: number, v: number, radius = RR): [number, number] {
  const a = (Math.PI * 2 * i) / TOPICS.length - Math.PI / 2
  const d = (v / 100) * radius
  return [RC + d * Math.cos(a), RC + d * Math.sin(a)]
}
const poly = (vals: number[]) => vals.map((v, i) => rp(i, v).join(",")).join(" ")

function Radar({ result }: { result: PartyResult }) {
  const color = C.party[result.partyId]
  const vals = TOPICS.map((t) => (result.topics[t.id].score ?? 0) * 100)
  return (
    <View
      style={{
        width: "48.5%",
        borderWidth: 1,
        borderColor: C.border,
        borderTopWidth: 3,
        borderTopColor: color,
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
        alignItems: "center",
      }}
      wrap={false}
    >
      <View style={[s.row, { justifyContent: "space-between", width: "100%" }]}>
        <View style={s.row}>
          <Mark id={result.partyId} size={16} />
          <Text style={{ fontFamily: "Roboto Slab", fontWeight: 600, color }}>
            {PARTY_BY_ID[result.partyId].name}
          </Text>
        </View>
        <Text style={s.small}>
          Afinidad <Text style={{ color: C.fg, fontWeight: 700 }}>{formatPercent(result.affinity, 0)}</Text>
        </Text>
      </View>
      <Svg width={RS} height={RS}>
        {[25, 50, 75, 100].map((ring) => (
          <Polygon key={ring} points={poly(TOPICS.map(() => ring))} fill="none" stroke={C.border} strokeWidth={0.75} />
        ))}
        {TOPICS.map((t, i) => {
          const [x, y] = rp(i, 100)
          return <Line key={t.id} x1={RC} y1={RC} x2={x} y2={y} stroke={C.border} strokeWidth={0.75} />
        })}
        <Polygon points={poly(vals)} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1.5} />
        {vals.map((v, i) => {
          const [x, y] = rp(i, v)
          return <Circle key={i} cx={x} cy={y} r={2} fill={color} />
        })}
        {TOPICS.map((t, i) => {
          const [x, y] = rp(i, 100, RR + 12)
          return (
            <Text key={t.id} x={x - 3} y={y + 2.5} style={{ fontSize: 7, fill: C.muted }}>
              {String(i + 1)}
            </Text>
          )
        })}
      </Svg>
    </View>
  )
}

function Radars({ results }: { results: PartyResult[] }) {
  return (
    <View style={s.card} wrap={false}>
      <Text style={s.h2}>Perfil de afinidad por tema</Text>
      <Text style={s.desc}>
        Cuanto más se aleja del centro, más medidas de ese partido has apoyado en el tema. Los números
        corresponden a los temas de la tabla.
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        {results.map((r) => (
          <Radar key={r.partyId} result={r} />
        ))}
      </View>
    </View>
  )
}

/**
 * La fuente incrustada solo tiene el subconjunto latino: los subíndices (CO₂) rompen la maquetación
 * de react-pdf, así que se sustituyen por dígitos normales.
 */
const clean = (text: string) =>
  text.replace(/[\u2080-\u2089]/g, (d) => String(d.charCodeAt(0) - 0x2080))

function statusOf(a: Answers[string] | undefined): string | null {
  if (a === undefined) return "Sin responder"
  if (a === null) return "Prefieres no responder"
  if (a.length === 0) return "Ninguna te convence"
  return null
}

function QuestionCard({ question: q, answer: a }: { question: Question; answer: Answers[string] | undefined }) {
  const status = statusOf(a)
  return (
    <View style={[s.card, { padding: 10, marginBottom: 6 }]}>
      <View style={[s.row, { justifyContent: "space-between", alignItems: "flex-start" }]}>
        <View style={{ flex: 1 }}>
          <Text style={s.h3}>{clean(q.prompt)}</Text>
          <Text style={[s.small, { marginBottom: 3 }]}>{clean(q.question)}</Text>
        </View>
        {status && <Text style={[s.badge, { marginLeft: 8 }]}>{status}</Text>}
      </View>
      {PARTIES.map((p) => {
        const ok = Array.isArray(a) && a.includes(p.id)
        const color = C.party[p.id]
        return (
          <View
            key={p.id}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              borderWidth: 1,
              borderColor: ok ? color : C.border,
              borderLeftWidth: 3,
              borderLeftColor: color,
              backgroundColor: ok ? `${color}14` : C.card,
              borderRadius: 6,
              paddingVertical: 4,
              paddingHorizontal: 6,
              marginTop: 3,
            }}
          >
            <Mark id={p.id} size={15} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 7.5, fontWeight: 500, color, lineHeight: 1.3 }}>{p.name}</Text>
              <Text style={{ fontSize: 8.5, lineHeight: 1.35 }}>{clean(q.options[p.id])}</Text>
            </View>
            {ok && (
              <Text style={{ fontSize: 7.5, fontWeight: 700, color, marginLeft: 6, lineHeight: 1.3 }}>
                Apoyada
              </Text>
            )}
          </View>
        )
      })}
    </View>
  )
}

function AnswersSection({ questions, answers }: { questions: Question[]; answers: Answers }) {
  return (
    <>
      <Text style={s.h2}>De quién era cada medida</Text>
      <Text style={s.desc}>
        Tus respuestas, pregunta a pregunta, con el partido que propone cada medida. Las medidas
        que apoyaste aparecen resaltadas.
      </Text>
      {TOPICS.map((t) => {
        const [first, ...rest] = questions.filter((q) => q.topic === t.id)
        if (!first) return null
        return (
          <Fragment key={t.id}>
            {/* El título del tema va siempre con su primera pregunta (no queda solo al final de página). */}
            <View wrap={false}>
              <Text
                style={{
                  fontFamily: "Roboto Slab",
                  fontWeight: 700,
                  fontSize: 12,
                  lineHeight: 1.25,
                  marginBottom: 5,
                  marginTop: 8,
                }}
              >
                {t.name}
              </Text>
              <QuestionCard question={first} answer={answers[first.id]} />
            </View>
            {rest.map((q) => (
              <View key={q.id} wrap={false}>
                <QuestionCard question={q} answer={answers[q.id]} />
              </View>
            ))}
          </Fragment>
        )
      })}
    </>
  )
}

export interface AnswersPdfInput {
  mode: TestMode
  results: PartyResult[]
  questions: Question[]
  answers: Answers
  weights: Weights
  high: TopicId[]
  low: TopicId[]
}

export function AnswersDocument(props: AnswersPdfInput & { date: string; url: string }) {
  const { mode, results, questions, answers, weights, high, low, date, url } = props
  const profile = analyzeProfile(results, questions, answers, high, low)
  const answered = questions.filter((q) => Array.isArray(answers[q.id])).length
  return (
    <Document title="Test de afinidad · 29N – Tus respuestas" author="Test de afinidad · 29N" language="es">
      <Page size="A4" style={s.page}>
        <Header mode={mode} date={date} />
        <Footer url={url} />
        <View style={s.card}>
          <View style={[s.row, { justifyContent: "space-between" }]}>
            <Text style={s.h1}>Tu afinidad</Text>
            <Text style={s.badge}>{MODES[mode].name}</Text>
          </View>
          <Text style={s.desc}>
            Has respondido {answered} de {questions.length} preguntas. La afinidad es el porcentaje
            de medidas de cada partido que has apoyado, ponderado por tema.
          </Text>
          <Ranking results={results} />
        </View>
        <ProfileCard profile={profile} />
        <TopicTable results={results} weights={weights} high={high} low={low} />
        <Radars results={results} />
      </Page>
      <Page size="A4" style={s.page}>
        <Header mode={mode} date={date} />
        <Footer url={url} />
        <AnswersSection questions={questions} answers={answers} />
      </Page>
    </Document>
  )
}
