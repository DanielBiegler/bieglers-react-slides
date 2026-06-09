import { ReactNode } from "react"
import styles from "./CoverCentered.module.css"

interface CoverCenteredProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  children?: ReactNode
}

export function CoverCentered({ title, subtitle, icon, children }: CoverCenteredProps) {
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.accent} />
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
