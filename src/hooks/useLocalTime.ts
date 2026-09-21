import { useReducer, useEffect } from 'react'

export interface LocalTime {
  timeStr: string
  dateStr: string
  greet: string
}

function getLocalTime(timezone: string): LocalTime {
  const now = new Date()
  const opts: Intl.DateTimeFormatOptions = {
    timeZone: timezone || undefined,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }
  const dateOpts: Intl.DateTimeFormatOptions = {
    timeZone: timezone || undefined,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }
  const timeStr = new Intl.DateTimeFormat('en-US', opts).format(now)
  const dateStr = new Intl.DateTimeFormat('en-US', dateOpts).format(now)
  const hourStr = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone || undefined,
    hour: 'numeric',
    hour12: false,
  }).format(now)
  const hour = parseInt(hourStr, 10)
  let greet = 'Good evening'
  if (hour >= 5 && hour < 12) greet = 'Good morning'
  else if (hour >= 12 && hour < 17) greet = 'Good afternoon'
  return { timeStr, dateStr, greet }
}

// Use a tick counter so the component re-renders every second without setState-in-effect
export function useLocalTime(timezone: string): LocalTime {
  const [, tick] = useReducer((n: number) => n + 1, 0)

  useEffect(() => {
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [tick])

  return getLocalTime(timezone)
}
