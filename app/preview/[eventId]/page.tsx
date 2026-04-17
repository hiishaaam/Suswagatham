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
      {/* Sticky Banner */}
      <div className="sticky top-0 z-[100] w-full bg-gold text-ink font-body text-[14px] font-medium py-3 px-4 text-center shadow-md">
        <span className="font-bold">🔒 Preview Mode</span> — This is how your guests will see the invitation. 
        Share this link with us on WhatsApp to request changes.
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
