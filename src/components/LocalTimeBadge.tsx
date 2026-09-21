import { MapPin, Clock } from 'lucide-react'
import { useLocalTime } from '../hooks/useLocalTime'

interface Props {
  city: string
  country: string
  timezone: string
}

export function LocalTimeBadge({ city, country, timezone }: Props) {
  const { timeStr, dateStr } = useLocalTime(timezone)

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 glass-pill px-3 py-1.5 w-fit">
        <MapPin size={12} style={{ color: 'var(--accent)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--ink-2)' }}>
          {city}{country && city !== 'Detecting…' ? `, ${country}` : ''}
        </span>
      </div>
      <div className="flex items-center gap-1.5 glass-pill px-3 py-1.5 w-fit">
        <Clock size={12} style={{ color: 'var(--teal)' }} />
        <span className="mono text-xs" style={{ color: 'var(--ink-2)' }}>
          {timeStr}
        </span>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          · {dateStr}
        </span>
      </div>
    </div>
  )
}
