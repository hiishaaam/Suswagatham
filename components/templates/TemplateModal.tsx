import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: any;
  onNext: () => void;
  onPrev: () => void;
}

export default function TemplateModal({ isOpen, onClose, template, onNext, onPrev }: TemplateModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          ></motion.div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white hover:text-[#C9A84C] z-50 transition-colors"
            aria-label="Close preview"
          >
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          {/* Navigation Arrows */}
          <button onClick={onPrev} className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 text-white hover:text-[#C9A84C] z-50 transition-colors p-4 hidden sm:block">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          
          <button onClick={onNext} className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 text-white hover:text-[#C9A84C] z-50 transition-colors p-4 hidden sm:block">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>

          {/* Device Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-[375px] h-full max-h-[812px] bg-black rounded-[40px] border-[8px] border-[#1a1a1a] shadow-[inset_0_0_12px_rgba(255,255,255,0.1),0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
          >
             {/* Notch */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-[#1a1a1a] rounded-b-[16px] z-50 shadow-[0_2px_10px_rgba(0,0,0,0.2)]"></div>
             
             {/* The Actual Live Component */}
             <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-white relative isolate">
                {template && React.createElement(template.component, { isPreview: false })}
             </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 hidden sm:flex items-center gap-6 bg-black/50 backdrop-blur-md border border-white/10 pl-6 pr-2 py-2 rounded-full shadow-2xl"
          >
             <span className="font-body text-sm text-white/80">Like this template?</span>
             <Link href={`/admin/events/new?template=${template.id}`}>
               <button className="bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] text-[#1A1208] font-body font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:brightness-110 transition-all flex items-center gap-2">
                 Use it <span className="">→</span>
               </button>
             </Link>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
