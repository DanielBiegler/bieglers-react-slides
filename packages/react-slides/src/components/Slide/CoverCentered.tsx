import { ReactNode } from "react"
import type { Overrides } from "../../overrides"
import styles from "./CoverCentered.module.css"

interface CoverCenteredProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  overrides?: Overrides
  children?: ReactNode
}

export function CoverCentered({ title, subtitle, icon, overrides, children }: CoverCenteredProps) {
  return (
    <div className={styles.root} style={overrides as React.CSSProperties}>
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
