import type { Question, Source } from "./questions"

/**
 * Fuentes de cada pregunta, mostradas sin asociarlas a ninguna medida concreta para no delatar
 * qué medida es de qué partido:
 * - `context`: normas y estadísticas oficiales en las que se basa el contexto de la pregunta.
 * - `programs`: los programas de los cuatro partidos (siempre los cuatro) más los resúmenes de
 *   prensa usados para completar alguna medida de esa pregunta.
 *
 * Los argumentos de «¿Qué implica?» resumen el debate público habitual y no tienen fuente única.
 */

const boe = (id: string, label: string): Source => ({
  label: `${label} (BOE)`,
  url: `https://www.boe.es/buscar/act.php?id=${id}`,
})

const S = {
  leyVivienda: boe("BOE-A-2023-12203", "Ley 12/2023, por el derecho a la vivienda"),
  leyIva: boe("BOE-A-1992-28740", "Ley 37/1992, del IVA"),
  leyItp: boe("BOE-A-1993-25359", "Texto refundido del Impuesto de Transmisiones Patrimoniales (RDLeg. 1/1993)"),
  reglamentoExtranjeria: boe("BOE-A-2024-24099", "Reglamento de Extranjería (RD 1155/2024)"),
  codigoCivil: boe("BOE-A-1889-4763", "Código Civil, arts. 17-28 (nacionalidad)"),
  leyImv: boe("BOE-A-2021-21007", "Ley 19/2021, del ingreso mínimo vital"),
  estatutoTrabajadores: boe("BOE-A-2015-11430", "Estatuto de los Trabajadores (RDLeg. 2/2015)"),
  leyProcedimiento: boe("BOE-A-2015-10565", "Ley 39/2015, del Procedimiento Administrativo Común"),
  leySanidad: boe("BOE-A-1986-10499", "Ley 14/1986, General de Sanidad"),
  carteraSns: boe("BOE-A-2006-16212", "Cartera de servicios comunes del SNS (RD 1030/2006)"),
  accesoUniversal: boe("BOE-A-2018-10752", "Real Decreto-ley 7/2018, sobre el acceso universal al SNS"),
  lomloe: boe("BOE-A-2020-17264", "Ley Orgánica 3/2020 (LOMLOE)"),
  loe: boe("BOE-A-2006-7899", "Ley Orgánica 2/2006, de Educación (texto consolidado)"),
  onuSahara: {
    label: "Naciones Unidas: Sáhara Occidental, territorio no autónomo",
    url: "https://www.un.org/dppa/decolonization/en/nsgt/western-sahara",
  },
  lopj: boe("BOE-A-1985-12666", "Ley Orgánica 6/1985, del Poder Judicial, art. 23"),
  justiciaUniversal: {
    label: "Ley Orgánica 1/2014, sobre la justicia universal (BOE)",
    url: "https://www.boe.es/buscar/doc.php?id=BOE-A-2014-2709",
  },
  pniec: {
    label: "Plan Nacional Integrado de Energía y Clima 2023-2030 (MITECO)",
    url: "https://www.miteco.gob.es/es/energia/estrategia-normativa/pniec-23-30.html",
  },
  omie: {
    label: "OMIE: funcionamiento del mercado de electricidad",
    url: "https://www.omie.es/es/mercado-de-electricidad",
  },
  leyImpuestosEspeciales: boe("BOE-A-1992-28741", "Ley 38/1992, de Impuestos Especiales"),
  leySostenibilidadEnergetica: boe("BOE-A-2012-15649", "Ley 15/2012, de medidas fiscales para la sostenibilidad energética"),
  leyViolenciaGenero: boe("BOE-A-2004-21760", "Ley Orgánica 1/2004, de Violencia de Género"),
  leyTrans: boe("BOE-A-2023-5366", "Ley 4/2023, para la igualdad real y efectiva de las personas trans"),
  leyAborto: boe("BOE-A-2010-3514", "Ley Orgánica 2/2010, de salud sexual y reproductiva"),
  leyEutanasia: boe("BOE-A-2021-4628", "Ley Orgánica 3/2021, de regulación de la eutanasia"),
  lgss: boe("BOE-A-2015-11724", "Ley General de la Seguridad Social (RDLeg. 8/2015)"),
  leyIrpf: boe("BOE-A-2006-20764", "Ley 35/2006, del IRPF"),
  leySociedades: boe("BOE-A-2014-12328", "Ley 27/2014, del Impuesto sobre Sociedades"),
  otanLaHaya: {
    label: "OTAN: Declaración de la Cumbre de La Haya (2025)",
    url: "https://www.nato.int/cps/en/natohq/official_texts_236705.htm",
  },
  codigoPenal2015: boe("BOE-A-2015-3439", "Ley Orgánica 1/2015, de reforma del Código Penal"),
  leySeguridadCiudadana: boe("BOE-A-2015-3442", "Ley Orgánica 4/2015, de protección de la seguridad ciudadana"),
  leyFuerzasSeguridad: boe("BOE-A-1986-6859", "Ley Orgánica 2/1986, de Fuerzas y Cuerpos de Seguridad"),
  ineIdi: {
    label: "INE: Estadística sobre actividades de I+D",
    url: "https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736176754&menu=ultiDatos&idp=1254735576669",
  },
  eurostatIdi: {
    label: "Eurostat: gasto en I+D (R&D expenditure)",
    url: "https://ec.europa.eu/eurostat/statistics-explained/index.php?title=R%26D_expenditure",
  },
  lopdgdd: boe("BOE-A-2018-16673", "Ley Orgánica 3/2018, de Protección de Datos, art. 7"),
  pactoVerde: {
    label: "Comisión Europea: el Pacto Verde Europeo",
    url: "https://commission.europa.eu/strategy-and-policy/priorities-2019-2024/european-green-deal_es",
  },
  reglamentoCo2Coches: {
    label: "Reglamento (UE) 2023/851, emisiones de CO₂ de turismos nuevos (EUR-Lex)",
    url: "https://eur-lex.europa.eu/eli/reg/2023/851/oj",
  },
  planHidrologico: boe("BOE-A-2001-13042", "Ley 10/2001, del Plan Hidrológico Nacional"),
  leyCambioClimatico: boe("BOE-A-2021-8447", "Ley 7/2021, de cambio climático (art. 14, zonas de bajas emisiones)"),
  leyProteccionCivil: boe("BOE-A-2015-7730", "Ley 17/2015, del Sistema Nacional de Protección Civil"),
  mercosur: {
    label: "Comisión Europea: relaciones comerciales UE-Mercosur",
    url: "https://policy.trade.ec.europa.eu/eu-trade-relationships-country-and-region/countries-and-regions/mercosur_es",
  },
  pac: { label: "MAPA: Política Agraria Común", url: "https://www.mapa.gob.es/es/pac" },
  relevoGeneracional: {
    label: "MAPA: relevo generacional en el sector agrario",
    url: "https://www.mapa.gob.es/es/desarrollo-rural/temas/relevo-generacional",
  },
  censoAgrario: {
    label: "INE: Censo Agrario",
    url: "https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736176851&menu=ultiDatos&idp=1254735727106",
  },
} satisfies Record<string, Source>

