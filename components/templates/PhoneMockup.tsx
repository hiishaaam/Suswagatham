import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

interface PhoneMockupProps {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  label: string;
  category: string;
  price: string;
  id: string;
}

export default function PhoneMockup({ children, isActive, onClick, label, category, price, id }: PhoneMockupProps) {
  return (
    <div className="flex flex-col items-center shrink-0 group">
      <motion.div
        layout
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -5 }}
        animate={{ scale: isActive ? 1.05 : 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative cursor-pointer overflow-visible"
        role="button"
        aria-label={`${label} preview`}
      >
        {/* Physical Drop Shadow */}
        <div className="absolute -inset-4 bg-black/30 blur-2xl rounded-full translate-y-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        {/* Outer Frame */}
        <div className="relative w-[232px] h-[484px] rounded-[42px] bg-[#1C1C1E] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_4px_10px_rgba(255,255,255,0.2),inset_0_-4px_10px_rgba(0,0,0,0.5)] border-[5px] border-[#1C1C1E]">
          
          {/* Hardware Buttons */}
          <div className="absolute top-[80px] -left-[7px] w-[2px] h-[22px] bg-[#2C2C2E] rounded-l-md shadow-[inset_1px_0_1px_rgba(255,255,255,0.1)]"></div>
          <div className="absolute top-[120px] -left-[7px] w-[2px] h-[40px] bg-[#2C2C2E] rounded-l-md shadow-[inset_1px_0_1px_rgba(255,255,255,0.1)]"></div>
          <div className="absolute top-[170px] -left-[7px] w-[2px] h-[40px] bg-[#2C2C2E] rounded-l-md shadow-[inset_1px_0_1px_rgba(255,255,255,0.1)]"></div>
          <div className="absolute top-[130px] -right-[7px] w-[2px] h-[60px] bg-[#2C2C2E] rounded-r-md shadow-[inset_-1px_0_1px_rgba(255,255,255,0.1)]"></div>
          
          {/* Inner bezel wrapper */}
          <div className="w-full h-full rounded-[36px] overflow-hidden relative bg-black border-[3px] border-black mask-image-[radial-gradient(white,black)]">
             
             {/* The Screen Layer */}
             <div className="w-full h-full relative" style={{ borderRadius: '32px', overflow: 'hidden' }}>
                {/* Dynamic Notch (Dynamic Island style) */}
                <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[84px] h-[24px] bg-black rounded-full z-50 flex items-center justify-between px-2.5">
                   <div className="w-[8px] h-[8px] rounded-full bg-blue-900/40"></div>
                   <div className="w-[8px] h-[8px] rounded-full bg-[#111] border border-[#222]"></div>
                </div>

                {/* Screen Content - Scaled from 375x812 */}
                {/* 232 - 10 (borders) - 6 (inner borders) = 216 width. 216 / 375 = 0.576. */}
                <div className="absolute top-0 left-0 w-[375px] h-[812px] origin-top-left bg-black" style={{ transform: 'scale(0.576)' }}>
                  <div className="w-full h-full pointer-events-none custom-scrollbar overflow-hidden [&>div]:!min-h-[812px] [&>div]:!h-full">
                     {children}
                  </div>
                </div>
                
                {/* Screen Glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none mix-blend-screen scale-[1.5] -translate-x-[20%] -translate-y-[20%] rotate-12"></div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Presentation Below Phone (Reference Style) */}
      <div className="mt-8 flex flex-col items-center text-center">
        <h3 className="font-display text-[22px] text-[#1A1208] leading-tight mb-2">{label}</h3>
        
        <div className="px-3 py-1 rounded-full bg-[#EEF5F4] text-[#115E59] font-body text-[10px] font-bold uppercase tracking-widest mb-4">
          {category}
        </div>
        
        <Link href={`/admin/events/new?template=${id}`}>
          <button className="bg-[#D1B162] hover:bg-[#C2A253] transition-colors text-[#1A1208] font-body font-semibold text-[13px] tracking-wide px-6 py-3 rounded-full flex items-center gap-2 shadow-sm">
            Order {price} <span className="text-[14px]">→</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
