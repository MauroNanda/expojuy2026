import { ArrowUpRight } from "lucide-react";

import {
  officialChannels,
  officialNews,
  type OfficialNewsItem,
} from "../../content/demoContent";
import styles from "./NewsPage.module.css";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Las fechas se interpretan en UTC para que el día publicado no se desplace
 * según la zona horaria del dispositivo.
 */
function formatDate(isoDate: string) {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00Z`));
}

function NewsArticle({ item }: { item: OfficialNewsItem }) {
  const titleId = `news-${item.id}`;

  return (
    <article aria-labelledby={titleId} className={styles.article}>
      <p className={styles.date}>
        <time dateTime={item.publishedDate}>
          {formatDate(item.publishedDate)}
        </time>
      </p>
      <h2 id={titleId}>{item.title}</h2>
      <p className={styles.summary}>{item.summary}</p>
      <p className={styles.source}>
        <span>Publicado por {item.source.name}</span>
        <a href={item.source.url} rel="noreferrer" target="_blank">
          Leer la publicación de origen
          <span className={styles.visuallyHidden}>
            {` de “${item.title}”. Se abre en un sitio externo.`}
          </span>
          <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.8} />
        </a>
      </p>
      <p className={styles.retrieved}>
        Consultado el {formatDate(item.retrievedDate)}
      </p>
    </article>
  );
}

export function NewsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.sectionLabel}>Noticias</p>
        <h1>Novedades de ExpoJuy 2026</h1>
        <p className={styles.intro}>
          Una selección de novedades publicadas sobre la Expo. Cada una enlaza a
          su publicación de origen para que puedas verificarla.
        </p>
      </header>

      {officialNews.length > 0 ? (
        <div className={styles.articles}>
          {officialNews.map((item) => (
            <NewsArticle key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          Todavía no hay novedades incorporadas a este prototipo. Las
          actualizaciones se publican en los canales oficiales.
        </p>
      )}

      <section aria-labelledby="channels-title" className={styles.channels}>
        <h2 id="channels-title">Dónde se publican las actualizaciones</h2>
        <p>
          La organización publica sus novedades en estos canales. Este prototipo
          no se conecta a ellos: las novedades no se incorporan de forma
          automática.
        </p>
        <ul>
          {officialChannels.map((channel) => (
            <li key={channel.url}>
              <a href={channel.url} rel="noreferrer" target="_blank">
                {channel.name}
                <span className={styles.visuallyHidden}>
                  . Se abre en un sitio externo.
                </span>
                <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.8} />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
