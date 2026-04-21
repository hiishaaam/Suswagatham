import React from 'react';
import { m } from 'motion/react';
import { demoEvent, TemplateProps } from './shared';

export default function MaroonRoyale({ isPreview = true, eventDetails }: TemplateProps) {
  const [mounted, setMounted] = React.useState(false);
   
  React.useEffect(() => setMounted(true), []);
  const data = eventDetails || demoEvent;

  return (
    <div className="w-full min-h-[100dvh] bg-[#12221A] relative overflow-hidden font-body text-[#FAF7F0] flex flex-col">
      {/* Top 75% Illustration/Image */}
      <div className="flex-1 w-full relative -z-0 overflow-hidden">
         <m.img 
            animate={{ scale: [1, 1.15, 1], rotate: [0, 1, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            src={data.photoUrl || "https://images.unsplash.com/photo-1596766624911-396a5a31a980?auto=format&fit=crop&q=80&w=800"} 
            className="w-full h-full object-cover opacity-80 pointer-events-none" 
            alt="Mosque background" 
         />
         <div className="absolute inset-0 bg-gradient-to-b from-[#12221A]/80 via-transparent to-[#12221A]/100"></div>
         
         {/* Top Arabic Text (Glowing) */}
         <m.div 
            animate={{ opacity: [0.7, 1, 0.7] }} 
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-12 left-0 w-full text-center z-10 px-6"
         >
            <h2 className="font-display text-[20px] text-[#C9A84C] drop-shadow-[0_0_10px_rgba(201,168,76,0.5)]">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</h2>
            <p className="font-body text-[8px] uppercase tracking-widest text-[#FAF7F0] mt-2 font-semibold">In the Name of Allah, the Most Gracious, the Most Merciful</p>
         </m.div>

         {/* Middle Text Over Image */}
         <div className="absolute bottom-[25%] left-0 w-full text-center z-10">
            <h3 className="font-body text-[8px] uppercase tracking-[0.4em] text-[#C9A84C] mb-2 font-bold">Nikah Invitation</h3>
            <h1 className="font-display font-bold text-[48px] text-[#FAF7F0] leading-none drop-shadow-lg relative inline-block">
              <m.span initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>{data.coupleNames.split(' ')[0]}</m.span> 
              <br/> 
              <m.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-[#C9A84C] text-[32px] italic inline-block">&amp;</m.span> 
              <br/>
              <m.span initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>{(data.coupleNames.split(' & ')[1] || data.coupleNames.split(' AND ')[1] || '').split(' ')[0]}</m.span>
            </h1>
            <p className="font-body text-[10px] text-[#FAF7F0]/80 tracking-widest uppercase mt-4">{data.date}</p>
         </div>

         {/* Floating Stars - Client Only */}
         {mounted && [...Array(6)].map((_, i) => (
            <m.div 
               key={i}
               animate={{ y: [0, -20, 0], opacity: [0, 1, 0] }}
                
               transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
               className="absolute text-white text-[10px]"
                
               style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 60 + 20}%` }}
            >
               ✨
            </m.div>
         ))}
      </div>

      {/* Bottom curved card */}
      <m.div 
         initial={{ y: 100 }}
         whileInView={{ y: 0 }}
         transition={{ type: "spring", stiffness: 50, damping: 20 }}
         className="h-[200px] w-full bg-[#FAF7F0] rounded-t-[40px] relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] flex flex-col items-center px-6 pt-8"
      >
         <div className="w-12 h-1 bg-[#12221A]/10 rounded-full mb-6"></div>
         
         <div className="text-center w-full relative">
            <p className="font-body text-[8px] uppercase tracking-[0.2em] text-[#12221A]/60 font-bold mb-1">The Blessed Union</p>
            <h2 className="font-display italic text-[24px] text-[#1A1208]">Meet the Couple</h2>
            
            {/* Play Button Sticker */}
            <m.div 
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.95 }}
               className="absolute -top-16 right-0 w-14 h-14 bg-[#12221A] text-[#C9A84C] rounded-full flex items-center justify-center shadow-2xl cursor-pointer border-2 border-[#C9A84C]"
            >
               <m.svg 
                  animate={{ scale: [1, 1.1, 1] }} 
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-5 h-5 ml-1" viewBox="0 0 24 24" fill="currentColor"
               >
                  <path d="M8 5v14l11-7z" />
               </m.svg>
            </m.div>
         </div>
      </m.div>
    </div>
  );
}
