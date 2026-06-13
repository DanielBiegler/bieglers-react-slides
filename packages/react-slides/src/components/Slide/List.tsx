import { ReactNode } from "react"
import type { Overrides } from "../../overrides"
import { List as ListHelper, ListProps } from "../List/List"
import styles from "./List.module.css"

export type { ListItem } from "../List/List"

interface SlideListProps extends ListProps {
  /** Optional heading above the list. */
  title?: string
  /** Optional description below the heading. */
  description?: string
  overrides?: Overrides
  /** Non-visual helpers such as <Footnote> or <Notes>. */
  children?: ReactNode
}

export function List({ title, description, overrides, children, ...listProps }: SlideListProps) {
  return (
    <div className={styles.root} style={overrides as React.CSSProperties}>
      {title && <h2 className={styles.heading}>{title}</h2>}
      {description && <p className={styles.description}>{description}</p>}
      <ListHelper {...listProps} />
      {children}
    </div>
  )
}
