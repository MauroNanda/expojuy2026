import { CalendarDays, MapPinned, Route as RouteIcon, X } from "lucide-react";
import { Link } from "react-router-dom";

import {
  demoAgenda,
  demoExhibitors,
  demoSectors,
  venueMapZones,
} from "../../content/demoContent";
import { routePaths } from "../../navigation/routePaths";
import { DemoNotice } from "../../shared/ui/DemoNotice";
import { useConnectionRoute } from "./useConnectionRoute";
import styles from "./ConnectionRouteSummary.module.css";

export function ConnectionRouteSummary() {
  const { actorIds, announcement, clearRoute, removeActor } =
    useConnectionRoute();
  const selectedExhibitors = actorIds.flatMap((actorId) => {
    const exhibitor = demoExhibitors.find(
      (candidate) => candidate.id === actorId,
    );

    return exhibitor ? [exhibitor] : [];
  });

  return (
    <aside className={styles.route} aria-labelledby="connection-route-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Tu recorrido</p>
          <h2 id="connection-route-title">
            <RouteIcon aria-hidden="true" size={20} /> Ruta de conexiones
          </h2>
        </div>
      </div>
      <p aria-live="polite" className={styles.status} role="status">
        {announcement}
      </p>

      {selectedExhibitors.length === 0 ? (
        <p className={styles.empty}>
          Sumá hasta tres protagonistas para ver cómo se conectan sus sectores,
          actividades y zonas del predio.
        </p>
      ) : (
        <>
          <DemoNotice className={styles.demoNotice}>
            Recorrido temporal de demostración
          </DemoNotice>
          <Link className={styles.mapAction} to={routePaths.map}>
            <MapPinned aria-hidden="true" size={18} /> Ver mi recorrido en el
            mapa
          </Link>
          <ol className={styles.entries}>
            {selectedExhibitors.map((exhibitor, index) => {
              const sector = demoSectors.find(
                (candidate) => candidate.id === exhibitor.sectorId,
              );
              const activity = demoAgenda.find(
                (candidate) => candidate.id === exhibitor.agendaItemId,
              );
              const zone = venueMapZones.find(
                (candidate) => candidate.id === exhibitor.venueZoneId,
              );

              return (
                <li key={exhibitor.id}>
                  <div className={styles.entryHeader}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{exhibitor.name}</strong>
                      <p>{sector?.name ?? "Sector de demostración"}</p>
                    </div>
                    <button
                      aria-label={`Quitar ${exhibitor.name} del recorrido`}
                      onClick={() => removeActor(exhibitor.id)}
                      type="button"
                    >
                      <X aria-hidden="true" size={18} />
                    </button>
                  </div>
                  <dl>
                    {activity ? (
                      <div>
                        <dt>Actividad</dt>
                        <dd>{activity.title}</dd>
                      </div>
                    ) : null}
                    {zone ? (
                      <div>
                        <dt>Zona</dt>
                        <dd>{zone.label}</dd>
                      </div>
                    ) : null}
                  </dl>
                  <div className={styles.entryActions}>
                    {activity ? (
                      <Link to={routePaths.agenda}>
                        <CalendarDays aria-hidden="true" size={16} /> Ver
                        actividad
                      </Link>
                    ) : null}
                    {zone ? (
                      <Link to={`${routePaths.map}?zone=${zone.id}`}>
                        <MapPinned aria-hidden="true" size={16} /> Ver{" "}
                        {zone.label} en Mapa
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
          <button
            className={styles.clearAction}
            onClick={clearRoute}
            type="button"
          >
            Vaciar ruta
          </button>
        </>
      )}
    </aside>
  );
}
