// Notification card background images — drop real .webp travel/destination photos here.
// Each alert card picks a random image from this pool on mount and keeps it stable.
import n1 from '../assets/images/notifications/n1.webp'
import n2 from '../assets/images/notifications/n2.webp'
import n3 from '../assets/images/notifications/n3.webp'
import n4 from '../assets/images/notifications/n4.webp'
import n5 from '../assets/images/notifications/n5.webp'
import n6 from '../assets/images/notifications/n6.webp'
import n7 from '../assets/images/notifications/n7.webp'
import n8 from '../assets/images/notifications/n8.webp'

export const NOTIFICATION_IMAGES: string[] = [n1, n2, n3, n4, n5, n6, n7, n8]

// Deterministic pick by alert id so the same card always gets the same image
export function getNotificationImage(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return NOTIFICATION_IMAGES[hash % NOTIFICATION_IMAGES.length]
}
