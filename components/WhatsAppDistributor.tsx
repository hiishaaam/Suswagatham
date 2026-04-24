'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'motion/react'
import { X, MessageCircle, Copy, CheckCircle2, ExternalLink, Send } from 'lucide-react'

interface WhatsAppDistributorProps {
  isOpen: boolean
  onClose: () => void
  tokens: any[]
  eventSlug: string
  coupleNames: string
  invitationText?: string
}

export default function WhatsAppDistributor({ isOpen, onClose, tokens, eventSlug, coupleNames, invitationText }: WhatsAppDistributorProps) {
  const [sentTokens, setSentTokens] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  const getInviteLink = (token: any) => {
    return `${baseUrl}/events/${eventSlug}?t=${token.unique_token}`
  }

  const getWhatsAppMessage = (token: any) => {
    const link = getInviteLink(token)
    
    if (invitationText && invitationText.trim() !== '') {
      return `✨ *You're Invited!* ✨

Dear *${token.family_name}*,

${invitationText}

Please RSVP using your personal link:
🔗 ${link}

We look forward to celebrating with you! 💕`
    }

    return `✨ *You're Invited!* ✨

Dear *${token.family_name}*,

We are delighted to invite you to the wedding celebration of *${coupleNames}*.

Please RSVP using your personal invitation link:
🔗 ${link}

We look forward to celebrating with you! 💕`
  }

  const getWhatsAppUrl = (token: any) => {
    const message = encodeURIComponent(getWhatsAppMessage(token))
    const phone = token.phone ? token.phone.replace(/\D/g, '') : ''
    // If phone starts without country code, assume India (+91)
    const fullPhone = phone ? (phone.startsWith('91') ? phone : `91${phone}`) : ''
    return fullPhone
      ? `https://wa.me/${fullPhone}?text=${message}`
      : `https://wa.me/?text=${message}`
  }

  const handleSendWhatsApp = (token: any) => {
    window.open(getWhatsAppUrl(token), '_blank')
    setSentTokens((prev) => new Set(prev).add(token.id))
  }

  const handleCopyLink = (token: any) => {
    navigator.clipboard.writeText(getInviteLink(token))
    setCopiedId(token.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleBulkCopyAll = () => {
    const allLinks = tokens
      .map(t => `${t.family_name}: ${getInviteLink(t)}`)
      .join('\n')
    navigator.clipboard.writeText(allLinks)
    setCopiedId('__bulk__')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const tokensWithPhone = tokens.filter(t => t.phone)
  const tokensWithoutPhone = tokens.filter(t => !t.phone)
  const sentCount = sentTokens.size

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <m.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
          className="bg-white rounded-2xl w-full max-w-[580px] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-[#25D366] text-white px-8 py-5 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <MessageCircle size={22} />
              <div>
                <h2 className="font-display text-lg font-bold">Send Invitations</h2>
                <p className="text-white/70 text-[10px] uppercase tracking-widest mt-0.5">
                  {tokens.length} guests · {sentCount} sent
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white transition p-1">
              <X size={20} />
            </button>
          </div>

          {/* Progress bar */}
          {sentCount > 0 && (
            <div className="h-1 bg-gray-100 shrink-0">
              <m.div
                className="h-full bg-[#25D366]"
                initial={{ width: 0 }}
                animate={{ width: `${(sentCount / tokens.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}

          {/* Actions bar */}
          <div className="px-6 py-3 bg-ivory/50 border-b border-gold-light/30 flex gap-3 shrink-0">
            <button
              onClick={handleBulkCopyAll}
              className="text-[10px] uppercase tracking-widest font-bold text-ink bg-white border border-gold-light/50 px-4 py-2 rounded-lg hover:border-gold transition flex items-center gap-2"
            >
              {copiedId === '__bulk__' ? <CheckCircle2 size={12} className="text-success" /> : <Copy size={12} />}
              {copiedId === '__bulk__' ? 'Copied All!' : 'Copy All Links'}
            </button>
          </div>

          {/* Token list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {tokens.length === 0 ? (
              <div className="text-center py-12 text-muted italic font-display text-lg">
                No guest tokens created yet. Add guests in the Tokens tab first.
              </div>
            ) : (
              tokens.map((token) => {
                const isSent = sentTokens.has(token.id)
                return (
                  <m.div
                    key={token.id}
                    layout
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      isSent
                        ? 'bg-[#25D366]/5 border-[#25D366]/20'
                        : 'bg-white border-gold-light/30 hover:border-gold/40'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-ink text-sm truncate">{token.family_name}</span>
                        {isSent && <CheckCircle2 size={14} className="text-[#25D366] shrink-0" />}
                      </div>
                      <span className="text-muted text-xs block truncate">
                        {token.phone || 'No phone — copy link manually'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {/* Copy link button */}
                      <button
                        onClick={() => handleCopyLink(token)}
                        className="p-2 rounded-lg border border-gold-light/40 hover:border-gold text-muted hover:text-ink transition"
                        title="Copy personal link"
                      >
                        {copiedId === token.id ? <CheckCircle2 size={14} className="text-success" /> : <Copy size={14} />}
                      </button>
                      {/* WhatsApp send button */}
                      <button
                        onClick={() => handleSendWhatsApp(token)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                          isSent
                            ? 'bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20'
                            : 'bg-[#25D366] text-white hover:bg-[#1DAF54] shadow'
                        }`}
                      >
                        {isSent ? (
                          <>
                            <CheckCircle2 size={12} /> Sent
                          </>
                        ) : (
                          <>
                            <Send size={12} /> Send
                          </>
                        )}
                      </button>
                    </div>
                  </m.div>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-ivory/50 border-t border-gold-light/30 text-center shrink-0">
            <p className="text-[10px] text-muted uppercase tracking-widest">
              Each guest receives a unique, personalized RSVP link
            </p>
          </div>
        </m.div>
      </m.div>
    </AnimatePresence>
  )
}
