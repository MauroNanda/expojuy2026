import { useState } from "react";

import { venueMapReferences, venueMapZones } from "../../content/demoContent";
import { DemoNotice } from "../../shared/ui/DemoNotice";
import venueAerial from "../../assets/map/venue-aerial.png";
import styles from "./VenueMapPage.module.css";

export function VenueMapPage() {
  const [selectedZoneId, setSelectedZoneId] = useState(venueMapZones[0].id);
  const selectedZone = venueMapZones.find(
    (zone) => zone.id === selectedZoneId,
  )!;

  return (
    <section className={styles.mapPage} aria-labelledby="map-title">
      <p className={styles.eyebrow}>Mapa del predio</p>
      <h1 id="map-title">Explorá la Expo por zonas</h1>
      <p>
        Seleccioná una zona para conocer las propuestas demostrativas asociadas.
      </p>
      <DemoNotice>Mapa y expositores de demostración</DemoNotice>
      <div className={styles.layout}>
        <div className={styles.zoneList} aria-label="Zonas del plano">
          {venueMapZones.map((zone) => (
            <button
              aria-pressed={zone.id === selectedZoneId}
              data-kind={zone.kind}
              key={zone.id}
              onClick={() => setSelectedZoneId(zone.id)}
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
                  aria-pressed={zone.id === selectedZoneId}
                  className={styles.hotspot}
                  data-kind={zone.kind}
                  data-selected={zone.id === selectedZoneId}
                  key={`${zone.id}-${index}`}
                  onClick={() => setSelectedZoneId(zone.id)}
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
