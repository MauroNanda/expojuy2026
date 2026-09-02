import styles from "./DemoNotice.module.css";

interface DemoNoticeProps {
  children?: string;
}

export function DemoNotice({
  children = "Contenido de demostración",
}: DemoNoticeProps) {
  return <p className={styles.notice}>{children}</p>;
}
