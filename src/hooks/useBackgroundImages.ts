import { useState, useEffect, useRef, useCallback } from 'react'
import { BUNDLED_BACKGROUNDS, getRandomBundledBackground } from '../lib/backgroundImages'
import { fetchWikimediaThumbnail } from '../lib/wikimediaFetch'
import { haversineKm } from './useGeolocation'

export type ImageSource = 'user' | 'geo' | 'bundled'

const USER_PHOTOS_KEY = 'travelpal_user_photos'
const USE_MY_PHOTOS_KEY = 'travelpal_use_my_photos'

function loadUserPhotos(): string[] {
  try {
    const raw = localStorage.getItem(USER_PHOTOS_KEY)
    if (raw) return JSON.parse(raw) as string[]
  } catch {}
  return []
}

function saveUserPhotos(photos: string[]) {
  try {
    localStorage.setItem(USER_PHOTOS_KEY, JSON.stringify(photos))
  } catch {}
}

interface BackgroundState {
  currentBackground: string
  imageSource: ImageSource
  userPhotos: string[]
  useMyPhotos: boolean
  geoPhoto: string | null
  allImages: string[]
}

interface UseBackgroundImagesReturn extends BackgroundState {
  addUserPhotos: (files: FileList) => void
  removeUserPhoto: (idx: number) => void
  toggleMyPhotos: (val: boolean) => void
  cycleNext: () => void
}

export function useBackgroundImages(params: {
  city: string
  countryCode: string
  lat: number
  lng: number
}): UseBackgroundImagesReturn {
  const { city, countryCode, lat, lng } = params
  const [userPhotos, setUserPhotos] = useState<string[]>(loadUserPhotos)
  const [useMyPhotos, setUseMyPhotos] = useState<boolean>(() => {
    try { return localStorage.getItem(USE_MY_PHOTOS_KEY) === 'true' } catch { return false }
  })
  const [geoPhoto, setGeoPhoto] = useState<string | null>(null)
  const [bundledBg] = useState<string>(getRandomBundledBackground)
  const [currentUserIdx, setCurrentUserIdx] = useState(0)
  const lastGeoRef = useRef<{ lat: number; lng: number; code: string }>({ lat: 0, lng: 0, code: '' })

  // Fetch Wikimedia image when location changes significantly
  useEffect(() => {
    if (!city || city === 'Detecting…' || city === 'Unknown') return
    const prev = lastGeoRef.current
    const dist = prev.lat !== 0 ? haversineKm(prev.lat, prev.lng, lat, lng) : 999
    if (dist < 10 && prev.code === countryCode) return
    lastGeoRef.current = { lat, lng, code: countryCode }

    void fetchWikimediaThumbnail(city, countryCode).then(url => {
      if (url) setGeoPhoto(url)
    })
  }, [city, countryCode, lat, lng])

  const addUserPhotos = useCallback((files: FileList) => {
    const readers: Promise<string>[] = []
    for (let i = 0; i < Math.min(files.length, 20); i++) {
      const file = files[i]
      readers.push(new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = e => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      }))
    }
    void Promise.all(readers).then(newUrls => {
      setUserPhotos(prev => {
        const combined = [...prev, ...newUrls].slice(0, 20)
        saveUserPhotos(combined)
        return combined
      })
    })
  }, [])

  const removeUserPhoto = useCallback((idx: number) => {
    setUserPhotos(prev => {
      const next = prev.filter((_, i) => i !== idx)
      saveUserPhotos(next)
      return next
    })
  }, [])

  const toggleMyPhotos = useCallback((val: boolean) => {
    setUseMyPhotos(val)
    try { localStorage.setItem(USE_MY_PHOTOS_KEY, String(val)) } catch {}
  }, [])

  const cycleNext = useCallback(() => {
    if (useMyPhotos && userPhotos.length > 0) {
      setCurrentUserIdx(i => (i + 1) % userPhotos.length)
    }
  }, [useMyPhotos, userPhotos.length])

  // Derive current background and source
  let currentBackground: string
  let imageSource: ImageSource

  if (useMyPhotos && userPhotos.length > 0) {
    currentBackground = userPhotos[currentUserIdx % userPhotos.length]
    imageSource = 'user'
  } else if (geoPhoto) {
    currentBackground = geoPhoto
    imageSource = 'geo'
  } else {
    currentBackground = bundledBg
    imageSource = 'bundled'
  }

  const allImages: string[] = [
    ...userPhotos,
    ...(geoPhoto ? [geoPhoto] : []),
    ...BUNDLED_BACKGROUNDS,
  ]

  return {
    currentBackground,
    imageSource,
    userPhotos,
    useMyPhotos,
    geoPhoto,
    allImages,
    addUserPhotos,
    removeUserPhoto,
    toggleMyPhotos,
    cycleNext,
  }
}
