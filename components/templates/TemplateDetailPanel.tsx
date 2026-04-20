import React from 'react';
import { m, AnimatePresence } from 'motion/react';

interface TemplateDetailPanelProps {
  template: any;
  onPreviewClick: () => void;
}

export default function TemplateDetailPanel({ template, onPreviewClick }: TemplateDetailPanelProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-16 px-6">
      <AnimatePresence mode="wait">
        <m.div
          key={template.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl flex flex-col md:flex-row gap-8 items-center md:items-start"
        >
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-display italic text-4xl text-[#C9A84C] mb-2">{template.name}</h3>
            <p className="font-body text-[15px] text-white/80 mb-6 leading-relaxed max-w-md">{template.desc}</p>
            
            <ul className="space-y-3 mb-8 md:mb-0 text-left w-max mx-auto md:mx-0">
              {template.features.map((feature: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-[#C9A84C] text-sm mt-0.5">✦</span>
                  <span className="font-body text-sm text-white/70">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex flex-col gap-4 w-full md:w-auto min-w-[240px]">
             <a href="/contact" className="w-full">
               <button className="w-full bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] text-[#1A1208] font-body font-bold text-[13px] uppercase tracking-widest py-4 rounded-xl shadow-lg hover:brightness-110 transition-all flex justify-center items-center gap-2 group">
                 Use This Template <span className="group-hover:translate-x-1 transition-transform">→</span>
               </button>
             </a>
             
             <button 
               onClick={onPreviewClick}
               className="w-full bg-transparent border border-[#C9A84C] text-[#C9A84C] font-body font-bold text-[13px] uppercase tracking-widest py-4 rounded-xl hover:bg-[#C9A84C]/10 transition-colors"
             >
               Preview Live Demo
             </button>
          </div>
        </m.div>
      </AnimatePresence>
    </div>
  );
}
