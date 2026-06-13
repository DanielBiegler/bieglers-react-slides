import { ReactNode } from "react"
import type { Overrides } from "../../overrides"
import styles from "./Video.module.css"

interface SlideVideoProps {
  src: string
  fit?: "cover" | "contain"
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  controls?: boolean
  poster?: string
  title?: string
  description?: string
  overrides?: Overrides
  children?: ReactNode
}

export function Video({
  src,
  fit = "cover",
  autoPlay = true,
  muted = true,
  loop = false,
  controls = false,
  poster,
  title,
  description,
  overrides,
  children,
}: SlideVideoProps) {
  return (
    <div className={styles.root} style={overrides as React.CSSProperties}>
      <video
        className={styles.video}
        src={src}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        poster={poster}
        playsInline
        preload="metadata"
        style={{ objectFit: fit }}
      />
      {(title || description) && (
        <div className={styles.caption}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
