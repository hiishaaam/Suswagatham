'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, UploadCloud, ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react'

export default function NewEventPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  
  const [formData, setFormData] = useState({
    new_client_name: '',
    new_client_phone: '',
    couple_names: '',
    event_slug: '',
    event_date: '',
    ceremony_type: 'Wedding',
    language: 'english',
    
    venue_name: '',
    venue_address: '',
    venue_lat: '',
    venue_lng: '',
    venue_parking_notes: '',
    rsvp_cutoff_at: '',
    max_guests_default: 6,
    
    template_id: 'kerala_traditional',
    couple_photo_url: '',
    invitation_text_en: '',
    invitation_text_ml: '',
    host_whatsapp: '',
    show_host_contact: true
  })

  // Debounced slug check
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!formData.event_slug) {
      setSlugStatus('idle')
      return
    }
    
    let active = true
    const timer = setTimeout(async () => {
      setSlugStatus('checking')
      try {
        const res = await fetch(`/api/admin/events/check-slug?slug=${encodeURIComponent(formData.event_slug)}`)
        const data = await res.json()
        if (active) setSlugStatus(data.available ? 'available' : 'taken')
      } catch (err) {
        if (active) setSlugStatus('idle')
      }
    }, 500)
    /* eslint-enable react-hooks/set-state-in-effect */
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [formData.event_slug])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setFormData(prev => ({
      ...prev,
      couple_names: val,
      event_slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }))
  }

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 1200
          
          let width = img.width
          let height = img.height

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width)
            width = MAX_WIDTH
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'))
              return
            }
            const newFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(newFile)
          }, 'image/jpeg', 0.8)
        }
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Default fallback if slug isn't set yet
    const slug = formData.event_slug || Date.now().toString()
    
    try {
      const compressedFile = await compressImage(file)
      const fd = new FormData()
      fd.append('file', compressedFile)
      fd.append('eventSlug', slug)
      
      const res = await fetch('/api/admin/upload-photo', {
        method: 'POST',
        body: fd
      })
      const data = await res.json()
      if (data.success) {
        setFormData(prev => ({ ...prev, couple_photo_url: data.url }))
      } else {
        alert('Upload failed: ' + data.error)
      }
    } catch (err) {
      console.error(err)
      alert('Upload failed')
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        router.push(`/admin/events/${data.event.id}`)
      } else {
        alert('Error: ' + data.error)
      }
    } catch (err) {
      alert('An unexpected error occurred while submitting')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto font-body text-ink pb-20">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold mb-4">Create New Event</h1>
        
        {/* Progress Tracker */}
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted">
          <span className={step >= 1 ? 'text-gold' : ''}>1. Basics</span>
          <ChevronRight size={14} className="opacity-50" />
          <span className={step >= 2 ? 'text-gold' : ''}>2. Venue</span>
          <ChevronRight size={14} className="opacity-50" />
          <span className={step >= 3 ? 'text-gold' : ''}>3. Design</span>
        </div>
      </div>

      <div className="bg-white border border-gold-light rounded-sm shadow-card p-6 md:p-10">
        
        {/* STEP 1: Basics */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="font-display text-2xl mb-6 border-b border-gold-light pb-2">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">New Client Name</label>
                <input 
                  type="text" 
                  value={formData.new_client_name}
                  onChange={e => setFormData({...formData, new_client_name: e.target.value})}
                  className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition" 
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">New Client Phone</label>
                <input 
                  type="text" 
                  value={formData.new_client_phone}
                  onChange={e => setFormData({...formData, new_client_phone: e.target.value})}
                  className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition" 
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gold-light/40">
              <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Couple Names</label>
              <input 
                type="text" 
                placeholder="e.g. Rahul & Sneha"
                value={formData.couple_names}
                onChange={handleNameChange}
                className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none font-display text-xl transition" 
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Event Slug (URL)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted">weddwise.com/events/</span>
                <input 
                  type="text" 
                  value={formData.event_slug}
                  onChange={e => setFormData({...formData, event_slug: e.target.value})}
                  className="w-full bg-ivory border border-gold-light p-3 pl-[165px] rounded-sm focus:border-gold outline-none transition font-mono text-sm" 
                />
                <div className="absolute right-3 top-3 text-xs font-bold uppercase tracking-widest">
                  {slugStatus === 'checking' && <span className="text-muted"><Loader2 size={14} className="animate-spin inline" /></span>}
                  {slugStatus === 'available' && <span className="text-success flex items-center gap-1"><Check size={14}/> Available</span>}
                  {slugStatus === 'taken' && <span className="text-error">Taken</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Event Date</label>
                <input 
                  type="date"
                  value={formData.event_date}
                  onChange={e => setFormData({...formData, event_date: e.target.value})}
                  className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition" 
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Language</label>
                <select 
                  value={formData.language}
                  onChange={e => setFormData({...formData, language: e.target.value})}
                  className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition"
                >
                  <option value="english">English</option>
                  <option value="malayalam">Malayalam</option>
                  <option value="bilingual">Bilingual</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Venue */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
             <h2 className="font-display text-2xl mb-6 border-b border-gold-light pb-2">Venue Details</h2>
             
             <div>
                <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Venue Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Grand Hyatt Kochi"
                  value={formData.venue_name}
                  onChange={e => setFormData({...formData, venue_name: e.target.value})}
                  className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition" 
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Full Address</label>
                <textarea 
                  rows={3}
                  value={formData.venue_address}
                  onChange={e => setFormData({...formData, venue_address: e.target.value})}
                  className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2 flex items-center gap-2"><MapPin size={12}/> Latitude</label>
                  <input 
                    type="text"
                    value={formData.venue_lat}
                    onChange={e => setFormData({...formData, venue_lat: e.target.value})}
                    className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition font-mono text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2 flex items-center gap-2"><MapPin size={12}/> Longitude</label>
                  <input 
                    type="text"
                    value={formData.venue_lng}
                    onChange={e => setFormData({...formData, venue_lng: e.target.value})}
                    className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition font-mono text-xs" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Parking & Entry Notes</label>
                <input 
                  type="text"
                  value={formData.venue_parking_notes}
                  onChange={e => setFormData({...formData, venue_parking_notes: e.target.value})}
                  className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition" 
                />
              </div>

              <div className="pt-4 border-t border-gold-light/40 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">RSVP Cutoff Date</label>
                  <input 
                    type="date"
                    value={formData.rsvp_cutoff_at}
                    onChange={e => setFormData({...formData, rsvp_cutoff_at: e.target.value})}
                    className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Default Guest Limit / Family</label>
                  <input 
                    type="number"
                    value={formData.max_guests_default}
                    onChange={e => setFormData({...formData, max_guests_default: parseInt(e.target.value) || 6})}
                    className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition" 
                  />
                </div>
              </div>
          </div>
        )}

        {/* STEP 3: Design */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in">
            <h2 className="font-display text-2xl mb-6 border-b border-gold-light pb-2">Invitation Design</h2>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-4">Choose Template</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: 'kerala_traditional', name: 'Kerala Traditional' },
                  { id: 'modern_minimal', name: 'Modern Minimal' },
                  { id: 'royal_gold', name: 'Royal Gold' }
                ].map(t => (
                  <div 
                    key={t.id}
                    onClick={() => setFormData({...formData, template_id: t.id})}
                    className={`border p-4 rounded-sm cursor-pointer transition ${formData.template_id === t.id ? 'border-gold bg-gold/5' : 'border-gold-light/50 bg-ivory'}`}
                  >
                    <div className="h-20 bg-black/5 mb-3 rounded-sm overflow-hidden flex items-center justify-center text-xs text-muted">Preview</div>
                    <div className="font-semibold text-sm">{t.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Couple Photo</label>
              <div className="border-2 border-dashed border-gold-light p-8 rounded-sm bg-ivory text-center relative overflow-hidden group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                />
                
                {formData.couple_photo_url ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.couple_photo_url} alt="Couple" className="mx-auto h-32 object-cover rounded shadow-sm" />
                    <p className="mt-2 text-[10px] text-gold uppercase tracking-widest font-bold">Click or drag to change</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-60 group-hover:opacity-100 transition">
                    <UploadCloud size={32} className="text-gold" />
                    <span className="text-sm font-semibold uppercase tracking-widest">Select Image</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Invitation Text (English)</label>
              <textarea 
                rows={4}
                value={formData.invitation_text_en}
                onChange={e => setFormData({...formData, invitation_text_en: e.target.value})}
                className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition font-display italic text-lg" 
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Invitation Text (Malayalam)</label>
              <textarea 
                rows={3}
                value={formData.invitation_text_ml}
                onChange={e => setFormData({...formData, invitation_text_ml: e.target.value})}
                className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition font-display text-lg" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Host WhatsApp Number</label>
                <input 
                  type="text"
                  value={formData.host_whatsapp}
                  onChange={e => setFormData({...formData, host_whatsapp: e.target.value})}
                  className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition" 
                />
              </div>
              <div className="pb-3 flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="showHost"
                  checked={formData.show_host_contact}
                  onChange={e => setFormData({...formData, show_host_contact: e.target.checked})}
                  className="w-5 h-5 accent-gold"
                />
                <label htmlFor="showHost" className="text-sm font-semibold cursor-pointer">Show contact button on RSVP</label>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-sm shadow-sm border border-gold-light/50">
        <button 
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
          className="px-6 py-2 border border-gold-light text-muted uppercase tracking-widest text-xs font-bold rounded-sm disabled:opacity-30 hover:bg-ivory transition"
        >
          <div className="flex items-center gap-1"><ChevronLeft size={16} /> Back</div>
        </button>

        {step < 3 ? (
          <button 
            onClick={() => setStep(step + 1)}
            className="px-8 py-3 bg-gold text-white uppercase tracking-widest text-xs font-bold rounded-sm hover:bg-gold/90 transition shadow-sm"
          >
            <div className="flex items-center gap-1">Next <ChevronRight size={16} /></div>
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || slugStatus === 'taken'}
            className="px-10 py-3 bg-ink text-gold uppercase tracking-widest text-xs font-bold rounded-sm hover:bg-black transition shadow-lg flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Create Event
          </button>
        )}
      </div>
    </div>
  )
}
