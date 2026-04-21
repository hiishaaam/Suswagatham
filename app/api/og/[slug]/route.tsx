import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Fetch event data
  let coupleNames = 'You\'re Invited'
  let eventDate = ''
  let venueName = ''
  let templateId = 'ivory-luxe'

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('events')
      .select('couple_names, event_date, venue_name, template_id')
      .eq('event_slug', slug)
      .single()

    if (data) {
      const event = data as any
      coupleNames = event.couple_names || coupleNames
      eventDate = event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''
      venueName = event.venue_name || ''
      templateId = event.template_id || templateId
    }
  } catch {
    // Use defaults if fetch fails
  }

  // Template-based accent colors
  const TEMPLATE_COLORS: Record<string, { bg: string; accent: string; text: string }> = {
    'emerald-islamic': { bg: '#1B3D2F', accent: '#C4A44A', text: '#F5F0E8' },
    'ivory-luxe': { bg: '#1A1208', accent: '#CAA867', text: '#FAF7F2' },
    'amethyst-dream': { bg: '#1A1A2E', accent: '#9B59B6', text: '#F0E6F6' },
    'warm-rustic': { bg: '#2C1810', accent: '#D4956A', text: '#FFF5ED' },
    'ivory-garden': { bg: '#1A2A1A', accent: '#7CB37C', text: '#F0FAF0' },
  }

  const colors = TEMPLATE_COLORS[templateId] || TEMPLATE_COLORS['ivory-luxe']

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200',
          height: '630',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: colors.bg,
          position: 'relative',
        }}
      >
        {/* Decorative corners */}
        <div style={{ position: 'absolute', top: '24px', left: '24px', width: '80px', height: '80px', borderTop: `3px solid ${colors.accent}`, borderLeft: `3px solid ${colors.accent}`, display: 'flex' }} />
        <div style={{ position: 'absolute', top: '24px', right: '24px', width: '80px', height: '80px', borderTop: `3px solid ${colors.accent}`, borderRight: `3px solid ${colors.accent}`, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '24px', left: '24px', width: '80px', height: '80px', borderBottom: `3px solid ${colors.accent}`, borderLeft: `3px solid ${colors.accent}`, display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '24px', right: '24px', width: '80px', height: '80px', borderBottom: `3px solid ${colors.accent}`, borderRight: `3px solid ${colors.accent}`, display: 'flex' }} />

        {/* Top label */}
        <div style={{ display: 'flex', fontSize: '14px', color: colors.accent, letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '16px' }}>
          Wedding Invitation
        </div>

        {/* Couple Names */}
        <div style={{ display: 'flex', fontSize: '64px', color: colors.text, fontWeight: 700, textAlign: 'center', lineHeight: 1.1, maxWidth: '900px' }}>
          {coupleNames}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', width: '120px', height: '2px', background: colors.accent, margin: '24px 0' }} />

        {/* Date */}
        {eventDate && (
          <div style={{ display: 'flex', fontSize: '22px', color: colors.accent, fontWeight: 600, letterSpacing: '3px' }}>
            {eventDate}
          </div>
        )}

        {/* Venue */}
        {venueName && (
          <div style={{ display: 'flex', fontSize: '16px', color: `${colors.text}99`, marginTop: '8px', letterSpacing: '2px' }}>
            {venueName}
          </div>
        )}

        {/* Bottom branding */}
        <div style={{ position: 'absolute', bottom: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', width: '24px', height: '24px', background: colors.accent, borderRadius: '4px', alignItems: 'center', justifyContent: 'center', color: colors.bg, fontSize: '12px', fontWeight: 700 }}>
            W
          </div>
          <div style={{ display: 'flex', fontSize: '14px', color: `${colors.text}66`, letterSpacing: '3px' }}>
            WEDDWISE
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
