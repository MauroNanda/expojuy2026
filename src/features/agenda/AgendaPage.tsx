import { CalendarPlus, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  demoAgenda,
  demoAgendaNotice,
  demoAgendaTimeZone,
  demoExhibitors,
  demoSectors,
  formatEventPeriod,
  officialEventPeriod,
} from "../../content/demoContent";
import { routePaths } from "../../navigation/routePaths";
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
function formatAgendaDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}
function formatAgendaDayButton(date: string) {
  const [, month, day] = date.split("-");
  return `${Number(day)}/${Number(month)}`;
}
function getActivityContext(id: string) {
  const contexts: Record<string, string> = {
    "encuentro-apertura":
      "Un comienzo para reconocer oficios, productos y las personas que los ponen en circulación.",
    "laboratorio-abierto":
      "Una demostración para observar cómo una idea técnica se convierte en una solución concreta.",
    "mesa-de-origen":
      "Una mesa para acercarse a los saberes y productos que nacen del territorio.",
    "ronda-descubrimiento":
      "Un intercambio guiado para acercarse a tecnologías aplicadas y proyectos que buscan conexión.",
    "experiencias-ecosistema":
      "Una conversación demostrativa para encontrar puntos de contacto entre proyectos, empresas y oportunidades.",
    "ronda-de-negocios":
      "Un espacio para reconocer afinidades y posibles vínculos entre proyectos productivos.",
    "cierre-de-recorrido":
      "Una instancia para reunir aprendizajes y conexiones de la visita.",
    "visita-de-sintesis":
      "Una síntesis breve para ordenar hallazgos y próximos contactos después del recorrido.",
  };
  return (
    contexts[id] ??
    "Una actividad demostrativa para recorrer la Expo con contexto y orientación."
  );
}

