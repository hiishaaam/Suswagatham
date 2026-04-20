/* eslint-disable react-hooks/refs */
'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { m, AnimatePresence } from 'motion/react'
import { Check, Loader2, MapPin, Map, Calendar, ChevronDown } from 'lucide-react'
import { Database } from '@/lib/supabase/types'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import WeddingEnvelope from '@/components/ui/WeddingEnvelope'
import dynamic from 'next/dynamic'
import DigitalShagun from '@/components/ui/DigitalShagun'

const TemplateSkeleton = () => <div className="h-[600px] w-full bg-[#0F0C07] flex items-center justify-center"><Loader2 className="animate-spin text-gold w-8 h-8" /></div>;

const MidnightBloom = dynamic(() => import('@/components/templates/templates/MidnightBloom'), { loading: () => <TemplateSkeleton /> })
const KeralaGold = dynamic(() => import('@/components/templates/templates/KeralaGold'), { loading: () => <TemplateSkeleton /> })
const SapphireNight = dynamic(() => import('@/components/templates/templates/SapphireNight'), { loading: () => <TemplateSkeleton /> })
const GardenBloom = dynamic(() => import('@/components/templates/templates/GardenBloom'), { loading: () => <TemplateSkeleton /> })
const MaroonRoyale = dynamic(() => import('@/components/templates/templates/MaroonRoyale'), { loading: () => <TemplateSkeleton /> })
import DynamicTemplate from '@/components/templates/DynamicTemplate'

type Event = Database['public']['Tables']['events']['Row']
type GuestToken = Database['public']['Tables']['guest_tokens']['Row']
type Rsvp = Database['public']['Tables']['rsvps']['Row']

interface GuestPageProps {
  event: Event
  guestToken: GuestToken | null
  existingRsvp: Rsvp | null
  tokenStr?: string
  previewMode?: boolean
}

