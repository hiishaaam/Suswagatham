import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue } from 'motion/react';
import Image from 'next/image';

const MOCK_TEMPLATES = [
  { id: 'christian-wedding-rsvp', name: 'Christian Classic', category: 'CHRISTIAN', image: '/templates/christian-wedding-rsvp.webp' },
  { id: 'muslim-wedding-rsvp', name: 'Emerald Islamic', category: 'MUSLIM', image: '/templates/muslim-wedding-rsvp.webp' },
  { id: 'hindu-wedding-rsvp', name: 'Vedic Ruby', category: 'HINDU', image: '/templates/hindu-wedding-rsvp.webp' },
  { id: 'sikh-wedding-rsvp', name: 'Golden Gurdwara', category: 'SIKH', image: '/templates/sikh-wedding-rsvp.webp' },
  { id: 'birthday-rsvp', name: 'Midnight Birthday', category: 'ALL FAITHS', image: '/templates/birthday-rsvp.webp' },
  { id: 'christian-wedding-invitation', name: 'Pearly White', category: 'CHRISTIAN', image: '/templates/christian-wedding-invitation.webp' },
  { id: 'muslim-wedding-invitation', name: 'Amethyst Dream', category: 'MUSLIM', image: '/templates/muslim-wedding-invitation.webp' },
  { id: 'hindu-wedding-invitation', name: 'Ivory Luxe', category: 'HINDU', image: '/templates/hindu-wedding-invitation.webp' },
  { id: 'sikh-wedding-invitation', name: 'Peach Bloom', category: 'SIKH', image: '/templates/sikh-wedding-invitation.webp' },
];

export default function TemplatesShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.scrollWidth - containerRef.current.offsetWidth);
    }
  }, []);

  return (
    <section className="py-32 bg-[#F6F4F0] relative overflow-hidden" id="templates">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-left"
        >
          <h2 className="font-display text-4xl md:text-5xl text-ink font-medium tracking-wide mb-4">
            Multicultural &amp; Heritage Themes
          </h2>
          <p className="font-body text-ink/60 text-lg flex items-center gap-3">
            <span className="italic">15+ Award-Winning Templates</span>
            <span className="w-1 h-1 bg-gold rounded-full" />
            <span className="uppercase tracking-widest text-sm">Drag to explore</span>
          </p>
        </motion.div>
      </div>

      <div className="w-full h-full overflow-hidden" ref={containerRef}>
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          whileTap={{ cursor: "grabbing" }}
          className="flex gap-8 px-6 md:px-12 cursor-grab"
        >
          {MOCK_TEMPLATES.map((template, idx) => (
            <motion.div 
              key={template.id}
              className="flex flex-col items-center flex-none"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.1 }}
            >
              {/* iPhone Mockup Frame */}
              <div className="relative w-[280px] h-[580px] rounded-[48px] bg-ink shadow-2xl border-[12px] border-[#1C1C1E] overflow-hidden mb-6 flex-none group">
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-[26px] bg-black rounded-full z-20" />
                
                {/* Phone Frame Buttons */}
                <div className="absolute left-[-16px] top-32 w-1 h-8 bg-black rounded-l-md" />
                <div className="absolute left-[-16px] top-44 w-1 h-12 bg-black rounded-l-md" />
                <div className="absolute left-[-16px] top-60 w-1 h-12 bg-black rounded-l-md" />
                <div className="absolute right-[-16px] top-44 w-1 h-16 bg-black rounded-r-md" />

                <div className="relative w-full h-full bg-ivory overflow-hidden rounded-[36px] custom-scrollbar">
                   {/* We load the screenshot full width natively to maintain crisp pixel density instead of object-cover scaling */ }
                   <motion.img 
                      src={template.image} 
                      alt={template.name}
                      className="w-full h-auto min-h-full"
                      draggable="false"
                      initial={{ y: 0 }}
                      whileHover={{ y: "-65%" }} // Pan down elegantly to show off the rest of the template
                      transition={{ duration: 6, ease: "linear" }}
                   />
                </div>
              </div>

              {/* Labels */}
              <div className="text-center">
                <h3 className="font-display text-2xl text-ink font-medium mb-2">{template.name}</h3>
                <span className="inline-block px-3 py-1 bg-[#E8F3E8] text-[#2D5A27] font-body text-[10px] uppercase tracking-widest rounded-full font-bold">
                  {template.category}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Fade overlay for right side */}
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#F6F4F0] to-transparent pointer-events-none" />
    </section>
  );
}
