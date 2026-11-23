import type { PartyId } from "./parties"
import type { TopicId } from "./topics"

/**
 * Cada pregunta presenta una medida concreta de CADA partido sobre el mismo tema,
 * tomada del listado de medidas de su programa (medidas_partidos_29N.csv).
 * En el test se muestran anónimas y en orden aleatorio; el usuario marca las que apoyaría.
 *
 * Los textos de `options` son una redacción en lenguaje llano de la medida del listado
 * (sin siglas ni tecnicismos). Las palabras clave van entre `**…**` y se muestran en negrita;
 * se marcan en las cuatro medidas por igual para no delatar al partido. `implications` resume, de forma neutral, qué cambiaría y los
 * argumentos habituales a favor y en contra; nunca menciona al partido.
 */
export interface Question {
  id: string
  topic: TopicId
  /** Subtema corto (se usa como título en los resultados). */
  prompt: string
  /** Pregunta en lenguaje llano que se muestra en el test. */
  question: string
  /** Contexto o glosario breve para entender las medidas. */
  context?: string
  /** Medida de cada partido. */
  options: Record<PartyId, string>
  /** Implicaciones de cada medida, en tono neutral. */
  implications: Record<PartyId, Implication>
  /**
   * Fuente de las medidas que NO proceden del listado del CSV original
   * (añadidas tras buscar en programas actuales, anteriores o en la acción de gobierno autonómica).
   */
  sources?: Partial<Record<PartyId, Source>>
}

export interface Implication {
  /** Qué cambiaría en la práctica. */
  effect: string
  /** Argumento habitual a favor. */
  pros: string
  /** Argumento habitual en contra. */
  cons: string
}

export interface Source {
  /** Descripción breve de la fuente (p. ej. «Programa electoral generales 2023»). */
  label: string
  url: string
}

const imp = (effect: string, pros: string, cons: string): Implication => ({ effect, pros, cons })

const FA_PDF = "https://www.democrata.es/uploads/s1/35/42/91/4/programafrenteamplio.pdf"
const VOX_PDF = "https://www.elindependiente.com/wp-content/uploads/2026/11/programa-elecct-vox.pdf"
const ARTICULO14 =
  "https://www.articulo14.es/politica/de-la-prioridad-nacional-a-las-pulseras-antimaltrato-las-claves-del-programa-electoral-de-feijoo-20261111.html"

