// Auto-generated Template: HinduWeddingInvitation
import React from 'react';
import Script from 'next/script';

export default function HinduWeddingInvitation() {
  return (
    <div className={`bg-maroon-dark min-h-screen font-serif text-gold-light selection:bg-gold-dark selection:text-white`} style={{ minHeight: '100dvh' }}>
      <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="lazyOnload" />
      <Script 
        id="tailwind-config-HinduWeddingInvitation" 
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{ __html: "tailwind.config = {\n      theme: {\n        extend: {\n          colors: {\n            maroon: {\n              DEFAULT: '#4A0404',\n              dark: '#2D0202',\n              light: '#6B0606',\n            },\n            gold: {\n              DEFAULT: '#D4AF37',\n              light: '#F4CF63',\n              dark: '#996515',\n            }\n          },\n          fontFamily: {\n            serif: ['\"Playfair Display\"', 'serif'],\n            display: ['\"Cinzel\"', 'serif'],\n          }\n        }\n      }\n    }\n  " }}
      />
      <style dangerouslySetInnerHTML={{__html: `

      `}} />
      

<main className="flex flex-col items-center justify-start min-h-screen p-6 max-w-md mx-auto relative overflow-hidden bg-texture">

<div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-maroon to-transparent opacity-50 pointer-events-none"></div>
<div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-maroon-dark to-transparent opacity-80 pointer-events-none"></div>


<header className="text-center mt-8 mb-6 z-10" data-purpose="header">
<p className="font-display tracking-[0.2em] text-xs uppercase text-gold/80 mb-2">We Invite You To The Wedding Of</p>
<h1 className="font-display text-3xl md:text-4xl text-gold drop-shadow-sm">Anu &amp; Vikram</h1>
</header>


<section className="w-full relative z-10 mb-8" data-purpose="central-invitation-image">
<div className="card-border invitation-shadow rounded-sm overflow-hidden bg-maroon">
<img alt="Traditional Hindu wedding invitation card featuring deep maroon paper and gold foil" className="w-full h-auto block" loading="lazy" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5WSCydcbYNFaN6_1MPDjAL9A_F9Th7XmcoofqC8kc-GfmKHHW70yohHbnEl43cZcrMFyorXpFkcLKj4Pr4pM-pctV8kqrfq1kCOqkVI-_UmKbcFHG6W3bCep5M9eoS2Kj4wzgG8QmLRSw8mtMfGuv_hirE8XlU9A9fcUgBUVyv4zsefF7IBEsXXQ0Y2sPZijWZJTHkv4cOETNFVEtsXPA4g4RKwm9QoQ3-5p59enM1i09L_Iljj4-e0a_sxk3VPtAA0FyvcJV1cs2"/>
</div>
</section>


<section className="text-center space-y-6 z-10 w-full" data-purpose="event-details">

<div className="flex flex-col items-center">
<div className="h-[1px] w-12 bg-gold/50 mb-3"></div>
<div className="space-y-1">
<time className="block text-xl font-semibold tracking-wide" dateTime="2023-02-17">Friday, February 17, 2023</time>
<p className="text-gold/90 italic">Auspicious Muhurtham: 9:00 AM - 10:30 AM</p>
</div>
<div className="h-[1px] w-12 bg-gold/50 mt-3"></div>
</div>

<div className="px-4" data-purpose="venue-address">
<h2 className="font-display text-sm tracking-[0.15em] text-gold mb-2">VENUE</h2>
<address className="not-italic text-sm leading-relaxed text-gold-light/90">
          The Grand Ballroom, Nilavilakku Heritage Resort<br/>
          Chunranre Highlands, Kochi<br/>
          Kerala, India
        </address>
</div>

<div className="pt-4" data-purpose="rsvp-action">
<button className="bg-gold hover:bg-gold-light text-maroon-dark font-display font-bold py-3 px-12 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg tracking-widest text-sm" id="rsvp-button">
          RSVP NOW
        </button>
</div>
</section>


<footer className="mt-12 mb-8 text-center z-10" data-purpose="invitation-footer">
<div className="flex items-center justify-center space-x-2 mb-4">
<div className="w-8 h-[1px] bg-gold/30"></div>
<span className="text-gold/40 text-[10px] tracking-widest uppercase">With Love, The Families</span>
<div className="w-8 h-[1px] bg-gold/30"></div>
</div>
<p className="text-[10px] text-gold/40">© 2023 Wedding Celebrations</p>
</footer>

</main>

<script data-purpose="interactivity" dangerouslySetInnerHTML={{ __html: `
    // Simple button interaction feedback
    document.getElementById('rsvp-button')?.addEventListener('click', function() {
      alert('Thank you! Redirecting to RSVP form...');
    });
` }} />

    </div>
  );
}
