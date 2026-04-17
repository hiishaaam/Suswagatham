export function generateWhatsAppShareUrl(eventSlug: string, familyName?: string): string {
  const isBrowser = typeof window !== 'undefined'
  const origin = isBrowser ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL
  const url = `${origin}/events/${eventSlug}`
  
  const greeting = familyName ? `Hi ${familyName}, y` : 'Y'
  const text = `${greeting}ou're invited to our wedding! Confirm your attendance and receive the venue location: ${url}`
  
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
