import type { PartyId } from "./parties"
import type { TopicId } from "./topics"

/**
 * Cada pregunta presenta una medida concreta de CADA partido sobre el mismo tema,
 * tomada del listado de medidas de su programa (medidas_partidos_29N.csv).
 * En el test se muestran anónimas y en orden aleatorio; el usuario marca las que apoyaría.
 */
export interface Question {
  id: string
  topic: TopicId
  /** Subtema de la pregunta. */
  prompt: string
  /** Medida de cada partido. */
  options: Record<PartyId, string>
  /**
   * Fuente de las medidas que NO proceden del listado del CSV original
   * (añadidas tras buscar en programas actuales, anteriores o en la acción de gobierno autonómica).
   */
  sources?: Partial<Record<PartyId, Source>>
}

export interface Source {
  /** Descripción breve de la fuente (p. ej. «Programa electoral generales 2023»). */
  label: string
  url: string
}

export const QUESTIONS: Question[] = [
  // ───────── Vivienda
  {
    id: "viv-1",
    topic: "vivienda",
    prompt: "Alquiler y Ley de Vivienda",
    options: {
      vox: "Derogar la Ley de Vivienda, reformar la Ley del Suelo y poner más suelo a disposición.",
      pp: "Derogar la Ley de Vivienda y los mecanismos de intervención de precios del alquiler, y conceder licencias en 3 meses con silencio positivo.",
      psoe: "Contratos de alquiler más largos, congelación de rentas en zonas tensionadas y seguro de impago para jóvenes.",
      fa: "Contratos de alquiler indefinidos y alquiler topado al 25 % de la renta media neta en zonas tensionadas.",
    },
  },
  {
    id: "viv-2",
    topic: "vivienda",
    prompt: "Compra de la primera vivienda",
    options: {
      vox: "IVA del 0 % en la primera vivienda habitual nueva, bonificación del 100 % del ITP en la de segunda mano y recuperar la deducción por compra de vivienda habitual.",
      pp: "Bajar el IVA de la primera vivienda nueva del 10 % al 4 % para menores de 40 años y un ahorro para vivienda de hasta 2.000 €/año con deducción del 20 % y avales de hasta 40.000 €.",
      psoe: "10.000 M€ en préstamos públicos sin interés de hasta 50.000 € para comprar la primera vivienda.",
      fa: "Hipoteca pública obligatoria a tipo fijo.",
    },
  },
  {
    id: "viv-3",
    topic: "vivienda",
    prompt: "Oferta de vivienda, vivienda pública y grandes tenedores",
    options: {
      vox: "Prioridad para los españoles en la vivienda pública y fiscalidad agravada a compradores no comunitarios y a fondos.",
      pp: "Construir 1 millón de viviendas en la legislatura con una nueva Ley del Suelo.",
      psoe: "Movilizar el 1 % del PIB al año para el acceso a la vivienda, con un parque estatal de 100.000 viviendas asequibles.",
      fa: "Invertir el 1 % del PIB al año (unos 17.000 M€) para sumar 1,5 millones de viviendas públicas en 12 años y expropiación progresiva a grandes tenedores.",
    },
  },

  // ───────── Inmigración
  {
    id: "inm-1",
    topic: "inmigracion",
    prompt: "Inmigración irregular y regularización",
    options: {
      vox: "Prohibir las regularizaciones masivas, suprimir el arraigo como vía de regularización y repatriar a los inmigrantes irregulares.",
      pp: "Identificar en un máximo de 7 días a quien entre irregularmente, acelerar las devoluciones y crear centros para irregulares en terceros países.",
      psoe: "Ampliar las vías legales de protección internacional y reforzar la acogida y el asilo.",
      fa: "Un procedimiento estable de regularización y completar los expedientes pendientes de la regularización extraordinaria.",
    },
  },
  {
    id: "inm-2",
    topic: "inmigracion",
    prompt: "Nacionalidad e integración",
    options: {
      vox: "Endurecer el acceso a la nacionalidad española y deportar a los extranjeros que cometan delitos graves o reiterados.",
      pp: "Una Ley de Nacionalidad más exigente, con preferencia para nacionales de países hispanos, y compromisos de integración (español, Constitución) para renovar la residencia.",
      psoe: "Un Plan de Integración y Ciudadanía 2026-2030 dotado inicialmente con 500 M€ y agilizar la homologación de títulos extranjeros.",
      fa: "Devolver la nacionalidad española a los saharauis nacidos bajo administración española antes de septiembre de 1977 y a sus descendientes, y una nueva ley integral contra el racismo.",
    },
    sources: {
      fa: { label: "Programa Frente Amplio 29N, pág. 128 del PDF", url: "https://www.democrata.es/uploads/s1/35/42/91/4/programafrenteamplio.pdf" },
    },
  },
  {
    id: "inm-3",
    topic: "inmigracion",
    prompt: "Flujos migratorios, ayudas y acogida",
    options: {
      vox: "Ingreso Mínimo Vital y ayudas solo para españoles («prioridad nacional») y un plan de «remigración» para quienes no contribuyan.",
      pp: "Cupos anuales de inmigración laboral por sectores, ligados a que los países de origen colaboren en los retornos.",
      psoe: "Prioridad a la protección de los menores que llegan solos y apoyo a los territorios con emergencias de acogida.",
      fa: "Ampliar las vías legales y seguras de migración y asilo.",
    },
  },

  // ───────── Economía y empleo
  {
    id: "eco-1",
    topic: "economia",
    prompt: "Mercado laboral",
    options: {
      vox: "Derogar la legislación laboral vigente y recortar las subvenciones a partidos, sindicatos y patronales.",
      pp: "Bonificar al 100 % la cotización del primer contratado (50 % el segundo) y reducir la cotización por desempleo a las empresas con plantillas más estables que la media de su sector.",
      psoe: "Jornada de 37,5 horas sin pérdida salarial, avanzando hacia las 35 horas por negociación colectiva.",
      fa: "Semana laboral de 32 horas sin bajada de sueldo.",
    },
  },
  {
    id: "eco-2",
    topic: "economia",
    prompt: "Burocracia, empresas y derechos laborales",
    options: {
      vox: "Derogar tres normas por cada nueva ley aprobada, silencio administrativo positivo como regla general y fin de la cita previa obligatoria.",
      pp: "Reducir las cargas administrativas un 25 % hasta 2029 (35 % para pymes) y eliminar 3 normas por cada nueva.",
      psoe: "Registro horario digital, un Estatuto del Becario y que el despido improcedente se repare según el daño causado, no con una indemnización uniforme.",
      fa: "Trabajadores en los consejos de administración: un tercio en empresas de 50 a 1.000 empleados y la mitad en las mayores.",
    },
  },
  {
    id: "eco-3",
    topic: "economia",
    prompt: "Industria, autónomos y salarios",
    options: {
      vox: "Un Plan Nacional de Reindustrialización y una ley de unidad de mercado para operar en toda España sin nuevas licencias.",
      pp: "Cuota cero para autónomos el primer año y sin IVA si facturan menos de 85.000 €/año.",
      psoe: "Salario mínimo blindado por ley por encima del 60 % del salario medio y una Ley de Industria y Autonomía Estratégica.",
      fa: "Salario mínimo garantizado en el 60 % del salario medio neto y la SEPI como agencia industrial y banco público de inversión.",
    },
  },

  // ───────── Sanidad
  {
    id: "san-1",
    topic: "sanidad",
    prompt: "Financiación, atención primaria y listas de espera",
    options: {
      vox: "Un plan nacional para reducir las listas de espera, con colaboración público-privada.",
      pp: "Al menos 4.500 médicos más en Atención Primaria y un plan urgente de reducción de listas de espera.",
      psoe: "Financiación sanitaria pública en torno al 7 % del PIB, con gestión directa preferente.",
      fa: "Un suelo de financiación sanitaria pública del 8 % del PIB y refuerzo obligatorio de la atención primaria.",
    },
  },
  {
    id: "san-2",
    topic: "sanidad",
    prompt: "Nuevas prestaciones",
    options: {
      vox: "Reforzar los cuidados paliativos y la objeción de conciencia.",
      pp: "Una ley nacional de cuidados paliativos y un Plan Nacional de Salud Mental 2027-2037 centrado en niños y adolescentes.",
      psoe: "Dentista básico en la sanidad pública (mientras tanto, ayuda de hasta 200 €/año) y primera consulta psicológica pública en un máximo de 30 días.",
      fa: "Cobertura dental pública para el 50 % de la población.",
    },
  },
  {
    id: "san-3",
    topic: "sanidad",
    prompt: "Acceso y organización del sistema",
    options: {
      vox: "Excluir de la atención sanitaria ordinaria a los extranjeros sin residencia legal, salvo urgencia grave.",
      pp: "Tarjeta sanitaria e historia clínica interoperables en toda España.",
      psoe: "Reforzar la atención primaria y ampliar el programa público de gafas para menores.",
      fa: "Gafas y lentillas gratuitas y financiación pública de los audífonos.",
    },
  },

  // ───────── Educación
  {
    id: "edu-1",
    topic: "educacion",
    prompt: "Ley educativa y resultados",
    options: {
      vox: "Derogar la LOMLOE y recuperar las reválidas.",
      pp: "Sustituir la LOMLOE y ligar la promoción en la ESO a aprobar las asignaturas.",
      psoe: "Abandono escolar temprano por debajo del 10 % antes de 2030, más plazas de FP (IA, ciberseguridad, transición energética) y un orientador por cada 250 alumnos.",
      fa: "Financiación mínima de la educación pública del 7 % del PIB y reducción de ratios.",
    },
  },
  {
    id: "edu-2",
    topic: "educacion",
    prompt: "Educación de 0 a 3 años y comedor",
    options: {
      vox: "Educación infantil de 0 a 3 años gratuita.",
      pp: "Educación de 0 a 3 años gratuita al final de la legislatura.",
      psoe: "Universalizar la educación pública de 0 a 3 años y comedor gratuito para los alumnos en riesgo de pobreza.",
      fa: "Acceso universal a la educación de 0 a 3 años y comedor gratuito para todo Infantil y Primaria en la pública, con producto fresco y local.",
    },
  },
  {
    id: "edu-3",
    topic: "educacion",
    prompt: "Lenguas y universidad",
    options: {
      vox: "EVAU única, currículos unificados y enseñanza garantizada en español.",
      pp: "PAU común en toda España, nota mínima para acceder a Magisterio y educación en español en todas las etapas.",
      psoe: "Matrícula gratuita del primer curso de grado en universidades públicas y becas Erasmus de hasta 1.500 €/mes según renta.",
      fa: "Un Plan Estatal para el aprendizaje de las lenguas cooficiales, garantizando la inmersión en catalán en Cataluña, y reducir los precios universitarios hacia la gratuidad.",
    },
    sources: {
      fa: { label: "Programa Frente Amplio 29N, págs. 32-33 del PDF", url: "https://www.democrata.es/uploads/s1/35/42/91/4/programafrenteamplio.pdf" },
    },
  },

  // ───────── Geopolítica y relaciones internacionales
  {
    id: "geo-1",
    topic: "geopolitica",
    prompt: "Vecindad y Unión Europea",
    options: {
      vox: "Sanciones a Marruecos, suspensión de acuerdos y revisión de las relaciones con ese país.",
      pp: "Más equilibrio en las relaciones con Marruecos y Argelia.",
      psoe: "Una Unión Europea con mayor integración política y fiscal y una defensa común.",
      fa: "Retirar el apoyo al plan de autonomía marroquí para el Sáhara y apoyar un referéndum.",
    },
  },
  {
    id: "geo-2",
    topic: "geopolitica",
    prompt: "Conflictos internacionales y soberanía",
    options: {
      vox: "Presión internacional para recuperar la soberanía de Gibraltar.",
      pp: "Mantener el apoyo a Ucrania y apoyo expreso a María Corina Machado en Venezuela.",
      psoe: "Apoyo a la soberanía de Ucrania y solución de dos Estados para Israel y Palestina.",
      fa: "Embargo total de armas a Israel, cierre de tránsitos militares, suspensión del Acuerdo UE-Israel y reconocimiento de Palestina.",
    },
  },
  {
    id: "geo-3",
    topic: "geopolitica",
    prompt: "Fronteras, cooperación y justicia internacional",
    options: {
      vox: "Refuerzo militar de las fronteras de Ceuta y Melilla y suspender la cooperación al desarrollo con los países que no controlen la emigración.",
      pp: "Pedir a Bruselas para Ceuta y Melilla un trato de frontera como el de la frontera con Rusia y rechazo en frontera de quienes entren a nado.",
      psoe: "Ayuda al desarrollo hacia el 0,7 % de la renta nacional bruta e impulsar un impuesto mínimo global a las grandes fortunas.",
      fa: "Restablecer la jurisdicción universal y más apoyo a la Corte Internacional de Justicia y a la Corte Penal Internacional.",
    },
  },

  // ───────── Infraestructuras, energía y transportes
  {
    id: "inf-1",
    topic: "infraestructuras",
    prompt: "Energía nuclear y modelo energético",
    options: {
      vox: "Mantener las centrales nucleares sin calendario de cierre y estudiar nuevas centrales.",
      pp: "Eliminar en 100 días el calendario de cierre de las centrales nucleares y aprobar un plan para prevenir nuevos apagones.",
      psoe: "Mantener el cierre nuclear hasta 2035 e impulsar renovables, redes, almacenamiento e hidrógeno verde.",
      fa: "Reformar el sistema marginalista de fijación de precios de la electricidad.",
    },
  },
  {
    id: "inf-2",
    topic: "infraestructuras",
    prompt: "Electricidad: impuestos y redes",
    options: {
      vox: "Bajar los impuestos a la electricidad y quitar límites a la inversión en redes.",
      pp: "Suprimir el impuesto del 7 % a la producción eléctrica.",
      psoe: "Un bono social único y automático (luz, calefacción, transporte, telecomunicaciones y agua) reconocido de oficio, y reformar el mercado eléctrico para que el abaratamiento de las renovables llegue a hogares y empresas.",
      fa: "Control público de las redes de distribución, una comercializadora eléctrica pública y titularidad pública de las líneas de transporte de más de 380 kV.",
    },
    sources: {
      psoe: { label: "Programa PSOE 29N, págs. 39 y 67, según Tarifaluzhora (18/11/2026)", url: "https://tarifaluzhora.es/noticias/elecciones-2026-psoe-propuestas-luz" },
    },
  },
  {
    id: "inf-3",
    topic: "infraestructuras",
    prompt: "Transporte e infraestructuras",
    options: {
      vox: "Más inversión en carreteras, ferrocarril, redes hidráulicas y telecomunicaciones, con una auditoría de la red ferroviaria y mejora de Cercanías y Media Distancia.",
      pp: "Un Plan Nacional de Infraestructuras de más de 300.000 M€ en 15 años, con capital privado.",
      psoe: "Unos 19.000 M€ para conservación ferroviaria en 2026-2030, reparar 5.000 km de la red estatal de carreteras y restringir los vuelos cortos con alternativa directa en tren.",
      fa: "Abono único de transporte de 20 €/mes en Cercanías (10 € para menores de 26 y gratis para menores de 16), fibra y 5G en el rural y revertir los recortes de paradas de autobús.",
    },
  },

  // ───────── Derechos sociales y feminismo
  {
    id: "der-1",
    topic: "derechos",
    prompt: "Familia y natalidad",
    options: {
      vox: "Plan de natalidad con beneficios de familia numerosa desde el primer hijo y cotizaciones pagadas por el Estado a los españoles que cuiden de sus hijos.",
      pp: "Una deducción familiar única y reembolsable, pagada mensualmente, que cuente al hijo no nacido.",
      psoe: "Prestación por crianza y una Cuenta de Futuro de 1.000 € al nacer.",
      fa: "Prestación universal de 200 €/mes por cada hijo menor de 18 años.",
    },
  },
  {
    id: "der-2",
    topic: "derechos",
    prompt: "Igualdad y violencia",
    options: {
      vox: "Derogar las leyes de violencia de género y sustituirlas por normas de protección a las víctimas.",
      pp: "Garantizar la fiabilidad de las pulseras de control de las órdenes de alejamiento, que pasarán a depender del Ministerio del Interior con supervisión continua de las fuerzas de seguridad.",
      psoe: "Ley abolicionista de la prostitución, leyes contra la violencia vicaria y la trata, y delito de deepfakes sexuales.",
      fa: "Transparencia salarial y medidas contra la brecha de género.",
    },
    sources: {
      pp: { label: "Programa PP 29N, según Artículo14 (11/11/2026)", url: "https://www.articulo14.es/politica/de-la-prioridad-nacional-a-las-pulseras-antimaltrato-las-claves-del-programa-electoral-de-feijoo-20261111.html" },
    },
  },
  {
    id: "der-3",
    topic: "derechos",
    prompt: "Derechos civiles e identidad",
    options: {
      vox: "Protección de la vida desde la concepción hasta la muerte natural.",
      pp: "Revisar la Ley Trans para eliminar la autodeterminación registral de sexo.",
      psoe: "Blindar el aborto, el matrimonio igualitario y la eutanasia, y penalizar las terapias de conversión.",
      fa: "Reconocimiento legal de las personas no binarias y desarrollo de la Ley Trans.",
    },
  },

  // ───────── Jubilación, IRPF e impuestos
  {
    id: "imp-1",
    topic: "impuestos",
    prompt: "Pensiones y jubilación",
    options: {
      vox: "Ligar la sostenibilidad de las pensiones al crecimiento, el empleo, los salarios y la natalidad.",
      pp: "Revalorizar las pensiones cada año con el IPC, garantizado por ley aunque no haya Presupuestos, y deducciones en el IRPF para quien siga trabajando tras la edad de jubilación.",
      psoe: "Revalorización de las pensiones con el IPC blindada en la Constitución, 20.000 M€ en el Fondo de Reserva y un año adicional cotizado por hijo.",
      fa: "Jubilación de nuevo a los 65 años (60 en construcción, limpieza, ayuda a domicilio, camareras de piso y pesca), sin recorte tras 40 años cotizados y ninguna pensión por debajo del salario mínimo.",
    },
  },
  {
    id: "imp-2",
    topic: "impuestos",
    prompt: "IRPF, rentas y patrimonio",
    options: {
      vox: "Un IRPF simplificado con tipos según el número de hijos.",
      pp: "Deflactar el IRPF, elevar los mínimos personales y familiares, dejar exento el salario mínimo y rebajar el IRPF a los jóvenes de 18 a 35 años en sus cuatro primeras declaraciones (100 %, 75 %, 50 % y 25 %).",
      psoe: "Subir la tributación de las rentas del capital desde 50.000 €, hasta el 35 % por encima de 300.000 €.",
      fa: "Impuesto a las grandes fortunas (2 % desde 1 M€ y 3 % desde 50 M€) y un impuesto de sucesiones estatal desde 1 M€.",
    },
  },
  {
    id: "imp-3",
    topic: "impuestos",
    prompt: "Empresas, consumo y Seguridad Social",
    options: {
      vox: "Rebajar el Impuesto de Sociedades, bajar el IVA priorizando los productos esenciales y gravar las remesas enviadas al extranjero.",
      pp: "Que la empresa que invierta en crecimiento pague menos Impuesto sobre Sociedades y eliminar los impuestos que frenan la inversión.",
      psoe: "Tasa Tobin del 0,2 % al 0,4 %, tributación complementaria a grandes tecnológicas e IA, más impuestos a las cotizadas cuyo CEO cobre más de 100 veces la mediana y una tasa a los viajes de lujo.",
      fa: "Tipo efectivo mínimo del 20 % en Sociedades para las grandes empresas, subir la base máxima de cotización y eliminar las deducciones por planes de pensiones privados.",
    },
    sources: {
      pp: { label: "Programa PP 29N, según Artículo14 (11/11/2026)", url: "https://www.articulo14.es/politica/de-la-prioridad-nacional-a-las-pulseras-antimaltrato-las-claves-del-programa-electoral-de-feijoo-20261111.html" },
    },
  },

  // ───────── Seguridad y defensa
  {
    id: "seg-1",
    topic: "seguridad",
    prompt: "Gasto y modelo de defensa",
    options: {
      vox: "Más presupuesto de defensa y mejores sueldos y vivienda para los militares.",
      pp: "Una ley de programación de la Defensa con plan plurianual de inversión, priorizando drones, antidrones, defensa antiaérea, munición y ciberdefensa.",
      psoe: "Rechazar elevar el gasto militar al 5 % del PIB y apostar por una defensa común europea.",
      fa: "Reducir el gasto militar, rechazar el objetivo OTAN del 5 % del PIB y destinar ese dinero a seguridad humana, emergencias, sanidad y educación.",
    },
  },
  {
    id: "seg-2",
    topic: "seguridad",
    prompt: "Código penal y seguridad ciudadana",
    options: {
      vox: "Ampliar la prisión permanente revisable y bajar la edad de responsabilidad penal.",
      pp: "Extender la prisión permanente revisable a ciertos asesinatos y a la reincidencia sexual, endurecer la respuesta a la multirreincidencia y ampliar los juicios rápidos.",
      psoe: "Sustituir la Ley de Seguridad Ciudadana de 2015 y cámaras corporales para los agentes con garantías de protección de datos.",
      fa: "Derogar la «Ley Mordaza» y multas proporcionales a la renta.",
    },
  },
  {
    id: "seg-3",
    topic: "seguridad",
    prompt: "Cuerpos de seguridad, fronteras y armas",
    options: {
      vox: "Participación militar en la protección de fronteras y Policía y Guardia Civil como profesión de riesgo.",
      pp: "Policía y Guardia Civil como profesión de riesgo y más agentes en barrios conflictivos.",
      psoe: "Reforzar Policía y Guardia Civil y la respuesta a las ciberestafas, y modernizar tecnológicamente las Fuerzas Armadas con más capacidades para la UME.",
      fa: "Desmilitarizar la Guardia Civil y reconocer a Guardia Civil y Policía Nacional como profesión de riesgo, con coeficientes reductores para la jubilación anticipada.",
    },
    sources: {
      fa: { label: "Programa Frente Amplio 29N, págs. 144-145 del PDF", url: "https://www.democrata.es/uploads/s1/35/42/91/4/programafrenteamplio.pdf" },
    },
  },

  // ───────── I+D, ciencia y tecnología
  {
    id: "idi-1",
    topic: "idi",
    prompt: "Inversión e investigación",
    options: {
      vox: "Más gasto en I+D+i, incentivos fiscales a la innovación y un plan de retorno de investigadores emigrados.",
      pp: "Un tipo fiscal del 20 % durante 6 años para los profesionales que se incorporen a grandes proyectos tecnológicos.",
      psoe: "Inversión pública en I+D del 1,25 % del PIB (1,5 % en 2035) y un Estatuto del Personal Investigador.",
      fa: "Un fondo público de inversión tecnológica e inversión a través de la banca pública.",
    },
  },
  {
    id: "idi-2",
    topic: "idi",
    prompt: "Menores y entorno digital",
    options: {
      vox: "Proteger a los menores de los riesgos de los entornos digitales (adicción al juego, pornografía) y acabar con los móviles en clase, con un plan nacional contra el acoso escolar y el ciberacoso.",
      pp: "Prohibir las redes sociales a los menores de 14 años.",
      psoe: "Una ley de protección de menores en entornos digitales con 16 años como edad mínima para las redes sociales.",
      fa: "Regulación severa de las plataformas y redes sociales dirigidas a menores de 16 años, con verificación de edad respetuosa con la privacidad y eliminación de funciones adictivas (scroll infinito, reproducción automática, recomendaciones algorítmicas).",
    },
    sources: {
      fa: { label: "Programa Frente Amplio 29N, pág. 41 del PDF", url: "https://www.democrata.es/uploads/s1/35/42/91/4/programafrenteamplio.pdf" },
      vox: { label: "Programa Vox 29N, págs. 35 y 45", url: "https://www.elindependiente.com/wp-content/uploads/2026/11/programa-elecct-vox.pdf" },
    },
  },
  {
    id: "idi-3",
    topic: "idi",
    prompt: "Inteligencia artificial e innovación",
    options: {
      vox: "Impulsar la IA en la economía y la administración, manteniendo la atención presencial.",
      pp: "Libertad de amortización para las inversiones de las empresas en maquinaria, digitalización o inteligencia artificial.",
      psoe: "Supervisión humana de las decisiones de IA sobre derechos, auditorías y etiquetado de contenidos generados, y que los creadores autoricen y cobren por el uso de sus obras para entrenar IA.",
      fa: "Un plan de adopción de la IA para pymes.",
    },
    sources: {
      pp: { label: "Programa PP 29N, según Merca2 (19/11/2026)", url: "https://www.merca2.es/2026/11/19/propuestas-economicas-pp-2510463/" },
    },
  },

  // ───────── Ecologismo
  {
    id: "ecol-1",
    topic: "ecologismo",
    prompt: "Clima y energía",
    options: {
      vox: "Rechazar el Pacto Verde Europeo y la Agenda 2030 y oponerse a la prohibición de los motores de combustión y a los impuestos sobre el CO₂.",
      pp: "Reformular el plan de renovables para que todas las tecnologías compitan en igualdad en subastas, ayudas y regulación.",
      psoe: "81 % de generación eléctrica renovable en 2030 y una hoja de ruta de salida de los combustibles fósiles.",
      fa: "Un Fondo Generacional de Energía con un 30 % de participación pública en nuevas renovables y almacenamiento, y gravar el diésel igual que la gasolina.",
    },
    sources: {
      pp: { label: "Programa PP 29N, según Tarifaluzhora (18/11/2026)", url: "https://tarifaluzhora.es/noticias/elecciones-2026-29n-partidos-propuestas-luz" },
    },
  },
  {
    id: "ecol-2",
    topic: "ecologismo",
    prompt: "Agua",
    options: {
      vox: "Un Plan Nacional del Agua con interconexión de cuencas.",
      pp: "Mantenimiento, limpieza y ensanche de cauces y barrancos.",
      psoe: "Bancos públicos de agua y un mínimo vital de agua para los hogares vulnerables.",
      fa: "Mínimo vital de agua gratuito para los hogares vulnerables y prohibición de los cortes de suministro.",
    },
  },
  {
    id: "ecol-3",
    topic: "ecologismo",
    prompt: "Territorio, emergencias y transición",
    options: {
      vox: "Eliminar las zonas de bajas emisiones, facilitar la explotación de recursos minerales y energéticos y limitar las grandes plantas renovables en suelo agrícola.",
      pp: "Intervención del Estado desde el inicio en las catástrofes.",
      psoe: "Una Agencia Estatal de Protección Civil, un Fondo Nacional de Resiliencia Climática y restauración de ecosistemas.",
      fa: "Placas solares obligatorias en las comunidades de vecinos donde sea viable.",
    },
  },

  // ───────── Actividades del sector primario
  {
    id: "pri-1",
    topic: "primario",
    prompt: "Agricultura, precios y comercio",
    options: {
      vox: "Rechazar el acuerdo UE-Mercosur, exigir cláusulas espejo a las importaciones y revisar las obligaciones medioambientales de agricultores y ganaderos.",
      pp: "IVA del 0 % en los alimentos básicos (carne, pescado, conservas) mientras dure la crisis de precios.",
      psoe: "Una PAC orientada a las explotaciones profesionales, familiares y pequeñas y medianas, y una Ley de Agricultura Familiar y Profesional.",
      fa: "Transición agroecológica, apoyo a la ganadería extensiva y descarbonizar la agricultura, la ganadería y la pesca.",
    },
  },
  {
    id: "pri-2",
    topic: "primario",
    prompt: "Agua, relevo generacional y pesca",
    options: {
      vox: "Apoyo al relevo generacional y a las cooperativas, revisar la política pesquera y las cuotas de la UE y modernizar la flota.",
      pp: "Un Pacto Nacional del Agua con hasta 40.000 M€ hasta 2030, también para los regadíos.",
      psoe: "Modernizar los regadíos sin aumentar el consumo total de agua y bancos de tierras para el relevo generacional.",
      fa: "Bancos públicos de tierras para nuevos agricultores y limitar la pesca con Marruecos a sus aguas, excluyendo el Sáhara.",
    },
  },
]
