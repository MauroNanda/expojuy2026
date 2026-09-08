import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  sponsorReferences,
  type SponsorReference,
} from "../../content/sponsors";
import styles from "./SponsorsShowcase.module.css";

function SponsorLogo({ sponsor }: { sponsor: SponsorReference }) {
  const [failed, setFailed] = useState(false);
  const content = failed ? (
    <span className={styles.fallback}>{sponsor.name}</span>
  ) : (
    <img
      src={sponsor.logo}
      alt={sponsor.name}
      loading="lazy"
      decoding="async"
      style={{ maxWidth: sponsor.displayWidth }}
      onError={() => setFailed(true)}
    />
  );
  return sponsor.website ? (
    <a
      className={styles.brand}
      href={sponsor.website}
      aria-label={`Visitar el sitio de ${sponsor.name}`}
    >
      <span className={styles.logoArea}>{content}</span>
      <span className={styles.external}>
        Visitar sitio <ArrowUpRight size={16} aria-hidden="true" />
      </span>
    </a>
  ) : (
    <div className={styles.brand}>
      <span className={styles.logoArea}>{content}</span>
    </div>
  );
}

export function SponsorsShowcase({
  sponsors = sponsorReferences,
}: {
  sponsors?: readonly SponsorReference[];
}) {
  return (
    <section
      id="sponsors"
      aria-labelledby="sponsors-name"
      className={styles.showcase}
    >
      <div className={styles.heading}>
        <h2 id="sponsors-name">Sponsors</h2>
        <p>Un espacio para las marcas que quieran ser parte del encuentro.</p>
      </div>
      <p className={styles.notice}>
        Logotipos utilizados como referencia visual. No representan patrocinios
        confirmados de ExpoJuy 2026.
      </p>
      <ul className={styles.grid} aria-label="Marcas de referencia">
        {sponsors.map((sponsor) => (
          <li key={`${sponsor.name}-${sponsor.logo}`}>
            <SponsorLogo sponsor={sponsor} />
          </li>
        ))}
      </ul>
      <div className={styles.invitation}>
        <div>
          <h3>¿Tu marca en ExpoJuy?</h3>
          <p>
            El canal oficial para consultas sobre participación está pendiente
            de confirmación.
          </p>
        </div>
        <Link to="/#contacto" className={styles.contact}>
          Ver información de contacto{" "}
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
