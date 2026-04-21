'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { m, useScroll, useTransform, AnimatePresence } from 'motion/react'
import { Users, QrCode, ChefHat, BarChart3, Calendar, Share2, CheckCircle2, ArrowRight, Check, Star } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import ParticleField from '@/components/ui/ParticleField'
import TemplatePreviewSection from '@/components/landing/TemplatePreviewSection'

const AnimatedStat = ({ value, label, suffix = '' }: { value: string | number, label: string, suffix?: string }) => {
  const { ref, hasEntered } = useIntersectionObserver()
  const isNum = typeof value === 'number'
  const animatedValue = useCountUp(isNum && hasEntered ? value as number : 0)
  
  return (
    <m.div 
      ref={ref as React.RefObject<HTMLDivElement>} 
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center group"
    >
      <div className="font-display text-4xl md:text-[56px] text-gold mb-2 leading-none transform group-hover:scale-110 transition-transform duration-500 will-change-transform drop-shadow-md">
        {isNum ? animatedValue : value}<span className="text-gold opacity-60">{suffix}</span>
      </div>
      <div className="font-body text-[12px] uppercase text-ink/70 font-bold tracking-widest">
        {label}
      </div>
    </m.div>
  )
}

// Fade in up wrapper
const FadeInUp = ({ children, delay = 0, className = '' }: any) => (
  <m.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </m.div>
)

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0F0C07] text-ink font-body flex flex-col selection:bg-gold/30 overflow-hidden relative">
      
      {/* GLOBAL BACKGROUND MESH (For the entire page to give glassmorphism something to blur) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-ivory">
        <m.div 
          animate={{ rotate: 360, scale: [1, 1.2, 1] }} 
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gold/20 blur-[150px] rounded-full mix-blend-multiply"
        />
        <m.div 
          animate={{ rotate: -360, x: [0, -100, 0], y: [0, 100, 0] }} 
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] -left-[20%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-gold/15 blur-[120px] rounded-full mix-blend-multiply"
        />
      </div>

      {/* 1. Navigation (Clear iOS Glass) */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/10 backdrop-blur-[40px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] py-3 border-b border-white/20' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <m.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2"
          >
            <div className="text-gold font-display text-sm font-bold flex items-center justify-center w-8 h-8 rounded-lg border border-gold/50 bg-black/20 backdrop-blur-md">
              W
            </div>
            <span className={`font-display text-xl md:text-2xl font-bold tracking-wide transition-colors duration-500 ${scrolled ? 'text-ink' : 'text-ivory'}`}>WeddWise</span>
          </m.div>
          
          <m.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={`hidden md:flex items-center gap-8 font-body text-sm font-medium tracking-wide transition-colors duration-500 ${scrolled ? 'text-ink/80' : 'text-ivory/90'}`}
          >
            <Link href="#features" className="hover:text-gold transition-colors hover:scale-105 transform duration-300 drop-shadow-sm">Features</Link>
            <Link href="#how-it-works" className="hover:text-gold transition-colors hover:scale-105 transform duration-300 drop-shadow-sm">How It Works</Link>
            <Link href="#pricing" className="hover:text-gold transition-colors hover:scale-105 transform duration-300 drop-shadow-sm">Pricing</Link>
          </m.div>

          <m.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4"
          >
             <Link href="/admin/login" className={`hidden sm:block text-[11px] font-bold uppercase tracking-widest hover:text-gold transition-colors drop-shadow-sm ${scrolled ? 'text-ink' : 'text-ivory'}`}>
               Login
             </Link>
             <Link href="/admin">
              <button className="relative overflow-hidden group bg-black/20 backdrop-blur-[40px] border border-white/20 text-gold px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all shadow-lg hover:shadow-[0_8px_32px_rgba(201,168,76,0.2)]">
                <span className="relative z-10 transition-colors group-hover:text-[#0F0C07]">Get Started</span>
                <div className="absolute inset-0 h-full w-0 bg-gold transition-all duration-300 ease-out group-hover:w-full z-0"></div>
              </button>
            </Link>
          </m.div>
        </div>
      </nav>

      {/* 2. Hero Section (Keeps dark aesthetic to make gold pop) */}
      <section className="relative min-h-[100svh] bg-[#0F0C07] flex flex-col items-center justify-center pt-24 pb-20 px-6 overflow-hidden z-10">
        <ParticleField />
        
        {/* Animated Radial glow */}
        <m.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-gold/20 rounded-full blur-[140px] pointer-events-none"
        />

        <m.div 
          style={{ y: heroY, opacity }}
          className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          <m.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.3 }}
            className="font-display text-5xl sm:text-7xl md:text-[96px] text-ivory leading-[1.1] mb-6 drop-shadow-2xl mt-12"
          >
            Where Every Guest<br/>
            <span className="text-gold italic font-medium relative inline-block group">
              Feels Expected
              <span className="absolute bottom-2 left-0 w-full h-[1px] bg-gold/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-left"></span>
            </span>
          </m.h1>

          <m.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-body text-ivory/60 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Beautiful digital invitations, token-based RSVP tracking, real-time headcount dashboards, and caterer kitchen reports — all built for the grandeur of Indian weddings.
          </m.p>

          <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-5 items-center justify-center mb-16 w-full sm:w-auto"
          >
            <Link href="/admin/events/new" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto border border-gold/40 bg-gold/10 backdrop-blur-[40px] text-gold px-8 py-4 text-[12px] font-bold uppercase tracking-widest rounded-xl hover:bg-gold hover:text-[#0F0C07] hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-[0_10px_40px_rgba(201,168,76,0.2)]">
                Start Planning Free <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/admin" className="w-full sm:w-auto mt-2 sm:mt-0">
              <button className="w-full sm:w-auto border border-white/20 bg-white/5 backdrop-blur-[40px] text-ivory px-8 py-4 text-[12px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center justify-center shadow-2xl">
                <span>View Live Demo</span>
              </button>
            </Link>
          </m.div>
          
          <m.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col items-center gap-3 bg-white/5 backdrop-blur-[40px] px-6 py-3 rounded-2xl border border-white/10 shadow-xl"
          >
             <div className="flex items-center gap-1 text-gold">
               {[1,2,3,4,5].map(i => (
                 <m.div key={i} animate={{ rotateY: 360 }} transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, repeatDelay: 5 }}>
                   <Star size={14} className="fill-gold" />
                 </m.div>
               ))}
             </div>
             <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/60 font-bold">
               Trusted by 50+ Kerala wedding families
             </p>
          </m.div>
        </m.div>

        {/* Clear iOS Glass Cards */}
        <m.div 
          initial={{ opacity: 0, x: -50, y: 20, rotate: -5 }}
          animate={{ opacity: 1, x: 0, y: [0, -15, 0], rotate: -12 }}
          transition={{ 
            opacity: { duration: 1, delay: 1 },
            x: { duration: 1, delay: 1 },
            rotate: { duration: 1, delay: 1 },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 } 
          }}
          style={{ y: useTransform(scrollYProgress, [0, 0.3], [0, 100]) }}
          className="absolute hidden lg:flex flex-col gap-2 top-[30%] left-10 xl:left-24 bg-white/5 backdrop-blur-[40px] border-[0.5px] border-white/20 p-6 rounded-3xl shadow-2xl w-64 hover:border-white/40 hover:bg-white/10 transition-all"
        >
          <div className="text-[10px] uppercase tracking-widest text-gold font-bold relative z-10">Attending</div>
          <div className="font-display text-4xl text-ivory relative z-10 drop-shadow-md">48 <span className="text-lg text-ivory/50">/ 120</span></div>
          <div className="h-1.5 w-full bg-black/40 rounded-full mt-2 overflow-hidden shadow-inner relative z-10 border border-white/5">
            <m.div 
              initial={{ width: 0 }}
              animate={{ width: "40%" }}
              transition={{ duration: 1.5, delay: 2, ease: "easeOut" }}
              className="h-full bg-gold rounded-full shadow-[0_0_10px_rgba(201,168,76,0.8)]"
            />
          </div>
        </m.div>

        <m.div 
          initial={{ opacity: 0, x: 50, y: -20, rotate: 5 }}
          animate={{ opacity: 1, x: 0, y: [0, 15, 0], rotate: 8 }}
          transition={{ 
            opacity: { duration: 1, delay: 1.2 },
            x: { duration: 1, delay: 1.2 },
            rotate: { duration: 1, delay: 1.2 },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 } 
          }}
          style={{ y: useTransform(scrollYProgress, [0, 0.3], [0, -100]) }}
          className="absolute hidden lg:flex flex-col gap-3 bottom-[25%] right-10 xl:right-24 bg-white/5 backdrop-blur-[40px] border-[0.5px] border-white/20 p-6 rounded-3xl shadow-2xl w-64 hover:border-white/40 hover:bg-white/10 transition-all"
        >
           <div className="flex justify-between items-center relative z-10">
             <div className="text-ivory font-bold text-sm drop-shadow-md">Menon Family</div>
             <m.div 
               animate={{ scale: [1, 1.05, 1] }} 
               transition={{ duration: 2, repeat: Infinity }}
               className="bg-black/20 border border-success/30 backdrop-blur-md text-success text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold shadow-sm"
             >
               Confirmed
             </m.div>
           </div>
           <div className="text-ivory/60 text-xs font-medium relative z-10">4 Guests &middot; Non-Veg</div>
        </m.div>

      </section>

      {/* 3. Stats Strip (Clear Glass) */}
      <section className="py-20 px-6 relative z-10 overflow-hidden transform -translate-y-8">
        <div className="max-w-6xl mx-auto rounded-3xl grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 relative z-10 bg-white/20 backdrop-blur-[40px] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] py-10 px-4">
           <AnimatedStat value={2400} label="RSVPs Managed" suffix="+" />
           <AnimatedStat value={120} label="Events Hosted" suffix="+" />
           <AnimatedStat value={98} label="Guest Response Rate" suffix="%" />
           <AnimatedStat value="4.9" label="Average Rating" suffix="★" />
        </div>
      </section>

      {/* Multicultural Templates Drag Carousel */}
      <div className="relative z-20 w-full mb-10 overflow-visible">
        <TemplatePreviewSection />
      </div>

      {/* 4. Features Section */}
      <section id="features" className="py-32 px-6 relative z-10 -mt-10">
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeInUp className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-[40px] border border-white/50 px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[3px] text-ink mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              <Star size={12} className="text-gold" />
              Platform Features
              <Star size={12} className="text-gold" />
            </div>
            <h2 className="font-display text-4xl md:text-6xl text-ink font-medium max-w-3xl mx-auto leading-tight drop-shadow-sm">
              Crafted for the complexity of Indian weddings
            </h2>
          </FadeInUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Smart RSVP Links', desc: 'Token-based magic links per family. No logins needed.' },
              { icon: BarChart3, title: 'Live Dashboard', desc: 'Real-time headcount with attending, pending, and declining split.' },
              { icon: ChefHat, title: 'Kitchen Reports', desc: 'Auto-generated PDF for caterers with veg/non-veg counts + 10% buffer.' },
              { icon: QrCode, title: 'QR Code Invites', desc: 'One-tap QR generation per event for beautiful venue displays.' },
              { icon: Calendar, title: 'Multi-Sub-Event', desc: 'Track Reception, Haldi, and Sangeet separately in one event.' },
              { icon: Share2, title: 'WhatsApp Integration', desc: 'One-click share links perfectly formatted for endless WhatsApp forwarding.' },
            ].map((f, i) => (
              <m.div 
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
                whileHover={{ y: -10 }}
                className="bg-white/20 backdrop-blur-[40px] border-[0.5px] border-white/60 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(201,168,76,0.1)] hover:bg-white/30 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="w-14 h-14 bg-white/40 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white/50 group-hover:bg-gold group-hover:border-gold transition-all duration-300 relative z-10 group-hover:scale-110">
                  <f.icon size={26} className="text-gold group-hover:text-white transition-colors duration-300 drop-shadow-sm" />
                </div>
                <h3 className="font-display text-2xl text-ink font-bold mb-3 relative z-10 group-hover:text-gold transition-colors">{f.title}</h3>
                <p className="text-ink/70 text-sm leading-relaxed relative z-10 font-medium">{f.desc}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works (Dark IOS Glassmorphism) */}
      <section id="how-it-works" className="bg-[#0F0C07] py-40 px-6 text-ivory relative border-y border-white/10 z-20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/15 blur-[150px] pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 left-[10%] w-[500px] h-[500px] bg-blue-900/15 blur-[150px] pointer-events-none rounded-full"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <FadeInUp className="text-center mb-24">
            <h2 className="font-display text-4xl md:text-[56px] leading-tight drop-shadow-2xl">
              From invitation to reception — <span className="text-gold italic font-medium relative inline-block">
                in minutes
              </span>
            </h2>
          </FadeInUp>

          <div className="relative mt-10">
            <div className="hidden md:block absolute top-[40px] left-[10%] w-[80%] h-[2px] bg-white/5 rounded-full">
              <m.div 
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-gold/50 via-gold to-gold/50 shadow-[0_0_15px_rgba(201,168,76,0.5)]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 relative z-10">
               {[
                 { step: '01', title: 'Create Your Event', desc: 'Add couple names, venue, date, photos, and personalized text' },
                 { step: '02', title: 'Invite Guests', desc: 'Generate unique token links per family, share seamlessly via WhatsApp' },
                 { step: '03', title: 'Track Live', desc: 'Watch RSVPs arrive in real-time, generate instant kitchen reports' },
               ].map((s, i) => (
                 <m.div 
                   key={i}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, margin: "-100px" }}
                   transition={{ duration: 0.8, delay: i * 0.3 }}
                   className="relative flex flex-col items-center text-center group bg-black/10 backdrop-blur-[40px] border border-white/10 p-8 rounded-[40px] shadow-2xl hover:bg-white/5 hover:border-gold/30 transition-all"
                 >
                   <m.div 
                     whileHover={{ scale: 1.1, rotate: 5 }}
                     className="w-20 h-20 bg-white/5 backdrop-blur-[40px] border border-white/20 rounded-3xl flex items-center justify-center font-display text-3xl italic text-gold mb-8 relative z-10 shadow-lg transition-all duration-300 group-hover:border-gold"
                   >
                     {s.step}
                   </m.div>
                   <h3 className="font-body font-bold text-lg text-ivory uppercase tracking-widest mb-4 transition-colors drop-shadow-md">{s.title}</h3>
                   <p className="text-ivory/60 text-sm leading-relaxed max-w-xs">{s.desc}</p>
                 </m.div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Guest Experience Preview */}
      <section className="py-32 px-6 overflow-hidden relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          
          <m.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="order-1 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-[40px] border border-white/50 px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[3px] text-ink mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
              Guest Experience
            </div>
            <h3 className="font-display text-4xl md:text-[56px] text-ink font-medium leading-[1.1] mb-8 relative drop-shadow-sm">
              A digital invitation <br/>
              <span className="italic text-gold">as beautiful</span> as the occasion
            </h3>
            
            <div className="space-y-6">
              {[
                {text:'No app download or login required', delay: 0.1},
                {text:'Venue map revealed only after RSVP', delay: 0.2},
                {text:'Works perfectly on any mobile device', delay: 0.3}
              ].map((item, i) => (
                <m.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: item.delay }}
                  className="flex items-start gap-4 group cursor-default"
                >
                   <div className="w-8 h-8 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-sm flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-125 group-hover:bg-gold group-hover:border-gold">
                     <Check size={14} className="text-gold group-hover:text-white transition-colors" />
                   </div>
                   <p className="font-body text-ink/80 text-lg group-hover:text-ink transition-colors font-medium mt-0.5">{item.text}</p>
                </m.div>
              ))}
            </div>

            <m.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-12"
            >
              <Link href="/admin">
                <button className="group bg-white/20 backdrop-blur-[40px] border border-white/50 text-ink px-8 py-4 font-bold uppercase text-[11px] tracking-widest rounded-xl shadow-sm hover:bg-white/40 hover:border-white/80 transition-all flex items-center gap-2">
                  Explore Guest Flow <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
            </m.div>
          </m.div>

          <m.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="order-2 lg:order-2 flex justify-center relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[600px] bg-gold/20 blur-[120px] rounded-full pointer-events-none"></div>

            <m.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-[320px] h-[650px] bg-white/10 backdrop-blur-[40px] border-[0.5px] border-white/40 rounded-[44px] shadow-[0_30px_80px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col group p-2"
            >
               <div className="rounded-[36px] overflow-hidden flex-1 relative flex flex-col bg-ivory shadow-inner border border-black/5">
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/50 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-30 pointer-events-none transform -translate-x-[100%] group-hover:translate-x-[100%]"></div>

                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black/80 backdrop-blur-md rounded-b-[16px] z-20"></div>
                 
                 <div className="flex-1 overflow-y-auto bg-ivory hide-scrollbar flex flex-col items-center">
                   <div className="w-full h-72 bg-gradient-to-b from-ink to-[#2A1F12] flex flex-col items-center justify-end pb-8 relative shrink-0 overflow-hidden">
                     <m.div 
                       animate={{ rotate: 360 }}
                       transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                       className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-20" style={{ backgroundImage: 'radial-gradient(var(--color-gold) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                     ></m.div>
                     <h1 className="font-display text-4xl italic text-ivory relative z-10 drop-shadow-md">Rahul & Priya</h1>
                     <div className="w-16 h-[2px] bg-gold my-4 relative z-10"></div>
                     <div className="text-[10px] text-gold uppercase tracking-widest relative z-10 font-bold drop-shadow-md">Kochi &middot; Dec 28</div>
                   </div>
                   
                   <div className="p-6 flex-1 flex flex-col w-full">
                     <h2 className="font-display text-3xl text-ink mb-6 text-center leading-snug pt-4">Will you be<br/>joining us?</h2>
                     <div className="space-y-4 mt-auto mb-4 w-full">
                       <m.div whileHover={{ scale: 1.02 }} className="w-full py-4 border border-gold/40 bg-gold/5 backdrop-blur-[40px] text-ink font-display text-xl italic rounded-2xl shadow-sm flex justify-center items-center cursor-pointer hover:bg-gold/20 hover:border-gold transition-all">
                         Yes, I&apos;ll be there
                       </m.div>
                       <m.div whileHover={{ scale: 1.02 }} className="w-full py-4 border-[0.5px] border-ink/20 bg-black/5 backdrop-blur-[40px] text-ink/70 font-display text-xl italic rounded-2xl shadow-sm flex justify-center items-center cursor-pointer hover:bg-black/10 transition-all">
                         I cannot attend
                       </m.div>
                     </div>
                   </div>
                 </div>
               </div>
            </m.div>
          </m.div>
        </div>
      </section>

      {/* 7. Caterer Portal Highlight (Clear Glass) */}
      <section className="pb-32 px-6 pt-10 relative z-10">
        <FadeInUp>
          <div className="max-w-5xl mx-auto bg-white/20 backdrop-blur-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[40px] flex flex-col md:flex-row items-stretch border-[0.5px] border-white/60 overflow-hidden relative group">
            
            <div className="p-10 md:p-14 pl-10 md:pl-16 flex-1 z-10 relative flex flex-col justify-center">
               <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-gold to-gold-light transform origin-top group-hover:scale-y-110 transition-transform duration-500"></div>
               
               <h3 className="font-display text-3xl md:text-[40px] text-ink font-bold mb-6 leading-tight drop-shadow-sm">Your caterers always have the right numbers</h3>
               <p className="text-ink/70 text-sm md:text-base leading-relaxed mb-8 font-medium">
                 Generate instant, print-ready PDF reports for your kitchen team. See precise headcounts separated by Veg and Non-Veg preferences, automatically calculating a standard 10% safety buffer to prevent peak-wedding shortages.
               </p>
               <button className="bg-white/40 backdrop-blur-[40px] border border-white/60 px-6 py-4 rounded-xl text-ink font-bold uppercase text-[10px] tracking-widest shadow-sm hover:bg-gold hover:text-white hover:border-gold transition-all flex items-center gap-2 group/btn w-max">
                  See Sample Report <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform"/>
               </button>
            </div>

            <div className="w-full md:w-2/5 bg-white/10 border-t md:border-t-0 md:border-l border-white/40 p-8 md:p-12 flex flex-col justify-center min-h-[300px] relative overflow-hidden">
               <div className="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700">
                 <ChefHat size={250} />
               </div>

               <div className="relative z-10 bg-white/30 backdrop-blur-[60px] border-[0.5px] border-white/60 p-6 rounded-3xl shadow-xl">
                 <div className="text-[10px] uppercase tracking-widest text-ink/70 font-bold mb-2">Total Confirmed</div>
                 <m.div 
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 1 }}
                   viewport={{ once: true }}
                   className="font-display text-[70px] leading-none text-gold mb-6 drop-shadow-sm"
                 >
                   <AnimatedStat value={248} label="" />
                 </m.div>
                 
                 <div className="flex justify-between text-[10px] font-bold uppercase text-ink mb-2">
                   <span>142 Veg</span>
                   <span>106 Non-Veg</span>
                 </div>
                 <div className="h-4 w-full flex rounded-full overflow-hidden shadow-inner bg-black/10 border border-black/5">
                    <m.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '57%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-success/80 to-success"
                    />
                    <m.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: '43%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-error/80 to-error" 
                    />
                 </div>
               </div>
            </div>
          </div>
        </FadeInUp>
      </section>

      {/* 8. Pricing Section (IOS Dark Glass) */}
      <section id="pricing" className="bg-[#0F0C07] py-32 px-6 relative z-20">
        <div className="absolute top-1/2 left-1/4 w-[800px] h-[800px] bg-gold/15 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <FadeInUp className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl text-ivory font-medium drop-shadow-2xl">Simple, transparent pricing</h2>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            
            {/* Basic Tier */}
            <m.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 backdrop-blur-[40px] border-[0.5px] border-white/10 rounded-[40px] p-10 flex flex-col hover:border-gold/30 hover:bg-white/10 transition-all shadow-2xl group"
            >
              <div className="text-[11px] font-bold uppercase tracking-widest text-ivory/50 mb-2">Basic</div>
              <div className="font-display text-5xl text-ivory mb-6 mt-2 relative">
                Free<span className="text-lg text-ivory/50 font-body">/event</span>
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-white/20 transition-all duration-300 group-hover:w-full group-hover:bg-gold/50 rounded-full"></span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-ivory/70 flex-1 mt-4">
                <li className="flex items-center gap-3"><span className="bg-white/10 backdrop-blur-md p-1.5 rounded-full"><Check size={14} className="text-gold" /></span> Single event</li>
                <li className="flex items-center gap-3"><span className="bg-white/10 backdrop-blur-md p-1.5 rounded-full"><Check size={14} className="text-gold" /></span> Up to 200 guests</li>
                <li className="flex items-center gap-3"><span className="bg-white/10 backdrop-blur-md p-1.5 rounded-full"><Check size={14} className="text-gold" /></span> Standard template</li>
              </ul>
              <button className="w-full mt-auto py-4 bg-white/5 backdrop-blur-[40px] border border-white/10 text-ivory font-bold uppercase text-[11px] tracking-widest rounded-2xl hover:bg-gold hover:text-[#0F0C07] hover:border-gold transition-all shadow-lg">Start Free</button>
            </m.div>

            {/* Premium Tier */}
            <m.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-gold/10 to-transparent backdrop-blur-[40px] border border-gold/40 rounded-[40px] p-10 shadow-[0_0_80px_rgba(201,168,76,0.15)] relative transform md:-translate-y-6 flex flex-col z-10 group"
            >
              <div className="absolute inset-0 bg-gold/5 rounded-[40px] pointer-events-none group-hover:bg-gold/10 transition-colors"></div>
              
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold/20 backdrop-blur-xl border border-gold/50 text-gold text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-full shadow-lg whitespace-nowrap z-20">Most Popular</div>
              
              <div className="text-[11px] font-bold uppercase tracking-widest text-gold mb-2 relative z-10">Premium</div>
              <div className="font-display text-5xl text-white mb-6 mt-2 relative z-10 drop-shadow-md">
                ₹1,999<span className="text-lg text-white/50 font-body">/event</span>
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gold transition-all duration-300 group-hover:w-full rounded-full shadow-[0_0_10px_rgba(201,168,76,0.5)]"></span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-white/90 font-medium flex-1 mt-4 relative z-10">
                <li className="flex items-center gap-3"><span className="bg-gold/20 backdrop-blur-md p-1.5 rounded-full"><Check size={14} className="text-gold" /></span> Unlimited guests</li>
                <li className="flex items-center gap-3"><span className="bg-gold/20 backdrop-blur-md p-1.5 rounded-full"><Check size={14} className="text-gold" /></span> Multi event logic</li>
                <li className="flex items-center gap-3"><span className="bg-gold/20 backdrop-blur-md p-1.5 rounded-full"><Check size={14} className="text-gold" /></span> Caterer PDF</li>
                <li className="flex items-center gap-3"><span className="bg-gold/20 backdrop-blur-md p-1.5 rounded-full"><Check size={14} className="text-gold" /></span> WhatsApp support</li>
              </ul>
              <button className="w-full mt-auto py-4 bg-gold border border-gold-light text-[#0F0C07] font-bold uppercase text-[11px] tracking-widest rounded-2xl hover:scale-[1.02] transition-transform shadow-[0_10px_30px_rgba(201,168,76,0.3)] relative overflow-hidden group-btn z-10">
                <span className="relative z-10">Upgrade Event</span>
                <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:animate-[shine_1.5s]"></div>
              </button>
            </m.div>

            {/* Enterprise Tier */}
            <m.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/5 backdrop-blur-[40px] border-[0.5px] border-white/10 rounded-[40px] p-10 flex flex-col hover:border-gold/30 hover:bg-white/10 transition-all shadow-2xl group"
            >
              <div className="text-[11px] font-bold uppercase tracking-widest text-ivory/50 mb-2">Enterprise</div>
              <div className="font-display text-5xl text-ivory mb-6 mt-2 relative">
                Custom
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-white/20 transition-all duration-300 group-hover:w-full group-hover:bg-gold/50 rounded-full"></span>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-ivory/70 flex-1 mt-4">
                <li className="flex items-center gap-3"><span className="bg-white/10 backdrop-blur-md p-1.5 rounded-full"><Check size={14} className="text-gold" /></span> White-label</li>
                <li className="flex items-center gap-3"><span className="bg-white/10 backdrop-blur-md p-1.5 rounded-full"><Check size={14} className="text-gold" /></span> Agency tools</li>
                <li className="flex items-center gap-3"><span className="bg-white/10 backdrop-blur-md p-1.5 rounded-full"><Check size={14} className="text-gold" /></span> Custom domain</li>
              </ul>
              <button className="w-full mt-auto py-4 bg-white/5 backdrop-blur-[40px] border border-white/10 text-ivory font-bold uppercase text-[11px] tracking-widest rounded-2xl hover:bg-gold hover:text-[#0F0C07] hover:border-gold transition-all shadow-lg">Contact Us</button>
            </m.div>

          </div>
        </div>
      </section>

      {/* 9. Testimonial / Social Proof (Clear Glass) */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto relative z-10">
          <FadeInUp>
            <h2 className="font-display text-4xl md:text-5xl text-ink text-center italic mb-20 drop-shadow-sm">
              Families who trusted WeddWise
            </h2>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: "It completely removed the chaos of calling 300 families for headcounts. The caterer reports were spot-on.", name: "Sreelakshmi & Arjun", loc: "Thrissur" },
              { quote: "Our guests loved the digital invite. Being able to see the venue map directly without an app was perfect for older relatives.", name: "The Menon Family", loc: "Kochi" },
              { quote: "Managing multiple events like Haldi and Reception separately saved us so much confusion and food waste.", name: "Rahul & Priya", loc: "Trivandrum" }
            ].map((t, i) => (
              <m.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2, ease: "easeOut" }}
                whileHover={{ y: -10 }}
                className="bg-white/20 backdrop-blur-[40px] p-10 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border-[0.5px] border-white/50 flex flex-col relative transition-all duration-500 hover:bg-white/30 hover:shadow-[0_30px_60px_rgba(201,168,76,0.08)] group overflow-hidden"
              >
                <div className="text-gold font-display text-7xl absolute top-4 left-6 opacity-20 leading-none select-none drop-shadow-sm">&quot;</div>
                <p className="font-display text-xl text-ink italic leading-relaxed mb-10 relative z-10 pt-6">&quot;{t.quote}&quot;</p>
                <div className="mt-auto pt-6 border-t border-ink/5 flex items-center justify-between relative z-10">
                  <div>
                    <div className="font-bold text-sm text-ink uppercase tracking-wider">{t.name}</div>
                    <div className="text-[10px] text-ink/60 uppercase tracking-widest mt-1">{t.loc}</div>
                  </div>
                  <div className="flex bg-white/40 backdrop-blur-[40px] border-[0.5px] border-white/60 px-3 py-1.5 rounded-full shadow-sm gap-1">
                    <Star size={12} className="fill-gold text-gold" /><Star size={12} className="fill-gold text-gold" /><Star size={12} className="fill-gold text-gold" />
                  </div>
                </div>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Final CTA Section (Ultimate Clear IOS Glass) */}
      <section className="py-32 px-6 relative z-10 flex items-center justify-center min-h-[60vh] overflow-hidden -mt-20">
        
        <m.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10 bg-white/10 backdrop-blur-[60px] p-12 md:p-24 rounded-[60px] border-[0.5px] border-white/60 shadow-[0_30px_100px_rgba(201,168,76,0.15)] overflow-hidden"
        >
          {/* Subtle Inner Highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80 mix-blend-overlay"></div>

          <h2 className="font-display text-5xl md:text-7xl text-ink mb-6 italic drop-shadow-md relative z-10">
            Your celebration deserves this
          </h2>
          <p className="font-body text-ink/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium relative z-10 drop-shadow-sm">
            Bring unparalleled elegance and organization to your big day. Let the technology handle the chaos while you enjoy the journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center relative z-10">
            <Link href="/admin/events/new" className="w-full sm:w-auto">
              <m.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-[#0F0C07]/80 backdrop-blur-[40px] border border-white/20 text-gold px-10 py-5 text-[12px] font-bold uppercase tracking-widest rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.2)] flex items-center justify-center gap-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:bg-[#0F0C07] hover:border-gold/30 transition-all"
              >
                Create Your Event <ArrowRight size={16} />
              </m.button>
            </Link>
            <m.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto border-[0.5px] border-ink/30 bg-white/20 backdrop-blur-[40px] text-ink px-10 py-5 text-[12px] font-bold uppercase tracking-widest rounded-2xl shadow-sm hover:border-ink/50 transition-all"
            >
              Talk to Us
            </m.button>
          </div>
        </m.div>
      </section>

      {/* 11. Footer (Dark) */}
      <footer className="bg-[#0F0C07] pt-32 pb-8 px-6 text-ivory/60 relative overflow-hidden z-20">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gold/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 relative z-10">
          <div className="col-span-1 md:col-span-5 pr-8">
             <div className="flex items-center gap-2 mb-6 group cursor-pointer w-max">
               <div className="text-gold font-display text-sm font-bold flex items-center justify-center w-10 h-10 rounded-xl border border-gold/30 bg-white/5 backdrop-blur-[40px] group-hover:bg-gold group-hover:text-[#0F0C07] transition-all duration-300 shadow-[0_0_20px_rgba(201,168,76,0.1)] group-hover:shadow-[0_0_20px_rgba(201,168,76,0.4)]">W</div>
               <span className="font-display text-3xl font-bold text-ivory tracking-wide drop-shadow-md">WeddWise</span>
             </div>
             <p className="text-sm leading-relaxed mb-6 max-w-sm font-medium">The modern standard for Kerala wedding RSVP tracking and elegant guest management. Built precisely to handle the scale and beauty of our traditions.</p>
          </div>
          
          <div className="md:col-span-2">
             <h4 className="text-gold/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 drop-shadow-sm">Product</h4>
             <ul className="space-y-4 text-sm font-medium">
               <li><Link href="#features" className="hover:text-gold transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-gold transition-all group-hover:w-3"></span>Features</Link></li>
               <li><Link href="#pricing" className="hover:text-gold transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-gold transition-all group-hover:w-3"></span>Pricing</Link></li>
               <li><Link href="/admin" className="hover:text-gold transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-gold transition-all group-hover:w-3"></span>Live Dashboard</Link></li>
               <li><Link href="/admin/events/new" className="hover:text-gold transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-gold transition-all group-hover:w-3"></span>Create Event</Link></li>
             </ul>
          </div>

          <div className="md:col-span-2">
             <h4 className="text-gold/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 drop-shadow-sm">Company</h4>
             <ul className="space-y-4 text-sm font-medium">
               <li><a href="#" className="hover:text-gold transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-gold transition-all group-hover:w-3"></span>About Us</a></li>
               <li><a href="#" className="hover:text-gold transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-gold transition-all group-hover:w-3"></span>Contact</a></li>
               <li><a href="#" className="hover:text-gold transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-gold transition-all group-hover:w-3"></span>Privacy Policy</a></li>
               <li><a href="#" className="hover:text-gold transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-gold transition-all group-hover:w-3"></span>Terms of Service</a></li>
             </ul>
          </div>

          <div className="md:col-span-3">
             <h4 className="text-gold/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 drop-shadow-sm">Connect</h4>
             <ul className="space-y-4 text-sm font-medium">
               <li><a href="#" className="hover:text-gold transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-gold transition-all group-hover:w-3"></span>Instagram</a></li>
               <li><a href="#" className="hover:text-gold transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-gold transition-all group-hover:w-3"></span>WhatsApp Support</a></li>
               <li><a href="#" className="hover:text-gold transition-colors flex items-center gap-2 group"><span className="w-0 h-px bg-gold transition-all group-hover:w-3"></span>Email Us</a></li>
             </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto border-t border-white/10 pt-8 text-center md:flex md:justify-between md:items-center relative z-10">
          <div className="text-[10px] uppercase tracking-widest mb-4 md:mb-0 font-bold opacity-50 hover:opacity-100 transition-opacity">
            &copy; 2025 WeddWise Inc. All Rights Reserved.
          </div>
          <div className="text-[10px] uppercase tracking-widest text-gold flex items-center justify-center gap-1.5 font-bold drop-shadow-sm">
            Crafted with <Star size={10} className="fill-gold animate-pulse"/> for luxury Indian weddings
          </div>
        </div>
      </footer>
    </div>
  )
}
