import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  MapPinned,
  ScanLine,
  Ticket,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  demoAgenda,
  demoExhibitors,
  demoInterests,
  demoPoles,
  type DemoPole,
  demoSectors,
  formatEventPeriod,
  officialEventPeriod,
  officialNews,
  venueMapZones,
} from "../../content/demoContent";
import { routePaths } from "../../navigation/routePaths";
import { DemoNotice } from "../../shared/ui/DemoNotice";
import heroIllustration from "../../assets/demostrativos/recorrido-descubrimiento-hero.png";
import poloBioceanicoImg from "../../assets/polos/polo_bioceanico.jpg";
import poloPunaImg from "../../assets/polos/polo_puna.jpg";
import poloQuebradaImg from "../../assets/polos/polo_quebrada.jpg";
import poloYungasImg from "../../assets/polos/polo_yungas.jpg";
import poloVallesImg from "../../assets/polos/polo_valles.jpg";
import styles from "./HomePage.module.css";
import { SponsorsShowcase } from "../sponsors/SponsorsShowcase";
import { ContactGuidance } from "../contact/ContactGuidance";

interface HomePageProps {
  onOpenTickets: () => void;
}

function getPoleImage(theme: DemoPole["theme"]) {
  switch (theme) {
    case "bioceanico":
      return poloBioceanicoImg;
    case "puna":
      return poloPunaImg;
    case "quebrada":
      return poloQuebradaImg;
    case "yungas":
      return poloYungasImg;
    case "valles":
      return poloVallesImg;
  }
}

