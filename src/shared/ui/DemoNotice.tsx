import styles from "./DemoNotice.module.css";

interface DemoNoticeProps {
  className?: string;
  children?: string;
}

export function DemoNotice({
  className,
  children = "Contenido de demostración",
}: DemoNoticeProps) {
  return <p className={`${styles.notice} ${className ?? ""}`}>{children}</p>;
}
