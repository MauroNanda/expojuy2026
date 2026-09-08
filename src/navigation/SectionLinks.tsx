import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";

interface SectionLinksProps {
  label: string;
  links: readonly { label: string; to: string }[];
  onNavigate: () => void;
}

export function SectionLinks({ label, links, onNavigate }: SectionLinksProps) {
  return (
    <details className={styles.moreLinks} name="global-navigation-sections">
      <summary aria-label={label}>
        <ChevronDown aria-hidden="true" size={15} />
      </summary>
      <ul>
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} onClick={onNavigate}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
