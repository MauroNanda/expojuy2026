import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { EntryPage } from "../features/entry/EntryPage";
import { HomePage } from "../features/home/HomePage";
import { VenueMapPage } from "../features/map/VenueMapPage";
import { TicketDialog } from "../features/tickets/TicketDialog";
import { routePaths } from "../navigation/routePaths";
import { ApplicationShell } from "../shared/ui/ApplicationShell";

const entries = {
  [routePaths.exhibitors]: {
    title: "Expositores",
    description:
      "La exploración de expositores se construirá sobre contenido oficial.",
  },
  [routePaths.agenda]: {
    title: "Agenda",
    description:
      "La agenda se habilitará cuando exista una programación confirmada.",
  },
  [routePaths.news]: {
    title: "Noticias",
    description:
      "Las novedades oficiales se incorporarán en un módulo específico.",
  },
  [routePaths.realityAugmented]: {
    title: "Experiencia RA",
    description:
      "No se activa cámara en este prototipo. La integración de MindAR, A-Frame y Three.js se definirá en un change específico.",
  },
} as const;

export function App() {
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  return (
    <ApplicationShell onOpenTickets={() => setIsTicketDialogOpen(true)}>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage onOpenTickets={() => setIsTicketDialogOpen(true)} />
          }
        />
        <Route path={routePaths.map} element={<VenueMapPage />} />
        {Object.entries(entries).map(([path, entry]) => (
          <Route key={path} path={path} element={<EntryPage {...entry} />} />
        ))}
      </Routes>
      <TicketDialog
        isOpen={isTicketDialogOpen}
        onClose={() => setIsTicketDialogOpen(false)}
      />
    </ApplicationShell>
  );
}
