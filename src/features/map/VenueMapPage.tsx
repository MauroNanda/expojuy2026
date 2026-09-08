import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, FileDown, Loader2, MapPinned } from "lucide-react";

import {
  demoAgenda,
  demoExhibitors,
  demoSectors,
  venueMapReferences,
  venueMapZones,
} from "../../content/demoContent";
import { routePaths } from "../../navigation/routePaths";
import { DemoNotice } from "../../shared/ui/DemoNotice";
import venueAerial from "../../assets/map/venue-aerial.png";
import { useConnectionRoute } from "../connection-route/useConnectionRoute";
import {
  createConnectionRouteSnapshot,
  officialGoogleMapsDirectionsUrl,
} from "../connection-route/connectionRouteExportModel.ts";
import styles from "./VenueMapPage.module.css";

export function VenueMapPage() {
  const { actorIds } = useConnectionRoute();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedZoneId, setSelectedZoneId] = useState(venueMapZones[0].id);
  const [hasSelectedZoneManually, setHasSelectedZoneManually] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<string>("");

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

  async function handleDownloadPdf() {
    if (isGeneratingPdf || routeExhibitors.length === 0) {
      return;
    }

    setIsGeneratingPdf(true);
    setExportError(null);
    setExportStatus("Generando recorrido en PDF...");

    try {
      // 1. Instantánea síncrona tomada al momento de la acción
      const snapshot = createConnectionRouteSnapshot(actorIds);
      if (!snapshot.isValid) {
        throw new Error(
          snapshot.emptyReason ?? "No hay protagonistas válidos en el recorrido.",
        );
      }

      // 2. Carga diferida del servicio PDF
      const { downloadRoutePdf } = await import(
        "../connection-route/connectionRoutePdfService.ts"
      );
      await downloadRoutePdf(snapshot);

      setExportStatus("Recorrido generado y descargado con éxito.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al generar el PDF. Por favor reintentá.";
      setExportError(message);
      setExportStatus("Error al generar el PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  return (
    <section className={styles.mapPage} aria-labelledby="map-name">
      <p id="map-name" className={styles.eyebrow}>
        Mapa
      </p>
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
              protagonistas que elegiste. Podés seguir explorando el predio o
              descargar tu itinerario para llevarlo con vos.
            </p>
          </div>
          <ul>
            {routeExhibitors.map((exhibitor, index) => {
              const sector = demoSectors.find(
                (candidate) => candidate.id === exhibitor.sectorId,
              );
              const zone = venueMapZones.find(
                (candidate) => candidate.id === exhibitor.venueZoneId,
              );
              const activity = demoAgenda.find(
                (candidate) => candidate.id === exhibitor.agendaItemId,
              );
              const num = String(index + 1).padStart(2, "0");

              return (
                <li key={exhibitor.id}>
                  <div className={styles.routeHeader}>
                    <span className={styles.routeIndexBadge}>{num}</span>
                    <strong>{exhibitor.name}</strong>
                  </div>
                  <span>{sector?.name ?? "Sector de demostración"}</span>
                  <span>{zone?.label ?? "Zona de demostración"}</span>
                  {activity ? (
                    <span className={styles.activityNotice}>
                      Actividad: {activity.title}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <div className={styles.actionsGroup}>
            <button
              aria-busy={isGeneratingPdf}
              className={styles.downloadButton}
              disabled={isGeneratingPdf}
              onClick={handleDownloadPdf}
              type="button"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 aria-hidden="true" className={styles.spinner} size={18} />
                  <span>Generando recorrido en PDF...</span>
                </>
              ) : (
                <>
                  <FileDown aria-hidden="true" size={18} />
                  <span>Descargar recorrido (PDF)</span>
                </>
              )}
            </button>
            <a
              className={styles.mapsAction}
              href={officialGoogleMapsDirectionsUrl}
              rel="noreferrer noopener"
              target="_blank"
            >
              <MapPinned aria-hidden="true" size={17} />
              <span>¿Cómo llegar al predio? (Google Maps)</span>
            </a>
            <Link className={styles.editAction} to={routePaths.exhibitors}>
              Editar Ruta de conexiones
            </Link>
          </div>
          {exportStatus ? (
            <p aria-live="polite" className={styles.exportStatus} role="status">
              {exportStatus}
            </p>
          ) : null}
          {exportError ? (
            <div className={styles.errorBanner} role="alert">
              <AlertCircle aria-hidden="true" size={18} />
              <span>{exportError}</span>
              <button onClick={handleDownloadPdf} type="button">
                Reintentar descarga
              </button>
            </div>
          ) : null}
        </section>
      ) : (
        <div className={styles.emptyRouteNotice}>
          <p>
            ¿Querés armar tu itinerario? Elegí hasta 3 protagonistas en{" "}
            <Link to={routePaths.exhibitors}>Expositores</Link> para destacarlos
            en el mapa y descargar tu recorrido.
          </p>
          <a
            className={styles.mapsAction}
            href={officialGoogleMapsDirectionsUrl}
            rel="noreferrer noopener"
            target="_blank"
          >
            <MapPinned aria-hidden="true" size={16} />
            <span>¿Cómo llegar a Ciudad Cultural en Google Maps?</span>
          </a>
        </div>
      )}
      <div className={styles.layout}>
        <div className={styles.zoneList} aria-label="Zonas del plano">
          {venueMapZones.map((zone) => {
            const matchingNumbers = routeExhibitors
              .map((exhibitor, idx) => ({
                exhibitor,
                num: String(idx + 1).padStart(2, "0"),
              }))
              .filter(({ exhibitor }) => exhibitor.venueZoneId === zone.id)
              .map((item) => item.num);

            return (
              <button
                aria-pressed={zone.id === displayedZoneId}
                data-kind={zone.kind}
                data-in-route={routeZoneIds.has(zone.id) || undefined}
                key={zone.id}
                onClick={() => selectZone(zone.id)}
                type="button"
              >
                <span>{zone.label}</span>
                {matchingNumbers.length > 0 ? (
                  <span
                    aria-label={`Parada ${matchingNumbers.join(", ")}`}
                    className={styles.zoneNumberBadge}
                  >
                    {matchingNumbers.join(", ")}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <div className={styles.planViewport}>
          <div className={styles.planWrap}>
            <img
              alt="Vista aérea demostrativa del predio de ExpoJuy 2026"
              src={venueAerial}
            />
            {venueMapZones.flatMap((zone) => {
              const matchingNumbers = routeExhibitors
                .map((exhibitor, idx) => ({
                  exhibitor,
                  num: String(idx + 1).padStart(2, "0"),
                }))
                .filter(({ exhibitor }) => exhibitor.venueZoneId === zone.id)
                .map((item) => item.num);
              const badgeText = matchingNumbers.join(", ");

              return zone.areas.map((area, index) => {
                const showBadge = index === 0 && badgeText.length > 0;

                return (
                  <button
                    aria-label={
                      showBadge
                        ? `${zone.label} (Parada ${badgeText})`
                        : zone.label
                    }
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
                  >
                    {showBadge ? (
                      <span
                        aria-hidden="true"
                        className={styles.pinBadge}
                        style={{
                          transform: area.rotation
                            ? `rotate(${-area.rotation}deg)`
                            : undefined,
                        }}
                      >
                        {badgeText}
                      </span>
                    ) : null}
                  </button>
                );
              });
            })}
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
