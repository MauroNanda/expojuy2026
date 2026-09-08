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
function formatDate(isoDate: string) {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00Z`));
}

function NewsArticle({
  item,
  featured = false,
}: {
  item: OfficialNewsItem;
  featured?: boolean;
}) {
  const titleId = `news-${item.id}`;
  return (
    <article
      id={item.id}
      aria-labelledby={titleId}
      className={featured ? styles.featuredArticle : styles.article}
    >
      {featured && (
        <figure className={styles.visual}>
          <img
            src={`${import.meta.env.BASE_URL}${item.visual.src.replace(/^\//, "")}`}
            alt={item.visual.alt}
            width="1536"
            height="1024"
            loading={featured ? "eager" : "lazy"}
          />
          <figcaption>{item.visual.caption}</figcaption>
        </figure>
      )}
      <div className={styles.articleContent}>
        <p className={styles.date}>
          <time dateTime={item.publishedDate}>
            {formatDate(item.publishedDate)}
          </time>
        </p>
        <h2 id={titleId}>{item.title}</h2>
        <p className={styles.summary}>{item.summary}</p>
        <p className={styles.context}>{item.context}</p>
        <p className={styles.source}>
          <span>Fuente:</span>
          <a href={item.source.url} rel="noreferrer" target="_blank">
            {item.source.name} <ArrowUpRight aria-hidden="true" size={15} />
            <span className={styles.visuallyHidden}>
              de “{item.title}”. Se abre en un sitio externo.
            </span>
          </a>
        </p>
        <p className={styles.retrieved}>
          Consultado el {formatDate(item.retrievedDate)}
        </p>
      </div>
    </article>
  );
}

export function NewsPage() {
  const [featured, ...rest] = [...officialNews].sort((a, b) =>
    b.publishedDate.localeCompare(a.publishedDate),
  );
  return (
    <div className={styles.page} role="region" aria-labelledby="news-page-name">
      <header className={styles.header}>
        <p id="news-page-name" className={styles.sectionLabel}>
          Noticias
        </p>
        <h1>La Expo toma forma</h1>
        <p className={styles.intro}>
          Una lectura editorial de novedades publicadas sobre ExpoJuy: qué
          ocurrió, por qué importa y dónde verificarlo.
        </p>
      </header>
      {featured ? (
        <div className={styles.articles}>
          <NewsArticle item={featured} featured />
          {rest.map((item) => (
            <NewsArticle key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          Todavía no hay novedades incorporadas. Consultá los canales oficiales.
        </p>
      )}
      <section
        id="canales-oficiales"
        aria-labelledby="channels-title"
        className={styles.channels}
      >
        <h2 id="channels-title">Canales oficiales</h2>
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
                <ArrowUpRight aria-hidden="true" size={15} />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
