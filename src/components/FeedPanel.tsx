import { Bell, BellOff } from 'lucide-react'
import { FeedCard } from './FeedCard'
import type { FeedAlert } from '../lib/mockFeedData'

interface Props {
  alerts: FeedAlert[]
  readIds: Set<string>
  unreadCount: number
  filter: 'all' | 'unread'
  onFilterChange: (f: 'all' | 'unread') => void
  onMarkRead: (id: string) => void
  onDismiss: (id: string) => void
}

export function FeedPanel({
  alerts,
  readIds,
  unreadCount,
  filter,
  onFilterChange,
  onMarkRead,
  onDismiss,
}: Props) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Spectral strip */}
      <div className="spectral-strip" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell size={16} style={{ color: 'var(--gold)' }} />
          <span className="display font-semibold text-sm" style={{ color: 'var(--ink)' }}>
            Local Alerts
          </span>
          {unreadCount > 0 && (
            <span
              className="rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--danger)', color: 'white' }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1">
          {(['all', 'unread'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => onFilterChange(tab)}
              className="px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all"
              style={{
                background: filter === tab ? 'var(--accent)' : 'var(--surface)',
                color: filter === tab ? '#0a1628' : 'var(--muted)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="px-4 pb-4 flex flex-col gap-2 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center py-8 gap-2" style={{ color: 'var(--subtle)' }}>
            <BellOff size={28} strokeWidth={1.2} />
            <p className="text-xs">No {filter === 'unread' ? 'unread ' : ''}alerts for your location</p>
          </div>
        ) : (
          alerts.map(alert => (
            <FeedCard
              key={alert.id}
              alert={alert}
              isRead={readIds.has(alert.id)}
              onMarkRead={onMarkRead}
              onDismiss={onDismiss}
            />
          ))
        )}
      </div>
    </div>
  )
}
