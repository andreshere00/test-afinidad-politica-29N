# Test de afinidad · 29N

Test de afinidad política basado en las medidas de Vox, PP, PSOE y Frente Amplio para las
elecciones generales del 29 de noviembre de 2026.

Cada pregunta presenta **una medida concreta de cada uno de los cuatro partidos** sobre el mismo
subtema, en orden aleatorio y sin indicar de quién es. El usuario marca las que apoyaría. El
partido de cada medida solo se revela en los resultados.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui (Radix) · Motion (animaciones) · Lucide (iconos).
**Tipografías:** Roboto Slab (títulos) y Roboto (texto), vía `@fontsource`.
**Tema:** claro, oscuro o el del sistema (selector en la cabecera; la elección se guarda en el
navegador). Los colores son los tokens de `src/index.css` (`:root` y `.dark`); la lógica está en
`src/lib/theme.ts` y un script en `index.html` aplica el tema antes de pintar para evitar destellos.

## Requisitos

Un gestor de paquetes con runtime de JavaScript. El proyecto se creó con [Bun](https://bun.sh)
(recomendado), pero también funciona con Node.js 20+ y npm.

Instalar Bun (macOS/Linux):

```bash
curl -fsSL https://bun.sh/install | bash
```

## Instalación

Desde la carpeta del proyecto:

```bash
bun install
```

Con npm:

```bash
npm install
```

## Lanzar en local

```bash
bun run dev
```

Con npm:

```bash
npm run dev
```

Abre <http://localhost:5173>. El puerto está fijado en `vite.config.ts` (`strictPort`); si lo
tienes ocupado, cámbialo allí.

## Otros comandos

| Comando | Qué hace |
| --- | --- |
| `bun run build` | Comprueba tipos y genera la versión de producción en `dist/` |
| `bun run preview` | Sirve la build de producción en local |
| `bun run lint` | Pasa oxlint |

## Flujo

1. Introducción y elección de versión:
   - **Test rápido** (por defecto, 5-10 min): 26 preguntas, 2 por tema.
   - **Test completo** (12-15 min): 38 preguntas, 3 por tema (2 en sector primario).
2. Paso 1: temas más importantes (3–5, cuentan ×2).
3. Paso 2: temas menos importantes (1–3, cuentan ×0,5).
4. Test: cada pregunta tiene 4 medidas.
5. Resultados: afinidad por partido, afinidad por tema, un radar de afinidad por partido
   (porcentaje de sus medidas que has apoyado en cada uno de los 13 temas) y de quién era cada
   medida, con enlace a la fuente cuando la medida no procede del listado original. Tras el test rápido, «Completar el
   test» plantea solo las 12 preguntas que faltan y conserva las respuestas.

## Estructura

- `src/data/topics.ts` – los 13 temas (con su icono de Lucide) y los límites de selección.
- `src/data/parties.ts` – los 4 partidos. El campo opcional `logo` (p. ej. `/partidos/vox.svg` dentro
  de `public/`) sustituye el monograma por un logotipo en escala de grises.
- `src/data/questions.ts` – las preguntas: `prompt` (subtema), `question` (la pregunta en lenguaje
  llano), `context` (glosario o contexto breve), `options` (una medida por partido, redactada sin
  tecnicismos), `implications` (qué cambiaría y argumentos a favor y en contra de cada medida, en
  tono neutral y sin mencionar al partido) y `sources` (fuente de las medidas añadidas fuera del
  listado original).
- `src/components/ImplicationsPopover.tsx` – el panel «¿Qué implica?» (se abre al pasar el ratón o
  al pulsar/tocar).
- `src/data/references.ts` – fuentes de cada pregunta: normas y datos oficiales del contexto (BOE,
  INE, Eurostat, UE…) y los programas de los cuatro partidos. Se muestran en el desplegable «Fuentes
  de esta pregunta» (`QuestionSources`) sin asociarlas a ninguna medida, para no delatar al partido.
- `src/data/modes.ts` – versiones del test (rápido y completo) y qué preguntas entran en el rápido.
- `src/lib/scoring.ts` – ponderación de temas y cálculo de afinidad.
- `src/components/AffinityRadar.tsx` – radares de afinidad por tema (SVG propio, 13 ejes con el icono
  de cada tema y dato al pasar el ratón o con el foco).
- `src/components/` – `Intro`, `Priorities` (pasos 1 y 2), `TopicGrid`, `Quiz`, `Results`,
  `PartyMark` (distintivo de partido); `ui/` contiene los componentes de shadcn.
- `datos/` – el listado de medidas en CSV y XLSX, con las medidas añadidas y sus fuentes.

## Cómo se calcula la afinidad

1. En cada pregunta, cada medida marcada suma 1 a su partido; las no marcadas, 0.
   «Ninguna me convence» cuenta como 0 para todos; «Prefiero no responder» no cuenta.
2. Por tema: porcentaje de medidas de cada partido que el usuario ha apoyado.
3. Total: media ponderada de los temas con los pesos del usuario (por defecto 7,69 % cada uno;
   ×2 los importantes y ×0,5 los menos importantes, normalizado a 100 %).

Todos los partidos se evalúan sobre las mismas preguntas.

## Datos y fuentes (`datos/`)

`medidas_partidos_29N.csv` y `.xlsx` son el listado original de medidas más 14 medidas añadidas el
23/11/2026 para que cada pregunta tenga una medida de cada partido sobre el mismo subtema:

- En el CSV y en la hoja «Comparativa», las medidas añadidas llevan `[Fuente: … – URL]` al final.
- En la hoja «Formato largo» hay una columna nueva, «Fuente».
- En la hoja «Fuentes» se han añadido las nuevas fuentes.

Fuentes primarias usadas: los programas completos de Vox (PDF publicado por El Independiente) y de
Frente Amplio (PDF publicado por Demócrata). Para PP y PSOE se usaron resúmenes de prensa del
programa (Artículo14, Merca2, Tarifaluzhora), porque el PDF del PP supera el tamaño descargable.

## Añadir o editar preguntas

Añade un objeto a `QUESTIONS` en `src/data/questions.ts` con una medida y sus implicaciones para
cada partido (`vox`, `pp`, `psoe`, `fa`). Las implicaciones no deben nombrar ni insinuar el partido. La app se adapta sola al número de preguntas (el enunciado pide
entre 26 y 52).
