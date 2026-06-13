import { ReactNode } from "react"
import type { Overrides } from "../../overrides"
import styles from "./Cover.module.css"

interface CoverProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  overrides?: Overrides
  children?: ReactNode
}

export function Cover({ title, subtitle, icon, overrides, children }: CoverProps) {
  return (
    <div className={styles.root} style={overrides as React.CSSProperties}>
      <div className={styles.content}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.titleGroup}>
          <div className={styles.accent} />
          <div>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
