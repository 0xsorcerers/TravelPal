// Bundled travel background images — lowest priority fallback
// Drop real .webp travel photos into src/assets/images/backgrounds/ to replace these.
import bg1 from '../assets/images/backgrounds/bg1.webp'
import bg2 from '../assets/images/backgrounds/bg2.webp'
import bg3 from '../assets/images/backgrounds/bg3.webp'
import bg4 from '../assets/images/backgrounds/bg4.webp'
import bg5 from '../assets/images/backgrounds/bg5.webp'
import bg6 from '../assets/images/backgrounds/bg6.webp'

export const BUNDLED_BACKGROUNDS: string[] = [bg1, bg2, bg3, bg4, bg5, bg6]

let lastIndex = -1

export function getRandomBundledBackground(): string {
  let idx: number
  do {
    idx = Math.floor(Math.random() * BUNDLED_BACKGROUNDS.length)
  } while (idx === lastIndex && BUNDLED_BACKGROUNDS.length > 1)
  lastIndex = idx
  return BUNDLED_BACKGROUNDS[idx]
}
