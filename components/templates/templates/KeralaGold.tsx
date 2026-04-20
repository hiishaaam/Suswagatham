import React from 'react';
import { m } from 'motion/react';
import { demoEvent, TemplateProps } from './shared';

export default function KeralaGold({ isPreview = true, eventDetails }: TemplateProps) {
  const data = eventDetails || demoEvent;

  return (
    <div className="w-full min-h-[100dvh] bg-[#1A1208] relative overflow-hidden font-body text-[#FAF7F0] flex flex-col">
      {/* Background Hero with Ken Burns effect */}
      <div className="flex-1 w-full relative overflow-hidden">
         <m.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: isPreview ? 1.1 : 1.3 }}
            transition={{ duration: 15, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            src={data.photoUrl || "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=800"} 
            className="w-full h-full object-cover origin-center transform-gpu" 
            alt="Couple" 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208] via-transparent to-[#1A1208]/40"></div>
         
         {/* Animated Top Sticker */}
         <m.div 
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-10 right-8 text-4xl drop-shadow-xl"
         >
            ✨
         </m.div>
         <m.div 
            animate={{ y: [0, 15, 0], rotate: [0, -10, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute top-40 left-6 text-3xl drop-shadow-xl opacity-60"
         >
            🕊️
         </m.div>

         <div className="absolute bottom-6 left-6 text-white/50 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
            <m.div className="w-2 h-2 rounded-full bg-white" animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }}></m.div>
            01 / 03
         </div>
      </div>

      {/* Typography Section */}
      <div className="w-full flex flex-col px-8 pb-16 pt-8 text-center relative z-10 bg-[#1A1208]">
         {/* Marquee Text */}
         <div className="overflow-hidden whitespace-nowrap mb-6 flex">
            <m.div 
               animate={{ x: ["0%", "-50%"] }} 
               transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
               className="font-body text-[#C9A84C] text-[10px] uppercase tracking-[0.3em] font-bold inline-flex gap-8"
            >
               <span>WEDDING INVITATION · 2025</span>
               <span>WEDDING INVITATION · 2025</span>
               <span>WEDDING INVITATION · 2025</span>
            </m.div>
         </div>
         
         <m.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display italic text-[#FAF7F0]/60 text-[10px] tracking-widest mb-6"
         >
            ❋ Om Shree Ganeshay Namaha ❋
         </m.div>
         
          <m.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-display font-bold text-[48px] text-white leading-none origin-bottom"
         >
            {data.coupleNames.split(' ')[0]}
         </m.h1>
         
         <div className="font-body italic text-[#C9A84C] text-[12px] my-2 relative">
            — weds —
            {/* Spinning decorative ring around "weds" */}
            <m.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-dashed border-[#C9A84C]/20 rounded-full"
            />
         </div>
         
         <m.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-display font-bold text-[48px] text-[#C9A84C] leading-none mb-6 drop-shadow-[0_0_15px_rgba(201,168,76,0.5)] origin-top"
         >
            {(data.coupleNames.split(' & ')[1] || data.coupleNames.split(' AND ')[1] || '').split(' ')[0]}
         </m.h1>
      </div>

      {/* Floating Action Button with Pulse */}
      <m.div 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-6 right-6 w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg z-50 cursor-pointer"
      >
        <m.div 
           animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }} 
           transition={{ duration: 1.5, repeat: Infinity }}
           className="absolute inset-0 bg-[#25D366] rounded-full"
        />
        <svg fill="white" viewBox="0 0 24 24" className="w-6 h-6 relative z-10"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
      </m.div>
    </div>
  );
}