export const QUESTIONS: Question[] = [
  // ───────── Vivienda
  {
    id: "viv-1",
    topic: "vivienda",
    prompt: "Alquiler y Ley de Vivienda",
    question: "¿Qué debería hacer el Estado con el precio del alquiler?",
    context:
      "La Ley de Vivienda de 2023 permite a las comunidades autónomas declarar «zonas tensionadas», donde se pueden limitar las subidas del alquiler.",
    options: {
      vox: "**Derogar la Ley de Vivienda** y reformar la Ley del Suelo para que haya **más terreno donde construir**.",
      pp: "**Derogar la Ley de Vivienda y los topes al alquiler**, y que los ayuntamientos resuelvan las **licencias de obra en 3 meses**: si no contestan, se dan por concedidas.",
      psoe: "**Contratos de alquiler más largos**, **congelar el alquiler** en las zonas tensionadas y un **seguro público contra impagos** para inquilinos jóvenes.",
      fa: "**Contratos de alquiler indefinidos** y, en zonas tensionadas, un **alquiler máximo del 25 % de la renta media** neta de la zona.",
    },
    implications: {
      vox: imp(
        "Desaparecerían los límites al alquiler en zonas tensionadas y se buscaría abaratar la vivienda construyendo más.",
        "Más oferta a medio plazo; los propietarios recuperan libertad para fijar precios y pueden animarse a sacar más pisos al mercado.",
        "Construir lleva años y, mientras tanto, los inquilinos de zonas caras pierden la protección frente a las subidas."
      ),
      pp: imp(
        "Fin de los límites de precio, y las obras irían más rápido porque el silencio del ayuntamiento contaría como aprobación.",
        "Menos trabas para construir y más seguridad para los propietarios que alquilan.",
        "Sin topes, el alquiler puede subir en zonas muy demandadas; aprobar por silencio reduce el control municipal sobre las obras."
      ),
      psoe: imp(
        "Los inquilinos tendrían más estabilidad y su renta no subiría en zonas caras; los impagos de inquilinos jóvenes quedarían cubiertos.",
        "Protege a quien ya alquila y hace que los propietarios acepten más fácilmente a inquilinos jóvenes.",
        "Algunos propietarios podrían retirar pisos del alquiler habitual o pasarlos a alquiler de temporada o turístico, reduciendo la oferta."
      ),
      fa: imp(
        "El inquilino podría quedarse sin fecha de fin y el precio quedaría ligado a lo que gana la gente de la zona.",
        "Máxima estabilidad y alquileres asumibles con los sueldos locales.",
        "Es la intervención más intensa: puede desanimar a alquilar y a invertir, y favorecer el alquiler en negro si no se vigila."
      ),
    },
  },
  {
    id: "viv-2",
    topic: "vivienda",
    prompt: "Compra de la primera vivienda",
    question: "¿Cómo ayudarías a comprar la primera vivienda?",
    context:
      "Al comprar vivienda nueva se paga IVA (10 %); en la de segunda mano, el Impuesto de Transmisiones Patrimoniales (ITP), que fija cada comunidad (entre el 6 % y el 10 %).",
    options: {
      vox: "**Quitar el IVA a la primera vivienda nueva**, **eliminar el ITP** en la de segunda mano y recuperar la **desgravación en el IRPF** por comprar vivienda habitual.",
      pp: "Para menores de 40 años: **IVA de la primera vivienda nueva al 4 %** (ahora 10 %), una **cuenta de ahorro para vivienda** de hasta 2.000 €/año que desgrava un 20 % y **avales públicos** de hasta 40.000 € para la entrada.",
      psoe: "**Préstamos públicos sin intereses** de **hasta 50.000 €** para comprar la primera vivienda, con un fondo de 10.000 M€.",
      fa: "Una **hipoteca pública a tipo fijo**, de **oferta obligatoria**.",
    },
    implications: {
      vox: imp(
        "Comprar la primera casa costaría entre un 6 % y un 10 % menos en impuestos, y después se desgravaría parte de la hipoteca.",
        "Ahorro directo e inmediato para quien compra.",
        "Gran pérdida de recaudación (el ITP financia a las comunidades) y parte de la rebaja puede acabar trasladándose al precio."
      ),
      pp: imp(
        "Un joven pagaría menos impuestos al comprar obra nueva, podría ahorrar con ventaja fiscal y el Estado le avalaría la parte que el banco no financia.",
        "Ataca el principal obstáculo de los jóvenes: reunir el dinero de la entrada.",
        "Ayuda sobre todo a quien ya puede hipotecarse; más demanda sin más oferta puede encarecer los precios."
      ),
      psoe: imp(
        "El Estado prestaría sin intereses parte del dinero de la compra, que luego habría que devolver.",
        "Reduce los ahorros previos necesarios y el coste de financiarse.",
        "Las arcas públicas asumen el riesgo de impago y, como otras ayudas a la demanda, puede empujar los precios al alza."
      ),
      fa: imp(
        "Habría siempre disponible una hipoteca con cuota estable, que no sube aunque suban los tipos de interés.",
        "Protege a las familias de las subidas del euríbor y de condiciones abusivas.",
        "Interviene en el negocio bancario, y si los tipos suben el coste lo asume el sector público o la banca."
      ),
    },
  },
  {
    id: "viv-3",
    topic: "vivienda",
    prompt: "Oferta de vivienda, vivienda pública y grandes tenedores",
    question: "¿Cómo aumentarías la vivienda disponible o accesible?",
    context:
      "Se llama «grandes tenedores» a quienes poseen muchas viviendas (en general, más de 10), como fondos de inversión o bancos.",
    options: {
      vox: "Dar **prioridad a los españoles en la vivienda pública** y **subir los impuestos a los compradores de fuera de la UE** y a los fondos de inversión.",
      pp: "Construir **1 millón de viviendas** en la legislatura, con una **nueva Ley del Suelo** que agilice la urbanización.",
      psoe: "Movilizar el **1 % del PIB cada año** para el acceso a la vivienda y crear un **parque estatal de 100.000 viviendas asequibles**.",
      fa: "Invertir el 1 % del PIB al año (unos 17.000 M€) para sumar **1,5 millones de viviendas públicas** en 12 años, y **expropiar progresivamente viviendas** a los grandes tenedores.",
    },
    implications: {
      vox: imp(
        "Los extranjeros quedarían detrás en las listas de vivienda pública, y comprar sería más caro para inversores de fuera de la UE y fondos.",
        "Reduce la competencia de compradores con mucho capital y favorece a los residentes nacionales.",
        "No construye más viviendas; dar prioridad por nacionalidad puede chocar con la igualdad de trato y el derecho europeo."
      ),
      pp: imp(
        "Se facilitaría convertir suelo en edificable para construir mucho más rápido, sobre todo con promoción privada.",
        "Ataca la escasez de oferta, causa de fondo de los precios altos.",
        "Objetivo muy ambicioso (unas 250.000 al año); más urbanización tiene impacto territorial y no garantiza precios asequibles."
      ),
      psoe: imp(
        "Se destinarían unos 16.000 M€ al año (públicos y privados) y el Estado gestionaría directamente viviendas de alquiler a precio limitado.",
        "Crea vivienda asequible estable, que no depende de los vaivenes del mercado.",
        "Coste público elevado, la vivienda pública tarda años en llegar y 100.000 viviendas son pocas frente a la demanda."
      ),
      fa: imp(
        "Se ampliaría mucho el parque público, en parte construyendo y en parte pasando a manos públicas pisos de grandes propietarios.",
        "Acercaría el alquiler social a los niveles de los países europeos que más tienen.",
        "Expropiar exige indemnizar y genera inseguridad jurídica, lo que puede frenar la inversión privada en vivienda."
      ),
    },
  },

  // ───────── Inmigración
  {
    id: "inm-1",
    topic: "inmigracion",
    prompt: "Inmigración irregular y regularización",
    question: "¿Qué hacer con las personas que viven en España sin papeles?",
    context:
      "El «arraigo» permite obtener la residencia legal tras vivir en España un tiempo (en general, 2 años) demostrando vínculos laborales, familiares o sociales.",
    options: {
      vox: "**Prohibir las regularizaciones masivas**, **eliminar el arraigo** como vía para obtener papeles y **repatriar** a los inmigrantes en situación irregular.",
      pp: "**Identificar en 7 días** como máximo a quien entre de forma irregular, **acelerar las devoluciones** y crear **centros para inmigrantes irregulares en terceros países**.",
      psoe: "**Ampliar las vías legales** para pedir protección internacional y **reforzar el sistema de acogida y asilo**.",
      fa: "Un **procedimiento permanente de regularización** y terminar de tramitar los **expedientes pendientes** de la regularización extraordinaria.",
    },
    implications: {
      vox: imp(
        "Quien esté sin papeles no tendría forma de regularizarse y el objetivo sería devolverlo a su país.",
        "Desincentiva la inmigración irregular y refuerza que solo se entre por vías legales.",
        "Las repatriaciones dependen de acuerdos con otros países: muchas personas seguirían aquí, sin derechos ni posibilidad de cotizar."
      ),
      pp: imp(
        "Las expulsiones se tramitarían más rápido y parte de los migrantes esperarían fuera de la UE.",
        "Más control y rapidez; reduce el llamado efecto llamada.",
        "Los centros en terceros países plantean dudas legales y de derechos humanos, y su coste y eficacia son discutidos."
      ),
      psoe: imp(
        "Más personas podrían pedir protección por cauces legales y habría más plazas y recursos de acogida.",
        "Ordena las llegadas y protege a quien huye de guerras o persecución.",
        "No resuelve la situación de quien ya está sin papeles y supone más gasto público."
      ),
      fa: imp(
        "Quien viva y trabaje aquí sin papeles tendría siempre una vía abierta para regularizarse.",
        "Saca a personas de la economía sumergida: cotizan, pagan impuestos y tienen derechos.",
        "Sus críticos sostienen que provoca efecto llamada y debilita el control de fronteras."
      ),
    },
  },
  {
    id: "inm-2",
    topic: "inmigracion",
    prompt: "Nacionalidad e integración",
    question: "¿Qué cambiarías en el acceso a la nacionalidad y la integración?",
    context:
      "Hoy se piden en general 10 años de residencia legal para la nacionalidad, y 2 años a quienes vienen de Iberoamérica, Filipinas, Guinea Ecuatorial, Portugal o Andorra.",
    options: {
      vox: "**Endurecer el acceso a la nacionalidad** española y **expulsar a los extranjeros que cometan delitos** graves o reiterados.",
      pp: "Una **ley de nacionalidad más exigente**, con **preferencia para personas de países hispanos**, y exigir **compromisos de integración** (aprender español, conocer la Constitución) para renovar la residencia.",
      psoe: "Un **Plan de Integración y Ciudadanía** 2026-2030 con 500 M€ iniciales y agilizar la **homologación de títulos extranjeros**.",
      fa: "**Devolver la nacionalidad española a los saharauis** nacidos bajo administración española antes de 1977 y a sus descendientes, y una **ley integral contra el racismo**.",
    },
    implications: {
      vox: imp(
        "Sería más difícil hacerse español y una condena podría suponer la expulsión del país.",
        "Vincula la permanencia en España al respeto de la ley.",
        "Expulsar exige que el país de origen acepte a la persona y puede separar familias asentadas aquí."
      ),
      pp: imp(
        "Renovar los papeles dependería de demostrar integración, y se favorecería la inmigración hispanohablante.",
        "Facilita la integración gracias al idioma y la cultura comunes.",
        "Trata distinto a las personas según su origen y añade trámites que pueden dejar a gente en situación irregular."
      ),
      psoe: imp(
        "Más recursos para integración (idioma, empleo, servicios) y que médicos, ingenieros, etc. formados fuera puedan ejercer antes.",
        "Aprovecha la formación de quienes ya están aquí y cubre empleos donde faltan profesionales.",
        "Coste público; homologar más rápido exige asegurar que la formación es realmente equivalente."
      ),
      fa: imp(
        "Miles de saharauis podrían ser españoles y habría nuevas herramientas legales contra la discriminación racial.",
        "Repara una situación histórica de la antigua colonia española y refuerza la igualdad de trato.",
        "Puede tensar las relaciones con Marruecos, y la ley antirracismo se solaparía en parte con normas ya vigentes."
      ),
    },
    sources: {
      fa: { label: "Programa Frente Amplio 29N, pág. 128 del PDF", url: FA_PDF },
    },
  },
  {
    id: "inm-3",
    topic: "inmigracion",
    prompt: "Flujos migratorios, ayudas y acogida",
    question: "¿Qué política de llegadas y de ayudas a inmigrantes prefieres?",
    context:
      "El Ingreso Mínimo Vital (IMV) es una ayuda estatal para hogares sin ingresos suficientes; hoy también pueden cobrarlo extranjeros con residencia legal.",
    options: {
      vox: "Que el Ingreso Mínimo Vital y otras ayudas sean **solo para españoles** («prioridad nacional») y un **plan de «remigración»** para los inmigrantes que no contribuyan.",
      pp: "**Cupos anuales de inmigrantes para trabajar** por sectores, condicionados a que sus países de origen **colaboren en las devoluciones**.",
      psoe: "Priorizar la **protección de los menores que llegan solos** y **apoyar a los territorios desbordados** por la acogida.",
      fa: "Ampliar las **vías legales y seguras para migrar y pedir asilo**.",
    },
    implications: {
      vox: imp(
        "Los extranjeros, aunque residan legalmente, perderían el acceso a ayudas sociales, y se promovería su salida si no trabajan.",
        "Sus defensores dicen que reduce el gasto y prioriza a los nacionales.",
        "Choca con la igualdad de trato que reconocen la Constitución y el derecho europeo, y puede empujar a la pobreza a familias residentes."
      ),
      pp: imp(
        "Se fijaría cada año cuántos trabajadores extranjeros entran y para qué empleos, premiando a los países que readmitan a sus irregulares.",
        "Ajusta la inmigración a las necesidades reales de mano de obra.",
        "Los cupos suelen ser rígidos y lentos para lo que piden las empresas, y depender de otros países los hace inciertos."
      ),
      psoe: imp(
        "El Estado asumiría más responsabilidad sobre los menores no acompañados y la acogida se repartiría entre comunidades.",
        "Alivia a territorios fronterizos como Canarias, Ceuta o Melilla y cumple la obligación legal de proteger a menores.",
        "El reparto entre comunidades genera conflictos políticos y necesita financiación."
      ),
      fa: imp(
        "Habría más formas de llegar a España con papeles desde el país de origen (visados de trabajo o de búsqueda de empleo, asilo).",
        "Reduce las travesías peligrosas y el negocio de las mafias.",
        "Sus críticos creen que aumentaría el número total de llegadas."
      ),
    },
  },

  // ───────── Economía y empleo
  {
    id: "eco-1",
    topic: "economia",
    prompt: "Mercado laboral",
    question: "¿Qué cambio en el trabajo te parece más importante?",
    context: "La jornada laboral máxima legal en España es hoy de 40 horas semanales.",
    options: {
      vox: "**Derogar la legislación laboral vigente** y **recortar las subvenciones públicas** a partidos, sindicatos y patronales.",
      pp: "Que la empresa **no pague cotizaciones por su primer empleado** (y la mitad por el segundo), y que **pague menos por desempleo** si su plantilla es más estable que la media de su sector.",
      psoe: "Bajar la jornada a **37,5 horas sin reducir el sueldo** y avanzar hacia las **35 horas** mediante los convenios.",
      fa: "**Semana laboral de 32 horas** **sin bajada de sueldo**.",
    },
    implications: {
      vox: imp(
        "Se eliminarían las normas laborales actuales para sustituirlas por otras (el programa no detalla cuáles), y sindicatos y patronal recibirían menos dinero público.",
        "Abre la puerta a un mercado laboral más flexible y ahorra dinero público.",
        "Crea incertidumbre sobre derechos actuales (contratos, despido, convenios) y debilita a los representantes de trabajadores y empresas."
      ),
      pp: imp(
        "Contratar al primer trabajador saldría mucho más barato y se premiaría a las empresas que no despiden.",
        "Anima a autónomos y microempresas a contratar y premia el empleo estable.",
        "Menos ingresos para la Seguridad Social y riesgo de pagar descuentos por contratos que se habrían hecho igualmente."
      ),
      psoe: imp(
        "Se trabajarían unas 2,5 horas menos a la semana por el mismo salario.",
        "Más tiempo libre y mejor conciliación; puede repartir el empleo.",
        "Sube el coste por hora para las empresas, sobre todo pymes y sectores con poco margen."
      ),
      fa: imp(
        "Se trabajaría un 20 % menos de horas (cuatro días a la semana) cobrando lo mismo.",
        "Gran mejora del tiempo libre; algunas pruebas piloto muestran que la productividad se mantiene en ciertos sectores.",
        "Coste muy alto para muchas empresas, sobre todo en servicios donde hace falta cubrir horas de presencia."
      ),
    },
  },
  {
    id: "eco-2",
    topic: "economia",
    prompt: "Burocracia, empresas y derechos laborales",
    question: "¿Qué reforma prefieres para empresas y trabajadores?",
    context:
      "«Silencio administrativo positivo» significa que, si la Administración no responde a tiempo, la solicitud se considera aprobada.",
    options: {
      vox: "**Eliminar tres normas por cada ley nueva**, que el **silencio administrativo sea positivo** como regla general y **acabar con la cita previa obligatoria**.",
      pp: "**Reducir el papeleo de las empresas un 25 %** hasta 2029 (35 % para pymes) y **eliminar tres normas por cada nueva**.",
      psoe: "**Registro digital de la jornada**, un **Estatuto del Becario** y que la **indemnización por despido injustificado** se ajuste al daño real causado, no a una cifra fija.",
      fa: "Que los trabajadores tengan **representantes en el consejo de administración**: un tercio en empresas de 50 a 1.000 empleados y la mitad en las mayores.",
    },
    implications: {
      vox: imp(
        "Habría menos normas, los trámites sin respuesta se darían por aprobados y se podría ir a la Administración sin cita.",
        "Menos burocracia y más agilidad para ciudadanos y empresas.",
        "El silencio positivo puede dar por buenas solicitudes que no cumplen los requisitos; quitar normas en bloque puede eliminar protecciones útiles."
      ),
      pp: imp(
        "Menos papeleo y obligaciones de información para las empresas, con un objetivo medible.",
        "Ahorra tiempo y costes, especialmente a las pequeñas empresas.",
        "Depende de cómo se mida; algunas obligaciones existen para proteger a consumidores, trabajadores o el medio ambiente."
      ),
      psoe: imp(
        "Sería más fácil controlar las horas extra, los becarios tendrían derechos claros y los despidos injustificados podrían salir más caros.",
        "Refuerza los derechos laborales y frena las horas no pagadas y las becas que encubren empleos.",
        "Más costes y pleitos para las empresas, y menos certeza sobre cuánto cuesta un despido."
      ),
      fa: imp(
        "La plantilla participaría directamente en las grandes decisiones de la empresa, como ocurre en el modelo alemán.",
        "Más democracia en la empresa y decisiones con visión a largo plazo.",
        "Puede ralentizar decisiones y retraer la inversión; es un cambio profundo en el gobierno de las empresas."
      ),
    },
  },
  {
    id: "eco-3",
    topic: "economia",
    prompt: "Industria, autónomos y salarios",
    question: "¿Qué medida apoyarías para la industria, los autónomos y los salarios?",
    context:
      "El salario mínimo (SMI) lo fija cada año el Gobierno. La SEPI es la sociedad estatal que gestiona las participaciones del Estado en empresas.",
    options: {
      vox: "Un **Plan Nacional de Reindustrialización** y una ley para que una empresa autorizada en una comunidad pueda **operar en toda España sin pedir nuevas licencias**.",
      pp: "**Cuota de autónomos cero el primer año** y que los autónomos que facturen menos de 85.000 € al año **no tengan que cobrar ni declarar IVA**.",
      psoe: "Fijar por ley que el **salario mínimo esté siempre por encima del 60 % del salario medio**, y una **Ley de Industria y Autonomía Estratégica**.",
      fa: "Garantizar un **salario mínimo del 60 % del salario medio neto** y convertir la SEPI en **agencia industrial y banco público de inversión**.",
    },
    implications: {
      vox: imp(
        "Se impulsaría la industria y se eliminarían trabas para operar en varias comunidades autónomas.",
        "Un mercado único más sencillo facilita que las empresas crezcan.",
        "Limita la capacidad de las comunidades para fijar sus propios requisitos (ambientales, sanitarios…)."
      ),
      pp: imp(
        "Empezar como autónomo no costaría cotizaciones el primer año y los pequeños quedarían fuera del IVA, como permite la normativa europea.",
        "Facilita emprender y reduce el papeleo de los pequeños negocios.",
        "Menos ingresos públicos y riesgo de que algunos dividan su actividad para no pasar el umbral."
      ),
      psoe: imp(
        "El salario mínimo no podría bajar de ese nivel aunque cambie el Gobierno, y se apoyaría a sectores industriales clave.",
        "Protege el poder adquisitivo de los sueldos más bajos.",
        "Subidas fuertes del SMI pueden dificultar el empleo poco cualificado y afectar a pymes y zonas con sueldos bajos."
      ),
      fa: imp(
        "Un suelo similar para el salario mínimo y un Estado que invierte directamente en empresas y proyectos industriales.",
        "Permite una política industrial activa y financiación pública a largo plazo.",
        "Más riesgo para el dinero público y posibles decisiones de inversión con criterios políticos."
      ),
    },
  },

  // ───────── Sanidad
  {
    id: "san-1",
    topic: "sanidad",
    prompt: "Financiación, atención primaria y listas de espera",
    question: "¿Cuál es tu prioridad para mejorar la sanidad pública?",
    context:
      "La «colaboración público-privada» consiste en que la sanidad pública pague a centros privados para hacer pruebas u operaciones.",
    options: {
      vox: "Un **plan nacional contra las listas de espera** apoyándose en la **sanidad privada** (colaboración público-privada).",
      pp: "Al menos **4.500 médicos más** en los centros de salud y un plan urgente para **reducir las listas de espera**.",
      psoe: "Que el gasto en sanidad pública ronde el **7 % del PIB**, priorizando la **gestión pública directa**.",
      fa: "Un mínimo legal del **8 % del PIB para la sanidad pública** y reforzar obligatoriamente la **atención primaria**.",
    },
    implications: {
      vox: imp(
        "Parte de las pruebas y operaciones pendientes se harían en centros privados pagados con dinero público.",
        "Reduce esperas a corto plazo aprovechando capacidad que ya existe.",
        "Desvía fondos a la privada en lugar de reforzar la pública y no soluciona la falta de profesionales."
      ),
      pp: imp(
        "Más médicos de familia y pediatras en los centros de salud.",
        "Ataca directamente la saturación de la atención primaria.",
        "Faltan médicos formados: contratar 4.500 exige atraerlos con mejores condiciones, y las plantillas dependen de las comunidades."
      ),
      psoe: imp(
        "Más dinero para la sanidad pública y menos conciertos con centros privados.",
        "Refuerza el sistema público de forma estable.",
        "Exige más gasto público, y la gestión directa no garantiza por sí sola más eficiencia."
      ),
      fa: imp(
        "Se blindaría por ley un gasto sanitario mucho mayor, acercándose al de países como Francia o Alemania.",
        "Financiación garantizada aunque cambie el Gobierno.",
        "Supone muchos miles de millones adicionales al año, y un suelo fijo resta margen para otras prioridades."
      ),
    },
  },
  {
    id: "san-2",
    topic: "sanidad",
    prompt: "Nuevas prestaciones",
    question: "¿Qué debería cubrir la sanidad pública que hoy no cubre bien?",
    context:
      "Hoy la sanidad pública apenas cubre el dentista (sobre todo extracciones y algunos tratamientos infantiles) y la atención psicológica tiene largas esperas.",
    options: {
      vox: "Reforzar los **cuidados paliativos** y proteger la **objeción de conciencia** de los sanitarios.",
      pp: "Una **ley nacional de cuidados paliativos** y un **Plan Nacional de Salud Mental** 2027-2037 centrado en niños y adolescentes.",
      psoe: "Incluir el **dentista básico en la sanidad pública** (mientras tanto, una ayuda de hasta 200 € al año) y ver a un **psicólogo público en 30 días** como máximo.",
      fa: "**Cobertura dental pública** para la mitad de la población.",
    },
    implications: {
      vox: imp(
        "Más atención a los enfermos terminales y más garantías para los profesionales que no quieran practicar abortos o eutanasias.",
        "Mejora la atención al final de la vida y respeta las convicciones de los sanitarios.",
        "Una objeción muy amplia puede dificultar el acceso a prestaciones legales en algunas zonas."
      ),
      pp: imp(
        "Cuidados paliativos garantizados en todo el país y más recursos de salud mental para niños y jóvenes.",
        "Responde a dos carencias reconocidas, con un horizonte de largo plazo.",
        "Sin cifras de inversión concretas, su alcance depende de la financiación real."
      ),
      psoe: imp(
        "Revisiones y tratamientos dentales básicos gratuitos y atención psicológica rápida.",
        "Cubre gastos que hoy las familias pagan de su bolsillo.",
        "Requiere dentistas y psicólogos que el sistema hoy no tiene; coste elevado."
      ),
      fa: imp(
        "El dentista sería gratuito para un amplio grupo de la población.",
        "Gran cobertura de una necesidad básica muy cara.",
        "Coste alto, y el criterio para decidir quién entra puede generar desigualdades."
      ),
    },
  },
  {
    id: "san-3",
    topic: "sanidad",
    prompt: "Acceso y organización del sistema",
    question: "¿Qué cambio en el acceso a la sanidad prefieres?",
    context:
      "Desde 2018, las personas extranjeras sin residencia legal tienen derecho a la sanidad pública. Cada comunidad tiene su propia tarjeta sanitaria y su sistema informático.",
    options: {
      vox: "**Excluir de la sanidad pública ordinaria** a los **extranjeros sin residencia legal**, salvo urgencias graves.",
      pp: "Una **tarjeta sanitaria** y una **historia clínica** que funcionen **igual en toda España**.",
      psoe: "**Reforzar la atención primaria** y ampliar el programa público de **gafas gratuitas para menores**.",
      fa: "**Gafas y lentillas gratuitas** y que la sanidad pública pague los **audífonos**.",
    },
    implications: {
      vox: imp(
        "Las personas sin papeles perderían el médico de cabecera y solo se las atendería en urgencias graves.",
        "Reduce el gasto y desincentiva el llamado turismo sanitario.",
        "Las enfermedades sin tratar acaban en urgencias, que son más caras, y suponen un riesgo para la salud pública."
      ),
      pp: imp(
        "Cualquier paciente podría ser atendido en otra comunidad con todo su historial disponible.",
        "Facilita la atención cuando te desplazas y evita repetir pruebas.",
        "Exige coordinar 17 sistemas informáticos distintos y proteger bien los datos médicos."
      ),
      psoe: imp(
        "Más recursos para los centros de salud y gafas sin coste para más niños y adolescentes.",
        "Detecta y corrige problemas de visión que afectan al rendimiento escolar.",
        "Alcance limitado, y el refuerzo de primaria no concreta cifras."
      ),
      fa: imp(
        "La sanidad pública pagaría gafas, lentillas y audífonos.",
        "Elimina un gasto importante, sobre todo para personas mayores y familias con pocos ingresos.",
        "Coste elevado si se da a todos, incluidos quienes pueden pagarlo."
      ),
    },
  },

  // ───────── Educación
  {
    id: "edu-1",
    topic: "educacion",
    prompt: "Ley educativa y resultados",
    question: "¿Qué cambiarías en el sistema educativo?",
    context:
      "La LOMLOE (2020) es la ley educativa vigente; entre otras cosas, permite pasar de curso con suspensos si lo decide el equipo docente. Las «reválidas» son exámenes externos al final de una etapa, necesarios para obtener el título.",
    options: {
      vox: "**Derogar la ley educativa vigente** (LOMLOE) y recuperar las **reválidas** al final de cada etapa.",
      pp: "**Sustituir la LOMLOE** y que en la ESO **solo se pase de curso aprobando las asignaturas**.",
      psoe: "Bajar el **abandono escolar temprano por debajo del 10 %** antes de 2030, **más plazas de FP** en áreas como IA, ciberseguridad o energía, y **un orientador por cada 250 alumnos**.",
      fa: "Garantizar al menos el **7 % del PIB para la educación pública** y **bajar el número de alumnos por aula**.",
    },
    implications: {
      vox: imp(
        "Para obtener el título de ESO o Bachillerato habría que aprobar un examen externo común.",
        "Más exigencia y un nivel comparable entre centros y comunidades.",
        "Puede aumentar el abandono y orientar la enseñanza a preparar el examen."
      ),
      pp: imp(
        "Se acabaría pasar de curso con suspensos por decisión del profesorado.",
        "Refuerza el esfuerzo y el valor de aprobar.",
        "Más repeticiones de curso, que según muchos estudios no mejoran los resultados y aumentan el abandono."
      ),
      psoe: imp(
        "Se mantiene la ley actual y se pone el foco en que menos jóvenes dejen de estudiar y en la Formación Profesional.",
        "Ataca un problema histórico de España y conecta la formación con el empleo.",
        "Son objetivos más que cambios de fondo, y no responde a quienes piden más exigencia académica."
      ),
      fa: imp(
        "Mucha más inversión (hoy, en torno al 5 % del PIB) y clases más pequeñas.",
        "Atención más personalizada y mejores condiciones para el profesorado.",
        "Requiere un gran aumento del gasto y miles de docentes y aulas nuevas."
      ),
    },
  },
  {
    id: "edu-2",
    topic: "educacion",
    prompt: "Educación de 0 a 3 años y comedor",
    question: "¿Cómo debería ser la escuela infantil (0-3 años) y el comedor escolar?",
    context:
      "La etapa de 0 a 3 años no es obligatoria; en muchas zonas las plazas públicas son de pago o no alcanzan para todos.",
    options: {
      vox: "**Escuela infantil de 0 a 3 años gratuita**.",
      pp: "**Escuela infantil de 0 a 3 años gratuita** **al final de la legislatura**.",
      psoe: "**Plaza pública de 0 a 3 años para todos** los niños y **comedor gratuito** para los alumnos en riesgo de pobreza.",
      fa: "**Plaza de 0 a 3 años para todos** y **comedor gratuito para todo el alumnado** de Infantil y Primaria de la escuela pública, con producto fresco y local.",
    },
    implications: {
      vox: imp(
        "Las familias dejarían de pagar la escuela infantil.",
        "Ayuda a la conciliación y a la natalidad.",
        "Si no se crean plazas suficientes, la gratuidad no garantiza el acceso; no concreta si incluye centros privados."
      ),
      pp: imp(
        "Lo mismo, pero con un plazo de unos cuatro años para implantarlo.",
        "Calendario gradual y más realista para crear plazas.",
        "Las familias con hijos pequeños hoy podrían no llegar a beneficiarse."
      ),
      psoe: imp(
        "Se crearían plazas públicas para toda la demanda y el comedor sería gratis para las familias vulnerables.",
        "Concentra la ayuda del comedor en quien más la necesita.",
        "Las ayudas por renta implican trámites y estigma, y dejan fuera a familias con ingresos justos."
      ),
      fa: imp(
        "Todos los niños de 3 a 12 años de la escuela pública comerían gratis en el colegio.",
        "Garantiza una comida sana a todos, sin estigma, y apoya a los productores locales.",
        "Coste alto, que incluye a familias que podrían pagarlo."
      ),
    },
  },
  {
    id: "edu-3",
    topic: "educacion",
    prompt: "Lenguas y universidad",
    question: "¿Qué prefieres sobre las lenguas en la escuela y el acceso a la universidad?",
    context:
      "La PAU (antes EvAU o selectividad) es el examen de acceso a la universidad; hoy cada comunidad hace el suyo. En Cataluña, la «inmersión» significa que el catalán es la lengua principal de enseñanza.",
    options: {
      vox: "Un **examen de acceso a la universidad único** en toda España, los **mismos contenidos en todas las comunidades** y garantizar la **enseñanza en español**.",
      pp: "Un **examen de acceso a la universidad común** en toda España, **nota mínima para estudiar Magisterio** y garantizar la **educación en español** en todas las etapas.",
      psoe: "**Matrícula gratuita en el primer curso** de grado en universidades públicas y **becas Erasmus de hasta 1.500 € al mes** según renta.",
      fa: "Un plan estatal para **aprender las lenguas cooficiales**, manteniendo la **inmersión en catalán** en Cataluña, y bajar los precios de la universidad **hasta hacerla gratuita**.",
    },
    implications: {
      vox: imp(
        "El Estado fijaría un examen y un temario comunes, y se podría estudiar en castellano en cualquier comunidad.",
        "Igualdad de condiciones entre estudiantes de distintas comunidades.",
        "Recorta competencias educativas de las comunidades y afecta a los modelos de enseñanza en lenguas cooficiales."
      ),
      pp: imp(
        "Examen común, más exigencia para los futuros maestros y derecho a estudiar en castellano.",
        "Igualdad en el acceso a la universidad y mejor nivel del profesorado.",
        "Choca con los modelos lingüísticos de comunidades como Cataluña, el País Vasco o Galicia."
      ),
      psoe: imp(
        "Empezar la universidad pública no costaría matrícula y estudiar en el extranjero sería posible para más familias.",
        "Facilita el acceso a la universidad a estudiantes con menos recursos.",
        "La matrícula gratuita también beneficia a familias con rentas altas."
      ),
      fa: imp(
        "Se fomentaría el aprendizaje de catalán, euskera y gallego, se mantendría el modelo catalán y la universidad pública acabaría siendo gratis.",
        "Protege la diversidad lingüística y elimina barreras económicas para estudiar.",
        "Quienes defienden el castellano como lengua principal de enseñanza lo rechazan; la universidad gratuita tiene un coste público elevado."
      ),
    },
    sources: {
      fa: { label: "Programa Frente Amplio 29N, págs. 32-33 del PDF", url: FA_PDF },
    },
  },

  // ───────── Geopolítica y relaciones internacionales
  {
    id: "geo-1",
    topic: "geopolitica",
    prompt: "Vecindad y Unión Europea",
    question: "¿Qué prioridad debería tener España con sus vecinos y con Europa?",
    context:
      "En 2022 España apoyó el plan de autonomía de Marruecos para el Sáhara Occidental, antigua colonia española cuyo estatus sigue pendiente en la ONU.",
    options: {
      vox: "**Sancionar a Marruecos**, **suspender acuerdos** con ese país y revisar a fondo la relación.",
      pp: "Una **relación más equilibrada con Marruecos y con Argelia**.",
      psoe: "Una **Unión Europea más integrada** en lo político y lo fiscal, con una **defensa común**.",
      fa: "**Retirar el apoyo al plan de autonomía marroquí** para el Sáhara y apoyar un **referéndum de autodeterminación**.",
    },
    implications: {
      vox: imp(
        "Se pasaría a una relación de presión frente a Marruecos por la inmigración, Ceuta y Melilla o la pesca.",
        "Defensa más firme de los intereses españoles frente a las presiones migratorias.",
        "Marruecos es un socio clave en control migratorio, comercio y lucha antiterrorista; una ruptura puede salir cara."
      ),
      pp: imp(
        "Se intentaría recomponer la relación con Argelia, deteriorada desde 2022, sin romper con Marruecos.",
        "Argelia es un proveedor clave de gas; diversifica alianzas.",
        "Llevarse bien con dos países rivales es difícil, y la propuesta es poco concreta."
      ),
      psoe: imp(
        "Más decisiones (impuestos, deuda, defensa) se tomarían a nivel europeo.",
        "Más peso de Europa en el mundo y herramientas comunes ante crisis.",
        "Supone ceder soberanía nacional a la UE."
      ),
      fa: imp(
        "España volvería a defender que los saharauis voten su futuro, como piden las resoluciones de la ONU.",
        "Coherente con la legalidad internacional y con la responsabilidad histórica de España.",
        "Probable crisis diplomática con Marruecos, con efectos en migración y comercio."
      ),
    },
  },
  {
    id: "geo-2",
    topic: "geopolitica",
    prompt: "Conflictos internacionales y soberanía",
    question: "¿Qué posición internacional apoyas?",
    options: {
      vox: "Presionar internacionalmente para **recuperar la soberanía de Gibraltar**.",
      pp: "Mantener el **apoyo a Ucrania** y respaldar expresamente a la líder opositora venezolana **María Corina Machado**.",
      psoe: "Apoyar la **soberanía de Ucrania** y la **solución de dos Estados** para Israel y Palestina.",
      fa: "**Embargo total de armas a Israel**, impedir el paso de material militar por España, **suspender el Acuerdo de Asociación UE-Israel** y **reconocer plenamente a Palestina**.",
    },
    implications: {
      vox: imp(
        "Gibraltar pasaría al centro de la política exterior, por delante de la vía del acuerdo entre la UE y el Reino Unido.",
        "Reivindicación histórica con amplio respaldo en España.",
        "Puede bloquear el acuerdo posterior al Brexit y perjudicar a los miles de trabajadores del Campo de Gibraltar."
      ),
      pp: imp(
        "Continuidad de la ayuda a Ucrania y respaldo explícito a la oposición venezolana.",
        "Alineado con la UE en Ucrania y con la defensa de la democracia en Venezuela.",
        "Tomar partido por una líder opositora complica el diálogo con quien gobierne en Venezuela, donde viven muchos españoles."
      ),
      psoe: imp(
        "Mantener el apoyo a Ucrania y defender que Israel y Palestina convivan como Estados independientes.",
        "Posición de consenso en la UE y la ONU.",
        "Sus críticos la ven insuficiente: unos piden más firmeza con Israel y otros más apoyo a Israel."
      ),
      fa: imp(
        "Ruptura de la cooperación militar y presión económica sobre Israel.",
        "Responde a las denuncias de crímenes de guerra en Gaza.",
        "Tensiones con Israel y con EE. UU. (bases de Rota y Morón); suspender el acuerdo europeo requiere el apoyo de otros países."
      ),
    },
  },
  {
    id: "geo-3",
    topic: "geopolitica",
    prompt: "Fronteras, cooperación y justicia internacional",
    question: "¿Qué papel debería tener España en fronteras, cooperación y justicia internacional?",
    context:
      "La «jurisdicción universal» permite a jueces españoles investigar crímenes como el genocidio cometidos fuera de España; se recortó en 2009 y 2014.",
    options: {
      vox: "**Reforzar con el Ejército las fronteras** de Ceuta y Melilla y **retirar la ayuda al desarrollo** a los países que no controlen la emigración.",
      pp: "Pedir a la UE que trate Ceuta y Melilla como su **frontera con Rusia** y **rechazar en la frontera a quienes entren a nado**.",
      psoe: "Subir la **ayuda al desarrollo hacia el 0,7 %** de la renta nacional e impulsar un **impuesto mínimo mundial a las grandes fortunas**.",
      fa: "Recuperar la **jurisdicción universal** y apoyar más a la **Corte Internacional de Justicia** y a la **Corte Penal Internacional**.",
    },
    implications: {
      vox: imp(
        "El Ejército vigilaría la frontera y la ayuda exterior se usaría como herramienta de presión migratoria.",
        "Más control fronterizo y más capacidad de presión sobre los países de origen.",
        "Recortar la ayuda puede agravar la pobreza que empuja a emigrar."
      ),
      pp: imp(
        "Más fondos y medios europeos para estas fronteras y devolución inmediata de quien llegue nadando.",
        "Implica a la UE en unas fronteras que también son europeas.",
        "Las devoluciones inmediatas, sin estudiar cada caso, son criticadas por organizaciones de derechos humanos."
      ),
      psoe: imp(
        "Mucha más ayuda exterior (hoy, en torno al 0,25 %) y promover en foros internacionales que los más ricos paguen un mínimo.",
        "Compromiso histórico de la ONU; ataca las causas de la pobreza y la evasión fiscal.",
        "Gasto alto con resultados difíciles de medir; el impuesto mundial depende de acuerdos con otros países."
      ),
      fa: imp(
        "Los jueces españoles podrían volver a investigar genocidios o crímenes de guerra cometidos en el extranjero.",
        "Refuerza la lucha contra la impunidad de los crímenes más graves.",
        "Puede provocar conflictos diplomáticos y sobrecargar a los juzgados."
      ),
    },
  },

  // ───────── Infraestructuras, energía y transportes
  {
    id: "inf-1",
    topic: "infraestructuras",
    prompt: "Energía nuclear y modelo energético",
    question: "¿Qué hacer con las centrales nucleares y el precio de la electricidad?",
    context:
      "Está previsto cerrar las centrales nucleares entre 2027 y 2035. Hoy la tecnología más cara que se necesita en cada hora (a menudo el gas) marca el precio de toda la electricidad: es el sistema «marginalista».",
    options: {
      vox: "**Mantener las centrales nucleares sin fecha de cierre** y estudiar **construir otras nuevas**.",
      pp: "**Anular en 100 días el calendario de cierre de las nucleares** y aprobar un plan para **evitar nuevos apagones**.",
      psoe: "**Mantener el cierre nuclear hasta 2035** e **impulsar renovables**, redes eléctricas, almacenamiento (baterías, bombeo) e hidrógeno verde.",
      fa: "**Cambiar el sistema marginalista** de fijación del precio de la electricidad.",
    },
    implications: {
      vox: imp(
        "Las nucleares seguirían funcionando indefinidamente y podría haber centrales nuevas.",
        "Electricidad estable y sin emisiones de CO₂, que da firmeza a la red.",
        "Residuos radiactivos sin almacén definitivo, y las centrales nuevas son muy caras y lentas de construir."
      ),
      pp: imp(
        "Se pararía el cierre previsto y se reforzaría la estabilidad del sistema eléctrico tras el apagón de 2025.",
        "Mantiene una fuente estable mientras crecen las renovables.",
        "Las propietarias tendrían que invertir para alargar su vida y piden pagar menos impuestos; se siguen generando residuos."
      ),
      psoe: imp(
        "Las nucleares cerrarían según lo previsto y se sustituirían por renovables y almacenamiento.",
        "Apuesta por energía barata y autóctona, sin residuos nucleares.",
        "Si el almacenamiento no llega a tiempo, más dependencia del gas en las horas sin sol ni viento."
      ),
      fa: imp(
        "Cada tecnología cobraría según su coste, de modo que el gas dejaría de marcar el precio de la electricidad renovable o nuclear, más barata.",
        "Puede bajar la factura al trasladar a los hogares el bajo coste de las renovables.",
        "El sistema es europeo: cambiarlo requiere acuerdo en la UE y puede reducir los incentivos para invertir."
      ),
    },
  },
  {
    id: "inf-2",
    topic: "infraestructuras",
    prompt: "Electricidad: impuestos y redes",
    question: "¿Cómo bajarías la factura de la luz?",
    context:
      "La factura incluye IVA, el impuesto especial sobre la electricidad y un impuesto del 7 % a la producción. Las «redes» son los cables que transportan y reparten la electricidad.",
    options: {
      vox: "**Bajar los impuestos de la luz** y **quitar los límites a la inversión en redes eléctricas**.",
      pp: "**Suprimir el impuesto del 7 %** a la producción de electricidad.",
      psoe: "Un **bono social único** (luz, calefacción, transporte, telecomunicaciones y agua) que **se conceda automáticamente**, sin pedirlo, y **reformar el mercado eléctrico** para que el abaratamiento de las renovables llegue a hogares y empresas.",
      fa: "**Control público de las redes de distribución**, una **eléctrica pública** y que las grandes líneas de alta tensión (más de 380 kV) sean de **titularidad pública**.",
    },
    implications: {
      vox: imp(
        "Factura más barata a corto plazo y las eléctricas podrían invertir más en cables y subestaciones.",
        "Ahorro directo y una red preparada para más consumo eléctrico.",
        "Menos recaudación; además, la inversión en redes se acaba pagando en la factura."
      ),
      pp: imp(
        "Las eléctricas dejarían de pagar ese impuesto, lo que debería abaratar el precio.",
        "Reduce el coste de producir electricidad, que se traslada a la factura.",
        "Nada garantiza que todo el ahorro llegue al consumidor, y se pierden más de 1.000 M€ al año de recaudación."
      ),
      psoe: imp(
        "Los hogares vulnerables recibirían descuentos en varios suministros sin tener que hacer trámites.",
        "Llega a quien lo necesita: hoy mucha gente con derecho al bono social no lo pide.",
        "Exige cruzar datos fiscales y sociales, y la reforma del mercado depende en parte de la UE."
      ),
      fa: imp(
        "El Estado tendría su propia compañía eléctrica y gestionaría redes que hoy están en manos privadas.",
        "Más control público sobre un servicio esencial y competencia a las grandes eléctricas.",
        "Nacionalizar redes exige indemnizaciones millonarias, y la gestión pública no garantiza precios más bajos."
      ),
    },
    sources: {
      psoe: {
        label: "Programa PSOE 29N, págs. 39 y 67, según Tarifaluzhora (18/11/2026)",
        url: "https://tarifaluzhora.es/noticias/elecciones-2026-psoe-propuestas-luz",
      },
    },
  },
  {
    id: "inf-3",
    topic: "infraestructuras",
    prompt: "Transporte e infraestructuras",
    question: "¿Qué prioridad prefieres en transporte e infraestructuras?",
    options: {
      vox: "**Más inversión en carreteras, tren, agua y telecomunicaciones**, revisar a fondo el estado de la red ferroviaria y **mejorar Cercanías y Media Distancia**.",
      pp: "Un **Plan Nacional de Infraestructuras de más de 300.000 M€** en 15 años, con participación de **capital privado**.",
      psoe: "Unos **19.000 M€ para mantener la red ferroviaria** en 2026-2030, **reparar 5.000 km de carreteras** estatales y **limitar los vuelos cortos** cuando haya alternativa directa en tren.",
      fa: "**Abono único de Cercanías de 20 € al mes** (10 € para menores de 26 y gratis para menores de 16), **fibra y 5G en zonas rurales** y recuperar las paradas de autobús suprimidas.",
    },
    implications: {
      vox: imp(
        "Más gasto en obra pública en general y una revisión del estado de las vías.",
        "Responde a los problemas de mantenimiento y retrasos en el tren.",
        "No concreta cifras ni prioridades, ni cómo se financiaría."
      ),
      pp: imp(
        "Grandes obras financiadas en parte por empresas privadas, que después cobrarían por su uso o gestión.",
        "Permite invertir mucho sin cargarlo todo a la deuda pública.",
        "La financiación privada puede salir más cara a largo plazo (peajes, rescates de concesiones)."
      ),
      psoe: imp(
        "Prioridad a conservar lo que ya existe y menos vuelos en trayectos como Madrid-Barcelona.",
        "Ataca el deterioro de la red y reduce emisiones.",
        "Restringir vuelos limita la libertad de elegir y afecta a quien enlaza con otros vuelos."
      ),
      fa: imp(
        "Transporte público mucho más barato y mejor conexión en los pueblos.",
        "Ahorro para quien se mueve a diario y menos uso del coche.",
        "Las rebajas de abono cuestan mucho dinero público y pueden saturar trenes que ya van llenos."
      ),
    },
  },

  // ───────── Derechos sociales y feminismo
  {
    id: "der-1",
    topic: "derechos",
    prompt: "Familia y natalidad",
    question: "¿Cómo apoyarías a las familias con hijos?",
    options: {
      vox: "Un plan de natalidad con **ventajas de familia numerosa desde el primer hijo**, y que **el Estado pague las cotizaciones** de los españoles que se dediquen a cuidar a sus hijos.",
      pp: "Una **deducción fiscal única por familia**, **cobrada cada mes** aunque no se pague IRPF, que cuente al hijo **desde el embarazo**.",
      psoe: "Una **prestación por crianza** y una **«Cuenta de Futuro» de 1.000 €** para cada bebé al nacer.",
      fa: "Una **ayuda universal de 200 € al mes por cada hijo** menor de 18 años.",
    },
    implications: {
      vox: imp(
        "Descuentos (transporte, matrículas, impuestos) para todas las familias con hijos, y cotizar a la Seguridad Social mientras se cuida a los hijos en casa.",
        "Reconoce el cuidado como trabajo e incentiva tener hijos.",
        "Diluye las ayudas de las familias que más lo necesitan, y limitarlo a españoles plantea problemas de igualdad."
      ),
      pp: imp(
        "Las familias recibirían un pago mensual de Hacienda por cada hijo, incluso durante el embarazo.",
        "Simplifica ayudas dispersas y llega también a familias con pocos ingresos.",
        "Contar al hijo no nacido tiene una lectura ideológica sobre el aborto, y la cuantía no está concretada."
      ),
      psoe: imp(
        "Una ayuda periódica por hijo y un pequeño ahorro inicial a nombre de cada niño.",
        "Apoyo directo a la crianza y un pequeño capital para el futuro.",
        "1.000 € es una cantidad modesta y la cuantía de la prestación no está concretada."
      ),
      fa: imp(
        "Todas las familias cobrarían 2.400 € al año por hijo, sea cual sea su renta.",
        "Ayuda generosa y sencilla, sin trámites ni estigma, como en otros países europeos.",
        "Muy costosa (en torno a 19.000 M€ al año) y la reciben también las familias con más ingresos."
      ),
    },
  },
  {
    id: "der-2",
    topic: "derechos",
    prompt: "Igualdad y violencia",
    question: "¿Qué medida prefieres contra la violencia y la desigualdad?",
    context:
      "La Ley de Violencia de Género (2004) protege específicamente a las mujeres frente a la violencia de su pareja o expareja, con juzgados y recursos propios.",
    options: {
      vox: "**Derogar las leyes de violencia de género** y sustituirlas por normas de protección a las víctimas **sin distinguir por sexo**.",
      pp: "Garantizar que funcionen bien las **pulseras que controlan las órdenes de alejamiento**, pasando su gestión al **Ministerio del Interior** con vigilancia policial continua.",
      psoe: "Una ley para **abolir la prostitución**, leyes contra la **violencia vicaria y la trata**, y castigar como delito los **deepfakes sexuales**.",
      fa: "**Transparencia salarial** y medidas contra la **diferencia de sueldo entre hombres y mujeres**.",
    },
    implications: {
      vox: imp(
        "Desaparecería el tratamiento específico de la violencia contra las mujeres (juzgados, agravantes, recursos propios).",
        "Sus defensores sostienen que todas las víctimas deben recibir el mismo trato legal.",
        "Elimina un sistema especializado que las organizaciones de víctimas y la mayoría de expertos consideran necesario."
      ),
      pp: imp(
        "La policía supervisaría directamente los dispositivos que avisan si un agresor se acerca a la víctima.",
        "Responde a fallos detectados en estos dispositivos y mejora la protección.",
        "Es una mejora concreta de gestión, no un cambio de fondo en las políticas de igualdad."
      ),
      psoe: imp(
        "Se perseguiría el negocio de la prostitución, se protegería a los hijos usados para dañar a la madre y sería delito crear imágenes sexuales falsas con IA.",
        "Combate la explotación sexual y nuevas formas de violencia digital.",
        "La abolición divide al propio feminismo: parte cree que empujará la prostitución a la clandestinidad."
      ),
      fa: imp(
        "Las empresas tendrían que informar de cuánto pagan por cada puesto, para detectar diferencias por sexo.",
        "Hace visible la discriminación salarial y facilita reclamarla.",
        "Más obligaciones para las empresas; una directiva europea ya exige parte de estas medidas."
      ),
    },
    sources: {
      pp: { label: "Programa PP 29N, según Artículo14 (11/11/2026)", url: ARTICULO14 },
    },
  },
  {
    id: "der-3",
    topic: "derechos",
    prompt: "Derechos civiles e identidad",
    question: "¿Qué posición prefieres sobre derechos civiles e identidad?",
    context:
      "Desde 2023, la «Ley Trans» permite cambiar el sexo en el registro civil con una declaración, sin informes médicos (la «autodeterminación»). El aborto y la eutanasia son legales en España.",
    options: {
      vox: "**Proteger la vida desde la concepción hasta la muerte natural**.",
      pp: "**Revisar la Ley Trans** para **eliminar el cambio de sexo en el registro por simple declaración**.",
      psoe: "**Blindar el aborto, el matrimonio entre personas del mismo sexo y la eutanasia**, y castigar las **terapias de conversión**.",
      fa: "**Reconocer legalmente a las personas no binarias** y **desarrollar la Ley Trans**.",
    },
    implications: {
      vox: imp(
        "Supondría restringir o eliminar el aborto y la eutanasia, hoy legales.",
        "Para sus defensores, protege la vida humana en todas sus etapas.",
        "Elimina derechos reconocidos por ley y avalados por el Tribunal Constitucional."
      ),
      pp: imp(
        "Volvería a exigirse algún requisito (como informes médicos) para cambiar de sexo en el registro.",
        "Sus defensores lo ven como una garantía de seguridad jurídica frente a usos fraudulentos.",
        "Los colectivos trans lo consideran un retroceso que vuelve a tratarlos como enfermos."
      ),
      psoe: imp(
        "Estos derechos quedarían más protegidos frente a cambios de Gobierno (por ejemplo, en la Constitución), y las terapias que intentan cambiar la orientación sexual serían delito.",
        "Da seguridad a derechos ya reconocidos.",
        "Quienes se oponen a estos derechos lo ven como cerrar un debate abierto; reformar la Constitución exige amplias mayorías."
      ),
      fa: imp(
        "Se podría registrar una identidad distinta de hombre o mujer en los documentos oficiales.",
        "Reconoce a personas que no se identifican con ninguno de los dos sexos.",
        "Exige adaptar registros y normas basadas en el sexo; sus críticos rechazan el concepto de género no binario."
      ),
    },
  },

  // ───────── Jubilación, IRPF e impuestos
  {
    id: "imp-1",
    topic: "impuestos",
    prompt: "Pensiones y jubilación",
    question: "¿Qué prefieres para las pensiones y la jubilación?",
    context:
      "La edad ordinaria de jubilación está subiendo hasta los 67 años en 2027. Revalorizar «con el IPC» significa subir las pensiones lo mismo que los precios.",
    options: {
      vox: "Asegurar las pensiones **haciendo crecer la economía, el empleo, los salarios y la natalidad**.",
      pp: "**Subir las pensiones cada año con el IPC**, garantizado por ley aunque no haya Presupuestos, y **rebajas en el IRPF a quien siga trabajando** después de la edad de jubilación.",
      psoe: "**Garantizar en la Constitución** que las pensiones suban con el IPC, llevar **20.000 M€ al Fondo de Reserva** y contar **un año más cotizado por cada hijo**.",
      fa: "Volver a **jubilarse a los 65 años** (60 en construcción, limpieza, ayuda a domicilio, camareras de piso y pesca), sin recorte de pensión con 40 años cotizados, y que **ninguna pensión sea inferior al salario mínimo**.",
    },
    implications: {
      vox: imp(
        "No propone cambios concretos de edad o cuantía: confía en que más actividad y más cotizantes sostengan el sistema.",
        "Ataca la causa de fondo: cuántas personas cotizan por cada pensionista.",
        "Es una propuesta genérica que no garantiza cuánto subirán las pensiones."
      ),
      pp: imp(
        "Las pensiones mantendrían su poder adquisitivo y se premiaría retrasar la jubilación.",
        "Seguridad para los pensionistas y más gente cotizando a edades avanzadas.",
        "Subir siempre con el IPC es caro a largo plazo, y la rebaja fiscal beneficia sobre todo a quien tiene buena salud y empleo."
      ),
      psoe: imp(
        "Sería muy difícil congelar las pensiones, habría una «hucha» para los años malos y criar hijos sumaría para la pensión.",
        "Máxima protección del poder adquisitivo y reconocimiento de la crianza.",
        "Fija en la Constitución un gasto creciente que pagarán las generaciones más jóvenes."
      ),
      fa: imp(
        "Se jubilaría antes, especialmente en los trabajos más duros, y las pensiones mínimas subirían mucho.",
        "Protege a quienes tienen trabajos físicamente duros y acaba con las pensiones de pobreza.",
        "Coste muy elevado en un sistema que ya tiene déficit y con una población que envejece."
      ),
    },
  },
  {
    id: "imp-2",
    topic: "impuestos",
    prompt: "IRPF, rentas y patrimonio",
    question: "¿Qué cambio prefieres en el IRPF y en los impuestos a la riqueza?",
    context:
      "«Deflactar» el IRPF es actualizar sus tramos con la inflación, para que una subida de sueldo que solo compensa los precios no haga pagar más impuestos.",
    options: {
      vox: "Un **IRPF más sencillo**, con **tipos que bajan según el número de hijos**.",
      pp: "**Deflactar el IRPF**, subir el mínimo exento por persona y por familia, que **el salario mínimo no pague IRPF** y **rebajar el IRPF a los jóvenes** de 18 a 35 años en sus cuatro primeras declaraciones (100 %, 75 %, 50 % y 25 %).",
      psoe: "**Subir los impuestos a las rentas del capital** (dividendos, intereses, plusvalías) a partir de 50.000 €, **hasta el 35 %** por encima de 300.000 €.",
      fa: "Un **impuesto a las grandes fortunas** (2 % desde 1 M€ y 3 % desde 50 M€) y un **impuesto estatal de sucesiones** para herencias desde 1 M€.",
    },
    implications: {
      vox: imp(
        "Pagaría menos IRPF quien tenga más hijos.",
        "Simplifica el impuesto y apoya a las familias.",
        "No concreta tipos ni coste, y beneficia más a las familias con rentas altas, que son las que más IRPF pagan."
      ),
      pp: imp(
        "Bajada general del IRPF, sobre todo para rentas bajas y medias y jóvenes que empiezan a trabajar.",
        "Más dinero en el bolsillo y alivio para los jóvenes.",
        "Menos recaudación para servicios públicos; la rebaja por edad trata distinto a personas con el mismo sueldo."
      ),
      psoe: imp(
        "Quien gane mucho con inversiones pagaría más, acercándose a lo que paga el trabajo.",
        "Más progresividad: las rentas más altas proceden a menudo del capital.",
        "Puede desincentivar el ahorro y la inversión o llevar capitales a otros países."
      ),
      fa: imp(
        "Los patrimonios millonarios pagarían cada año un porcentaje, y las grandes herencias tributarían igual en toda España.",
        "Reduce la desigualdad y evita la competencia fiscal entre comunidades.",
        "Riesgo de fuga de patrimonios y de pagar dos veces por lo mismo; puede afectar a empresas familiares."
      ),
    },
  },
  {
    id: "imp-3",
    topic: "impuestos",
    prompt: "Empresas, consumo y Seguridad Social",
    question: "¿Qué impuestos cambiarías a las empresas y al consumo?",
    context:
      "El Impuesto sobre Sociedades grava los beneficios de las empresas. La «base máxima de cotización» es el sueldo a partir del cual ya no se cotiza más a la Seguridad Social.",
    options: {
      vox: "**Bajar el Impuesto de Sociedades**, **rebajar el IVA** empezando por los productos básicos y **gravar las remesas** (el dinero que los inmigrantes envían a sus países).",
      pp: "Que pague **menos Impuesto de Sociedades** la empresa que invierta en crecer, y **eliminar los impuestos que frenan la inversión**.",
      psoe: "Subir el impuesto a la compra de acciones (**tasa Tobin**) del 0,2 % hasta el 0,4 %, un impuesto adicional a **grandes tecnológicas y de IA**, más impuestos a las empresas cotizadas cuyo consejero delegado cobre más de 100 veces el sueldo mediano, y una **tasa a los viajes de lujo**.",
      fa: "Que las grandes empresas paguen como **mínimo un 20 % real en Sociedades**, **subir la base máxima de cotización** y **eliminar las desgravaciones por planes de pensiones privados**.",
    },
    implications: {
      vox: imp(
        "Menos impuestos para empresas y consumidores, y un impuesto nuevo sobre los envíos de dinero al extranjero.",
        "Abarata la cesta de la compra y mejora la competitividad de las empresas.",
        "Menos ingresos públicos; gravar remesas castiga a trabajadores inmigrantes y puede fomentar envíos informales."
      ),
      pp: imp(
        "Las empresas que reinviertan sus beneficios tributarían menos.",
        "Incentiva invertir y crear empleo en lugar de repartir dividendos.",
        "Pérdida de recaudación, y no concreta qué impuestos se eliminarían."
      ),
      psoe: imp(
        "Pagarían más la compraventa de acciones, las grandes tecnológicas, las empresas con sueldos directivos desorbitados y los viajes de lujo.",
        "Grava a quienes más se benefician y reduce la desigualdad salarial.",
        "Puede desplazar operaciones a otras bolsas y provocar represalias comerciales de EE. UU."
      ),
      fa: imp(
        "Las grandes empresas no podrían reducir tanto su factura con deducciones, y los sueldos altos cotizarían más.",
        "Más ingresos para la Seguridad Social y que las grandes empresas no paguen proporcionalmente menos que las pymes.",
        "Encarece contratar perfiles muy cualificados y desincentiva ahorrar para la jubilación."
      ),
    },
    sources: {
      pp: { label: "Programa PP 29N, según Artículo14 (11/11/2026)", url: ARTICULO14 },
    },
  },

  // ───────── Seguridad y defensa
  {
    id: "seg-1",
    topic: "seguridad",
    prompt: "Gasto y modelo de defensa",
    question: "¿Cuánto y en qué debería gastar España en defensa?",
    context:
      "En 2025 la OTAN acordó elevar el gasto en defensa al 5 % del PIB para 2035; España se desmarcó de ese objetivo. Hoy gasta en torno al 2 %.",
    options: {
      vox: "**Más presupuesto de defensa** y **mejores sueldos y vivienda para los militares**.",
      pp: "Una ley que **planifique la inversión en defensa** a varios años, priorizando **drones** y defensas contra ellos, defensa antiaérea, munición y ciberdefensa.",
      psoe: "**Rechazar subir el gasto militar al 5 % del PIB** y apostar por una **defensa común europea**.",
      fa: "**Reducir el gasto militar**, **rechazar el 5 % de la OTAN** y dedicar ese dinero a emergencias, sanidad y educación (**«seguridad humana»**).",
    },
    implications: {
      vox: imp(
        "Aumento del gasto militar con especial atención al personal.",
        "Mejora las condiciones de los militares y la capacidad de defensa en un contexto internacional tenso.",
        "No concreta cifras ni de dónde saldría el dinero."
      ),
      pp: imp(
        "Gasto estable y centrado en las capacidades que han demostrado ser clave en las guerras recientes.",
        "Previsibilidad para la industria de defensa y modernización ante amenazas actuales.",
        "Compromete presupuesto durante años frente a otras prioridades."
      ),
      psoe: imp(
        "España mantendría un gasto menor que sus aliados y buscaría compartir capacidades en la UE.",
        "Evita recortar otras partidas y gana eficiencia al compartir medios.",
        "Puede tensar la relación con la OTAN y EE. UU.; la defensa europea común todavía no existe."
      ),
      fa: imp(
        "Menos dinero para el Ejército y más para servicios públicos y protección civil.",
        "Prioriza riesgos cotidianos como catástrofes climáticas o pandemias.",
        "Debilita la capacidad militar y los compromisos con los aliados en plena tensión con Rusia."
      ),
    },
  },
  {
    id: "seg-2",
    topic: "seguridad",
    prompt: "Código penal y seguridad ciudadana",
    question: "¿Qué cambio prefieres en el Código Penal y la seguridad ciudadana?",
    context:
      "La prisión permanente revisable (desde 2015) es una cadena perpetua que se revisa tras 25-35 años. La Ley de Seguridad Ciudadana de 2015, llamada «Ley Mordaza» por sus críticos, regula multas por protestas, desobediencia o grabar a policías.",
    options: {
      vox: "Aplicar la **prisión permanente revisable a más delitos** y **bajar la edad** a partir de la cual se puede responder penalmente (hoy, 14 años).",
      pp: "Aplicar la **prisión permanente revisable** a algunos asesinatos y a violadores reincidentes, **castigar más a los delincuentes que reinciden** muchas veces y ampliar los **juicios rápidos**.",
      psoe: "**Sustituir la Ley de Seguridad Ciudadana** de 2015 y dotar de **cámaras corporales** a los agentes, con garantías de protección de datos.",
      fa: "**Derogar la «Ley Mordaza»** y que las **multas sean proporcionales a la renta** de quien las paga.",
    },
    implications: {
      vox: imp(
        "Penas más largas y menores más jóvenes podrían ser juzgados por delitos.",
        "Respuesta más dura a los delitos graves, incluidos los cometidos por menores.",
        "Su efecto disuasorio es discutido y dificulta la reinserción, sobre todo de menores."
      ),
      pp: imp(
        "Más castigo a los reincidentes, incluido el pequeño hurto repetido, y condenas más rápidas.",
        "Responde a la sensación de impunidad ante la reincidencia.",
        "Más presión sobre prisiones y juzgados que ya están saturados."
      ),
      psoe: imp(
        "Nueva ley con las sanciones revisadas y grabación de las actuaciones policiales.",
        "Más garantías para ciudadanos y policías cuando hay conflicto.",
        "Los sindicatos policiales temen perder herramientas; las cámaras plantean dudas de privacidad."
      ),
      fa: imp(
        "Se eliminaría esa ley (con sus multas por protestas o desobediencia) y las multas pesarían lo mismo a ricos y a pobres.",
        "Protege la libertad de expresión y manifestación y hace las sanciones más justas.",
        "Los cuerpos de seguridad creen que perderían herramientas de orden público; calcular multas según la renta es complejo."
      ),
    },
  },
  {
    id: "seg-3",
    topic: "seguridad",
    prompt: "Cuerpos de seguridad, fronteras y armas",
    question: "¿Qué medida apoyas para policías, guardias civiles y fronteras?",
    context:
      "Ser «profesión de riesgo» permite jubilarse antes. La Guardia Civil es un cuerpo de naturaleza militar; la Policía Nacional es civil.",
    options: {
      vox: "Que el **Ejército participe en la protección de las fronteras** y reconocer a Policía y Guardia Civil como **profesión de riesgo**.",
      pp: "Reconocer a Policía y Guardia Civil como **profesión de riesgo** y **más agentes en los barrios conflictivos**.",
      psoe: "**Reforzar Policía y Guardia Civil** y la lucha contra las **estafas por internet**, y modernizar las Fuerzas Armadas con más medios para la **Unidad Militar de Emergencias** (UME).",
      fa: "Que la **Guardia Civil deje de ser un cuerpo militar** y reconocer a Guardia Civil y Policía Nacional como **profesión de riesgo**, con **jubilación anticipada**.",
    },
    implications: {
      vox: imp(
        "Militares vigilando las fronteras y jubilación anticipada para los agentes.",
        "Más medios en frontera y reconocimiento a los agentes.",
        "Usar el Ejército en tareas policiales es excepcional en democracia y plantea riesgos."
      ),
      pp: imp(
        "Jubilación anticipada para los agentes y más presencia policial donde hay más delincuencia.",
        "Reivindicación histórica de los agentes y más seguridad en barrios difíciles.",
        "La jubilación anticipada tiene un coste y reduce plantillas si no se reponen."
      ),
      psoe: imp(
        "Más medios contra el fraude digital y más capacidad del Ejército para catástrofes.",
        "Se adapta a delitos en auge como las estafas online.",
        "Propuesta genérica, sin cifras de agentes ni de inversión."
      ),
      fa: imp(
        "Los guardias civiles tendrían derechos como los policías (sindicarse, régimen disciplinario civil) y podrían jubilarse antes.",
        "Iguala los derechos laborales de cuerpos con funciones parecidas.",
        "Cambia la naturaleza histórica del cuerpo y sus misiones militares, y tiene detractores dentro del propio cuerpo."
      ),
    },
    sources: {
      fa: { label: "Programa Frente Amplio 29N, págs. 144-145 del PDF", url: FA_PDF },
    },
  },

  // ───────── I+D, ciencia y tecnología
  {
    id: "idi-1",
    topic: "idi",
    prompt: "Inversión e investigación",
    question: "¿Cómo impulsarías la investigación y la innovación?",
    context:
      "España invierte en I+D alrededor del 1,5 % del PIB (público y privado), por debajo de la media europea, cercana al 2,2 %.",
    options: {
      vox: "**Más gasto en investigación e innovación**, **ventajas fiscales** para innovar y un plan para que **vuelvan los investigadores** que emigraron.",
      pp: "Un **IRPF del 20 % durante 6 años** para los profesionales que se incorporen a grandes proyectos tecnológicos en España.",
      psoe: "Inversión pública en **I+D del 1,25 % del PIB** (1,5 % en 2035) y un **Estatuto del Personal Investigador**.",
      fa: "Un **fondo público de inversión en tecnología** e inversión a través de la **banca pública**.",
    },
    implications: {
      vox: imp(
        "Más dinero y ventajas fiscales para investigar y recuperar talento.",
        "Combina inversión pública con incentivos al sector privado.",
        "No concreta cifras; los planes de retorno solo funcionan con sueldos y estabilidad competitivos."
      ),
      pp: imp(
        "Ingenieros o científicos que vengan a trabajar en grandes proyectos pagarían menos IRPF que el resto.",
        "Atrae talento internacional a sectores estratégicos.",
        "Trata fiscalmente distinto a personas con el mismo sueldo y beneficia sobre todo a rentas altas."
      ),
      psoe: imp(
        "Más fondos públicos estables y mejores condiciones laborales para los investigadores.",
        "Reduce la precariedad de la carrera científica.",
        "Más gasto público, y la inversión privada en I+D, la gran carencia de España, queda en segundo plano."
      ),
      fa: imp(
        "El Estado invertiría directamente en empresas y proyectos tecnológicos.",
        "Financia proyectos arriesgados que la banca privada no cubre.",
        "Riesgo de perder dinero público y de decidir inversiones con criterios políticos."
      ),
    },
  },
  {
    id: "idi-2",
    topic: "idi",
    prompt: "Menores y entorno digital",
    question: "¿Cómo proteger a los menores en internet y en las redes sociales?",
    context:
      "Hoy en España se puede abrir una cuenta en redes sociales sin permiso de los padres desde los 14 años, aunque la edad apenas se comprueba.",
    options: {
      vox: "**Proteger a los menores de los riesgos digitales** (apuestas, pornografía), **prohibir los móviles en clase** y un plan nacional contra el **acoso escolar y el ciberacoso**.",
      pp: "**Prohibir las redes sociales a los menores de 14 años**.",
      psoe: "Una ley de protección de menores en internet que fije en **16 años la edad mínima para usar redes sociales**.",
      fa: "**Regular con dureza las redes** dirigidas a menores de 16 años, con **verificación de edad** que respete la privacidad y **eliminando funciones adictivas** (scroll infinito, reproducción automática, recomendaciones por algoritmo).",
    },
    implications: {
      vox: imp(
        "Más control de los contenidos para adultos y móviles fuera de las aulas.",
        "Ataca riesgos concretos y mejora la concentración en clase.",
        "No fija una edad mínima para las redes, y muchas comunidades ya restringen los móviles en clase."
      ),
      pp: imp(
        "Las plataformas tendrían que impedir que los menores de 14 años abran cuentas.",
        "Retrasa la exposición a redes en una edad especialmente vulnerable.",
        "Difícil de comprobar sin pedir documentación a todos los usuarios; los menores pueden saltárselo."
      ),
      psoe: imp(
        "Hasta los 16 años no se podría tener redes sociales.",
        "Protección más amplia en plena adolescencia.",
        "Los mismos problemas para verificar la edad, y puede aislar socialmente a adolescentes."
      ),
      fa: imp(
        "En vez de prohibir el acceso, obligaría a las plataformas a cambiar cómo funcionan para los menores.",
        "Ataca el diseño adictivo, que es la causa del problema, y no solo el acceso.",
        "Choca con el modelo de negocio de las plataformas y su cumplimiento depende en buena parte de la UE."
      ),
    },
    sources: {
      fa: { label: "Programa Frente Amplio 29N, pág. 41 del PDF", url: FA_PDF },
      vox: { label: "Programa Vox 29N, págs. 35 y 45", url: VOX_PDF },
    },
  },
  {
    id: "idi-3",
    topic: "idi",
    prompt: "Inteligencia artificial e innovación",
    question: "¿Qué papel debería tener el Estado ante la inteligencia artificial?",
    context:
      "La «libertad de amortización» permite a una empresa restar de golpe en el Impuesto de Sociedades lo que invierte, en vez de repartirlo en varios años.",
    options: {
      vox: "**Impulsar la IA** en la economía y en la Administración, pero manteniendo siempre la **atención presencial**.",
      pp: "Que las empresas puedan **desgravar de golpe** lo que inviertan en maquinaria, digitalización o inteligencia artificial (**libertad de amortización**).",
      psoe: "**Supervisión humana** de las decisiones de IA que afecten a derechos, auditorías, **etiquetar los contenidos generados por IA** y que los **autores autoricen y cobren** cuando sus obras se usen para entrenar IA.",
      fa: "Un plan para que las **pymes adopten la inteligencia artificial**.",
    },
    implications: {
      vox: imp(
        "Más IA en los trámites públicos sin obligar a nadie a hacerlo todo por internet.",
        "Moderniza la Administración sin dejar atrás a mayores o a personas sin competencias digitales.",
        "Propuesta genérica, sin regulación ni financiación concretas."
      ),
      pp: imp(
        "Invertir en tecnología rebajaría de inmediato el impuesto de la empresa.",
        "Acelera la modernización de las empresas.",
        "Menos recaudación a corto plazo; beneficia más a las empresas que ya tienen beneficios."
      ),
      psoe: imp(
        "Más control sobre cómo se usa la IA y protección de los creadores.",
        "Protege derechos y ayuda a combatir la desinformación.",
        "Más regulación puede frenar la innovación y alejar a empresas tecnológicas."
      ),
      fa: imp(
        "Ayudas y formación para que las pequeñas empresas usen IA.",
        "Evita que solo las grandes empresas aprovechen la IA.",
        "Poco concreta en cuantía y no aborda la regulación."
      ),
    },
    sources: {
      pp: {
        label: "Programa PP 29N, según Merca2 (19/11/2026)",
        url: "https://www.merca2.es/2026/11/19/propuestas-economicas-pp-2510463/",
      },
    },
  },

  // ───────── Ecologismo
  {
    id: "ecol-1",
    topic: "ecologismo",
    prompt: "Clima y energía",
    question: "¿Qué política climática y energética prefieres?",
    context:
      "El Pacto Verde Europeo fija la neutralidad climática en 2050 e incluye dejar de vender coches nuevos de gasolina y diésel a partir de 2035.",
    options: {
      vox: "**Rechazar el Pacto Verde Europeo y la Agenda 2030**, y oponerse a **prohibir los coches de combustión** y a los **impuestos sobre el CO₂**.",
      pp: "Revisar el plan de renovables para que **todas las tecnologías compitan en igualdad** en subastas, ayudas y regulación.",
      psoe: "Que el **81 % de la electricidad sea renovable en 2030** y un plan para **abandonar los combustibles fósiles**.",
      fa: "Un fondo público con al menos el **30 % de las nuevas instalaciones renovables** y de almacenamiento, y que el **diésel pague los mismos impuestos que la gasolina**.",
    },
    implications: {
      vox: imp(
        "España se opondría a los objetivos climáticos de la UE y a los impuestos por contaminar.",
        "Evita costes a la industria, la agricultura y los conductores.",
        "Choca con compromisos europeos e internacionales y retrasa la reducción de emisiones."
      ),
      pp: imp(
        "Se dejaría de favorecer específicamente a las renovables frente a otras fuentes.",
        "Neutralidad tecnológica y precios según costes reales.",
        "Puede frenar el despliegue renovable y alejar los objetivos climáticos."
      ),
      psoe: imp(
        "Fuerte aceleración de la eólica, la solar y el almacenamiento.",
        "Menos emisiones, menos dependencia del gas importado y electricidad más barata a largo plazo.",
        "Exige muchas redes y almacenamiento, ocupa suelo y plantea retos para la estabilidad de la red."
      ),
      fa: imp(
        "El Estado sería socio de los nuevos parques renovables y el gasóleo subiría de precio.",
        "Los beneficios de las renovables revertirían en lo público y se dejaría de favorecer al diésel, más contaminante.",
        "Encarece el combustible a transportistas, agricultores y zonas rurales que dependen del coche."
      ),
    },
    sources: {
      pp: {
        label: "Programa PP 29N, según Tarifaluzhora (18/11/2026)",
        url: "https://tarifaluzhora.es/noticias/elecciones-2026-29n-partidos-propuestas-luz",
      },
    },
  },
  {
    id: "ecol-2",
    topic: "ecologismo",
    prompt: "Agua",
    question: "¿Cuál es tu prioridad en la política del agua?",
    context:
      "La «interconexión de cuencas» (trasvases) consiste en llevar agua de ríos con excedente a zonas con escasez.",
    options: {
      vox: "Un **Plan Nacional del Agua** que conecte las cuencas de los ríos mediante **trasvases**.",
      pp: "**Mantener, limpiar y ensanchar ríos**, cauces y barrancos.",
      psoe: "**Bancos públicos de agua** y una **cantidad mínima de agua garantizada** para los hogares vulnerables.",
      fa: "**Agua básica gratuita** para los hogares vulnerables y **prohibir que se les corte el suministro**.",
    },
    implications: {
      vox: imp(
        "Grandes obras para llevar agua del norte y el centro a zonas secas como el sureste.",
        "Asegura agua para los regadíos y las ciudades del sureste.",
        "Obras caras, con impacto ambiental y conflictos entre comunidades por el agua."
      ),
      pp: imp(
        "Prevenir inundaciones despejando ríos y ramblas.",
        "Reduce el riesgo de riadas como las de los últimos años.",
        "Las limpiezas pueden dañar los ecosistemas de los ríos; muchos expertos piden además no construir en zonas inundables."
      ),
      psoe: imp(
        "El Estado podría comprar y reasignar derechos de agua, y se garantizaría agua básica a quien no pueda pagarla.",
        "Gestión más flexible en las sequías y protección social.",
        "Los regantes temen perder derechos; intervenir el mercado del agua es complejo."
      ),
      fa: imp(
        "Ningún hogar vulnerable se quedaría sin agua por no poder pagar.",
        "Garantiza un derecho humano básico.",
        "Coste para los ayuntamientos y las empresas de agua, y riesgo de más impagos."
      ),
    },
  },
  {
    id: "ecol-3",
    topic: "ecologismo",
    prompt: "Territorio, emergencias y transición",
    question: "¿Qué medida apoyas sobre territorio, catástrofes y transición ecológica?",
    context:
      "Las zonas de bajas emisiones (ZBE) limitan la entrada de los coches más contaminantes en las ciudades de más de 50.000 habitantes. Hoy las emergencias las gestionan sobre todo las comunidades autónomas.",
    options: {
      vox: "**Eliminar las zonas de bajas emisiones**, **facilitar la minería** y la extracción de recursos energéticos y **limitar las grandes plantas solares** en tierras de cultivo.",
      pp: "Que el **Estado intervenga desde el primer momento** en las catástrofes.",
      psoe: "Una **Agencia Estatal de Protección Civil**, un **Fondo Nacional de Resiliencia Climática** y **restaurar ecosistemas**.",
      fa: "**Obligar a instalar placas solares** en los edificios de viviendas donde sea viable.",
    },
    implications: {
      vox: imp(
        "Cualquier coche podría circular por las ciudades, habría más explotación de recursos propios y menos plantas solares en suelo agrícola.",
        "Evita gastos a quien tiene coches antiguos y protege el suelo agrícola.",
        "Empeora la calidad del aire en las ciudades, y la minería y la extracción tienen impacto ambiental."
      ),
      pp: imp(
        "El Gobierno central asumiría antes la gestión de las emergencias graves, sin esperar a que se la pida la comunidad.",
        "Evita retrasos de coordinación en las primeras horas, que son decisivas.",
        "Las emergencias son competencia autonómica: habría que redefinir el reparto de poderes."
      ),
      psoe: imp(
        "Un organismo estatal coordinaría las emergencias y habría fondos para adaptarse al cambio climático.",
        "Mejor coordinación y prevención ante fenómenos extremos cada vez más frecuentes.",
        "Más estructura administrativa y posibles choques con las comunidades."
      ),
      fa: imp(
        "Las comunidades de vecinos tendrían que poner paneles solares en sus tejados.",
        "Más energía limpia y facturas más bajas a largo plazo.",
        "Inversión obligatoria para los vecinos, aunque después se amortice."
      ),
    },
  },

  // ───────── Actividades del sector primario
  {
    id: "pri-1",
    topic: "primario",
    prompt: "Agricultura, precios y comercio",
    question: "¿Cómo apoyarías a agricultores y ganaderos?",
    context:
      "Mercosur es un acuerdo comercial entre la UE y varios países de Sudamérica. Las «cláusulas espejo» exigen que los productos importados cumplan las mismas normas que los europeos. La PAC es la Política Agrícola Común, que reparte las ayudas europeas al campo.",
    options: {
      vox: "**Rechazar el acuerdo UE-Mercosur**, exigir **cláusulas espejo** a las importaciones y **revisar las obligaciones medioambientales** de agricultores y ganaderos.",
      pp: "**IVA del 0 % en alimentos básicos** (carne, pescado, conservas) mientras duren los precios altos.",
      psoe: "Que las **ayudas de la PAC** se centren en **agricultores profesionales** y en explotaciones familiares, pequeñas y medianas, y una **Ley de Agricultura Familiar y Profesional**.",
      fa: "Transición a una **agricultura ecológica**, apoyo a la **ganadería en pastos** y **reducir las emisiones** de la agricultura, la ganadería y la pesca.",
    },
    implications: {
      vox: imp(
        "Menos competencia de productos de fuera y menos requisitos ambientales para el campo.",
        "Protege a los productores españoles de una competencia que consideran desleal.",
        "Perjudica a sectores exportadores (vino, aceite, industria) y puede aumentar el impacto ambiental."
      ),
      pp: imp(
        "Estos alimentos bajarían de precio en el supermercado.",
        "Alivio directo para las familias y más consumo de producto del campo.",
        "Parte de la rebaja puede quedarse en la cadena comercial, y beneficia también a quien más gasta."
      ),
      psoe: imp(
        "Menos ayudas para grandes propietarios y para quien no vive del campo, y más para las explotaciones familiares.",
        "Ayuda a quien realmente trabaja la tierra y al mundo rural.",
        "Definir quién es «profesional» es complejo y puede dejar fuera a agricultores a tiempo parcial."
      ),
      fa: imp(
        "Menos fertilizantes y pesticidas químicos, y más ganado en pastos que en macrogranjas.",
        "Protege suelos, agua y biodiversidad y valoriza el producto de calidad.",
        "Puede reducir la producción y subir costes y precios; la transición necesita ayudas."
      ),
    },
  },
  {
    id: "pri-2",
    topic: "primario",
    prompt: "Agua, relevo generacional y pesca",
    question: "¿Qué prioridad prefieres para el campo y la pesca?",
    context:
      "El «relevo generacional» es que haya jóvenes que tomen el testigo de los agricultores que se jubilan; hoy muy pocas explotaciones están en manos de menores de 40 años.",
    options: {
      vox: "Apoyar el **relevo generacional y las cooperativas**, **revisar la política pesquera** y las cuotas de pesca de la UE y **modernizar la flota**.",
      pp: "Un **Pacto Nacional del Agua** con **hasta 40.000 M€** hasta 2030, también para los **regadíos**.",
      psoe: "**Modernizar los regadíos sin aumentar el consumo** total de agua y crear **bancos de tierras** para el relevo generacional.",
      fa: "**Bancos públicos de tierras** para nuevos agricultores y que la **pesca con Marruecos se limite a sus aguas**, sin incluir las del Sáhara Occidental.",
    },
    implications: {
      vox: imp(
        "Ayudas a jóvenes agricultores y negociar en Bruselas para que los pescadores españoles puedan capturar más.",
        "Defiende al sector pesquero ante las restricciones europeas.",
        "Las cuotas protegen especies sobreexplotadas; ampliarlas puede agotar caladeros."
      ),
      pp: imp(
        "Gran inversión en obras hidráulicas, también para el regadío.",
        "Garantiza agua al campo en un país con sequías recurrentes.",
        "Coste muy alto, y más regadío puede aumentar la presión sobre ríos y acuíferos."
      ),
      psoe: imp(
        "Regar con más eficiencia sin ampliar el consumo, y facilitar a los jóvenes tierras que hoy no se cultivan.",
        "Ahorra agua y ataca la falta de relevo.",
        "Los regantes pueden ver limitado su crecimiento."
      ),
      fa: imp(
        "Acceso a tierra para quien empieza, y los barcos españoles dejarían de faenar en aguas saharauis.",
        "Respeta las sentencias europeas sobre el Sáhara y facilita incorporarse al campo.",
        "La flota andaluza y canaria perdería caladeros."
      ),
    },
  },
]
