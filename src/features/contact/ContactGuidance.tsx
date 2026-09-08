import {
  ArrowRight,
  ArrowUpRight,
  Ticket,
  Store,
  Newspaper,
} from "lucide-react";
import { Link } from "react-router-dom";
import { officialChannels } from "../../content/demoContent";
import styles from "./ContactGuidance.module.css";

export function ContactGuidance() {
  const chamber = officialChannels.find(
    (channel) => channel.url === "https://camcomexjujuy.com.ar/",
  );
  const socialChannels = officialChannels.filter(
    (channel) => channel !== chamber,
  );
  return (
    <section
      id="contacto"
      aria-labelledby="contact-name"
      className={styles.contact}
    >
      <div className={styles.intro}>
        <p id="contact-name" className={styles.label}>
          Contacto
        </p>
        <h2>
          Tu <span>próximo paso</span> en ExpoJuy.
        </h2>
        <p>Encontrá la información según lo que buscás.</p>
      </div>
      <div className={styles.options}>
        <div className={styles.option}>
          <Ticket
            className={styles.intentionIcon}
            size={26}
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <h3>Quiero visitar la Expo</h3>
          <p>Ubicación y accesos para preparar tu visita.</p>
          <Link to="/#planifica">
            Planificá tu visita <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.option}>
          <Store
            className={styles.intentionIcon}
            size={26}
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <h3>Quiero participar con mi empresa</h3>
          <p>
            Información institucional de la Cámara de Comercio Exterior de
            Jujuy.
          </p>
          {chamber && (
            <a href={chamber.url}>
              Sitio de la Cámara <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          )}
          <p className={styles.pending}>
            El correo y teléfono específicos para consultas comerciales de
            ExpoJuy 2026 están pendientes de confirmación.
          </p>
        </div>
        <div className={styles.option}>
          <Newspaper
            className={styles.intentionIcon}
            size={26}
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <h3>Quiero seguir las novedades</h3>
          <p>Actualizaciones en los canales de ExpoJuy.</p>
          <ul className={styles.socials}>
            {socialChannels.map((channel) => (
              <li key={channel.url}>
                <a href={channel.url}>
                  {channel.name} <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
