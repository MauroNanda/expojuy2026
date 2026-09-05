export interface DemoSector {
  id: string;
  description: string;
  name: string;
}

export interface DemoExhibitor {
  agendaItemId: string;
  category: string;
  description: string;
  id: string;
  name: string;
  sectorId: string;
  venueZoneId: string;
  visual?: DemoExhibitorVisual;
}

export interface DemoExhibitorVisual {
  alt: string;
  origin: "reference-authorized" | "ai-generated" | "institutional";
  source: string;
}

export interface DemoAgendaItem {
  /** Fecha local de la actividad en formato `AAAA-MM-DD`. */
  date: string;
  description: string;
  durationMinutes: number;
  id: string;
  location: string;
  sectorId: string;
  /** Hora local de inicio en formato `HH:MM`. */
  time: string;
  title: string;
}

export interface DemoInterest {
  description: string;
  highlightActivityId: string;
  highlightActorId: string;
  id: string;
  label: string;
  relatedInterestIds: string[];
  sectorId: string;
  sectorName: string;
  venueZoneId: string;
}

/**
 * Canal oficial del que proviene una novedad. El enlace permite verificar la
 * publicación de origen sin depender de lo que afirme el prototipo.
 */
export interface OfficialNewsSource {
  name: string;
  url: string;
}

/**
 * Novedad compuesta a partir de contenido publicado en canales oficiales. La
 * procedencia es obligatoria: una novedad sin canal ni enlace no compila.
 */
export interface OfficialNewsItem {
  id: string;
  /** Fecha de publicación de la fuente en formato `AAAA-MM-DD`. */
  publishedDate: string;
  /** Fecha en que se consultó la publicación de origen, formato `AAAA-MM-DD`. */
  retrievedDate: string;
  source: OfficialNewsSource;
  summary: string;
  title: string;
}

/**
 * Grado de certeza de un dato del prototipo. Distinguirlo en el contenido evita
 * que la diferencia dependa de cómo se redacte cada sección.
 */
export type ContentCertainty = "confirmed" | "demonstrative";

export interface VenueMapZone {
  areas: MapArea[];
  description: string;
  exhibitors: string[];
  id: string;
  kind: "covered" | "food" | "outdoor" | "artisan";
  label: string;
  standIds: string[];
}

export interface MapArea {
  height: number;
  left: number;
  rotation?: number;
  top: number;
  width: number;
}

export interface VenueMapReference extends MapArea {
  id: string;
  label: string;
}

export const venueMapZones: VenueMapZone[] = [
  {
    id: "stands-cubiertos",
    kind: "covered",
    label: "Stands cubiertos",
    description: "Espacio demostrativo para proyectos de mayor escala.",
    exhibitors: ["Proyecto del Norte", "Laboratorio Andino", "Red Emprende"],
    areas: [{ left: 42.3, top: 10, width: 50.7, height: 35 }],
    standIds: [],
  },
  {
    id: "descubiertos",
    kind: "outdoor",
    label: "Stands descubiertos",
    description:
      "Zona exterior demostrativa para conocer propuestas del territorio.",
    exhibitors: ["Mercado del Valle", "Taller Quebrada"],
    areas: [
      { left: 20.1, top: 9.2, width: 6.8, height: 35.8 },
      { left: 13.1, top: 45.1, width: 14.5, height: 8.8, rotation: -15 },
      { left: 54.2, top: 49.9, width: 36.2, height: 15, rotation: -6 },
      { left: 34.7, top: 67.8, width: 35.8, height: 8.8 },
    ],
    standIds: [],
  },
  {
    id: "artesanos",
    kind: "artisan",
    label: "Stands artesanos",
    description: "Espacio demostrativo de oficios y producción local.",
    exhibitors: ["Manos de la Puna"],
    areas: [
      { left: 33.7, top: 34.3, width: 5.2, height: 10.5 },
      { left: 32, top: 49.9, width: 9.8, height: 8.7, rotation: -12 },
      { left: 39, top: 60.5, width: 6.3, height: 4.3 },
      { left: 44.5, top: 49.7, width: 5.7, height: 6.2, rotation: 18 },
    ],
    standIds: [],
  },
  {
    id: "food-trucks",
    kind: "food",
    label: "Food Trucks",
    description:
      "Parada gastronómica demostrativa para recorrer sabores locales y propuestas al paso.",
    exhibitors: [
      "La Yunga al Paso",
      "Sabor Norteño",
      "Ruta 9 Café",
      "Andes Veggie",
      "Dulce Quebrada",
    ],
    areas: [{ left: 28.9, top: 85.5, width: 39.4, height: 9.2, rotation: -3 }],
    standIds: [],
  },
];

