import { ReactNode } from "react"
import styles from "./Split.module.css"

interface SplitProps {
  left: ReactNode
  right: ReactNode
}

export function Split({ left, right }: SplitProps) {
  return (
    <div className={styles.root}>
      <div className={styles.pane}>{left}</div>
      <div className={styles.pane}>{right}</div>
    </div>
  )
}
