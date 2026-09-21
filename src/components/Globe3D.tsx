import { useRef, useEffect } from 'react'

interface Props {
  size?: number
}

// Pure CSS + SVG animated globe — no WebGL renderer required
export function Globe3D({ size = 220 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let frame = 0
    let raf: number
    const tick = () => {
      frame++
      const t = frame * 0.4
      el.style.setProperty('--globe-rot', `${t % 360}deg`)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative select-none animate-float"
      style={{ width: size, height: size }}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 38% 35%, rgba(56,189,248,0.18) 0%, rgba(13,40,78,0.55) 55%, transparent 80%)',
          filter: 'blur(18px)',
          transform: 'scale(1.18)',
        }}
      />

      {/* Main sphere */}
      <svg
        viewBox="0 0 220 220"
        width={size}
        height={size}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <defs>
          <radialGradient id="globe-grad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#1e3a8a" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0a1628" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="globe-shine" cx="30%" cy="25%" r="40%">
            <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.35" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <clipPath id="globe-clip">
            <circle cx="110" cy="110" r="92" />
          </clipPath>
          <filter id="globe-shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#0a1628" floodOpacity="0.7" />
          </filter>
        </defs>

        {/* Base sphere */}
        <circle cx="110" cy="110" r="92" fill="url(#globe-grad)" filter="url(#globe-shadow)" />

        {/* Latitude lines */}
        <g clipPath="url(#globe-clip)" stroke="rgba(56,189,248,0.18)" strokeWidth="0.8" fill="none">
          {[-60, -40, -20, 0, 20, 40, 60].map(lat => {
            const y = 110 + (lat / 90) * 92
            const r = Math.cos((lat * Math.PI) / 180) * 92
            return <ellipse key={lat} cx="110" cy={y} rx={r} ry={r * 0.18} />
          })}
        </g>

        {/* Longitude lines (animated rotation via CSS) */}
        <g
          clipPath="url(#globe-clip)"
          stroke="rgba(56,189,248,0.13)"
          strokeWidth="0.8"
          fill="none"
          style={{ transformOrigin: '110px 110px', transform: 'rotate(var(--globe-rot, 0deg))' }}
        >
          {[0, 30, 60, 90, 120, 150].map(lng => (
            <ellipse key={lng} cx="110" cy="110" rx="92" ry={Math.abs(Math.cos((lng * Math.PI) / 180)) * 92 || 8} transform={`rotate(${lng} 110 110)`} />
          ))}
        </g>

        {/* Continent silhouettes (simplified blobs) */}
        <g
          clipPath="url(#globe-clip)"
          fill="rgba(96,165,250,0.22)"
          style={{ transformOrigin: '110px 110px', transform: 'rotate(var(--globe-rot, 0deg))' }}
        >
          {/* North America */}
          <path d="M72 78 Q78 68 92 72 Q100 80 96 92 Q88 100 78 96 Q68 90 72 78Z" />
          {/* Europe */}
          <path d="M118 72 Q126 68 132 75 Q134 84 128 88 Q120 86 116 80 Q114 76 118 72Z" />
          {/* Africa */}
          <path d="M116 92 Q124 90 130 100 Q132 115 124 125 Q116 128 110 120 Q106 108 110 98 Q112 93 116 92Z" />
          {/* Asia */}
          <path d="M134 72 Q148 68 158 78 Q162 92 154 100 Q144 104 136 96 Q130 86 134 72Z" />
          {/* South America */}
          <path d="M84 108 Q92 104 98 112 Q100 126 94 136 Q86 140 80 132 Q76 120 80 112 Q82 108 84 108Z" />
          {/* Australia */}
          <path d="M148 115 Q158 112 164 120 Q166 130 158 136 Q150 138 144 130 Q142 120 148 115Z" />
        </g>

        {/* Shine overlay */}
        <circle cx="110" cy="110" r="92" fill="url(#globe-shine)" />

        {/* Equator highlight */}
        <ellipse cx="110" cy="110" rx="92" ry="16" fill="none" stroke="rgba(56,189,248,0.25)" strokeWidth="1" />

        {/* Animated orbital ring */}
        <ellipse
          cx="110" cy="110" rx="108" ry="22"
          fill="none"
          stroke="rgba(56,189,248,0.4)"
          strokeWidth="1.2"
          strokeDasharray="8 4"
          style={{
            transformOrigin: '110px 110px',
            transform: 'rotate(var(--globe-rot, 0deg))',
          }}
        />

        {/* Outer orbital ring counter-rotating */}
        <ellipse
          cx="110" cy="110" rx="108" ry="22"
          fill="none"
          stroke="rgba(45,212,191,0.25)"
          strokeWidth="0.8"
          transform="rotate(70 110 110)"
          style={{
            transformOrigin: '110px 110px',
          }}
        />

        {/* Dot traveling the ring */}
        <circle r="4" fill="#38bdf8" opacity="0.85">
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            path="M110,88 a108,22 0 1,1 -0.01,0"
          />
        </circle>

        {/* Second traveling dot */}
        <circle r="2.5" fill="#2dd4bf" opacity="0.7">
          <animateMotion
            dur="9s"
            repeatCount="indefinite"
            begin="-3s"
            path="M110,88 a108,22 0 1,0 0.01,0"
          />
        </circle>
      </svg>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { x: '20%', y: '20%', d: '3s' },
          { x: '80%', y: '30%', d: '4.5s' },
          { x: '15%', y: '70%', d: '3.8s' },
          { x: '75%', y: '65%', d: '5s' },
          { x: '50%', y: '10%', d: '4s' },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: 4,
              height: 4,
              left: p.x,
              top: p.y,
              background: 'rgba(56,189,248,0.7)',
              animationDuration: p.d,
              boxShadow: '0 0 6px rgba(56,189,248,0.8)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
