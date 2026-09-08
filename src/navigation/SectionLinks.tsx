import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";

interface SectionLinksProps {
  label: string;
  links: readonly { label: string; to: string }[];
  groups?: readonly {
    label: string;
    links: readonly { label: string; to: string }[];
  }[];
  onNavigate: () => void;
}

export function SectionLinks({
  label,
  links,
  groups,
  onNavigate,
}: SectionLinksProps) {
  return (
    <details className={styles.moreLinks} name="global-navigation-sections">
      <summary aria-label={label}>
        <ChevronDown aria-hidden="true" size={15} />
      </summary>
      {groups ? (
        <div className={styles.groupedLinks}>
          {groups.map((group) => (
            <section
              key={group.label}
              aria-labelledby={`${label}-${group.label}`}
            >
              <h3 id={`${label}-${group.label}`}>{group.label}</h3>
              <ul>
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} onClick={onNavigate}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <ul>
          {links.map((link) => (
            <li key={link.to}>
              <Link to={link.to} onClick={onNavigate}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}