/** Programas de los cuatro partidos: se citan siempre todos, en orden alfabético. */
export const PROGRAM_SOURCES: Source[] = [
  {
    label: "Programa electoral de Frente Amplio para el 29N (PDF, Demócrata)",
    url: "https://www.democrata.es/uploads/s1/35/42/91/4/programafrenteamplio.pdf",
  },
  {
    label: "Programa electoral del PP para el 29N (Demócrata)",
    url: "https://www.democrata.es/elecciones-generales-espana/programa-electoral-pp-29n-propuestas/",
  },
  {
    label: "Programa electoral del PSOE para el 29N (Demócrata)",
    url: "https://www.democrata.es/elecciones-generales-espana/todas-claves-programa-psoe-29n-100000-viviendas-ayudas-por-hijo-nuevos-impuestos/",
  },
  {
    label: "Programa electoral de Vox para el 29N (PDF, El Independiente)",
    url: "https://www.elindependiente.com/wp-content/uploads/2026/11/programa-elecct-vox.pdf",
  },
]

/** Fuentes del contexto de cada pregunta (normas y datos oficiales). */
const CONTEXT_SOURCES: Record<string, Source[]> = {
  "viv-1": [S.leyVivienda],
  "viv-2": [S.leyIva, S.leyItp],
  "viv-3": [S.leyVivienda],
  "inm-1": [S.reglamentoExtranjeria],
  "inm-2": [S.codigoCivil],
  "inm-3": [S.leyImv],
  "eco-1": [S.estatutoTrabajadores],
  "eco-2": [S.leyProcedimiento],
  "eco-3": [S.estatutoTrabajadores],
  "san-1": [S.leySanidad],
  "san-2": [S.carteraSns],
  "san-3": [S.accesoUniversal],
  "edu-1": [S.lomloe],
  "edu-2": [S.loe],
  "edu-3": [S.loe],
  "geo-1": [S.onuSahara],
  "geo-2": [],
  "geo-3": [S.lopj, S.justiciaUniversal],
  "inf-1": [S.pniec, S.omie],
  "inf-2": [S.leyImpuestosEspeciales, S.leySostenibilidadEnergetica],
  "inf-3": [],
  "der-1": [],
  "der-2": [S.leyViolenciaGenero],
  "der-3": [S.leyTrans, S.leyAborto, S.leyEutanasia],
  "imp-1": [S.lgss],
  "imp-2": [S.leyIrpf],
  "imp-3": [S.leySociedades, S.lgss],
  "seg-1": [S.otanLaHaya],
  "seg-2": [S.codigoPenal2015, S.leySeguridadCiudadana],
  "seg-3": [S.leyFuerzasSeguridad],
  "idi-1": [S.ineIdi, S.eurostatIdi],
  "idi-2": [S.lopdgdd],
  "idi-3": [S.leySociedades],
  "ecol-1": [S.pactoVerde, S.reglamentoCo2Coches],
  "ecol-2": [S.planHidrologico],
  "ecol-3": [S.leyCambioClimatico, S.leyProteccionCivil],
  "pri-1": [S.mercosur, S.pac],
  "pri-2": [S.relevoGeneracional, S.censoAgrario],
}

