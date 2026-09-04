import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  demoExhibitors,
  venueMapReferences,
  venueMapZones,
} from "../../content/demoContent";
import { routePaths } from "../../navigation/routePaths";
import { DemoNotice } from "../../shared/ui/DemoNotice";
import venueAerial from "../../assets/map/venue-aerial.png";
import { useConnectionRoute } from "../connection-route/useConnectionRoute";
import styles from "./VenueMapPage.module.css";

export function VenueMapPage() {
  const { actorIds } = useConnectionRoute();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedZoneId, setSelectedZoneId] = useState(venueMapZones[0].id);
  const [hasSelectedZoneManually, setHasSelectedZoneManually] = useState(false);
  const routeExhibitors = useMemo(
    () =>
      actorIds.flatMap((actorId) => {
        const exhibitor = demoExhibitors.find(
          (candidate) => candidate.id === actorId,
        );

        return exhibitor ? [exhibitor] : [];
      }),
    [actorIds],
  );
  const routeZones = useMemo(
    () =>
      venueMapZones.filter((zone) =>
        routeExhibitors.some((exhibitor) => exhibitor.venueZoneId === zone.id),
      ),
    [routeExhibitors],
  );
  const routeZoneIds = new Set(routeZones.map((zone) => zone.id));
  const requestedZoneId = searchParams.get("zone");
  const isRequestedZoneValid = venueMapZones.some(
    (zone) => zone.id === requestedZoneId,
  );
  const displayedZoneId =
    isRequestedZoneValid && requestedZoneId
      ? requestedZoneId
      : hasSelectedZoneManually || routeZones.length === 0
        ? selectedZoneId
        : routeZones[0].id;
  const selectedZone = venueMapZones.find(
    (zone) => zone.id === displayedZoneId,
  )!;

  function selectZone(zoneId: string) {
    setSelectedZoneId(zoneId);
    setHasSelectedZoneManually(true);

    if (requestedZoneId) {
      const nextParams = new URLSearchParams(searchParams);

      nextParams.delete("zone");
      setSearchParams(nextParams, { replace: true });
    }
  }

  return (
    <section className={styles.mapPage} aria-labelledby="map-title">
      <p className={styles.eyebrow}>Mapa del predio</p>
      <h1 id="map-title">Explorá la Expo por zonas</h1>
      <p>
        Seleccioná una zona para conocer las propuestas demostrativas asociadas.
      </p>
      <DemoNotice>Mapa y expositores de demostración</DemoNotice>
      {routeExhibitors.length > 0 ? (
        <section
          className={styles.routePanel}
          aria-labelledby="route-map-title"
        >
          <div>
            <p className={styles.eyebrow}>Ruta de conexiones</p>
            <h2 id="route-map-title">Zonas de tu recorrido</h2>
            <p>
              El mapa destaca las zonas demostrativas relacionadas con los
              protagonistas que elegiste. Podés seguir explorando el predio.
            </p>
          </div>
          <ul>
            {routeExhibitors.map((exhibitor) => {
              const zone = venueMapZones.find(
                (candidate) => candidate.id === exhibitor.venueZoneId,
              );

              return (
                <li key={exhibitor.id}>
                  <strong>{exhibitor.name}</strong>
                  <span>{zone?.label ?? "Zona de demostración"}</span>
                </li>
              );
            })}
          </ul>
          <Link to={routePaths.exhibitors}>Editar Ruta de conexiones</Link>
        </section>
      ) : null}
      <div className={styles.layout}>
        <div className={styles.zoneList} aria-label="Zonas del plano">
          {venueMapZones.map((zone) => (
            <button
              aria-pressed={zone.id === displayedZoneId}
              data-kind={zone.kind}
              data-in-route={routeZoneIds.has(zone.id) || undefined}
              key={zone.id}
              onClick={() => selectZone(zone.id)}
              type="button"
            >
              {zone.label}
            </button>
          ))}
        </div>
        <div className={styles.planViewport}>
          <div className={styles.planWrap}>
            <img
              alt="Vista aérea demostrativa del predio de ExpoJuy 2026"
              src={venueAerial}
            />
            {venueMapZones.flatMap((zone) =>
              zone.areas.map((area, index) => (
                <button
                  aria-label={zone.label}
                  aria-pressed={zone.id === displayedZoneId}
                  className={styles.hotspot}
                  data-kind={zone.kind}
                  data-in-route={routeZoneIds.has(zone.id) || undefined}
                  data-selected={zone.id === displayedZoneId}
                  key={`${zone.id}-${index}`}
                  onClick={() => selectZone(zone.id)}
                  style={{
                    left: `${area.left}%`,
                    top: `${area.top}%`,
                    transform: `rotate(${area.rotation ?? 0}deg)`,
                    width: `${area.width}%`,
                    height: `${area.height}%`,
                  }}
                  type="button"
                />
              )),
            )}
            {venueMapReferences.map((reference) => (
              <span
                aria-hidden="true"
                className={styles.reference}
                key={reference.id}
                style={{
                  left: `${reference.left}%`,
                  top: `${reference.top}%`,
                  transform: `rotate(${reference.rotation ?? 0}deg)`,
                  width: `${reference.width}%`,
                  height: `${reference.height}%`,
                }}
              >
                {reference.label}
              </span>
            ))}
          </div>
        </div>
        <div aria-label="Referencias de color" className={styles.legend}>
          {venueMapZones.map((zone) => (
            <span data-kind={zone.kind} key={zone.id}>
              <i aria-hidden="true" />
              {zone.label}
            </span>
          ))}
        </div>
      </div>
      <article aria-live="polite" className={styles.detail}>
        <p className={styles.eyebrow}>Zona seleccionada</p>
        <h2>{selectedZone.label}</h2>
        <p>{selectedZone.description}</p>
        {selectedZone.exhibitors.length > 0 ? (
          <ul>
            {selectedZone.exhibitors.map((exhibitor) => (
              <li key={exhibitor}>{exhibitor}</li>
            ))}
          </ul>
        ) : (
          <p>Esta zona reúne actividades de demostración.</p>
        )}
      </article>
    </section>
  );
}
