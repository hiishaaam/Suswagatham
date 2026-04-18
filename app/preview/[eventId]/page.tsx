import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import GuestPage from '@/app/events/[slug]/GuestPage'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ eventId: string }>
}

export default async function PreviewPage({ params }: Props) {
  const { eventId } = await params
  const supabase = createAdminClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()

  if (error || !event) return notFound()

  return (
    <div className="relative">
      {/* Floating Glassmorphic Pill Banner */}
      <div className="fixed bottom-6 left-0 right-0 z-[100] flex justify-center w-full px-4 pointer-events-none animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-500">
        <div className="bg-ink/80 backdrop-blur-xl border border-gold-light/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-full px-6 py-3 pointer-events-auto flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="font-body text-[13px] tracking-wide text-ivory">
            <strong className="text-gold font-medium mr-1">Preview Mode</strong> 
            <span className="opacity-70 font-light border-l border-ivory/20 pl-2 ml-1">Mock RSVPs will not be saved.</span>
          </span>
        </div>
      </div>
      
      {/* Target Render component with preview mode enabled */}
      <GuestPage 
         event={event} 
         guestToken={null} 
         existingRsvp={null} 
         tokenStr="preview"
         previewMode={true}
      />
    </div>
  )
}