export const venueMapReferences: VenueMapReference[] = [
  {
    id: "same-norte",
    label: "SAME",
    left: 32.8,
    top: 8.5,
    width: 5.6,
    height: 10,
  },
  {
    id: "boleteria",
    label: "Boletería",
    left: 15.9,
    top: 55.9,
    width: 6.8,
    height: 8.8,
    rotation: -13,
  },
  {
    id: "acceso",
    label: "Acceso",
    left: 6.6,
    top: 58.4,
    width: 7.6,
    height: 10.4,
    rotation: -15,
  },
  {
    id: "escenario",
    label: "Escenario",
    left: 18.1,
    top: 75.6,
    width: 5.6,
    height: 11.3,
  },
  {
    id: "same-sur",
    label: "SAME",
    left: 19,
    top: 91.5,
    width: 5.5,
    height: 5.1,
  },
];

export const demoSectors: DemoSector[] = [
  {
    id: "produccion-local",
    name: "Producción local",
    description: "Saberes, productos y territorio.",
  },
  {
    id: "tecnologia-aplicada",
    name: "Tecnología aplicada",
    description: "Ideas para conectar y transformar.",
  },
  {
    id: "vinculacion-empresarial",
    name: "Vinculación empresarial",
    description: "Encuentros entre proyectos y oportunidades.",
  },
];

export const demoInterests: DemoInterest[] = [
  {
    id: "innovacion-futuro",
    label: "Innovación y Futuro",
    description:
      "Explorá tecnología aplicada, software y soluciones digitales jujeñas.",
    sectorId: "tecnologia-aplicada",
    sectorName: "Tecnología aplicada",
    highlightActorId: "laboratorio-andino",
    highlightActivityId: "ronda-descubrimiento",
    venueZoneId: "stands-cubiertos",
    relatedInterestIds: ["formacion-charlas", "negocios-desarrollo"],
  },
  {
    id: "identidad-sabores",
    label: "Identidad y Sabores Regionales",
    description:
      "Conocé propuestas que nacen del territorio, oficios y producción local.",
    sectorId: "produccion-local",
    sectorName: "Producción local",
    highlightActorId: "manos-de-la-puna",
    highlightActivityId: "encuentro-apertura",
    venueZoneId: "artesanos",
    relatedInterestIds: ["innovacion-futuro", "negocios-desarrollo"],
  },
  {
    id: "negocios-desarrollo",
    label: "Negocios y Desarrollo Sostenible",
    description:
      "Encontrá oportunidades de inversión, vinculación productiva y cadenas de valor.",
    sectorId: "vinculacion-empresarial",
    sectorName: "Vinculación empresarial",
    highlightActorId: "red-emprende",
    highlightActivityId: "experiencias-ecosistema",
    venueZoneId: "stands-cubiertos",
    relatedInterestIds: ["innovacion-futuro", "formacion-charlas"],
  },
  {
    id: "formacion-charlas",
    label: "Charlas y Formación Profesional",
    description:
      "Participá de conferencias, intercambio de experiencias y networking sectorial.",
    sectorId: "tecnologia-aplicada",
    sectorName: "Tecnología aplicada",
    highlightActorId: "taller-quebrada",
    highlightActivityId: "ronda-descubrimiento",
    venueZoneId: "descubiertos",
    relatedInterestIds: ["innovacion-futuro", "negocios-desarrollo"],
  },
];

