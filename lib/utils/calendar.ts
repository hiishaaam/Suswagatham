export function generateGoogleCalendarUrl(event: any): string {
  if (!event) return ''
  
  const dateStr = event.event_date.replace(/-/g, '')
  const title = encodeURIComponent(`${event.couple_names}'s Wedding`)
  const details = encodeURIComponent(`We can't wait to celebrate with you!`)
  const loc = `${event.venue_name || ''} ${event.venue_address || ''}`.trim()
  const location = encodeURIComponent(loc)
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}&details=${details}&location=${location}`
}
