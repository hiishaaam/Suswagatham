'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Papa from 'papaparse'
import { Copy, Check, Upload, Plus, CheckCircle2, ChevronRight, Loader2, Save, MessageCircle, CreditCard } from 'lucide-react'
import { m, AnimatePresence } from 'motion/react'
import PaymentModal from '@/components/PaymentModal'
import WhatsAppDistributor from '@/components/WhatsAppDistributor'
export default function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const unwrappedParams = use(params)
  const id = unwrappedParams.eventId
  
  const [event, setEvent] = useState<any>(null)
  const [tokens, setTokens] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'tokens' | 'edit'>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [copyState, setCopyState] = useState<'live'|'preview'|null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)

  // Tokens Form
  const [newToken, setNewToken] = useState({ family_name: '', phone: '', max_guests: 6 })

  const fetchEvent = async () => {
    const res = await fetch(`/api/admin/events/${id}`)
    const data = await res.json()
    if (data.success) {
      setEvent(data.event)
    }
    setIsLoading(false)
  }

  const fetchTokens = async () => {
    const res = await fetch(`/api/admin/events/${id}/tokens`)
    const data = await res.json()
    if (data.success) {
      setTokens(data.tokens)
    }
  }

  useEffect(() => {
    fetchEvent()
  }, [id])

  useEffect(() => {
    if (activeTab === 'tokens' && tokens.length === 0) {
      fetchTokens()
    }
  }, [activeTab])

  const handleStatusChange = async (newStatus: string) => {
    const oldStatus = event.status
    setEvent({ ...event, status: newStatus }) // Optimistic
    try {
      const res = await fetch(`/api/admin/events/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
    } catch (e) {
      alert('Failed to update status')
      setEvent({ ...event, status: oldStatus })
    }
  }

  const handleCopyLink = (type: 'live' | 'preview') => {
    const url = `${window.location.origin}/events/${event.event_slug}${type === 'preview' ? '?preview=true' : ''}`
    navigator.clipboard.writeText(url)
    setCopyState(type)
    setTimeout(() => setCopyState(null), 2000)
  }

  const handleAddToken = async () => {
    if (!newToken.family_name) return
    const res = await fetch(`/api/admin/events/${id}/tokens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newToken)
    })
    const data = await res.json()
    if (data.success) {
      setNewToken({ family_name: '', phone: '', max_guests: 6 })
      fetchTokens() // reload
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function(results) {
        const normalize = (p: string) => p.replace(/^\+91/, '').replace(/\D/g, '')
        const parsedTokens = results.data.map((row: any) => {
          let phone = row.phone || row.Phone || null
          if (phone) {
            phone = normalize(phone)
            if (phone.length !== 10) phone = null
          }
          return {
            family_name: row.family_name || row.Family || 'Unknown',
            phone: phone,
            max_guests: parseInt(row.max_guests) || parseInt(row.Guests) || event.max_guests_default
          }
        })

        if (parsedTokens.length === 0) return alert('No valid data found in CSV.')

        const res = await fetch(`/api/admin/events/${id}/tokens`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsedTokens)
        })
        const data = await res.json()
        if (data.success) {
          alert(`Successfully imported ${parsedTokens.length} tokens.`)
          fetchTokens()
        } else {
          alert('Failed to import tokens: ' + data.error)
        }
      }
    })
  }

  const [isSaving, setIsSaving] = useState(false)

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
      const data = await res.json()
      if (data.success) {
        alert('Saved successfully.')
        setEvent(data.event)
      } else throw new Error(data.error)
    } catch (err: any) {
      alert('Save failed: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-gold" size={32} /></div>
  if (!event) return <div className="p-10">Event not found.</div>

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    fetchEvent() // Reload event data — now status='live'
  }

  const renderWorkflowButtons = () => {
    const isPaid = event.payment_status === 'paid'
    switch(event.status) {
      case 'draft': 
        return (
          <button 
            onClick={() => setShowPaymentModal(true)} 
            className="bg-gradient-to-r from-gold to-[#D4B96A] text-ink px-5 py-2.5 text-xs font-bold uppercase rounded-sm hover:opacity-90 transition flex items-center gap-2 shadow-sm"
          >
            <CreditCard size={14} /> Pay & Go Live
          </button>
        )
      case 'design_pending': 
        return <button onClick={() => handleStatusChange('preview_sent')} className="bg-blue-600 text-white px-4 py-2 text-xs font-bold uppercase rounded-sm hover:bg-blue-700">Send Preview</button>
      case 'preview_sent': 
        return (
          <button 
            onClick={() => isPaid ? handleStatusChange('live') : setShowPaymentModal(true)} 
            className="bg-gradient-to-r from-gold to-[#D4B96A] text-ink px-5 py-2.5 text-xs font-bold uppercase rounded-sm hover:opacity-90 transition flex items-center gap-2 shadow-sm"
          >
            <CreditCard size={14} /> {isPaid ? 'Go Live' : 'Pay & Go Live'}
          </button>
        )
      case 'live': 
        return (
          <div className="flex gap-2">
            <button 
              onClick={() => {
                if (tokens.length === 0) fetchTokens()
                setShowWhatsAppModal(true)
              }}
              className="bg-[#25D366] text-white px-4 py-2 text-xs font-bold uppercase rounded-sm hover:bg-[#1DAF54] flex items-center gap-2 shadow-sm"
            >
              <MessageCircle size={14} /> Send Invitations
            </button>
            <button onClick={() => handleStatusChange('completed')} className="bg-muted text-white px-4 py-2 text-xs font-bold uppercase rounded-sm hover:bg-muted/90">Mark Completed</button>
          </div>
        )
      default: return null
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto font-body text-ink pb-20">
      {/* Header */}
      <div className="bg-white rounded-sm shadow-card border border-gold-light p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                event.status === 'live' ? 'bg-success/10 text-success border border-success/20' : 
                'bg-gray-100 text-gray-600 border border-gray-200'
              }`}>
                {event.status.replace('_', ' ')}
              </span>
              <span className="text-muted text-sm tracking-wide">{new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 className="font-display text-4xl md:text-[48px] leading-none text-ink italic block">{event.couple_names}</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => handleCopyLink('live')} className="flex items-center gap-2 border border-gold-light bg-ivory text-ink hover:border-gold px-4 py-2 text-xs font-bold uppercase rounded-sm transition">
              {copyState === 'live' ? <CheckCircle2 size={16} className="text-success" /> : <Copy size={16} />} 
              Copy Live Link
            </button>
            <button onClick={() => handleCopyLink('preview')} className="flex items-center gap-2 border border-gold-light bg-ivory text-ink hover:border-gold px-4 py-2 text-xs font-bold uppercase rounded-sm transition">
              {copyState === 'preview' ? <CheckCircle2 size={16} className="text-success" /> : <Copy size={16} />} 
              Copy Preview Link
            </button>
            {renderWorkflowButtons()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gold-light mb-6">
        {['overview', 'tokens', 'edit'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-semibold uppercase tracking-widest text-xs transition border-b-2 ${
              activeTab === tab ? 'border-gold text-gold bg-white' : 'border-transparent text-muted hover:text-ink hover:bg-white/50'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <m.div key="overview" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15, ease: 'easeOut' }} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'Link Opens', value: event.summary?.total_clicks || 0 },
            { label: 'RSVP Responses', value: event.summary?.total_responded || 0 },
            { label: 'Attending', value: event.summary?.attending_count || 0, color: 'text-success' },
            { label: 'Not Attending', value: event.summary?.not_attending_count || 0, color: 'text-error' },
            { label: 'Total Headcount', value: event.summary?.total_headcount || 0, color: 'text-gold' },
            { label: 'Vegetarian', value: event.summary?.veg_count || 0 },
            { label: 'Non-Vegetarian', value: event.summary?.non_veg_count || 0 },
            { label: 'Pending Guests', value: tokens.length - (event.summary?.total_responded || 0) }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-sm shadow-card border border-gold-light/50 flex flex-col justify-center text-center">
              <div className="text-[10px] text-muted uppercase tracking-[0.2em] font-semibold mb-2">{stat.label}</div>
              <div className={`font-display text-4xl ${stat.color || 'text-ink'}`}>{stat.value}</div>
            </div>
          ))}
        </m.div>
      )}

      {/* TOKENS TAB */}
      {activeTab === 'tokens' && (
        <m.div key="tokens" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15, ease: 'easeOut' }} className="bg-white border border-gold-light rounded-sm shadow-card p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gold-light/40 pb-6">
            <div className="flex items-center gap-3">
              <label className="text-[11px] uppercase tracking-widest text-muted font-bold whitespace-nowrap">Add Individual:</label>
              <input type="text" placeholder="Family Name" value={newToken.family_name} onChange={e => setNewToken({...newToken, family_name: e.target.value})} className="border border-gold-light rounded-sm px-3 py-1.5 text-sm" />
              <input type="text" placeholder="Phone (opt)" value={newToken.phone} onChange={e => setNewToken({...newToken, phone: e.target.value})} className="border border-gold-light rounded-sm px-3 py-1.5 text-sm w-32" />
              <input type="number" placeholder="Limit" value={newToken.max_guests} onChange={e => setNewToken({...newToken, max_guests: parseInt(e.target.value) || 6})} className="border border-gold-light rounded-sm px-3 py-1.5 text-sm w-20" />
              <button onClick={handleAddToken} className="bg-gold text-white p-1.5 rounded-sm hover:bg-gold/90"><Plus size={18} /></button>
            </div>
            <div className="relative border border-dashed border-gold p-3 px-6 rounded-sm text-sm uppercase tracking-widest text-gold hover:bg-gold/5 cursor-pointer font-bold flex items-center gap-2">
              <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload size={16} /> Bulk CSV Upload
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-body">
              <thead className="bg-ivory border-b border-gold-light/50">
                <tr>
                  <th className="p-4 font-bold uppercase text-xs text-muted tracking-wider">Family Name</th>
                  <th className="p-4 font-bold uppercase text-xs text-muted tracking-wider hidden md:table-cell">Phone</th>
                  <th className="p-4 font-bold uppercase text-xs text-muted tracking-wider">Masked Token</th>
                  <th className="p-4 font-bold uppercase text-xs text-muted tracking-wider text-center">Limit</th>
                  <th className="p-4 font-bold uppercase text-xs text-muted tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((t, idx) => (
                  <tr key={t.id} className={`border-b border-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-ivory/30'}`}>
                    <td className="p-4 font-semibold text-ink">{t.family_name}</td>
                    <td className="p-4 text-muted hidden md:table-cell">{t.phone || '-'}</td>
                    <td className="p-4 font-mono text-xs text-muted">...{t.unique_token.slice(-4)}</td>
                    <td className="p-4 text-center font-bold text-ink">{t.max_guests}</td>
                    <td className="p-4">
                      {t.rsvp_status === 'Attending' ? <span className="text-success font-bold text-xs uppercase tracking-wider">{t.rsvp_status}</span> :
                       t.rsvp_status === 'Not Attending' ? <span className="text-error font-bold text-xs uppercase tracking-wider">{t.rsvp_status}</span> :
                       <span className="text-muted font-bold text-xs uppercase tracking-wider">{t.rsvp_status}</span>}
                    </td>
                  </tr>
                ))}
                {tokens.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-muted italic font-display text-lg">No guest tokens generated yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </m.div>
      )}

      {/* EDIT TAB */}
      {activeTab === 'edit' && (
        <m.form key="edit" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15, ease: 'easeOut' }} onSubmit={handleEditSave} className="bg-white border border-gold-light rounded-sm shadow-card p-6 md:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gold-light/30 pb-6">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Couple Names</label>
              <input type="text" value={event.couple_names} onChange={e => setEvent({...event, couple_names: e.target.value})} className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Event Date</label>
              <input type="date" value={event.event_date} onChange={e => setEvent({...event, event_date: e.target.value})} className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Venue Name</label>
              <input type="text" value={event.venue_name} onChange={e => setEvent({...event, venue_name: e.target.value})} className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Venue Address</label>
              <input type="text" value={event.venue_address || ''} onChange={e => setEvent({...event, venue_address: e.target.value})} className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Invitation Text (EN)</label>
              <textarea rows={3} value={event.invitation_text_en || ''} onChange={e => setEvent({...event, invitation_text_en: e.target.value})} className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">Host WhatsApp</label>
              <input type="text" value={event.host_whatsapp || ''} onChange={e => setEvent({...event, host_whatsapp: e.target.value})} className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition" />
            </div>
            
            <div className="col-span-full pt-4 border-t border-gold-light/40">
              <div className="flex items-center gap-3 bg-ivory p-4 rounded-sm border border-gold-light">
                <input 
                  type="checkbox" 
                  id="qrCheckin"
                  checked={event.requires_qr_checkin || false}
                  onChange={e => setEvent({...event, requires_qr_checkin: e.target.checked})}
                  className="w-5 h-5 accent-gold"
                />
                <div>
                  <label htmlFor="qrCheckin" className="text-sm font-bold text-ink cursor-pointer block">Enable QR Check-in System</label>
                  <span className="text-[11px] text-muted uppercase tracking-widest">Recommended for large venues</span>
                </div>
              </div>
            </div>
          </div>

          {/* Post-Event Gallery Section */}
          <div className="border-t border-gold-light/30 pt-6 space-y-4">
            <div>
              <h3 className="text-[11px] uppercase tracking-widest text-muted font-bold mb-1">Post-Event Portal</h3>
              <p className="text-xs text-muted/70 leading-relaxed">Once the event is over, paste a Google Photos, Google Drive, or iCloud shared album link below. The guest page will automatically transform into a beautiful photo gallery portal.</p>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-muted font-bold mb-2">
                External Gallery Link
              </label>
              <input
                type="url"
                placeholder="https://photos.google.com/share/..."
                value={event.gallery_link || ''}
                onChange={e => setEvent({...event, gallery_link: e.target.value || null})}
                className="w-full bg-ivory border border-gold-light p-3 rounded-sm focus:border-gold outline-none transition font-body text-sm"
              />
            </div>
          </div>

          {/* Digital Shagun Toggle */}
          <div className="border-t border-gold-light/30 pt-6">
            <div className="flex items-center gap-3 bg-ivory p-4 rounded-sm border border-gold-light">
              <input 
                type="checkbox" 
                id="acceptShagun"
                checked={event.accept_shagun || false}
                onChange={e => setEvent({...event, accept_shagun: e.target.checked})}
                className="w-5 h-5 accent-gold"
              />
              <div>
                <label htmlFor="acceptShagun" className="text-sm font-bold text-ink cursor-pointer block">Enable Digital Shagun</label>
                <span className="text-[11px] text-muted uppercase tracking-widest">Allow guests to send cash gifts via Razorpay</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button type="submit" disabled={isSaving} className="bg-ink text-gold flex items-center gap-2 px-8 py-3 rounded-sm uppercase tracking-widest text-xs font-bold shadow-sm hover:bg-ink/90 transition disabled:opacity-70">
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </m.form>
      )}
      </AnimatePresence>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        eventId={id}
        coupleNames={event.couple_names}
        templateId={event.template_id}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* WhatsApp Distribution Modal */}
      <WhatsAppDistributor
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        tokens={tokens}
        eventSlug={event.event_slug}
        coupleNames={event.couple_names}
        invitationText={event.invitation_text_en}
      />
    </div>
  )
}
