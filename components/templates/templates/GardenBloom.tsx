import React from 'react';
import Image from 'next/image';
import { m } from 'motion/react';
import { demoEvent, TemplateProps } from './shared';

export default function GardenBloom({ isPreview = true, eventDetails }: TemplateProps) {
  const [mounted, setMounted] = React.useState(false);
   
  React.useEffect(() => setMounted(true), []);
  const data = eventDetails || demoEvent;
  
  return (
    <div className="w-full min-h-[100dvh] bg-gradient-to-b from-[#31224A] to-[#1A0A2E] relative overflow-hidden font-body text-white flex flex-col items-center justify-between">
      
      {/* Top Card */}
      <m.div 
         initial={{ y: -50, opacity: 0 }}
         animate={{ y: 0, opacity: 1 }}
         transition={{ duration: 1, type: "spring" }}
         className="w-[90%] bg-gradient-to-b from-[#D1B162]/20 to-transparent border border-[#D1B162]/30 p-4 mt-10 rounded-[12px] text-center shadow-lg relative z-20 backdrop-blur-md"
      >
         <p className="font-display italic text-[#FAF7F0] text-[10px] tracking-wide leading-relaxed">
            In the Name of Allah, the Most <br/>Gracious, the Most Merciful
         </p>
      </m.div>

      {/* Animated Confetti Particles - Client Only */
      mounted && (
      <div className="absolute inset-0 pointer-events-none opacity-60">
        {[...Array(20)].map((_, i) => (
          <m.div 
            key={i} 
            className="absolute w-[6px] h-[6px] rounded-sm bg-[#D1B162]"
            animate={{ 
               y: ["-10vh", "110vh"],
                
               x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
                
               rotate: [0, 360 * (Math.random() * 5)]
            }}
             
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
             
            style={{ left: `${Math.random() * 100}%`, top: "-10%" }}
          />
        ))}
        {[...Array(15)].map((_, i) => (
          <m.div 
            key={i + 100} 
            className="absolute w-[4px] h-[4px] rounded-full bg-white/50"
            animate={{ 
               y: ["-10vh", "110vh"],
                
               x: [0, Math.random() * 60 - 30]
            }}
             
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, ease: "linear", delay: Math.random() * 4 }}
             
            style={{ left: `${Math.random() * 100}%`, top: "-10%" }}
          />
        ))}
      </div>
      )}

      {/* 3D Stacked Images with Levitation */}
      <div className="relative w-full h-[300px] flex justify-center items-center isolate mt-auto mb-auto">
         {/* Back Image Left */}
         <m.div 
            animate={{ y: [0, -10, 0], rotate: [-6, -4, -6] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute w-[160px] h-[220px] rounded-[16px] overflow-hidden -rotate-6 -translate-x-14 opacity-60 mix-blend-luminosity shadow-2xl pointer-events-none"
         >
            <Image src={data.photoUrl || "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&q=80"} fill className="object-cover" alt="Background" />
         </m.div>
         
         {/* Back Image Right */}
         <m.div 
            animate={{ y: [0, 10, 0], rotate: [6, 8, 6] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute w-[160px] h-[220px] rounded-[16px] overflow-hidden rotate-6 translate-x-14 opacity-60 mix-blend-luminosity shadow-2xl pointer-events-none"
         >
            <Image src={data.photoUrl || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80"} fill className="object-cover" alt="Background" />
         </m.div>
         
         {/* Front Hero Image */}
         <m.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[200px] h-[260px] bg-white rounded-[12px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-[8px] border-white z-20 pb-8 pointer-events-none"
         >
            <Image src={data.photoUrl || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80"} fill className="object-cover object-top" style={{ height: '120%' }} alt="Couple" />
            
            {/* Polaroid Love heart */}
            <div className="absolute bottom-1 right-2 text-red-500 text-lg">❤️</div>
         </m.div>
      </div>

      {/* Typography Bottom */}
      <div className="mb-12 text-center z-10 w-full px-6">
         {/* Animated Scroll indicator */}
         <m.div 
            animate={{ y: [0, 5, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center justify-center gap-1 mb-6"
         >
            <div className="w-[1px] h-6 bg-gradient-to-b from-transparent via-[#D1B162] to-[#D1B162]"></div>
            <p className="font-body text-[8px] uppercase tracking-[0.2em] font-bold text-[#D1B162]">Tap or swipe to browse</p>
         </m.div>
         
         <m.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="font-display italic font-bold text-[56px] text-white leading-[0.8] mb-2 drop-shadow-[0_0_20px_rgba(209,177,98,0.3)]"
         >
            {data.coupleNames.split(' ')[0]}
         </m.h1>
         <m.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="font-body text-[8px] uppercase tracking-widest text-[#D1B162] mb-2 inline-block"
         >
            W e d s
         </m.div>
         <m.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display italic font-bold text-[56px] text-white leading-[0.8] drop-shadow-[0_0_20px_rgba(209,177,98,0.3)]"
         >
            {(data.coupleNames.split(' & ')[1] || data.coupleNames.split(' AND ')[1] || '').split(' ')[0]}
         </m.h1>
         
         <div className="mt-8 font-display italic text-[#D1B162] text-[14px]">Insha Allah</div>
      </div>
    </div>
  );
}
