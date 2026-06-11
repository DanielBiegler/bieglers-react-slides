import { VideoHTMLAttributes } from "react"
import styles from "./Video.module.css"

interface VideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  src: string
  fit?: "cover" | "contain"
}

export function Video({
  src,
  fit = "cover",
  autoPlay = true,
  muted = true,
  loop = false,
  controls = false,
  playsInline = true,
  preload = "metadata",
  ...rest
}: VideoProps) {
  return (
    <div className={styles.root}>
      <video
        className={`${styles.video} ${styles[`fit-${fit}`]}`}
        src={src}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={controls}
        playsInline={playsInline}
        {...rest}
      />
    </div>
  )
}