export function HomePage({ onOpenTickets }: HomePageProps) {
  const [activePoleId, setActivePoleId] = useState<string>(demoPoles[0].id);
  const [selectedInterestId, setSelectedInterestId] = useState(
    demoInterests[0].id,
  );
  const [activeActorIdByInterest, setActiveActorIdByInterest] = useState<
    Record<string, string>
  >({});

  const selectedInterest =
    demoInterests.find((interest) => interest.id === selectedInterestId) ??
    demoInterests[0];

  const sectorExhibitors = demoExhibitors.filter(
    (exhibitor) => exhibitor.sectorId === selectedInterest.sectorId,
  );

  const currentActorId =
    activeActorIdByInterest[selectedInterest.id] ??
    selectedInterest.highlightActorId;

  const selectedExhibitor =
    demoExhibitors.find((exhibitor) => exhibitor.id === currentActorId) ??
    demoExhibitors[0];

  const selectedActivity =
    demoAgenda.find(
      (activity) => activity.id === selectedInterest.highlightActivityId,
    ) ?? demoAgenda[0];

  const selectedZone = venueMapZones.find(
    (zone) => zone.id === selectedExhibitor.venueZoneId,
  );

  return (
    <div className={styles.home}>
      <section className={styles.hero} id="expojuy" aria-labelledby="hero-name">
        <div className={styles.heroHeading}>
          <p id="hero-name" className={styles.eyebrow}>
            ExpoJuy
          </p>
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

      <section id="sectores" aria-labelledby="sectors-name">
        <p id="sectors-name" className={styles.sectionLabel}>
          Sectores
        </p>
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
                {sectorExhibitors.length > 1 && (
                  <div
                    className={styles.actorSwitcher}
                    role="group"
                    aria-label="Referentes disponibles del sector"
                  >
                    <span className={styles.switcherLabel}>
                      Referentes del sector:
                    </span>
                    <div className={styles.actorChips}>
                      {sectorExhibitors.map((exhibitor) => {
                        const isActorSelected =
                          exhibitor.id === selectedExhibitor.id;
                        return (
                          <button
                            key={exhibitor.id}
                            type="button"
                            aria-pressed={isActorSelected}
                            className={styles.actorChip}
                            data-active={isActorSelected || undefined}
                            onClick={() =>
                              setActiveActorIdByInterest((prev) => ({
                                ...prev,
                                [selectedInterest.id]: exhibitor.id,
                              }))
                            }
                          >
                            {exhibitor.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <span className={styles.stepTag}>
                  {selectedExhibitor.category}
                </span>
                <strong className={styles.stepEntityName}>
                  {selectedExhibitor.name}
                </strong>
                <p className={styles.stepDescription}>
                  {selectedExhibitor.description}
                </p>
                <div className={styles.stepActionsCol}>
                  <Link
                    className={styles.stepLink}
                    to={`${routePaths.exhibitors}?actor=${selectedExhibitor.id}`}
                  >
                    Ver {selectedExhibitor.name} en Expositores{" "}
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                  <Link
                    className={styles.sectorAllLink}
                    to={`${routePaths.exhibitors}?sector=${selectedInterest.sectorId}`}
                  >
                    Ver los {sectorExhibitors.length} expositores del sector →
                  </Link>
                </div>
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

      <section
        id="polos-productivos"
        className={styles.polesSection}
        aria-labelledby="poles-name"
      >
        <div className={styles.sectionHeader}>
          <p id="poles-name" className={styles.sectionLabel}>
            Protagonistas del Ecosistema
          </p>
          <h2 id="poles-title">
            De Jujuy al Corredor Bioceánico: los polos que mueven la Expo
          </h2>
          <p className={styles.sectionLead}>
            Explorá las fuerzas productivas de las cuatro regiones y el nodo
            bioceánico internacional que se dan cita en Ciudad Cultural.
          </p>
          <DemoNotice>
            Polos y expositores representativos de la matriz productiva
            regional; datos demostrativos.
          </DemoNotice>
        </div>

        {/* Acordeón Cinemático de Polos */}
        <div
          className={styles.accordionContainer}
          role="region"
          aria-label="Polos productivos de Jujuy y el Corredor Bioceánico"
        >
          {demoPoles.map((pole) => {
            const isExpanded = pole.id === activePoleId;
            const poleImg = getPoleImage(pole.theme);
            const poleExhibitors = demoExhibitors.filter((exhibitor) =>
              pole.exhibitorIds.includes(exhibitor.id),
            );

            return (
              <div
                key={pole.id}
                className={styles.polePanel}
                data-active={isExpanded || undefined}
                data-theme={pole.theme}
              >
                {/* Capa de fondo con fotografía inmersiva de la región */}
                <div
                  className={styles.poleBgLayer}
                  style={{ backgroundImage: `url(${poleImg})` }}
                  aria-hidden="true"
                />
                {/* Capas envolventes: gradiente cromático y trama andina de marca */}
                <div className={styles.poleDuoToneOverlay} aria-hidden="true" />
                <div className={styles.polePatternOverlay} aria-hidden="true" />

                {/* Botón disparador del panel / barra colapsada */}
                <button
                  type="button"
                  id={`pole-tab-${pole.id}`}
                  className={styles.poleTrigger}
                  aria-expanded={isExpanded}
                  aria-controls={`pole-content-${pole.id}`}
                  onClick={() => setActivePoleId(pole.id)}
                >
                  <span className={styles.poleVerticalTitle}>
                    {pole.shortName}
                  </span>
                  <span className={styles.poleExpandHint}>
                    <ChevronRight aria-hidden="true" size={18} />
                  </span>
                </button>

                {/* Contenido expandido del polo */}
                <div
                  id={`pole-content-${pole.id}`}
                  role="region"
                  aria-labelledby={`pole-tab-${pole.id}`}
                  className={styles.poleContent}
                >
                  <div className={styles.poleContentInner}>
                    <div className={styles.poleHeader}>
                      <div className={styles.poleMeta}>
                        <span className={styles.poleBadge}>{pole.badge}</span>
                      </div>
                      <h3 className={styles.poleTitle}>{pole.name}</h3>
                      <p className={styles.poleTagline}>{pole.tagline}</p>
                      <p className={styles.poleDescription}>
                        {pole.description}
                      </p>

                      <div className={styles.poleHighlights}>
                        {pole.highlights.map((item) => (
                          <span key={item} className={styles.highlightPill}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={styles.poleExhibitorsBlock}>
                      <h4 className={styles.exhibitorsBlockTitle}>
                        Referentes en Ciudad Cultural:
                      </h4>
                      <div className={styles.standCardsGrid}>
                        {poleExhibitors.map((exhibitor) => {
                          const zone = venueMapZones.find(
                            (z) => z.id === exhibitor.venueZoneId,
                          );

                          return (
                            <article
                              key={exhibitor.id}
                              className={styles.standCard}
                            >
                              <div className={styles.standHeader}>
                                <span className={styles.standBadge}>
                                  <MapPinned aria-hidden="true" size={13} />
                                  {zone ? zone.label : "Stand Oficial"}
                                </span>
                                <span className={styles.standSectorTag}>
                                  {exhibitor.category}
                                </span>
                              </div>

                              <strong className={styles.standName}>
                                {exhibitor.name}
                              </strong>
                              <p className={styles.standDescription}>
                                {exhibitor.description}
                              </p>

                              <div className={styles.standActions}>
                                {zone && (
                                  <Link
                                    to={`${routePaths.map}?zone=${zone.id}`}
                                    className={styles.standMapLink}
                                    title={`Ubicar ${exhibitor.name} en ${zone.label}`}
                                  >
                                    <MapPinned aria-hidden="true" size={14} />
                                    <span>Ver en mapa</span>
                                  </Link>
                                )}
                                <Link
                                  to={`${routePaths.exhibitors}?actor=${exhibitor.id}&sector=${exhibitor.sectorId}`}
                                  className={styles.standProfileLink}
                                >
                                  <span>Ficha completa</span>
                                  <ArrowUpRight aria-hidden="true" size={14} />
                                </Link>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pie de sección hacia el catálogo general */}
        <div className={styles.sectionFooter}>
          <p className={styles.footerSummary}>
            Conocé a los 200+ expositores y delegaciones previstos para esta 17°
            edición.
          </p>
          <Link className={styles.fullDirectoryLink} to={routePaths.exhibitors}>
            Explorar catálogo completo de expositores{" "}
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>

      <section
        className={styles.twoColumn}
        aria-label="Actividad y experiencia"
      >
        <div>
          <p id="agenda" tabIndex={-1} className={styles.sectionLabel}>
            Agenda destacada
          </p>
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
          <p id="experiencia-ra" tabIndex={-1} className={styles.sectionLabel}>
            Conocé la Experiencia RA
          </p>
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

      <section id="noticias" aria-labelledby="news-name">
        <p id="news-name" className={styles.sectionLabel}>
          Últimas noticias
        </p>
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

      <section
        id="planifica"
        className={styles.planning}
        aria-labelledby="planning-name"
      >
        <p id="planning-name" className={styles.sectionLabel}>
          Planificá tu visita
        </p>
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

      <SponsorsShowcase />

      <ContactGuidance />
    </div>
  );
}
