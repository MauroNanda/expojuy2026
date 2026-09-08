import {
  ArrowUpRight,
  CalendarDays,
  MapPinned,
  Route as RouteIcon,
} from "lucide-react";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  demoAgenda,
  demoExhibitors,
  demoSectors,
  venueMapZones,
} from "../../content/demoContent";
import { routePaths } from "../../navigation/routePaths";
import { DemoNotice } from "../../shared/ui/DemoNotice";
import { ConnectionRouteSummary } from "../connection-route/ConnectionRouteSummary";
import { useConnectionRoute } from "../connection-route/useConnectionRoute";
import styles from "./ExhibitorDirectoryPage.module.css";

const allSectorsId = "todos";

export function ExhibitorDirectoryPage() {
  const { actorIds, addActor, removeActor } = useConnectionRoute();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSectorId = searchParams.get("sector") ?? allSectorsId;
  const selectedSectorId = demoSectors.some(
    (sector) => sector.id === requestedSectorId,
  )
    ? requestedSectorId
    : allSectorsId;
  const requestedActorId = searchParams.get("actor");

  const visibleExhibitors = useMemo(
    () =>
      selectedSectorId === allSectorsId
        ? demoExhibitors
        : demoExhibitors.filter(
            (exhibitor) => exhibitor.sectorId === selectedSectorId,
          ),
    [selectedSectorId],
  );
  const selectedExhibitor =
    visibleExhibitors.find((exhibitor) => exhibitor.id === requestedActorId) ??
    visibleExhibitors[0];
  const selectedActivity = demoAgenda.find(
    (activity) => activity.id === selectedExhibitor?.agendaItemId,
  );
  const selectedZone = venueMapZones.find(
    (zone) => zone.id === selectedExhibitor?.venueZoneId,
  );
  const isSelectedForRoute = actorIds.includes(selectedExhibitor?.id ?? "");

  function updateSelection(sectorId: string, actorId?: string) {
    const nextParams = new URLSearchParams();

    if (sectorId !== allSectorsId) {
      nextParams.set("sector", sectorId);
    }
    if (actorId) {
      nextParams.set("actor", actorId);
    }

    setSearchParams(nextParams);
  }

  return (
    <section className={styles.directory} aria-labelledby="exhibitors-name">
      <div className={styles.intro}>
        <p id="exhibitors-name" className={styles.eyebrow}>
          Expositores
        </p>
        <h1 id="exhibitors-title">Encontrá quién activa cada recorrido.</h1>
        <p>
          Explorá protagonistas de demostración y seguí sus conexiones con un
          sector, una actividad y una zona del predio.
        </p>
        <DemoNotice>
          Expositores y relaciones de demostración; información no confirmada.
        </DemoNotice>
      </div>

      <div
        className={styles.filters}
        aria-label="Filtrar expositores por sector"
      >
        <p>Elegí un sector</p>
        <div>
          <button
            aria-pressed={selectedSectorId === allSectorsId}
            onClick={() => updateSelection(allSectorsId)}
            type="button"
          >
            Todos
          </button>
          {demoSectors.map((sector) => (
            <button
              aria-pressed={selectedSectorId === sector.id}
              key={sector.id}
              onClick={() => updateSelection(sector.id)}
              type="button"
            >
              {sector.name}
            </button>
          ))}
        </div>
      </div>

      <ConnectionRouteSummary />

      <div className={styles.layout}>
        <nav aria-label="Expositores disponibles" className={styles.index}>
          <p className={styles.indexLabel}>
            {visibleExhibitors.length} protagonista
            {visibleExhibitors.length === 1 ? "" : "s"} para explorar
          </p>
          <ul>
            {visibleExhibitors.map((exhibitor) => {
              const sector = demoSectors.find(
                (candidate) => candidate.id === exhibitor.sectorId,
              );
              const isSelected = exhibitor.id === selectedExhibitor?.id;

              return (
                <li key={exhibitor.id}>
                  <button
                    aria-current={isSelected ? "true" : undefined}
                    onClick={() =>
                      updateSelection(selectedSectorId, exhibitor.id)
                    }
                    type="button"
                  >
                    <span>{sector?.name}</span>
                    <strong>{exhibitor.name}</strong>
                    <ArrowUpRight aria-hidden="true" size={18} />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {selectedExhibitor ? (
          <article aria-live="polite" className={styles.profile}>
            <p className={styles.eyebrow}>Protagonista de demostración</p>
            <h2>{selectedExhibitor.name}</h2>
            <p className={styles.category}>{selectedExhibitor.category}</p>
            <p className={styles.description}>
              {selectedExhibitor.description}
            </p>

            <dl className={styles.connections}>
              <div>
                <dt>Sector</dt>
                <dd>
                  {demoSectors.find(
                    (sector) => sector.id === selectedExhibitor.sectorId,
                  )?.name ?? "Sector de demostración"}
                </dd>
              </div>
              {selectedActivity ? (
                <div>
                  <dt>Actividad relacionada</dt>
                  <dd>{selectedActivity.title}</dd>
                </div>
              ) : null}
              {selectedZone ? (
                <div>
                  <dt>Zona del predio</dt>
                  <dd>{selectedZone.label}</dd>
                </div>
              ) : null}
            </dl>

            <div className={styles.actions}>
              <button
                aria-pressed={isSelectedForRoute}
                className={styles.routeAction}
                onClick={() => {
                  if (isSelectedForRoute) {
                    removeActor(selectedExhibitor.id);
                    return;
                  }

                  addActor(selectedExhibitor.id);
                }}
                type="button"
              >
                <RouteIcon aria-hidden="true" size={18} />
                {isSelectedForRoute
                  ? "Quitar del recorrido"
                  : "Sumar al recorrido"}
              </button>
              {selectedActivity ? (
                <Link to={routePaths.agenda}>
                  <CalendarDays aria-hidden="true" size={18} /> Ver actividad
                </Link>
              ) : null}
              {selectedZone ? (
                <Link to={`${routePaths.map}?zone=${selectedZone.id}`}>
                  <MapPinned aria-hidden="true" size={18} /> Ver{" "}
                  {selectedZone.label} en Mapa
                </Link>
              ) : null}
            </div>
          </article>
        ) : (
          <p className={styles.empty}>
            No encontramos expositores para este sector de demostración.
          </p>
        )}
      </div>
    </section>
  );
}
