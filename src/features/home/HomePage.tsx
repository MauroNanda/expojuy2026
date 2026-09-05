import { ArrowRight, MapPinned, ScanLine, Ticket } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  demoAgenda,
  demoExhibitors,
  demoInterests,
  demoSectors,
  demoSponsors,
  formatEventPeriod,
  officialEventPeriod,
  officialNews,
  venueMapZones,
} from "../../content/demoContent";
import { routePaths } from "../../navigation/routePaths";
import { DemoNotice } from "../../shared/ui/DemoNotice";
import { PendingData } from "../../shared/ui/PendingData";
import heroIllustration from "../../assets/demostrativos/recorrido-descubrimiento-hero.png";
import styles from "./HomePage.module.css";

interface HomePageProps {
  onOpenTickets: () => void;
}

export function HomePage({ onOpenTickets }: HomePageProps) {
  const [selectedInterestId, setSelectedInterestId] = useState(
    demoInterests[0].id,
  );
  const selectedInterest =
    demoInterests.find((interest) => interest.id === selectedInterestId) ??
    demoInterests[0];

  const selectedExhibitor =
    demoExhibitors.find(
      (exhibitor) => exhibitor.id === selectedInterest.highlightActorId,
    ) ?? demoExhibitors[0];

  const selectedActivity =
    demoAgenda.find(
      (activity) => activity.id === selectedInterest.highlightActivityId,
    ) ?? demoAgenda[0];

  const selectedZone = venueMapZones.find(
    (zone) => zone.id === selectedInterest.venueZoneId,
  );

  return (
    <div className={styles.home}>
      <section
        className={styles.hero}
        id="expojuy"
        aria-labelledby="hero-title"
      >
        <div className={styles.heroHeading}>
          <p className={styles.eyebrow}>ExpoJuy 2026</p>
          <h1 id="hero-title">
            Jujuy conecta producción, ideas y{" "}
            <span className={styles.heroEmphasis}>oportunidades.</span>
          </h1>
        </div>
        <div className={styles.heroDetails}>
          <dl className={styles.eventPeriod}>
            <div>
              <dt>Fecha confirmada</dt>
              <dd>
                <time dateTime={officialEventPeriod.startDate}>
                  {formatEventPeriod(officialEventPeriod)}
                </time>
              </dd>
            </div>
            <div>
              <dt>Sede</dt>
              <dd>{officialEventPeriod.venue}</dd>
            </div>
          </dl>
          <div className={styles.heroCopy}>
            <p className={styles.lead}>
              Explorá sectores, protagonistas y actividades para preparar tu
              recorrido por la Expo.
            </p>
            <a className={styles.primaryAction} href="#sectores">
              Explorar sectores <ArrowRight aria-hidden="true" size={18} />
            </a>
            <p className={styles.actionHint}>
              Desde Sectores podés conocer protagonistas y actividades
              relacionadas.
            </p>
          </div>
        </div>
        <figure className={styles.heroVisual} aria-hidden="true">
          <img alt="" src={heroIllustration} />
        </figure>
        <ul className={styles.heroSectors} aria-label="Ámbitos de la Expo">
          {demoSectors.map((sector) => (
            <li key={sector.id}>{sector.name}</li>
          ))}
        </ul>
      </section>

      <section id="sectores" aria-labelledby="sectors-title">
        <p className={styles.sectionLabel}>Sectores y Recorrido</p>
        <h2 id="sectors-title">¿Qué venís a descubrir en ExpoJuy?</h2>
        <p className={styles.discoveryLead}>
          Elegí tu objetivo de visita para desplegar un recorrido sugerido paso
          a paso: conocé quién te espera, a qué actividad sumarte y dónde
          encontrarlo en el predio.
        </p>
        <DemoNotice>
          Intenciones, protagonistas y actividades de demostración
        </DemoNotice>

        <div
          className={styles.intentionGrid}
          role="tablist"
          aria-label="Objetivos de visita"
        >
          {demoInterests.map((interest) => {
            const isSelected = interest.id === selectedInterest.id;
            return (
              <button
                key={interest.id}
                role="tab"
                aria-selected={isSelected}
                aria-controls={`journey-panel-${interest.id}`}
                id={`tab-${interest.id}`}
                type="button"
                className={styles.intentionCard}
                data-selected={isSelected || undefined}
                onClick={() => setSelectedInterestId(interest.id)}
              >
                <span className={styles.intentionBadge}>
                  {interest.sectorName}
                </span>
                <strong>{interest.label}</strong>
                <p>{interest.description}</p>
              </button>
            );
          })}
        </div>

        <div
          id={`journey-panel-${selectedInterest.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${selectedInterest.id}`}
          className={styles.suggestedJourney}
        >
          <div className={styles.journeyHeader}>
            <p className={styles.journeyEyebrow}>
              Recorrido sugerido · {selectedInterest.label}
            </p>
            <h3>Tu itinerario recomendado en 3 pasos</h3>
            <p className={styles.journeyLead}>
              Conectamos tu interés con las personas, los horarios y los
              espacios clave del evento.
            </p>
          </div>

          <div className={styles.journeySteps}>
            {/* Paso 1: Quién te espera */}
            <article className={styles.journeyStep}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>Paso 1</span>
                <h4>Quién te espera</h4>
              </div>
              <div className={styles.stepBody}>
                <span className={styles.stepTag}>
                  {selectedExhibitor.category}
                </span>
                <strong className={styles.stepEntityName}>
                  {selectedExhibitor.name}
                </strong>
                <p className={styles.stepDescription}>
                  {selectedExhibitor.description}
                </p>
                <Link
                  className={styles.stepLink}
                  to={`${routePaths.exhibitors}?actor=${selectedExhibitor.id}`}
                >
                  Ver {selectedExhibitor.name} en Expositores{" "}
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </div>
            </article>

            {/* Paso 2: A qué hora ir */}
            <article className={styles.journeyStep}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>Paso 2</span>
                <h4>A qué hora ir</h4>
              </div>
              <div className={styles.stepBody}>
                <span className={styles.stepTag}>Agenda destacada</span>
                <strong className={styles.stepEntityName}>
                  {selectedActivity.title}
                </strong>
                <p className={styles.stepMeta}>
                  <time>{selectedActivity.time} hs</time> ·{" "}
                  {selectedActivity.durationMinutes} min de duración
                </p>
                <p className={styles.stepDescription}>
                  {selectedActivity.description}
                </p>
                <Link className={styles.stepLink} to={routePaths.agenda}>
                  Consultar agenda completa{" "}
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </div>
            </article>

            {/* Paso 3: Dónde encontrarlo */}
            <article className={styles.journeyStep}>
              <div className={styles.stepHeader}>
                <span className={styles.stepNumber}>Paso 3</span>
                <h4>Dónde encontrarlo</h4>
              </div>
              <div className={styles.stepBody}>
                <span className={styles.stepTag}>Ubicación en predio</span>
                <strong className={styles.stepEntityName}>
                  {selectedZone
                    ? selectedZone.label
                    : selectedActivity.location}
                </strong>
                <p className={styles.stepDescription}>
                  {selectedZone
                    ? selectedZone.description
                    : `Sector ${selectedInterest.sectorName} en Ciudad Cultural.`}
                </p>
                <Link
                  className={styles.stepLink}
                  to={
                    selectedZone
                      ? `${routePaths.map}?zone=${selectedZone.id}`
                      : routePaths.map
                  }
                >
                  Localizar en el mapa{" "}
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section aria-labelledby="exhibitors-title">
        <p className={styles.sectionLabel}>Protagonistas</p>
        <h2 id="exhibitors-title">Expositores destacados</h2>
        <DemoNotice />
        <ul className={styles.compactList}>
          {demoExhibitors.map((exhibitor) => (
            <li key={exhibitor.name}>
              <span>{exhibitor.category}</span>
              <strong>{exhibitor.name}</strong>
            </li>
          ))}
        </ul>
        <Link className={styles.textAction} to={routePaths.exhibitors}>
          Ver expositores
        </Link>
      </section>

      <section
        className={styles.twoColumn}
        aria-label="Actividad y experiencia"
      >
        <div>
          <p className={styles.sectionLabel}>Agenda</p>
          <h2>Momentos para compartir</h2>
          <DemoNotice />
          <ul className={styles.agendaList}>
            {demoAgenda.map((item) => (
              <li key={item.time}>
                <time>{item.time}</time>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
          <Link className={styles.textAction} to={routePaths.agenda}>
            Ver agenda
          </Link>
        </div>
        <div className={styles.raPanel}>
          <ScanLine aria-hidden="true" size={32} />
          <p className={styles.sectionLabel}>Experiencia RA</p>
          <h2>Una capa por descubrir</h2>
          <p>
            Simulá el escaneo del isologotipo y descubrí cómo se revela una
            experiencia audiovisual de ExpoJuy.
          </p>
          <Link className={styles.textAction} to={routePaths.realityAugmented}>
            Iniciar experiencia RA
          </Link>
        </div>
      </section>

      <section aria-labelledby="news-title">
        <p className={styles.sectionLabel}>Noticias</p>
        <h2 id="news-title">Lo que se activa en la Expo</h2>
        <ul className={styles.newsList}>
          {officialNews.slice(0, 2).map((news) => (
            <li key={news.id}>
              <h3>{news.title}</h3>
              <p>{news.summary}</p>
              <p className={styles.newsSource}>
                Publicado por {news.source.name}
              </p>
            </li>
          ))}
        </ul>
        <Link className={styles.textAction} to={routePaths.news}>
          Ver noticias
        </Link>
      </section>

      <section id="sponsors" aria-labelledby="sponsors-title">
        <p className={styles.sectionLabel}>Sponsors</p>
        <h2 id="sponsors-title">Espacios de vinculación</h2>
        <DemoNotice />
        <ul className={styles.sponsorList}>
          {demoSponsors.map((sponsor) => (
            <li key={sponsor}>{sponsor}</li>
          ))}
        </ul>
      </section>

      <section className={styles.planning} aria-labelledby="planning-title">
        <p className={styles.sectionLabel}>Planificá tu visita</p>
        <h2 id="planning-title">Guardá estos puntos de entrada</h2>
        <div className={styles.planningActions}>
          <Link to={routePaths.map}>
            <MapPinned aria-hidden="true" size={20} /> Mapa
          </Link>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=-24.1822527%2C-65.330159&travelmode=driving&dir_action=navigate"
            rel="noreferrer noopener"
            target="_blank"
          >
            <MapPinned aria-hidden="true" size={20} /> ¿Cómo llegar?
          </a>
          <button type="button" onClick={onOpenTickets}>
            <Ticket aria-hidden="true" size={20} /> Entradas
          </button>
        </div>
      </section>

      <section
        id="contacto"
        className={styles.contact}
        aria-labelledby="contact-title"
      >
        <p className={styles.sectionLabel}>Contacto y preguntas</p>
        <h2 id="contact-title">Información institucional</h2>
        <PendingData>
          Canales de contacto, teléfono y correo institucional de la
          organización.
        </PendingData>
        <p>
          Este prototipo incorporará los canales oficiales cuando sean
          provistos. No se completan con datos de fuentes no oficiales.
        </p>
      </section>
    </div>
  );
}
