import React from 'react';
import { motion } from 'motion/react';
import { demoEvent, TemplateProps } from './shared';

export default function SapphireNight({ isPreview = true, eventDetails }: TemplateProps) {
  const data = eventDetails || demoEvent;

  return (
    <div className="w-full min-h-[100dvh] bg-[#2E2822] relative overflow-hidden font-body text-[#FAF7F0] flex flex-col">
      {/* Full screen hero image */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
         <motion.img 
            animate={{ scale: [1, 1.2] }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
            src={data.photoUrl || "https://images.unsplash.com/photo-1621801306180-2a4fe6eb04ce?auto=format&fit=crop&q=80&w=800"} 
            className="w-full h-full object-cover origin-bottom pointer-events-none" 
            alt="Rustic Wedding" 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[#2E2822] via-[#2E2822]/20 to-[#2E2822]/40 border-[8px] border-transparent pointer-events-none"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full w-full justify-end px-8 pb-16 pointer-events-none">
         {/* Bismillah (Tiny) */}
         <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="w-full flex justify-center mb-6"
         >
            <svg viewBox="0 0 100 20" className="h-4 fill-[#FAF7F0]/80 drop-shadow-md">
               <path d="M50 10 C40 15 30 10 20 15" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
         </motion.div>

         {/* Names Block */}
         <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="w-full text-center border-l-4 border-[#FAF7F0] pl-6 text-left relative flex flex-col items-start bg-gradient-to-r from-[#2E2822]/90 to-transparent py-6 rounded-r-2xl shadow-xl backdrop-blur-sm pointer-events-auto"
         >
            <h1 className="font-display font-medium text-[44px] text-[#FAF7F0] leading-none mb-2 drop-shadow-md">
              {data.coupleNames.split(' ')[0]}
            </h1>
            <motion.div 
               animate={{ rotate: [0, 10, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="text-[12px] text-[#D1B162] font-display italic my-1 tracking-widest pl-2 drop-shadow-md"
            >
               &amp;
            </motion.div>
            <h1 className="font-display font-medium text-[44px] text-[#FAF7F0] leading-none mb-6 drop-shadow-md">
              {(data.coupleNames.split(' & ')[1] || data.coupleNames.split(' AND ')[1] || '').split(' ')[0]}
            </h1>
            
            <p className="font-body text-[10px] text-[#FAF7F0] tracking-[0.2em] uppercase font-bold bg-[#FAF7F0]/20 px-3 py-1 rounded-sm">
               {data.date.toUpperCase()}
            </p>

            {/* Glowing Ring Sticker */}
            <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute -right-4 -top-4 text-3xl"
            >
               💍
            </motion.div>
         </motion.div>
      </div>

      {/* Floating Action Button (WhatsApp Style) */}
      <motion.div 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-50 cursor-pointer pointer-events-auto"
      >
        <motion.div 
           animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }} 
           transition={{ duration: 2, repeat: Infinity }}
           className="absolute inset-0 bg-[#25D366] rounded-full"
        />
        <svg fill="white" viewBox="0 0 24 24" className="w-7 h-7 relative z-10"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.47-1.761-1.643-2.059-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
      </motion.div>
    </div>
  );
}