export const demoExhibitors: DemoExhibitor[] = [
  {
    id: "proyecto-del-norte",
    name: "Proyecto del Norte",
    category: "Producción local",
    description: "Una propuesta demostrativa vinculada a saberes y territorio.",
    sectorId: "produccion-local",
    agendaItemId: "encuentro-apertura",
    venueZoneId: "stands-cubiertos",
  },
  {
    id: "manos-de-la-puna",
    name: "Manos de la Puna",
    category: "Producción local",
    description:
      "Un recorrido demostrativo de oficios, saberes y producción del territorio.",
    sectorId: "produccion-local",
    agendaItemId: "encuentro-apertura",
    venueZoneId: "artesanos",
  },
  {
    id: "laboratorio-andino",
    name: "Laboratorio Andino",
    category: "Tecnología aplicada",
    description:
      "Un protagonista demostrativo para explorar innovación aplicada.",
    sectorId: "tecnologia-aplicada",
    agendaItemId: "ronda-descubrimiento",
    venueZoneId: "stands-cubiertos",
  },
  {
    id: "taller-quebrada",
    name: "Taller Quebrada",
    category: "Tecnología aplicada",
    description:
      "Una propuesta demostrativa para imaginar herramientas aplicadas a desafíos locales.",
    sectorId: "tecnologia-aplicada",
    agendaItemId: "ronda-descubrimiento",
    venueZoneId: "descubiertos",
  },
  {
    id: "red-emprende",
    name: "Red Emprende",
    category: "Vinculación empresarial",
    description:
      "Un espacio demostrativo de encuentro entre proyectos y oportunidades.",
    sectorId: "vinculacion-empresarial",
    agendaItemId: "experiencias-ecosistema",
    venueZoneId: "stands-cubiertos",
  },
  {
    id: "mercado-del-valle",
    name: "Mercado del Valle",
    category: "Vinculación empresarial",
    description:
      "Un espacio demostrativo para acercar propuestas, redes y oportunidades de intercambio.",
    sectorId: "vinculacion-empresarial",
    agendaItemId: "experiencias-ecosistema",
    venueZoneId: "descubiertos",
  },
];

/**
 * Período demostrativo de la agenda. No corresponde a la programación oficial
 * de ExpoJuy 2026: sustituir estas fechas por las confirmadas no requiere
 * alterar la estructura del contenido ni la generación de calendario.
 */
/**
 * Período y sede confirmados de ExpoJuy 2026. Es la única fuente de esta fecha:
 * su forma legible se deriva con `formatEventPeriod`, nunca se escribe a mano.
 * Origen registrado en `docs/decisiones.md` (D-015).
 */
export const officialEventPeriod = {
  certainty: "confirmed",
  edition: 17,
  endDate: "2026-10-12",
  startDate: "2026-10-09",
  venue: "Ciudad Cultural, San Salvador de Jujuy",
} as const satisfies OfficialEventPeriod;

/**
 * Período que abarca la programación demostrativa. Se ubica dentro del período
 * oficial, pero su certeza es distinta: las actividades no están confirmadas.
 */
export const demoAgendaPeriod = {
  certainty: "demonstrative",
  endDate: "2026-10-11",
  startDate: "2026-10-09",
} as const satisfies EventPeriod;

interface EventPeriod {
  certainty: ContentCertainty;
  /** Fecha final inclusiva en formato `AAAA-MM-DD`. */
  endDate: string;
  /** Fecha inicial en formato `AAAA-MM-DD`. */
  startDate: string;
}

/** El período confirmado suma los datos institucionales ya verificados. */
interface OfficialEventPeriod extends EventPeriod {
  certainty: "confirmed";
  edition: number;
  venue: string;
}

const monthNames = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

/**
 * Expresa un período como texto legible. Las fechas se descomponen sin `Date`
 * para que el resultado no dependa de la zona horaria del dispositivo.
 */
export function formatEventPeriod(period: EventPeriod): string {
  const [startYear, startMonth, startDay] = period.startDate.split("-");
  const [endYear, endMonth, endDay] = period.endDate.split("-");

  const startNumber = Number(startDay);
  const endNumber = Number(endDay);
  const endMonthName = monthNames[Number(endMonth) - 1];

  if (startMonth === endMonth && startYear === endYear) {
    return `${startNumber} al ${endNumber} de ${endMonthName} de ${endYear}`;
  }

  const startMonthName = monthNames[Number(startMonth) - 1];

  return `${startNumber} de ${startMonthName} al ${endNumber} de ${endMonthName} de ${endYear}`;
}

/**
 * Jujuy no aplica horario de verano, por lo que su desplazamiento respecto de
 * UTC es constante. La generación de calendario depende de este valor para
 * expresar los horarios sin ambigüedad.
 */
export const demoAgendaTimeZone = {
  name: "America/Argentina/Jujuy",
  utcOffsetMinutes: -180,
} as const;

