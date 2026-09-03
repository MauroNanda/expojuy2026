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
  description: string;
  id: string;
  sectorId: string;
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

export const demoAgenda: DemoAgendaItem[] = [
  {
    id: "encuentro-apertura",
    time: "10:00",
    title: "Encuentro de apertura",
    description: "Actividad demostrativa para abrir el recorrido productivo.",
    sectorId: "produccion-local",
  },
  {
    id: "ronda-descubrimiento",
    time: "14:00",
    title: "Ronda de descubrimiento",
    description: "Actividad demostrativa para conocer tecnología y proyectos.",
    sectorId: "tecnologia-aplicada",
  },
  {
    id: "experiencias-ecosistema",
    time: "17:00",
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
