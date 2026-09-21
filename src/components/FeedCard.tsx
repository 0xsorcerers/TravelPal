import { X, Shield, Landmark, Bus, HeartPulse, MapPin, type LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import type { FeedAlert, FeedCategory } from '../lib/mockFeedData'
import { getNotificationImage } from '../lib/notificationImages'

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>

const CATEGORY_META: Record<FeedCategory, { label: string; color: string; bg: string; Icon: LucideIcon }> = {
  security: { label: 'Security',  color: '#f87171', bg: 'rgba(248,113,113,0.12)', Icon: Shield     },
  cultural: { label: 'Culture',   color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  Icon: Landmark   },
  transport:{ label: 'Transport', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  Icon: Bus        },
  health:   { label: 'Health',    color: '#34d399', bg: 'rgba(52,211,153,0.12)',  Icon: HeartPulse },
  nearby:   { label: 'Nearby',    color: '#c084fc', bg: 'rgba(192,132,252,0.12)', Icon: MapPin     },
}

interface Props {
  alert: FeedAlert
  isRead: boolean
  onMarkRead: (id: string) => void
  onDismiss: (id: string) => void
}

export function FeedCard({ alert, isRead, onMarkRead, onDismiss }: Props) {
  const meta = CATEGORY_META[alert.category]
  const Icon = meta.Icon
  const imgSrc = getNotificationImage(alert.id)

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        border: `1px solid ${isRead ? 'var(--border)' : meta.color + '35'}`,
        opacity: isRead ? 0.68 : 1,
        background: 'var(--surface-muted)',
      }}
    >
      {/* ── Solid category header — always visible ── */}
      <div
        className="flex items-center justify-between px-3 pt-3 pb-2"
        style={{ background: meta.bg, borderBottom: `1px solid ${meta.color}20` }}
      >
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${meta.color}20` }}
          >
            <Icon size={12} style={{ color: meta.color }} />
          </div>
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: meta.color, letterSpacing: '0.07em' }}
          >
            {meta.label}
          </span>
        </div>
        <button
          onClick={() => onDismiss(alert.id)}
          className="p-1 rounded-full transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--muted)' }}
          title="Dismiss"
        >
          <X size={12} />
        </button>
      </div>

      {/* ── Optional decorative image strip ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 72 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imgSrc})` }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(10,22,40,0.25) 0%, rgba(10,22,40,0.65) 100%)' }}
        />
        {/* Title floated over image */}
        <div className="absolute inset-x-0 bottom-0 px-3 pb-2">
          <p
            className="text-sm font-semibold leading-tight"
            style={{ color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}
          >
            {alert.title}
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-3 py-3">
        <p className="text-xs leading-relaxed text-pretty mb-2.5" style={{ color: 'var(--muted)' }}>
          {alert.body}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'var(--subtle)' }}>
            {alert.source} · {alert.time}
          </span>
          {!isRead && (
            <button
              onClick={() => onMarkRead(alert.id)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all active:scale-95"
              style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}30` }}
            >
              Mark read
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
