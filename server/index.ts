/**
 * Travel Pal backend — Gemini-powered geo-fenced feed API
 * Runs on port 3001. The Vite dev server proxies /api → here.
 * The Gemini API key never leaves this process.
 */

const PORT = 3001

export interface FeedAlert {
  id: string
  category: 'security' | 'cultural' | 'transport' | 'health'
  title: string
  body: string
  source: string
  time: string
}

interface GeminiFeedResponse {
  alerts: FeedAlert[]
  generatedBy: 'gemini' | 'mock'
}

// ── Gemini call ──────────────────────────────────────────────────────────────

async function fetchGeminiFeed(
  countryCode: string,
  city: string,
  country: string,
  lat: number,
  lng: number,
): Promise<FeedAlert[]> {
  const apiKey = process.env.VITE_GEMINI_API_KEY
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY not set')

  const prompt = `You are Travel Pal, a geo-aware travel assistant. Generate exactly 5 highly localised travel alerts for a traveller currently in ${city}, ${country} (${countryCode}) at coordinates ${lat.toFixed(4)}, ${lng.toFixed(4)}.

Return ONLY a valid JSON array (no markdown, no code fences) with exactly 5 objects, each with these fields:
- id: string (unique, e.g. "${countryCode.toLowerCase()}-ai-1")
- category: one of "security" | "cultural" | "transport" | "health"
- title: string (max 50 chars, specific to this location)
- body: string (2-3 sentences, actionable, specific to ${city}/${country})
- source: string (credible source name, e.g. "Travel Pal AI", "Local Authority", "WHO")
- time: string (e.g. "just now", "1h ago", "2h ago")

Mix categories: include at least 1 security, 1 cultural, 1 transport. Be specific to ${city} — name real landmarks, districts, or local services. Do not use generic advice.`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
      signal: AbortSignal.timeout(15000),
    }
  )

  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText)
    throw new Error(`Gemini API error ${res.status}: ${txt}`)
  }

  const json = await res.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }

  const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  const parsed = JSON.parse(cleaned) as FeedAlert[]
  if (!Array.isArray(parsed)) throw new Error('Gemini returned non-array')
  return parsed.slice(0, 6)
}

// ── Simple HTTP server ───────────────────────────────────────────────────────

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const _server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    // ── GET /feed ──────────────────────────────────────────────────────────
    if (req.method === 'GET' && url.pathname === '/feed') {
      const countryCode = url.searchParams.get('countryCode') ?? 'US'
      const city = url.searchParams.get('city') ?? 'Unknown City'
      const country = url.searchParams.get('country') ?? 'Unknown Country'
      const lat = parseFloat(url.searchParams.get('lat') ?? '0')
      const lng = parseFloat(url.searchParams.get('lng') ?? '0')

      const hasKey = !!process.env.VITE_GEMINI_API_KEY

      try {
        if (!hasKey) throw new Error('No Gemini key — using mock')
        const alerts = await fetchGeminiFeed(countryCode, city, country, lat, lng)
        const body: GeminiFeedResponse = { alerts, generatedBy: 'gemini' }
        return new Response(JSON.stringify(body), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        })
      } catch (err) {
        // Fallback: return a signal so the frontend uses its built-in mock data
        const body: GeminiFeedResponse = {
          alerts: [],
          generatedBy: 'mock',
        }
        return new Response(JSON.stringify(body), {
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        })
      }
    }

    // ── GET /health ────────────────────────────────────────────────────────
    if (url.pathname === '/health') {
      return new Response(
        JSON.stringify({ ok: true, gemini: !!process.env.VITE_GEMINI_API_KEY }),
        { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      )
    }

    return new Response('Not found', { status: 404, headers: CORS_HEADERS })
  },
})

console.log(`Travel Pal API server running on port ${PORT}`)
