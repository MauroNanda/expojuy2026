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
  const [selectedSectorId, setSelectedSectorId] = useState(demoSectors[0].id);
  const selectedSector = demoSectors.find(
    (sector) => sector.id === selectedSectorId,
  );
  const selectedExhibitor = demoExhibitors.find(
    (exhibitor) => exhibitor.sectorId === selectedSectorId,
  );
  const selectedActivity = demoAgenda.find(
    (activity) => activity.sectorId === selectedSectorId,
  );
  const selectedInterest = demoInterests.find(
    (interest) => interest.sectorId === selectedSectorId,
  );
  const relatedInterests = selectedInterest
    ? demoInterests.filter((interest) =>
        selectedInterest.relatedInterestIds.includes(interest.id),
      )
    : [];

  if (
    !selectedSector ||
    !selectedExhibitor ||
    !selectedActivity ||
    !selectedInterest
  ) {
    return null;
  }

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
        <p className={styles.sectionLabel}>Sectores</p>
        <h2 id="sectors-title">Puntos de partida para descubrir la Expo</h2>
        <p className={styles.discoveryLead}>
          Empezá por lo que te interesa o elegí un sector para conocer un
          protagonista y una actividad relacionada.
        </p>
        <DemoNotice>
          Intereses, protagonistas y actividades de demostración
        </DemoNotice>
        <div className={styles.discoveryControls}>
          <div className={styles.interestExplorer}>
            <h3 className={styles.controlTitle}>Lo que te interesa explorar</h3>
            <ul className={styles.interestList}>
              {demoInterests.map((interest) => {
                const isSelected = interest.sectorId === selectedSectorId;
                const isRelated = selectedInterest.relatedInterestIds.includes(
                  interest.id,
                );

                return (
                  <li key={interest.id}>
                    <button
                      aria-pressed={isSelected}
                      data-related={isRelated || undefined}
                      type="button"
                      onClick={() => setSelectedSectorId(interest.sectorId)}
                    >
                      <strong>{interest.label}</strong>
                      <span>{interest.description}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={styles.sectorExplorer}>
            <p className={styles.directExplorerLabel}>
              O explorá directamente un sector
            </p>
            <ul className={styles.sectorList}>
              {demoSectors.map((sector) => (
                <li key={sector.id}>
                  <button
                    aria-pressed={sector.id === selectedSectorId}
                    type="button"
                    onClick={() => setSelectedSectorId(sector.id)}
                  >
                    {sector.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <section
          aria-live="polite"
          aria-labelledby="discovery-route-title"
          className={styles.discoveryRoute}
        >
          <div className={styles.routeHeading}>
            <p className={styles.sectionLabel}>Ruta de descubrimiento</p>
            <h3 id="discovery-route-title">{selectedSector.name}</h3>
            <p>{selectedSector.description}</p>
          </div>
          <p className={styles.routeIntro}>
            Tu interés por {selectedInterest.label.toLocaleLowerCase()} activa
            estas conexiones.
          </p>
          <div className={styles.routeConnections}>
            <article className={styles.routeConnection}>
              <span>Sector</span>
              <strong>{selectedSector.name}</strong>
              <p>{selectedSector.description}</p>
            </article>
            <article className={styles.routeConnection}>
              <span>Protagonista</span>
              <strong>{selectedExhibitor.name}</strong>
              <p>{selectedExhibitor.description}</p>
              <Link
                className={styles.connectionAction}
                to={`${routePaths.exhibitors}?actor=${selectedExhibitor.id}`}
              >
                Ver {selectedExhibitor.name} en Expositores
              </Link>
            </article>
            <article className={styles.routeConnection}>
              <span>Actividad relacionada</span>
              <strong>{selectedActivity.title}</strong>
              <p>{selectedActivity.description}</p>
            </article>
          </div>
          <div className={styles.relatedInterests}>
            <p>También se conecta con</p>
            <ul>
              {relatedInterests.map((interest) => (
                <li key={interest.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedSectorId(interest.sectorId)}
                  >
                    {interest.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
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
