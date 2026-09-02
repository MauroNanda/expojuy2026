export interface DemoSector {
  description: string;
  name: string;
}

export interface DemoExhibitor {
  category: string;
  name: string;
}

export interface DemoAgendaItem {
  time: string;
  title: string;
}

export interface DemoNewsItem {
  summary: string;
  title: string;
}

export const demoSectors: DemoSector[] = [
  { name: "Producción local", description: "Saberes, productos y territorio." },
  {
    name: "Tecnología aplicada",
    description: "Ideas para conectar y transformar.",
  },
  {
    name: "Vinculación empresarial",
    description: "Encuentros entre proyectos y oportunidades.",
  },
];

export const demoExhibitors: DemoExhibitor[] = [
  { name: "Proyecto del Norte", category: "Producción" },
  { name: "Laboratorio Andino", category: "Tecnología" },
  { name: "Red Emprende", category: "Vinculación" },
];

export const demoAgenda: DemoAgendaItem[] = [
  { time: "10:00", title: "Encuentro de apertura" },
  { time: "14:00", title: "Ronda de descubrimiento" },
  { time: "17:00", title: "Experiencias del ecosistema" },
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