/** Advertencia que acompaña a la agenda dentro y fuera del prototipo. */
export const demoAgendaNotice =
  "Programación demostrativa. El período del evento está confirmado; las actividades, sus horarios y sus lugares no están confirmados.";

export const demoAgenda: DemoAgendaItem[] = [
  {
    id: "encuentro-apertura",
    date: "2026-10-09",
    time: "10:00",
    durationMinutes: 90,
    location: "Predio ferial de demostración · Escenario central",
    title: "Encuentro de apertura",
    description: "Actividad demostrativa para abrir el recorrido productivo.",
    sectorId: "produccion-local",
  },
  {
    id: "ronda-descubrimiento",
    date: "2026-10-10",
    time: "14:00",
    durationMinutes: 120,
    location: "Predio ferial de demostración · Stands cubiertos",
    title: "Ronda de descubrimiento",
    description: "Actividad demostrativa para conocer tecnología y proyectos.",
    sectorId: "tecnologia-aplicada",
  },
  {
    id: "experiencias-ecosistema",
    date: "2026-10-11",
    time: "17:00",
    durationMinutes: 60,
    location: "Predio ferial de demostración · Espacio de vinculación",
    title: "Experiencias del ecosistema",
    description:
      "Actividad demostrativa orientada a la vinculación empresarial.",
    sectorId: "vinculacion-empresarial",
  },
];

/**
 * Novedades tomadas de la cobertura pública de ExpoJuy 2026. Cada una conserva
 * su canal y su enlace de origen para que su contenido pueda verificarse.
 * No se actualizan solas: ver la decisión D-016 en `docs/decisiones.md`.
 */
export const officialNews: OfficialNewsItem[] = [
  {
    id: "lanzamiento-nacional-buenos-aires",
    publishedDate: "2026-08-13",
    retrievedDate: "2026-09-04",
    source: {
      name: "Diario Pregón",
      url: "https://www.pregon.com.ar/nota/30646/2026/08/el-gobernador-destaco-el-perfil-comercial-de-expojuy-2026-y-convoco-a-las-empresas",
    },
    summary:
      "El gobernador Carlos Sadir presentó ExpoJuy 2026 en Buenos Aires junto a la Cámara de Comercio Exterior de Jujuy, con la presencia de diplomáticos de Brasil, Paraguay, Chile, Bolivia, Perú y Uruguay.",
    title: "Lanzamiento nacional de ExpoJuy 2026 en Buenos Aires",
  },
  {
    id: "fecha-y-sede-confirmadas",
    publishedDate: "2026-05-20",
    retrievedDate: "2026-09-04",
    source: {
      name: "Todo Jujuy",
      url: "https://www.todojujuy.com/jujuy/expojuy-2026-ya-tiene-fecha-y-lugar-confirmado-n290445",
    },
    summary:
      "La muestra se concentra en cuatro jornadas en la Ciudad Cultural, con rondas de negocios por la mañana y exposición comercial por la tarde.",
    title: "ExpoJuy 2026 confirma fecha y sede",
  },
  {
    id: "eje-corredor-bioceanico",
    publishedDate: "2026-05-20",
    retrievedDate: "2026-09-04",
    source: {
      name: "Jujuy al Momento",
      url: "https://www.jujuyalmomento.com/expojuy/lanzaron-la-expojuy-2026-enfoque-el-comercio-internacional-y-el-corredor-bioceanico-n202133",
    },
    summary:
      "La 17° edición organiza sus rondas de negocios internacionales alrededor del Corredor Bioceánico, con participación de Argentina, Chile, Paraguay y Brasil.",
    title: "La edición 2026 se enfoca en el Corredor Bioceánico",
  },
];

/**
 * Canales donde la organización publica sus actualizaciones. El prototipo no
 * los consume: ofrece el acceso para que la persona siga la fuente vigente.
 */
export const officialChannels: OfficialNewsSource[] = [
  { name: "Instagram @expojuy", url: "https://www.instagram.com/expojuy/" },
  { name: "Facebook ExpoJuy", url: "https://www.facebook.com/expojuy/" },
  {
    name: "Cámara de Comercio Exterior de Jujuy",
    url: "https://camcomexjujuy.com.ar/",
  },
];

export const demoSponsors = [
  "Espacio para sponsors",
  "Alianzas por confirmar",
] as const;
