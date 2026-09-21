import { useEffect, useRef, useState } from 'react'
import type { ImageSource } from '../hooks/useBackgroundImages'

interface Props {
  src: string
  source: ImageSource
  children: React.ReactNode
}

const SOURCE_LABELS: Record<ImageSource, string> = {
  user: 'your photo',
  geo: 'near you',
  bundled: 'travel pal',
}

export function ParallaxBackground({ src, source, children }: Props) {
  const [displayedSrc, setDisplayedSrc] = useState(src)
  const [prevSrc, setPrevSrc] = useState<string | null>(null)
  const [fading, setFading] = useState(false)
  const bgRef = useRef<HTMLDivElement>(null)

  // Crossfade when src changes
  const prevDisplayRef = useRef(displayedSrc)
  useEffect(() => {
    if (src === prevDisplayRef.current) return
    const prev = prevDisplayRef.current
    prevDisplayRef.current = src
    setPrevSrc(prev)
    setFading(true)
    const timer = setTimeout(() => {
      setDisplayedSrc(src)
      setPrevSrc(null)
      setFading(false)
    }, 700)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  // CSS parallax on scroll
  useEffect(() => {
    const el = bgRef.current
    if (!el) return
    const onScroll = () => {
      const scrollY = window.scrollY
      el.style.transform = `translateY(${scrollY * 0.35}px) scale(1.15)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* Prev background (fading out) */}
      {fading && prevSrc && (
        <div
          className="fixed inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${prevSrc})`,
            transform: 'scale(1.15)',
            opacity: 1,
            transition: 'opacity 0.7s ease',
            zIndex: 0,
          }}
        />
      )}

      {/* Current background */}
      <div
        ref={bgRef}
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${displayedSrc})`,
          opacity: fading ? 0 : 1,
          transition: fading ? 'opacity 0.7s ease' : undefined,
          transform: 'scale(1.15)',
          zIndex: 1,
        }}
      />

      {/* Dark overlay gradient */}
      <div
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(10,22,40,0.62) 0%, rgba(10,22,40,0.45) 40%, rgba(10,22,40,0.72) 100%)',
          zIndex: 2,
        }}
      />

      {/* Source badge */}
      <div
        className="fixed bottom-4 right-4 glass-pill px-2 py-1 text-xs uppercase tracking-widest"
        style={{ color: 'var(--muted)', zIndex: 10, fontSize: '0.6rem' }}
      >
        {SOURCE_LABELS[source]}
      </div>

      {/* Content — no z-index here so modals rendered via portals (or at body root) can escape */}
      <div className="relative" style={{ zIndex: 3 }}>
        {children}
      </div>
    </div>
  )
}
