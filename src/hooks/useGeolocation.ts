import { useState, useEffect, useCallback, useRef } from 'react'

export interface GeoLocation {
  lat: number
  lng: number
  country: string
  countryCode: string
  city: string
  region: string
  timezone: string
  loading: boolean
  error: string | null
  source: 'ip' | 'gps' | 'initial'
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ── IP Geolocation (ip-api.com — free, no key, ~300ms, no permission needed) ──
interface IpApiResponse {
  status: string
  country: string
  countryCode: string
  regionName: string
  city: string
  lat: number
  lon: number
  timezone: string
}

async function geoFromIp(): Promise<Omit<GeoLocation, 'loading' | 'error' | 'source'>> {
  const res = await fetch('https://ip-api.com/json/?fields=status,country,countryCode,regionName,city,lat,lon,timezone', {
    signal: AbortSignal.timeout(6000),
  })
  const data = await res.json() as IpApiResponse
  if (data.status !== 'success') throw new Error('ip-api returned failure')
  return {
    lat: data.lat,
    lng: data.lon,
    country: data.country,
    countryCode: data.countryCode,
    city: data.city,
    region: data.regionName,
    timezone: data.timezone,
  }
}

// ── Nominatim reverse geocode (GPS coords → place names) ──
interface NominatimAddress {
  city?: string
  town?: string
  village?: string
  county?: string
  state_district?: string
  state?: string
  region?: string
  country?: string
  country_code?: string
}
interface NominatimResponse { address: NominatimAddress }

async function reverseGeocode(lat: number, lng: number): Promise<Omit<GeoLocation, 'lat' | 'lng' | 'loading' | 'error' | 'source'>> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en' },
    signal: AbortSignal.timeout(8000),
  })
  const data = await res.json() as NominatimResponse
  const addr: NominatimAddress = data.address ?? {}
  const city = addr.city ?? addr.town ?? addr.village ?? addr.county ?? addr.state_district ?? addr.state ?? 'Unknown'
  const country = addr.country ?? 'Unknown'
  const countryCode = (addr.country_code ?? 'US').toUpperCase()
  const region = addr.state ?? addr.region ?? city
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'UTC'
  return { country, countryCode, city, region, timezone }
}

// ── Initial state ──
const INITIAL: GeoLocation = {
  lat: 0, lng: 0,
  country: 'Unknown', countryCode: 'US',
  city: 'Detecting location…', region: '',
  timezone: 'UTC',
  loading: true, error: null,
  source: 'initial',
}

export function useGeolocation() {
  const [geo, setGeo] = useState<GeoLocation>(INITIAL)
  const resolvedRef = useRef(false)

  // ── Step 1: IP geolocation fires immediately, no permission needed ──
  useEffect(() => {
    let cancelled = false

    async function runIpGeo() {
      try {
        const info = await geoFromIp()
        if (cancelled || resolvedRef.current) return
        setGeo(prev => ({
          ...prev,
          ...info,
          loading: false,
          error: null,
          source: 'ip',
        }))
      } catch {
        if (cancelled) return
        // IP geo failed — mark loading done so UI doesn't hang
        setGeo(prev => ({
          ...prev,
          loading: false,
          city: 'Location unavailable',
          source: 'ip',
        }))
      }
    }

    void runIpGeo()
    return () => { cancelled = true }
  }, [])

  // ── Step 2: GPS override when browser grants permission (higher accuracy) ──
  const detectGps = useCallback(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        void reverseGeocode(lat, lng).then(info => {
          resolvedRef.current = true
          setGeo(prev => ({
            ...prev,
            ...info,
            lat, lng,
            loading: false,
            error: null,
            source: 'gps',
          }))
        }).catch(() => {
          // Nominatim failed — keep IP data, just update coordinates
          setGeo(prev => ({ ...prev, lat, lng, source: 'gps' }))
        })
      },
      () => {
        // GPS denied — IP geo already handled it, no action needed
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300_000 }
    )
  }, [])

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    detectGps()
    // Re-check GPS every 5 minutes in case user moves
    const id = setInterval(() => {
      // oxlint-disable-next-line react/set-state-in-effect
      detectGps()
    }, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [detectGps])

  return geo
}