export default function GuestPage({ event, guestToken, existingRsvp, tokenStr, previewMode = false }: GuestPageProps) {
  const [step, setStep] = useState<number>(existingRsvp ? 0 : 1)
  const [envelopeOpened, setEnvelopeOpened] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

  useEffect(() => {
    // @ts-ignore
    if (event.requires_qr_checkin && tokenStr) {
      QRCode.toDataURL(tokenStr, { margin: 1, scale: 8, color: { dark: '#1A1208', light: '#FAF7F0' } })
        .then(setQrCodeUrl)
        .catch(console.error)
    }
  }, [event, tokenStr])
  
  const templateEventDetails = {
    coupleNames: event.couple_names,
    date: new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    venue: event.venue_name,
    photoUrl: event.couple_photo_url || undefined,
  };

  const getTemplateHero = () => {
    // If we have custom Gemini-generated theme data, use it!
    const anyEvent = event as any;
    if (anyEvent.custom_theme_data) {
      return (
        <DynamicTemplate 
          theme={anyEvent.custom_theme_data} 
          data={{
            coupleNames: event.couple_names || '',
            date: templateEventDetails.date,
            venue: event.venue_name || '',
            ceremonyType: 'Wedding'
          }} 
        />
      );
    }

    switch (event.template_id) {
      case 'emerald-islamic': return <MidnightBloom isPreview={false} eventDetails={templateEventDetails} />;
      case 'ivory-luxe': return <KeralaGold isPreview={false} eventDetails={templateEventDetails} />;
      case 'amethyst-dream': return <MaroonRoyale isPreview={false} eventDetails={templateEventDetails} />;
      case 'warm-rustic': return <SapphireNight isPreview={false} eventDetails={templateEventDetails} />;
      case 'ivory-garden': return <GardenBloom isPreview={false} eventDetails={templateEventDetails} />;
      default: return <KeralaGold isPreview={false} eventDetails={templateEventDetails} />;
    }
  }
  
  const [attending, setAttending] = useState<boolean | null>(null)
  const [guestCount, setGuestCount] = useState<number>(1)
  const [foodPreference, setFoodPreference] = useState<'veg' | 'non_veg' | 'both' | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [revealedEventData, setRevealedEventData] = useState<any>(null)
  const [mapEmbedUrl, setMapEmbedUrl] = useState<string>('')

  const maxAllowedGuests = guestToken ? guestToken.max_guests : event.max_guests_default

  // Intersection observer bindings
  const { ref: heroObserverRef } = useIntersectionObserver()
  const { ref: inviteRef, hasEntered: inviteHasEntered } = useIntersectionObserver({ threshold: 0.2 })
  const { ref: rsvpRef, hasEntered: rsvpHasEntered } = useIntersectionObserver({ threshold: 0.1 })

  const handleAttendanceSelect = (isAttending: boolean) => {
    setAttending(isAttending)
    if (!isAttending) {
      // Skip straight to submit if not attending
      submitRsvp(false)
    } else {
      setStep(2)
    }
  }

  const submitRsvp = async (finalAttending: boolean) => {
    if (finalAttending && !foodPreference) {
      setError('Please select a meal preference.')
      return
    }
    
    if (previewMode) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        if (finalAttending) {
          setRevealedEventData({
            venue_address: event.venue_address || event.venue_name,
            venue_parking_notes: event.venue_parking_notes,
            venue_lat: 10.024227, // mock Kerala lat
            venue_lng: 76.307997  // mock Kerala lng
          })
          setStep(3)
        } else {
          setStep(4)
        }
      }, 1000)
      return
    }

    setError(null)
    setIsLoading(true)
    
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenStr,
          event_id: event.id,
          attending: finalAttending,
          guest_count: guestCount,
          food_preference: foodPreference
        })
      })
      
      const data = await res.json()
      
      if (!data.success) {
        throw new Error(data.message)
      }

      if (finalAttending) {
        setRevealedEventData(data.event)
        const mapUrl = data.event.venue_lat && data.event.venue_lng
          ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY}&q=${data.event.venue_lat},${data.event.venue_lng}&zoom=14`
          : ''
        if (mapUrl) setMapEmbedUrl(mapUrl)
        setStep(3) // Success + Map
      } else {
        setStep(4) // Not attending confirmation
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const generateCalendarUrl = () => {
    // Generate an all-day event format (YYYYMMDD)
    const dateStr = event.event_date.replace(/-/g, '')
    const title = encodeURIComponent(`${event.couple_names} Wedding`)
    const details = encodeURIComponent(`We can't wait to celebrate with you!`)
    const location = encodeURIComponent(event.venue_address || event.venue_name)
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}&details=${details}&location=${location}`
  }

  return (
    <>
      {!envelopeOpened && (
        <WeddingEnvelope 
          coupleNames={event.couple_names || ''} 
          date={new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          onOpenComplete={() => setEnvelopeOpened(true)} 
        />
      )}
      
      {/* We keep the tree rendered but visually hidden until the envelope opens so images can preload */}
      <m.div 
        animate={{ opacity: envelopeOpened ? 1 : 0 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`flex flex-col min-h-screen bg-[#0F0C07] relative items-center sm:py-12 ${!envelopeOpened ? 'h-screen overflow-hidden pointer-events-none' : 'overflow-x-hidden'}`}
      >
        {/* Subtle Ambient Background glow behind the entire card */}
        <div className="fixed inset-0 pointer-events-none flex justify-center">
          <div className="w-[80vw] h-[80vh] max-w-2xl bg-gold/10 blur-[150px] rounded-full mix-blend-screen opacity-60"></div>
        </div>

        {/* --- THE LONG INVITATION CARD WRAPPER --- */}
        <div className="w-full max-w-[480px] mx-auto bg-ivory shadow-[0_30px_100px_rgba(0,0,0,0.8)] sm:rounded-[20px] border-x sm:border border-gold/30 flex flex-col relative z-20 min-h-screen sm:min-h-0 overflow-hidden">
        
        {/* Internal Ornamental Border (Frames the whole card) */}
        <div className="absolute inset-x-2 inset-y-2 border border-gold/20 rounded-md sm:rounded-[12px] pointer-events-none z-50"></div>

      {/* 1. Dynamic Hero Section Layout based on checkout Selection */}
      <section className="relative w-full overflow-hidden flex flex-col justify-end items-center">
        {getTemplateHero()}
      </section>

      {/* 2. Invitation Text */}
      <section 
        // @ts-ignore
        ref={inviteRef}
        className={`bg-ivory relative py-16 px-6 transition-all duration-1000 delay-100 transform ${inviteHasEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="max-w-[480px] mx-auto text-center">
          {/* Top Divider Motif */}
          <div className="flex items-center justify-center my-8">
            <div className="h-px bg-gold/40 flex-1 max-w-[80px]"></div>
            <div className="w-3 h-3 border border-gold rotate-45 mx-6"></div>
            <div className="h-px bg-gold/40 flex-1 max-w-[80px]"></div>
          </div>

          {event.language !== 'english' && event.invitation_text_ml && (
             <p className="font-display text-[22px] text-gold mb-8 leading-relaxed">
               {event.invitation_text_ml}
             </p>
          )}

          {event.invitation_text_en && (
            <p className="font-display text-[20px] italic text-ink/90 leading-[1.8]">
              {event.invitation_text_en}
            </p>
          )}
          
          {!event.invitation_text_en && !event.invitation_text_ml && (
             <p className="font-display text-[20px] italic text-ink/90 leading-[1.8]">
               We joyfully invite you to share our happiness as we unite in love and marriage.
             </p>
          )}

          {/* Bottom Divider Motif */}
          <div className="flex items-center justify-center mt-12 mb-8">
            <div className="h-px bg-gold/40 flex-1 max-w-[80px]"></div>
            <div className="w-3 h-3 border border-gold rotate-45 mx-6"></div>
            <div className="h-px bg-gold/40 flex-1 max-w-[80px]"></div>
          </div>
        </div>
      </section>

      {/* 2.5 Digital Shagun (opt-in) — only show during active event, not post-event */}
      {/* @ts-ignore */}
      {(event as any).accept_shagun && !(event as any).gallery_link && (
        <section className="bg-ivory px-4 pb-8">
          <div className="max-w-md mx-auto">
            <DigitalShagun
              eventId={event.id}
              coupleNames={event.couple_names}
              razorpayKeyId={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''}
            />
          </div>
        </section>
      )}

      {/* 3. RSVP Flow OR Post-Event Portal */}
      {/* @ts-ignore */}
      {(event as any).gallery_link ? (
        /* ── POST-EVENT PORTAL ────────────────────────────────── */
        <section
          // @ts-ignore
          ref={rsvpRef}
          className={`bg-ivory pb-24 px-6 flex-1 transition-all duration-1000 delay-300 transform ${rsvpHasEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-md mx-auto text-center"
          >
            {/* Ornamental divider */}
            <div className="flex items-center justify-center mb-12">
              <div className="h-px bg-gold/40 flex-1 max-w-[60px]"></div>
              <div className="w-3 h-3 border border-gold rotate-45 mx-5"></div>
              <div className="h-px bg-gold/40 flex-1 max-w-[60px]"></div>
            </div>

            {/* Flower icon */}
            <div className="text-5xl mb-6 select-none" aria-hidden>🌸</div>

            <h2 className="font-display text-[32px] leading-tight text-ink mb-4 italic tracking-wide">
              Thank you for celebrating with us
            </h2>
            <p className="font-body text-[15px] text-muted leading-relaxed mb-12">
              The joy you brought to our special day is something we will cherish forever. We&apos;ve put together all the memories — just for you.
            </p>

            {/* Gallery CTA */}
            <a
              href={(event as any).gallery_link}
              target="_blank"
              rel="noopener noreferrer"
              id="gallery-cta-link"
              className="group relative block w-full overflow-hidden rounded-sm shadow-[0_8px_30px_rgba(197,165,89,0.35)] active:scale-[0.98] transition-transform"
            >
              {/* Shimmer layer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"></div>
              <div className="bg-gradient-to-br from-[#C5A559] via-[#D4B96A] to-[#A8873C] text-ink px-6 py-6 flex flex-col items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[3px] text-ink/70">Official Memory Album</span>
                <span className="font-display text-[22px] font-bold tracking-wide">View the Photo Gallery</span>
                <span className="text-2xl mt-1" aria-hidden>→</span>
              </div>
            </a>

            <p className="text-[10px] uppercase tracking-widest text-muted/50 mt-6">
              Opens in a new tab
            </p>

            {/* Bottom ornament */}
            <div className="flex items-center justify-center mt-16 mb-4">
              <div className="h-px bg-gold/30 flex-1 max-w-[40px]"></div>
              <div className="w-2 h-2 border border-gold/50 rotate-45 mx-4"></div>
              <div className="h-px bg-gold/30 flex-1 max-w-[40px]"></div>
            </div>
          </m.div>
        </section>
      ) : (
        /* ── NORMAL RSVP FLOW ─────────────────────────────────── */
        <section 
          // @ts-ignore
          ref={rsvpRef}
          className={`bg-ivory pb-24 px-4 flex-1 transition-all duration-1000 delay-300 transform ${rsvpHasEntered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
        <div className="max-w-md mx-auto relative min-h-[400px]">
          <AnimatePresence mode="wait">

            {/* STEP 0: Existing RSVP View */}
            {step === 0 && existingRsvp && (
              <m.div
                key="step-0"
                initial={{ opacity: 0, translateY: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, translateY: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, translateY: -12, filter: 'blur(4px)' }}
                transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
                className="bg-white border border-gold-light p-8 rounded-sm shadow-card text-center"
              >
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  {existingRsvp.attending ? (
                    <Check className="text-gold" size={24} />
                  ) : (
                    <div className="w-3 h-3 bg-muted rounded-full"></div>
                  )}
                </div>
                <h3 className="font-display text-2xl text-ink mb-2">
                  {existingRsvp.attending ? "You're Attending" : "Not Attending"}
                </h3>
                {existingRsvp.attending && (
                  <p className="text-muted font-body text-sm mb-8 tracking-wide">
                    {existingRsvp.guest_count} Guest{existingRsvp.guest_count > 1 ? 's' : ''} &bull; {
                      existingRsvp.food_preference === 'veg' ? 'Vegetarian' :
                      existingRsvp.food_preference === 'non_veg' ? 'Non-Vegetarian' : 'Both'
                    }
                  </p>
                )}
                {!existingRsvp.attending && (
                  <p className="text-muted font-body text-sm mb-8 tracking-wide">
                    Thank you for letting us know.
                  </p>
                )}

                {/* QR Ticket Display */}
                {/* @ts-ignore */}
                {existingRsvp.attending && event.requires_qr_checkin && qrCodeUrl && (
                  <div className="mb-8 p-4 border border-gold-light/50 bg-ivory/50 rounded-sm">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gold mb-3">Your Entrance Ticket</p>
                    <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40 mx-auto rounded-sm mix-blend-multiply" />
                    <p className="text-[10px] uppercase tracking-widest text-muted mt-3">Please show this code at the venue</p>
                  </div>
                )}
                <m.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep(1)}
                  className="w-full py-4 border border-gold text-gold font-body text-[13px] font-semibold tracking-[2px] uppercase rounded-sm hover:bg-gold/5"
                >
                  Update My Response
                </m.button>
              </m.div>
            )}

            {/* STEP 1: Attendance */}
            {step === 1 && (
              <m.div
                key="step-1"
                initial={{ opacity: 0, translateY: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, translateY: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, translateY: -12, filter: 'blur(4px)' }}
                transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
                className="text-center"
              >
                <h2 className="font-display text-[28px] text-ink mb-8 tracking-wide">Will you be joining us?</h2>
                <div className="space-y-4">
                  <m.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAttendanceSelect(true)}
                    className="w-full flex items-center justify-center min-h-[72px] border border-gold/40 bg-white hover:bg-gold/5 text-ink font-display text-[22px] italic transition-colors rounded-sm shadow-sm"
                  >
                    Yes, I&apos;ll be there
                  </m.button>
                  <m.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleAttendanceSelect(false)}
                    className="w-full flex items-center justify-center min-h-[72px] border border-muted/30 bg-white hover:bg-muted/5 text-muted font-display text-[22px] italic transition-colors rounded-sm shadow-sm"
                  >
                    I cannot attend
                  </m.button>
                </div>
              </m.div>
            )}

            {/* STEP 2: Details */}
            {step === 2 && (
              <m.div
                key="step-2"
                initial={{ opacity: 0, translateY: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, translateY: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, translateY: -12, filter: 'blur(4px)' }}
                transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
              >
                <h2 className="font-display text-[28px] text-ink mb-8 text-center tracking-wide">A few details</h2>
                
                {/* Stepper */}
                <div className="bg-white border border-gold-light p-6 rounded-sm shadow-sm mb-6">
                  <label className="block text-[11px] uppercase tracking-[2px] text-muted mb-6 text-center font-semibold">
                    How many from your family will attend?
                  </label>
                  <div className="flex items-center justify-between px-4">
                    <button 
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      disabled={guestCount <= 1}
                      aria-label="Decrease guest count"
                      className="w-12 h-12 rounded-full border border-gold text-gold disabled:opacity-30 flex items-center justify-center text-3xl font-light hover:bg-gold/5 focus:ring-2 focus:ring-gold focus:outline-none"
                    >
                      -
                    </button>
                    <div className="font-display text-[48px] text-gold w-20 text-center leading-none" role="status" aria-live="polite">
                      {guestCount}
                    </div>
                    <button 
                      onClick={() => setGuestCount(Math.min(maxAllowedGuests, guestCount + 1))}
                      disabled={guestCount >= maxAllowedGuests}
                      aria-label="Increase guest count"
                      className="w-12 h-12 rounded-full border border-gold text-gold disabled:opacity-30 flex items-center justify-center text-3xl font-light hover:bg-gold/5 focus:ring-2 focus:ring-gold focus:outline-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Meal Preference */}
                <div className="bg-white border border-gold-light p-6 rounded-sm shadow-sm mb-8">
                  <label className="block text-[11px] uppercase tracking-[2px] text-muted mb-4 text-center font-semibold">
                    Meal preference
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {([ 
                      { id: 'veg', label: '🌿 Vegetarian' }, 
                      { id: 'non_veg', label: '🍖 Non-Vegetarian' }, 
                      { id: 'both', label: '🍽 Both Preferences' }
                    ] as const).map(pref => (
                      <button
                        key={pref.id}
                        onClick={() => {
                          setFoodPreference(pref.id)
                          setError(null)
                        }}
                        aria-pressed={foodPreference === pref.id}
                        className={`py-3 px-4 border rounded-sm font-body text-[14px] transition-all duration-200 focus:ring-2 focus:ring-gold focus:outline-none ${
                          foodPreference === pref.id 
                            ? 'bg-gold border-gold text-ivory shadow-gold-glow' 
                            : 'bg-white border-gold/30 text-ink hover:border-gold'
                        }`}
                      >
                        {pref.label}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 border border-error/20 bg-error/5 text-error text-[13px] text-center rounded-sm">
                    {error}
                  </div>
                )}

                <m.button
                  whileTap={{ scale: previewMode ? 1 : 0.97 }}
                  onClick={() => submitRsvp(true)}
                  disabled={isLoading || previewMode}
                  aria-busy={isLoading}
                  className={`w-full h-[56px] font-display text-[20px] italic shadow-md rounded-sm flex items-center justify-center focus:ring-2 focus:ring-offset-2 focus:ring-gold focus:outline-none 
                    ${previewMode 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300' 
                      : 'bg-gold text-ink hover:bg-gold/90 transition-colors disabled:opacity-70'}`}
                >
                  {isLoading ? <Loader2 className="animate-spin text-ink" size={24} aria-label="Loading..." role="status" /> : (previewMode ? "RSVP available when live" : "Send RSVP")}
                </m.button>
              </m.div>
            )}

            {/* STEP 3: Map & Success Reveal */}
            {step === 3 && revealedEventData && (
              <m.div
                key="step-3"
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                animate={{ clipPath: 'inset(0 0 0 0)' }}
                transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }} // smooth curtain wipe
                className="bg-white border border-gold p-6 md:p-8 rounded-sm shadow-card"
              >
                <m.div 
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.1 }}
                  className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 relative"
                >
                  <svg className="text-success stroke-success z-10 relative" width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <m.polyline 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                      points="20 6 9 17 4 12" 
                    />
                  </svg>
                  
                  {/* Joyous Particle Pop */}
                  {[...Array(6)].map((_, i) => (
                    <m.div
                      key={i}
                      className="absolute w-2 h-2 bg-success rounded-full"
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        x: Math.cos(i * (Math.PI / 3)) * 45,
                        y: Math.sin(i * (Math.PI / 3)) * 45,
                      }}
                      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    />
                  ))}
                </m.div>
                
                {/* QR Ticket Display */}
                {/* @ts-ignore */}
                {event.requires_qr_checkin && qrCodeUrl && (
                  <div className="mb-10 text-center">
                    <h2 className="font-display text-[26px] text-ink mb-2 italic tracking-wide">
                      Your Entrance Ticket
                    </h2>
                    <div className="inline-block p-4 border border-gold-light/50 bg-ivory/50 rounded-sm mb-2 shadow-sm">
                      <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto rounded-sm mix-blend-multiply" />
                    </div>
                    <p className="text-[11px] uppercase tracking-widest text-muted">Please show this code at the venue</p>
                    <div className="w-10 h-px bg-gold/40 mx-auto mt-8 mb-8"></div>
                  </div>
                )}
                
                <h2 className="font-display text-[26px] text-ink mb-6 text-center italic tracking-wide">
                  Here&apos;s how to find us
                </h2>

                <div className={`w-full h-[300px] rounded-sm overflow-hidden border border-gold/40 mb-6 bg-ivory relative ${previewMode ? 'select-none pointer-events-none' : ''}`}>
                  {previewMode && (
                     <div className="absolute inset-0 z-50 flex items-center justify-center p-4 text-center bg-ivory/60 backdrop-blur-[6px]">
                       <p className="font-display font-bold text-ink text-lg leading-tight uppercase tracking-widest bg-white/90 p-4 border border-gold-light shadow-sm rounded-sm">
                         Venue location will be revealed to guests after they RSVP
                       </p>
                     </div>
                  )}
                  {/* Google Maps Embed using server-side generated URL */}
                  {mapEmbedUrl && (
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0, filter: previewMode ? 'blur(4px)' : 'none' }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={mapEmbedUrl}
                    ></iframe>
                  )}
                </div>

                <div className="mb-8 text-center px-4">
                  <p className="font-body text-[15px] text-ink font-medium leading-relaxed mb-1">
                    {revealedEventData.venue_address || revealedEventData.venue_name}
                  </p>
                  {revealedEventData.venue_parking_notes && (
                    <p className="font-body text-[13px] text-muted leading-relaxed mt-2 italic">
                      Note: {revealedEventData.venue_parking_notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={`https://maps.google.com/?q=${revealedEventData.venue_lat},${revealedEventData.venue_lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open location in Google Maps"
                    className="flex-1 min-h-[48px] bg-ink text-ivory flex items-center justify-center gap-2 font-body text-[12px] font-semibold uppercase tracking-wider rounded-sm hover:bg-ink/90 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-ink focus:outline-none"
                  >
                    <Map size={16} aria-hidden="true" /> Maps
                  </a>
                  <a
                    href={generateCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Add event to Google Calendar"
                    className="flex-1 min-h-[48px] border border-gold text-gold flex items-center justify-center gap-2 font-body text-[12px] font-semibold uppercase tracking-wider rounded-sm hover:bg-gold/5 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gold focus:outline-none"
                  >
                    <Calendar size={16} aria-hidden="true" /> Calendar
                  </a>
                </div>
              </m.div>
            )}

            {/* STEP 4: Not Attending */}
            {step === 4 && (
              <m.div
                key="step-4"
                initial={{ opacity: 0, translateY: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, translateY: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, translateY: -12, filter: 'blur(4px)' }}
                transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
                className="text-center bg-white border border-gold-light p-10 rounded-sm shadow-card"
              >
                <h2 className="font-display text-[32px] text-ink mb-6 italic tracking-wide">
                  We&apos;ll miss you
                </h2>
                <div className="w-10 h-px bg-gold mx-auto mb-6 opacity-60"></div>
                <p className="font-body text-[15px] text-muted leading-relaxed mb-4">
                  Thank you for letting us know. You will be missed, but we understand.
                </p>
                <div className="mt-8 text-gold opacity-50">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto block">
                     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
              </m.div>
            )}

          </AnimatePresence>
        </div>
      </section>
      )} {/* end gallery_link ternary */}
        
        {/* End of Card Wrapper */}
        </div>
      </m.div>
    </>
  )
}
