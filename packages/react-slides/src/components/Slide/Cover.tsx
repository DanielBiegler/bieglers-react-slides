import { ReactNode } from "react"
import styles from "./Cover.module.css"

interface CoverProps {
  title: string
  subtitle?: string
  author?: string
  date?: string
  children?: ReactNode
}

export function Cover({ title, subtitle, author, date, children }: CoverProps) {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.accent} />
        <div>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      {(author || date) && (
        <div className={styles.meta}>
          {author && <span>{author}</span>}
          {date && <span>{date}</span>}
        </div>
      )}
      {children}
    </div>
  )
}
