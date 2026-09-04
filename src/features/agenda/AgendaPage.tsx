import { useMemo } from "react";
import { CalendarPlus } from "lucide-react";

import {
  demoAgenda,
  demoAgendaNotice,
  demoAgendaTimeZone,
  demoSectors,
  formatEventPeriod,
  officialEventPeriod,
} from "../../content/demoContent";
import {
  createCalendarLinkUrl,
  formatDuration,
} from "../../shared/calendar/calendarEvents";
import { DemoNotice } from "../../shared/ui/DemoNotice";
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

export function AgendaPage() {
  const days = useMemo(
    () => [...new Set(demoAgenda.map((item) => item.date))].sort(),
    [],
  );

  return (
    <section className={styles.agenda} aria-labelledby="agenda-title">
      <p className={styles.eyebrow}>Agenda</p>
      <h1 id="agenda-title">Planificá tu visita</h1>
      <p className={styles.confirmedPeriod}>
        <span className={styles.confirmedLabel}>Fecha confirmada</span>
        <time dateTime={officialEventPeriod.startDate}>
          {formatEventPeriod(officialEventPeriod)}
        </time>
        <span>{officialEventPeriod.venue}</span>
      </p>
      <p>
        Agregá al calendario de tu dispositivo las actividades que te interesan.
        Cada una se abre en Google Calendar para que la confirmes.
      </p>
      <DemoNotice>{demoAgendaNotice}</DemoNotice>

      {days.map((day) => (
        <div key={day}>
          <h2 className={styles.day}>{formatAgendaDate(day)}</h2>
          <ul className={styles.activityList}>
            {demoAgenda
              .filter((item) => item.date === day)
              .map((item) => {
                const sector = demoSectors.find(
                  (candidate) => candidate.id === item.sectorId,
                );

                return (
                  <li className={styles.activity} key={item.id}>
                    <div className={styles.activityText}>
                      <p className={styles.activityTime}>
                        <time dateTime={`${item.date}T${item.time}`}>
                          {item.time}
                        </time>
                        <span className={styles.duration}>
                          {formatDuration(item.durationMinutes)}
                        </span>
                      </p>
                      <h3 className={styles.activityTitle}>{item.title}</h3>
                      <p className={styles.activityMeta}>
                        {item.location}
                        {sector ? ` · ${sector.name}` : ""}
                      </p>
                      <p className={styles.activityDescription}>
                        {item.description}
                      </p>
                    </div>
                    {/* El nombre accesible identifica la actividad y describe
                        el resultado real: abre el calendario para confirmar,
                        no crea el evento. */}
                    <a
                      aria-label={`Agendar “${item.title}”: abre Google Calendar para confirmar`}
                      className={styles.scheduleAction}
                      href={createCalendarLinkUrl(
                        item,
                        demoAgendaTimeZone,
                        demoAgendaNotice,
                      )}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <CalendarPlus
                        aria-hidden="true"
                        size={18}
                        strokeWidth={1.8}
                      />
                      <span>Agendar</span>
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