/** Títulos de los resúmenes de prensa usados para completar medidas (sin número de página). */
const PRESS_LABELS: Record<string, string> = {
  "https://tarifaluzhora.es/noticias/elecciones-2026-psoe-propuestas-luz":
    "Tarifaluzhora: propuestas del PSOE sobre la luz (18/11/2026)",
  "https://tarifaluzhora.es/noticias/elecciones-2026-29n-partidos-propuestas-luz":
    "Tarifaluzhora: propuestas de los partidos sobre la luz (18/11/2026)",
  "https://www.articulo14.es/politica/de-la-prioridad-nacional-a-las-pulseras-antimaltrato-las-claves-del-programa-electoral-de-feijoo-20261111.html":
    "Artículo14: claves del programa electoral del PP (11/11/2026)",
  "https://www.merca2.es/2026/11/19/propuestas-economicas-pp-2510463/":
    "Merca2: propuestas económicas del PP (19/11/2026)",
}

export interface QuestionReferences {
  context: Source[]
  programs: Source[]
}

/**
 * Fuentes de una pregunta. Las fuentes complementarias de las medidas se añaden a la lista de
 * programas sin decir a qué medida corresponden, y se ordenan alfabéticamente.
 */
export function getReferences(q: Question): QuestionReferences {
  const seen = new Set(PROGRAM_SOURCES.map((s) => s.url))
  const extra: Source[] = []
  for (const s of Object.values(q.sources ?? {})) {
    if (!s || seen.has(s.url)) continue
    seen.add(s.url)
    extra.push({ label: PRESS_LABELS[s.url] ?? s.label, url: s.url })
  }
  return {
    context: CONTEXT_SOURCES[q.id] ?? [],
    programs: [...PROGRAM_SOURCES, ...extra.sort((a, b) => a.label.localeCompare(b.label, "es"))],
  }
}
