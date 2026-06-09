import { ReactNode } from "react"
import styles from "./Centered.module.css"

interface CenteredProps {
  children: ReactNode
}

export function Centered({ children }: CenteredProps) {
  return <div className={styles.root}>{children}</div>
}