export function AgendaPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const days = useMemo(() => {
    const dates: string[] = [];
    const current = new Date(`${officialEventPeriod.startDate}T00:00:00Z`);
    const end = new Date(`${officialEventPeriod.endDate}T00:00:00Z`);
    while (current <= end) {
      dates.push(current.toISOString().slice(0, 10));
      current.setUTCDate(current.getUTCDate() + 1);
    }
    return dates;
  }, []);
  const requestedDay = searchParams.get("day") ?? "todos";
  const selectedDay =
    requestedDay === "todos" || days.includes(requestedDay)
      ? requestedDay
      : "todos";
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const visibleItems = demoAgenda
    .filter((item) => selectedDay === "todos" || item.date === selectedDay)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const groupedItems =
    selectedDay === "todos"
      ? days.map((day) => ({
          day,
          items: visibleItems.filter((item) => item.date === day),
        }))
      : [{ day: selectedDay, items: visibleItems }];
  function selectDay(day: string) {
    const next = new URLSearchParams(searchParams);
    if (day === "todos") next.delete("day");
    else next.set("day", day);
    if (next.toString() === searchParams.toString()) return;
    navigate({
      pathname: location.pathname,
      search: next.toString(),
      hash: location.hash,
    });
  }

  return (
    <section className={styles.agenda} aria-labelledby="agenda-name">
      <p id="agenda-name" className={styles.eyebrow}>
        Agenda
      </p>
      <h1 id="agenda-title">Un día en la Expo</h1>
      <p className={styles.lead}>
        Elegí una jornada y seguí el ritmo de experiencias que conectan
        personas, proyectos y territorio.
      </p>
      <p className={styles.confirmedPeriod}>
        <span className={styles.confirmedLabel}>Fecha confirmada</span>
        <time dateTime={officialEventPeriod.startDate}>
          {formatEventPeriod(officialEventPeriod)}
        </time>
        <span>{officialEventPeriod.venue}</span>
      </p>
      <DemoNotice>{demoAgendaNotice}</DemoNotice>
      <nav
        className={styles.daySelector}
        aria-label="Seleccionar día de Agenda"
      >
        <button
          type="button"
          aria-pressed={selectedDay === "todos"}
          className={
            selectedDay === "todos" ? styles.dayButtonActive : styles.dayButton
          }
          onClick={() => selectDay("todos")}
        >
          Todos
        </button>
        {days.map((day) => (
          <button
            type="button"
            aria-pressed={selectedDay === day}
            className={
              selectedDay === day ? styles.dayButtonActive : styles.dayButton
            }
            onClick={() => selectDay(day)}
            aria-label={`Mostrar agenda del ${formatAgendaDate(day)}`}
            key={day}
          >
            {formatAgendaDayButton(day)}
          </button>
        ))}
      </nav>
      {visibleItems.length === 0 ? (
        <p className={styles.empty}>
          No hay actividades demostrativas para esta selección. Probá con
          “Todos” para consultar la programación disponible.
        </p>
      ) : (
        <div className={styles.timeline}>
          {groupedItems.map(({ day, items }) => (
            <section
              key={day}
              aria-label={`Actividades del ${formatAgendaDate(day)}`}
              className={styles.dayGroup}
            >
              {selectedDay === "todos" ? (
                <h2 id={`day-${day}`} className={styles.day}>
                  {formatAgendaDate(day)}
                </h2>
              ) : (
                <h2 className={styles.day}>{formatAgendaDate(day)}</h2>
              )}
              <ol className={styles.activityList}>
                {items.map((item) => {
                  const sector = demoSectors.find(
                    (candidate) => candidate.id === item.sectorId,
                  );
                  const protagonists = demoExhibitors.filter(
                    (exhibitor) => exhibitor.agendaItemId === item.id,
                  );
                  const isExpanded = expandedId === item.id;
                  return (
                    <li className={styles.activity} id={item.id} key={item.id}>
                      <div className={styles.activityTime}>
                        <time dateTime={`${item.date}T${item.time}`}>
                          {item.time}
                        </time>
                        <span>{formatDuration(item.durationMinutes)}</span>
                      </div>
                      <figure className={styles.scene}>
                        <img
                          src={`${import.meta.env.BASE_URL}${item.visual.src.replace(/^\//, "")}`}
                          alt={item.visual.alt}
                          width="1536"
                          height="1024"
                          loading="lazy"
                        />
                        <figcaption>{item.visual.caption}</figcaption>
                      </figure>
                      <div className={styles.activityContent}>
                        <p className={styles.kicker}>
                          {sector?.name ?? "Experiencia"}
                        </p>
                        <h3>{item.title}</h3>
                        <p className={styles.activityDescription}>
                          {item.description}
                        </p>
                        <p className={styles.activityMeta}>
                          <strong>Lugar demostrativo</strong> {item.location}
                        </p>
                        <button
                          type="button"
                          className={styles.detailButton}
                          aria-expanded={isExpanded}
                          aria-controls={`${item.id}-details`}
                          onClick={() =>
                            setExpandedId(isExpanded ? null : item.id)
                          }
                        >
                          {isExpanded ? "Ocultar detalles" : "Ver detalles"}
                          {isExpanded ? (
                            <ChevronUp aria-hidden="true" size={16} />
                          ) : (
                            <ChevronDown aria-hidden="true" size={16} />
                          )}
                        </button>
                        <div
                          id={`${item.id}-details`}
                          hidden={!isExpanded}
                          className={styles.details}
                        >
                          <p className={styles.activityContext}>
                            {getActivityContext(item.id)}
                          </p>
                          {protagonists.length > 0 && (
                            <div className={styles.related}>
                              <span>Protagonistas vinculados</span>
                              {protagonists.map((actor) => (
                                <Link
                                  key={actor.id}
                                  to={`${routePaths.exhibitors}?actor=${actor.id}`}
                                >
                                  {actor.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className={styles.actions}>
                          <a
                            className={styles.scheduleAction}
                            aria-label={`Agendar “${item.title}”: abre Google Calendar para confirmar`}
                            href={createCalendarLinkUrl(
                              item,
                              demoAgendaTimeZone,
                              demoAgendaNotice,
                            )}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <CalendarPlus aria-hidden="true" size={18} />
                            <span>Agendar</span>
                          </a>
                          {protagonists.length > 0 && (
                            <Link
                              className={styles.secondaryAction}
                              to={`${routePaths.exhibitors}?actor=${protagonists[0].id}`}
                            >
                              Ver protagonistas
                            </Link>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
