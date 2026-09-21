import { useState, useCallback, useEffect, useRef } from 'react'
import { getAlertsForCountry, type FeedAlert } from '../lib/mockFeedData'

const READ_KEY = 'travelpal_feed_read'

function loadRead(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_KEY)
    if (raw) return new Set(JSON.parse(raw) as string[])
  } catch {}
  return new Set()
}

function saveRead(ids: Set<string>) {
  try { localStorage.setItem(READ_KEY, JSON.stringify([...ids])) } catch {}
}

// ── Wikipedia summary → "nearby" card ──────────────────────────────────────
interface WikiSummary { extract?: string; description?: string }

async function fetchWikiSummary(city: string): Promise<string | null> {
  if (!city || city === 'Detecting location…' || city === 'Location unavailable' || city === 'Unknown') return null
  try {
    const slug = encodeURIComponent(city.replace(/ /g, '_'))
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    const data = await res.json() as WikiSummary
    const extract = data.extract ?? ''
    if (!extract || extract.length < 40) return null
    // Trim to ~2 sentences / 280 chars
    const sentences = extract.match(/[^.!?]+[.!?]+/g) ?? []
    return sentences.slice(0, 2).join(' ').slice(0, 280).trim() || null
  } catch {
    return null
  }
}

export function useFeed(countryCode: string, city: string) {
  const baseAlerts = getAlertsForCountry(countryCode)
  const [extraAlerts, setExtraAlerts] = useState<FeedAlert[]>([])
  const [readIds, setReadIds] = useState<Set<string>>(loadRead)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const lastCity = useRef('')

  // Fetch Wikipedia summary for the detected city
  useEffect(() => {
    if (!city || city === lastCity.current) return
    lastCity.current = city
    let cancelled = false

    async function run() {
      const summary = await fetchWikiSummary(city)
      if (cancelled || !summary) return
      const card: FeedAlert = {
        id: `wiki-${city.toLowerCase().replace(/\s+/g, '-')}`,
        category: 'nearby',
        title: `About ${city}`,
        body: summary,
        source: 'Wikipedia',
        time: 'just now',
      }
      setExtraAlerts([card])
    }

    void run()
    return () => { cancelled = true }
  }, [city])

  const markRead = useCallback((id: string) => {
    setReadIds(prev => {
      const next = new Set(prev)
      next.add(id)
      saveRead(next)
      return next
    })
  }, [])

  const dismiss = markRead

  // Nearby card first, then country alerts
  const allAlerts = [...extraAlerts, ...baseAlerts]
  const unreadCount = allAlerts.filter(a => !readIds.has(a.id)).length

  const visible = filter === 'unread'
    ? allAlerts.filter(a => !readIds.has(a.id))
    : allAlerts

  return { alerts: visible, allAlerts, readIds, unreadCount, markRead, dismiss, filter, setFilter }
}
