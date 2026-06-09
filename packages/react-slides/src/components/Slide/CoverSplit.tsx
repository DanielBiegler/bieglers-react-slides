import { ReactNode } from "react"
import styles from "./CoverSplit.module.css"

interface CoverSplitProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  children?: ReactNode
}

export function CoverSplit({ title, subtitle, icon, children }: CoverSplitProps) {
  return (
    <div className={styles.root}>
      <div className={styles.panel}>
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
      <div className={styles.body}>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}
