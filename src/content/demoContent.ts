export interface DemoSector {
  id: string;
  description: string;
  name: string;
}

export interface DemoExhibitor {
  category: string;
  description: string;
  id: string;
  name: string;
  sectorId: string;
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
  id: string;
  label: string;
  relatedInterestIds: string[];
  sectorId: string;
}

export interface DemoNewsItem {
  summary: string;
  title: string;
}

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
    exhibitors: ["Proyecto del Norte", "Red Emprende"],
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
    id: "saberes-locales",
    label: "Saberes y productos locales",
    description: "Conocé propuestas que nacen del territorio.",
    relatedInterestIds: ["innovacion", "conexiones"],
    sectorId: "produccion-local",
  },
  {
    id: "innovacion",
    label: "Innovación y tecnología",
    description: "Explorá ideas para conectar y transformar.",
    relatedInterestIds: ["saberes-locales", "conexiones"],
    sectorId: "tecnologia-aplicada",
  },
  {
    id: "conexiones",
    label: "Conexiones empresariales",
    description: "Encontrá espacios de encuentro y vinculación.",
    relatedInterestIds: ["saberes-locales", "innovacion"],
    sectorId: "vinculacion-empresarial",
  },
];

export const demoExhibitors: DemoExhibitor[] = [
  {
    id: "proyecto-del-norte",
    name: "Proyecto del Norte",
    category: "Producción local",
    description: "Una propuesta demostrativa vinculada a saberes y territorio.",
    sectorId: "produccion-local",
  },
  {
    id: "laboratorio-andino",
    name: "Laboratorio Andino",
    category: "Tecnología aplicada",
    description:
      "Un protagonista demostrativo para explorar innovación aplicada.",
    sectorId: "tecnologia-aplicada",
  },
  {
    id: "red-emprende",
    name: "Red Emprende",
    category: "Vinculación empresarial",
    description:
      "Un espacio demostrativo de encuentro entre proyectos y oportunidades.",
    sectorId: "vinculacion-empresarial",
  },
];

/**
 * Período demostrativo de la agenda. No corresponde a la programación oficial
 * de ExpoJuy 2026: sustituir estas fechas por las confirmadas no requiere
 * alterar la estructura del contenido ni la generación de calendario.
 */
export const demoAgendaPeriod = {
  endDate: "2026-09-20",
  startDate: "2026-09-18",
} as const;

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
  "Programación demostrativa de ExpoJuy 2026. Las fechas, los horarios y los lugares no están confirmados.";

export const demoAgenda: DemoAgendaItem[] = [
  {
    id: "encuentro-apertura",
    date: "2026-09-18",
    time: "10:00",
    durationMinutes: 90,
    location: "Predio ferial de demostración · Escenario central",
    title: "Encuentro de apertura",
    description: "Actividad demostrativa para abrir el recorrido productivo.",
    sectorId: "produccion-local",
  },
  {
    id: "ronda-descubrimiento",
    date: "2026-09-19",
    time: "14:00",
    durationMinutes: 120,
    location: "Predio ferial de demostración · Stands cubiertos",
    title: "Ronda de descubrimiento",
    description: "Actividad demostrativa para conocer tecnología y proyectos.",
    sectorId: "tecnologia-aplicada",
  },
  {
    id: "experiencias-ecosistema",
    date: "2026-09-20",
    time: "17:00",
    durationMinutes: 60,
    location: "Predio ferial de demostración · Espacio de vinculación",
    title: "Experiencias del ecosistema",
    description:
      "Actividad demostrativa orientada a la vinculación empresarial.",
    sectorId: "vinculacion-empresarial",
  },
];

export const demoNews: DemoNewsItem[] = [
  {
    title: "Una experiencia para explorar",
    summary: "Novedades de demostración.",
  },
  { title: "Sectores que se conectan", summary: "Contenido de demostración." },
];

export const demoSponsors = [
  "Espacio para sponsors",
  "Alianzas por confirmar",
] as const;
