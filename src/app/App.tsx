import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { AgendaPage } from "../features/agenda/AgendaPage";
import { ConnectionRouteProvider } from "../features/connection-route/ConnectionRouteProvider";
import { ExhibitorDirectoryPage } from "../features/exhibitors/ExhibitorDirectoryPage";
import { AugmentedRealityPage } from "../features/ar/AugmentedRealityPage";
import { HomePage } from "../features/home/HomePage";
import { NewsPage } from "../features/news/NewsPage";
import { VenueMapPage } from "../features/map/VenueMapPage";
import { TicketDialog } from "../features/tickets/TicketDialog";
import { routePaths } from "../navigation/routePaths";
import { ApplicationShell } from "../shared/ui/ApplicationShell";

export function App() {
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  return (
    <ConnectionRouteProvider>
      <ApplicationShell onOpenTickets={() => setIsTicketDialogOpen(true)}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage onOpenTickets={() => setIsTicketDialogOpen(true)} />
            }
          />
          <Route path={routePaths.agenda} element={<AgendaPage />} />
          <Route
            path={routePaths.exhibitors}
            element={<ExhibitorDirectoryPage />}
          />
          <Route path={routePaths.map} element={<VenueMapPage />} />
          <Route
            path={routePaths.realityAugmented}
            element={<AugmentedRealityPage />}
          />
          <Route path={routePaths.news} element={<NewsPage />} />
        </Routes>
        <TicketDialog
          isOpen={isTicketDialogOpen}
          onClose={() => setIsTicketDialogOpen(false)}
        />
      </ApplicationShell>
    </ConnectionRouteProvider>
  );
}
