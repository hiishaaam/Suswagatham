'use client'

import React, { useState, useEffect } from 'react'
import { m, AnimatePresence } from 'motion/react'
import { Check } from 'lucide-react'

interface WeddingEnvelopeProps {
  coupleNames: string
  date: string
  onOpenComplete: () => void
}

export default function WeddingEnvelope({ coupleNames, date, onOpenComplete }: WeddingEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const handleOpen = () => {
    if (isOpen) return
    setIsOpen(true)

    // Wait for flap to open (0.8s) + card to rise (1s) + pause (0.5s)
    setTimeout(() => {
      setIsLeaving(true)
      // Then notify parent to show main content after exit animation
      setTimeout(() => {
        onOpenComplete()
      }, 1000)
    }, 2800)
  }

  return (
    <AnimatePresence>
      {!isLeaving && (
        <m.div
          exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0C07] overflow-hidden perspective-[1200px]"
          onClick={handleOpen}
        >
          {/* Subtle background ambient light */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[60vh] h-[60vh] bg-gold/10 blur-[120px] rounded-full mix-blend-screen" />
          </div>

          <m.div 
            initial={{ y: 50, opacity: 0, rotateX: 10 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-[340px] h-[220px] md:w-[480px] md:h-[300px] cursor-pointer group"
          >
            {/* ENVELOPE BACK */}
            <div className="absolute inset-0 bg-[#A68133] rounded-sm shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex items-center justify-center pt-10">
               {/* Inside pattern/texture */}
               <div className="w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            </div>

            {/* THE CARD (Slides up and slightly scales up) */}
            <m.div
              animate={isOpen ? { 
                y: -140, 
                z: 20, 
                rotateX: -5,
                boxShadow: "0 25px 50px rgba(0,0,0,0.5)" 
              } : { 
                y: 0, 
                z: 0, 
                rotateX: 0,
                boxShadow: "0 0 0 rgba(0,0,0,0)" 
              }}
              transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1], delay: isOpen ? 0.6 : 0 }}
              className="absolute bottom-2 left-2 right-2 top-4 bg-[#FFF9E5] rounded-sm flex flex-col items-center justify-center p-6 border-[0.5px] border-gold/30"
              style={{ originY: 1 }}
            >
              <div className="h-full w-full border border-gold/20 p-4 flex flex-col items-center justify-center text-center">
                <p className="font-display text-[10px] md:text-xs uppercase tracking-[0.3em] text-gold-dark mb-4">You are invited</p>
                <h1 className="font-display text-3xl md:text-4xl text-ink italic mb-4">{coupleNames}</h1>
                <p className="font-body text-xs md:text-sm text-ink/60 uppercase tracking-widest">{date}</p>
                
                {/* Decorative motif */}
                <div className="mt-6 flex items-center gap-2">
                  <div className="w-8 h-px bg-gold/40"></div>
                  <div className="w-1.5 h-1.5 rotate-45 bg-gold"></div>
                  <div className="w-8 h-px bg-gold/40"></div>
                </div>
              </div>
            </m.div>

            {/* ENVELOPE FRONT POCKET (Left/Right/Bottom flaps simulated as one piece for robustness) */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent 0%, transparent 35%, #C29B43 35.1%, #C29B43 100%)',
                clipPath: 'polygon(0% 0%, 50% 45%, 100% 0%, 100% 100%, 0% 100%)',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
              }}
            >
               {/* Front Texture/Gradients */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
               <div className="absolute bottom-0 left-0 w-full h-full" style={{
                 background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)'
               }}></div>
            </div>

            {/* WAX SEAL */}
            <m.div 
              animate={isOpen ? { opacity: 0, scale: 1.5 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#751A1A] shadow-[0_5px_15px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] flex items-center justify-center border-2 border-[#540d0d]"
            >
              <span className="font-display text-white/80 text-xl md:text-2xl italic tracking-tighter drop-shadow-md">
                {coupleNames.charAt(0)}
              </span>
            </m.div>

            {/* ENVELOPE TOP FLAP */}
            <m.div
              animate={isOpen ? { rotateX: 160, zIndex: 0 } : { rotateX: 0, zIndex: 20 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformOrigin: 'top', backfaceVisibility: 'hidden' }}
              className="absolute top-0 left-0 w-full h-[65%] pointer-events-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]"
            >
              {/* Flap shape */}
              <div 
                className="w-full h-full bg-[#CBA44C]"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  boxShadow: 'inset 0 -5px 20px rgba(0,0,0,0.1)'
                }}
              >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
              </div>
            </m.div>
            
            {/* INSTRUCTIONS */}
            <m.div 
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-white/50 text-[10px] uppercase tracking-[0.2em] whitespace-nowrap animate-pulse"
            >
              Tap to open
            </m.div>

          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
