const CACHE_KEY = 'travelpal_geo_images'

function loadCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) return JSON.parse(raw) as Record<string, string>
  } catch {}
  return {}
}

function saveCache(cache: Record<string, string>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {}
}

interface WikiSummary {
  thumbnail?: {
    source?: string
  }
}

export async function fetchWikimediaThumbnail(city: string, countryCode: string): Promise<string | null> {
  const cache = loadCache()
  const key = `${countryCode}-${city}`
  if (cache[key]) return cache[key]

  try {
    const encoded = encodeURIComponent(city.replace(/ /g, '_'))
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('wiki fetch failed')
    const data = await res.json() as WikiSummary
    const thumb = data.thumbnail?.source ?? null
    if (thumb) {
      const largeThumb = thumb.replace(/\/\d+px-/, '/800px-')
      cache[key] = largeThumb
      saveCache(cache)
      return largeThumb
    }
  } catch {}
  return null
}
