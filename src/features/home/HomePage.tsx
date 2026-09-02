import { ArrowRight, MapPinned, ScanLine, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

import {
  demoAgenda,
  demoExhibitors,
  demoNews,
  demoSectors,
  demoSponsors,
} from "../../content/demoContent";
import { routePaths } from "../../navigation/routePaths";
import { DemoNotice } from "../../shared/ui/DemoNotice";
import styles from "./HomePage.module.css";

interface HomePageProps {
  onOpenTickets: () => void;
}

export function HomePage({ onOpenTickets }: HomePageProps) {
  return (
    <div className={styles.home}>
      <section
        className={styles.hero}
        id="expojuy"
        aria-labelledby="hero-title"
      >
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>ExpoJuy 2026</p>
          <h1 id="hero-title">Donde el ecosistema productivo se encuentra.</h1>
          <p className={styles.lead}>
            Descubrí sectores, protagonistas y experiencias para preparar tu
            recorrido.
          </p>
          <a className={styles.primaryAction} href="#sectores">
            Explorar sectores <ArrowRight aria-hidden="true" size={18} />
          </a>
        </div>
        <div className={styles.meshPanel}>
          <div aria-hidden="true" className={styles.productiveMesh}>
            <span className={styles.nodeOne} />
            <span className={styles.nodeTwo} />
            <span className={styles.nodeThree} />
            <span className={styles.nodeFour} />
            <i className={styles.lineOne} />
            <i className={styles.lineTwo} />
            <i className={styles.lineThree} />
          </div>
          <p>Trama productiva</p>
          <ul aria-label="Relaciones representadas en la trama">
            <li>Producción local</li>
            <li>Tecnología aplicada</li>
            <li>Vinculación empresarial</li>
          </ul>
        </div>
      </section>

      <section id="sectores" aria-labelledby="sectors-title">
        <p className={styles.sectionLabel}>Sectores</p>
        <h2 id="sectors-title">Puntos de partida para descubrir la Expo</h2>
        <DemoNotice />
        <ul className={styles.sectorList}>
          {demoSectors.map((sector) => (
            <li key={sector.name}>
              <h3>{sector.name}</h3>
              <p>{sector.description}</p>
            </li>
          ))}
        </ul>
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
            La experiencia de realidad aumentada se definirá en un change
            específico.
          </p>
          <Link className={styles.textAction} to={routePaths.realityAugmented}>
            Conocer la experiencia RA
          </Link>
        </div>
      </section>

      <section aria-labelledby="news-title">
        <p className={styles.sectionLabel}>Noticias</p>
        <h2 id="news-title">Lo que se activa en la Expo</h2>
        <DemoNotice />
        <ul className={styles.newsList}>
          {demoNews.map((news) => (
            <li key={news.title}>
              <h3>{news.title}</h3>
              <p>{news.summary}</p>
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
        <h2 id="contact-title">Información institucional por confirmar</h2>
        <p>
          Este prototipo incorporará los canales oficiales cuando sean
          provistos.
        </p>
      </section>
    </div>
  );
}
