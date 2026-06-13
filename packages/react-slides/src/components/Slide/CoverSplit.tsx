import { ReactNode } from "react"
import type { Overrides } from "../../overrides"
import styles from "./CoverSplit.module.css"

interface CoverSplitProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  iconDirection?: "row" | "column"
  image?: string
  imageFilter?: boolean | number
  overrides?: Overrides
  children?: ReactNode
}

export function CoverSplit({ title, subtitle, icon, iconDirection = "row", image, imageFilter, overrides, children }: CoverSplitProps) {
  const overlayOpacity = imageFilter === false || imageFilter === undefined
    ? 0
    : imageFilter === true ? 1 : imageFilter

  return (
    <div className={styles.root} style={overrides as React.CSSProperties}>
      <div className={styles.panel}>
        {image && <img src={image} className={styles.panelImage} alt="" />}
        {overlayOpacity > 0 && (
          <div className={styles.panelOverlay} style={{ "--overlay-opacity": overlayOpacity } as React.CSSProperties} />
        )}
        {icon && (
          <div className={styles.icon} style={{ flexDirection: iconDirection }}>
            {icon}
          </div>
        )}
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
