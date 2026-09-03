import { useMemo, useState } from "react";
import { CalendarPlus, Check, ExternalLink } from "lucide-react";

import {
  demoAgenda,
  demoAgendaNotice,
  demoAgendaTimeZone,
  demoSectors,
} from "../../content/demoContent";
import {
  createCalendarFile,
  createCalendarFileName,
  createCalendarLinkUrl,
  formatDuration,
} from "../../shared/calendar/calendarEvents";
import { DemoNotice } from "../../shared/ui/DemoNotice";
import { useAgendaSelection } from "./useAgendaSelection";
import styles from "./AgendaPage.module.css";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
  weekday: "long",
});

/**
 * La fecha se interpreta en UTC para que el día mostrado sea el declarado en
 * el contenido y no dependa de la zona horaria del dispositivo.
 */
function formatAgendaDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

/**
 * Entrega el archivo de calendario. El resultado visible depende de la
 * plataforma y no puede uniformarse desde la aplicación: en escritorio queda
 * como archivo descargado y en móvil la aplicación de calendario suele
 * ofrecer directamente la incorporación. Cuando la descarga por objeto binario
 * no prospera —situación conocida en algunos navegadores móviles— se recurre a
 * entregar el contenido como recurso de datos.
 */
function deliverCalendarFile(content: string, fileName: string): boolean {
  const anchor = document.createElement("a");
  anchor.download = fileName;

  try {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    anchor.href = objectUrl;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
    return true;
  } catch {
    try {
      anchor.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`;
      anchor.click();
      return true;
    } catch {
      return false;
    }
  }
}

export function AgendaPage() {
  const availableIds = useMemo(() => demoAgenda.map((item) => item.id), []);
  const { selectedIds, toggle } = useAgendaSelection(availableIds);
  const [status, setStatus] = useState("");

  const selectedItems = demoAgenda.filter((item) =>
    selectedIds.includes(item.id),
  );
  const days = useMemo(
    () => [...new Set(demoAgenda.map((item) => item.date))].sort(),
    [],
  );

  function handleAddSelection() {
    const fileName = createCalendarFileName(selectedItems.length);
    const content = createCalendarFile(
      {
        events: selectedItems,
        generatedAt: new Date(),
        timeZone: demoAgendaTimeZone,
      },
      demoAgendaNotice,
    );

    const delivered = deliverCalendarFile(content, fileName);
    const activities =
      selectedItems.length === 1
        ? "1 actividad"
        : `${selectedItems.length} actividades`;

    // El mensaje describe lo que se generó y el paso siguiente. La creación del
    // evento la confirma la persona en su aplicación de calendario, de modo que
    // el prototipo no puede darla por hecha.
    setStatus(
      delivered
        ? `Se generó el archivo ${fileName} con ${activities}. Abrilo para que tu aplicación de calendario incorpore los eventos.`
        : "No se pudo generar el archivo en este navegador. Podés agendar cada actividad por separado con su acceso al calendario.",
    );
  }

  return (
    <section className={styles.agenda} aria-labelledby="agenda-title">
      <p className={styles.eyebrow}>Agenda</p>
      <h1 id="agenda-title">Planificá tu visita</h1>
      <p>
        Elegí las actividades que te interesan y agregalas al calendario de tu
        dispositivo. La selección se guarda solo en este navegador.
      </p>
      <DemoNotice>{demoAgendaNotice}</DemoNotice>

      <div className={styles.summary}>
        <p className={styles.count}>
          {selectedItems.length === 0
            ? "Ninguna actividad seleccionada"
            : `${selectedItems.length} de ${demoAgenda.length} actividades seleccionadas`}
        </p>
        <button
          className={styles.primaryAction}
          disabled={selectedItems.length === 0}
          onClick={handleAddSelection}
          type="button"
        >
          <CalendarPlus aria-hidden="true" size={18} strokeWidth={1.8} />
          <span>
            {selectedItems.length > 1
              ? `Agendar las ${selectedItems.length} seleccionadas`
              : "Agendar la selección"}
          </span>
        </button>
        {selectedItems.length === 0 ? (
          <p className={styles.hint}>
            Seleccioná al menos una actividad para agendarlas juntas.
          </p>
        ) : null}
      </div>

      <p aria-live="polite" className={styles.status}>
        {status}
      </p>

      {days.map((day) => (
        <div key={day}>
          <h2 className={styles.day}>{formatAgendaDate(day)}</h2>
          <ul className={styles.activityList}>
            {demoAgenda
              .filter((item) => item.date === day)
              .map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const sector = demoSectors.find(
                  (candidate) => candidate.id === item.sectorId,
                );

                return (
                  <li className={styles.activity} key={item.id}>
                    <button
                      aria-pressed={isSelected}
                      className={styles.selectControl}
                      onClick={() => toggle(item.id)}
                      type="button"
                    >
                      <span aria-hidden="true" className={styles.marker}>
                        {isSelected ? (
                          <Check size={16} strokeWidth={2.5} />
                        ) : null}
                      </span>
                      <span className={styles.activityText}>
                        <span className={styles.activityTime}>
                          <time dateTime={`${item.date}T${item.time}`}>
                            {item.time}
                          </time>
                          <span className={styles.duration}>
                            {formatDuration(item.durationMinutes)}
                          </span>
                        </span>
                        <span className={styles.activityTitle}>
                          {item.title}
                        </span>
                        <span className={styles.activityMeta}>
                          {item.location}
                          {sector ? ` · ${sector.name}` : ""}
                        </span>
                        <span className={styles.activityState}>
                          {isSelected ? "Seleccionada" : "Sin seleccionar"}
                        </span>
                      </span>
                    </button>
                    <a
                      className={styles.linkAction}
                      href={createCalendarLinkUrl(
                        item,
                        demoAgendaTimeZone,
                        demoAgendaNotice,
                      )}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <ExternalLink
                        aria-hidden="true"
                        size={15}
                        strokeWidth={1.8}
                      />
                      <span>Agendar “{item.title}” en Google Calendar</span>
                    </a>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
    </section>
  );
}
