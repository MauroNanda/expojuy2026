import { Link } from "react-router-dom";

import { DemoNotice } from "../../shared/ui/DemoNotice";
import styles from "./EntryPage.module.css";

interface EntryPageProps {
  description: string;
  title: string;
}

export function EntryPage({ description, title }: EntryPageProps) {
  return (
    <section className={styles.entry} aria-labelledby="entry-title">
      <DemoNotice>Estado de entrada · Capacidad pendiente</DemoNotice>
      <h1 id="entry-title">{title}</h1>
      <p>{description}</p>
      <Link to="/">Volver a Inicio</Link>
    </section>
  );
}
