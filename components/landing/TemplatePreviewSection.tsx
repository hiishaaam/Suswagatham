'use client'

import React, { useState } from 'react';
import PhoneMockup from '../templates/PhoneMockup';
import TemplateDetailPanel from '../templates/TemplateDetailPanel';
import TemplateModal from '../templates/TemplateModal';

// Import mini-templates
import MidnightBloom from '../templates/templates/MidnightBloom';
import KeralaGold from '../templates/templates/KeralaGold';
import MaroonRoyale from '../templates/templates/MaroonRoyale';
import SapphireNight from '../templates/templates/SapphireNight';
import GardenBloom from '../templates/templates/GardenBloom';

const TEMPLATES = [
  { 
    id: 'emerald-islamic', 
    name: 'Emerald Islamic', 
    category: 'MUSLIM',
    price: '₹2,500',
    desc: 'Deep purple and gold elegance perfectly tailored for Muslim weddings (Nikah & Valima).', 
    features: ['Floating animated gold confetti', 'Live countdown timer', 'Fixed WhatsApp RSVP button'], 
    component: MidnightBloom 
  },
  { 
    id: 'ivory-luxe', 
    name: 'Ivory Luxe', 
    category: 'HINDU',
    price: '₹2,000',
    desc: 'Traditional ivory and red with ornate gold details, ideal for Hindu Kerala weddings.', 
    features: ['Dual circular photo layout', 'Scrollable multiple event chips', 'Traditional Sadya RSVP formatting'], 
    component: KeralaGold
  },
  { 
    id: 'amethyst-dream', 
    name: 'Amethyst Dream', 
    category: 'ALL FAITHS',
    price: '₹2,500',
    desc: 'Classic and luxurious styling with rich maroon hues for Christian ceremonies.', 
    features: ['Watermark cross background', 'Full-width hero photo overlay', 'Detailed guest counter stepper'], 
    component: MaroonRoyale 
  },
  { 
    id: 'warm-rustic', 
    name: 'Warm Rustic', 
    category: 'CHRISTIAN',
    price: '₹2,500',
    desc: 'Modern destination wedding vibes with sleek typography and deep blues.', 
    features: ['Spinning circular photo ring', 'Animated star background', 'Built-in music player UI'], 
    component: SapphireNight 
  },
  { 
    id: 'ivory-garden', 
    name: 'Ivory Garden', 
    category: 'ALL FAITHS',
    price: '₹2,000',
    desc: 'Soft pastels and watercolor florals for outdoor garden parties and receptions.', 
    features: ['Blush watercolor header', 'Polaroid-style photo frame', 'Soft pastel RSVP form tiles'], 
    component: GardenBloom 
  }
];

export default function TemplatePreviewSection() {
  const [activeIndex, setActiveIndex] = useState(1); // Default to Ivory Luxe
  const [modalOpen, setModalOpen] = useState(false);

  const activeTemplate = TEMPLATES[activeIndex];

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % TEMPLATES.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + TEMPLATES.length) % TEMPLATES.length);

  return (
    <section className="bg-[#FAF7F2] py-24 sm:py-32 relative overflow-hidden" id="templates">
      {/* Soft radial background gradient commonly found in premium beige sites */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#F2ECE4] to-transparent rounded-full pointer-events-none opacity-60"></div>

      <div className="container mx-auto px-4 relative z-10 w-full max-w-[1400px]">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="font-display italic text-[#115E59] text-[15px] tracking-[0.2em] mb-4">Choose your invitation style</p>
          <h2 className="font-display font-semibold text-[#1A1208] text-[40px] md:text-[56px] leading-tight mb-2">Beautiful templates.</h2>
          <h2 className="font-display italic font-normal text-[#D1B162] text-[40px] md:text-[56px] leading-tight mb-6 mt-[-10px]">Unforgettable impressions.</h2>
        </div>

        {/* Carousel / Phone Row */}
        <div className="w-full overflow-x-auto hide-scrollbar pb-16 pt-12 px-8">
          <div className="flex gap-8 sm:gap-14 w-max mx-auto px-4">
            {TEMPLATES.map((tpl, i) => (
              <PhoneMockup 
                key={tpl.id}
                id={tpl.id}
                isActive={activeIndex === i}
                onClick={() => setActiveIndex(i)}
                label={tpl.name}
                category={tpl.category}
                price={tpl.price}
              >
                {/* Render the mini preview component lazily inside */}
                {React.createElement(tpl.component, { isPreview: true })}
              </PhoneMockup>
            ))}
          </div>
        </div>
      </div>

      {/* Full screen modal */}
      <TemplateModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        template={activeTemplate}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </section>
  );
}
