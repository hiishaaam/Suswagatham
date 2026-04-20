import React from 'react';
import { m } from 'motion/react';
import { demoEvent, TemplateProps } from './shared';

export default function MidnightBloom({ isPreview = true, eventDetails }: TemplateProps) {
  const data = eventDetails || demoEvent;

  return (
    <div className="w-full min-h-[100dvh] bg-[#EBE5D9] relative overflow-hidden font-body text-[#3B2C1A]">
      {/* Vintage Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>

      <div className="flex flex-col h-full w-full relative z-10 px-6 pt-12 pb-10">
         {/* Top Banner (Marquee) */}
         <div className="w-full border-t border-b border-[#3B2C1A] py-1 mb-4 text-center overflow-hidden flex">
            <m.div 
               animate={{ x: ["0%", "-50%"] }} 
               transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
               className="font-display font-bold text-[8px] uppercase tracking-widest text-[#3B2C1A] whitespace-nowrap inline-flex gap-4"
            >
               <span>— DAYS TO GO —</span>
               <span>— CELEBRATE WITH US —</span>
               <span>— DAYS TO GO —</span>
               <span>— CELEBRATE WITH US —</span>
            </m.div>
         </div>

         {/* Location Banner (Pulsing bg) */}
         <m.div 
            animate={{ backgroundColor: ["#EBE5D9", "#D1B162", "#EBE5D9"] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-full border border-[#3B2C1A] p-2 mb-8 text-center"
         >
            <span className="font-body font-bold text-[8px] uppercase tracking-[0.2em] mix-blend-color-burn">{data.date.toUpperCase()} | {data.venue.toUpperCase()}</span>
         </m.div>

         {/* Huge Serif Text with staggered entrance */}
         <div className="w-full mb-6 relative">
            <m.h1 
               initial={{ y: 20, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               transition={{ duration: 0.8 }}
               className="font-display font-black text-[56px] leading-[0.8] text-[#93281E] uppercase tracking-tighter mix-blend-multiply"
            >
              {data.coupleNames.split(' ')[0]}<br/>
              <m.span 
                 animate={{ rotate: [0, -10, 10, 0] }} 
                 transition={{ duration: 3, repeat: Infinity }} 
                 className="inline-block text-[#D1B162]"
              >&amp;</m.span> {(data.coupleNames.split(' & ')[1] || data.coupleNames.split(' AND ')[1] || '').split(' ')[0]}
            </m.h1>
            <p className="font-body text-[#3B2C1A] text-[9px] mt-2 font-bold tracking-widest">{data.coupleNames}</p>
            
            {/* Celebration Sticker */}
            <m.div 
               animate={{ scale: [1, 1.2, 1], rotate: 15 }} 
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute -right-4 top-0 bg-[#D1B162] text-white text-[12px] font-bold px-3 py-1 rounded-full shadow-lg border-2 border-[#3B2C1A]"
            >
               NEW!
            </m.div>
         </div>

         {/* Buttons */}
          {/* Buttons handled by parent GuestPage in live mode */}
          {isPreview && (
            <div className="flex gap-2 w-full mb-8 z-20">
               <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 bg-[#D1B162] text-[#EBE5D9] font-body font-bold text-[10px] uppercase py-3 shadow-[2px_2px_0px_#3B2C1A] border border-[#3B2C1A]">RSVP</m.button>
               <m.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 bg-[#93281E] text-[#EBE5D9] font-body font-bold text-[10px] uppercase py-3 shadow-[2px_2px_0px_#3B2C1A] border border-[#3B2C1A]">SCHEDULE</m.button>
            </div>
          )}

         {/* Hero Image with Slow Parallax */}
         <div className="w-full flex-1 relative border-2 border-[#3B2C1A] mt-auto min-h-[300px] overflow-hidden group">
            <m.img 
               animate={{ y: ["-5%", "0%", "-5%"] }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               src={data.photoUrl || "https://images.unsplash.com/photo-1614713568393-2715cc6ba114?q=80&w=600&auto=format&fit=crop"} 
               className="w-full h-[110%] object-cover filter contrast-125 saturate-50 absolute top-0 z-0 pointer-events-none" 
               alt="Couple" 
            />
            {/* Spinning Music Record Sticker */}
            <m.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               className="absolute bottom-4 right-4 w-10 h-10 bg-[#3B2C1A] rounded-full flex items-center justify-center border-2 border-[#D1B162] shadow-xl"
            >
               <span className="text-white text-xs">🎵</span>
            </m.div>
         </div>
      </div>
    </div>
  );
}
