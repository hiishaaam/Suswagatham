// Auto-generated Template: ChristianWeddingInvitation
import React from 'react';
import Script from 'next/script';

import Image from 'next/image';
export default function ChristianWeddingInvitation() {
  return (
    <div className={`font-sans text-slate-800`} style={{ minHeight: '100dvh' }}>
      <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="lazyOnload" />
      <Script 
        id="tailwind-config-ChristianWeddingInvitation" 
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{ __html: "tailwind.config = {}" }}
      />
      <style dangerouslySetInnerHTML={{__html: `

      `}} />
      

<main className="invitation-container bg-white flex flex-col relative overflow-hidden">

<section className="relative w-full h-[60vh]" data-purpose="hero-image-container">
<Image alt="Elegant Christian Wedding Invitation Card with floral wreath and cross" className="w-full h-full object-cover object-center" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLAmKmX7Puef966TMahQ_-stcmTp4-TP0rkYTvKaM65RBLS7Da0mKooUC8gKBZtC3MZwW44bFIyZY_p7jIARyca9td6PVsmfet3yB1IM1Qv5nw2flbVPfmjdm6YE2Z60AFkxNXMlnTy0fDZ1YicdMKo8hTwi0RCc-V1pKPinbTJk7IfinlLuulbSqq-X6JHX3hckfq9SL-62yJAgYzm1jvYXa2SlJ85GJeiWnuwpvSLIKLWw33I-cvmiZDpca-FArSYri07U7Xjbk9" fill />

<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"></div>
</section>


<section className="flex-1 px-8 pb-12 -mt-20 z-10 relative" data-purpose="invitation-details">

<div className="text-center space-y-4 mb-8">
<p className="uppercase tracking-[0.2em] text-xs text-slate-400 font-medium">Save the Date</p>
<div className="space-y-1">
<h1 className="font-script text-5xl text-slate-700">Sarah &amp; Michael</h1>
<p className="font-serif italic text-lg text-slate-500">request the honor of your presence</p>
</div>
<div className="flex items-center justify-center space-x-4 py-2">
<div className="h-[1px] w-12 bg-slate-200"></div>
<span className="text-slate-400">
<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"></path>
</svg>
</span>
<div className="h-[1px] w-12 bg-slate-200"></div>
</div>
</div>


<div className="glass-effect rounded-2xl p-8 shadow-sm border border-slate-100 text-center space-y-6" data-purpose="details-card">

<div className="space-y-2">
<h2 className="font-serif text-xl font-bold text-slate-800">The Wedding Ceremony</h2>
<p className="text-slate-600 text-sm leading-relaxed">
            Saturday, the Twenty-Fourth of August<br/>
            Two Thousand and Twenty-Four<br/>
            at Half Past Three in the Afternoon
          </p>
</div>

<div className="space-y-1 pt-4 border-t border-slate-50">
<p className="font-serif text-lg text-slate-700">Grace Cathedral</p>
<p className="text-slate-500 text-sm italic">1100 California St, San Francisco, CA</p>
</div>

<div className="pt-2">
<p className="text-xs uppercase tracking-widest text-slate-400">Reception to follow</p>
</div>
</div>


<div className="mt-10 space-y-4" data-purpose="interaction-area">
<button className="w-full bg-slate-800 text-white py-4 rounded-full font-medium tracking-widest text-sm uppercase shadow-lg active:scale-95 transition-transform" id="rsvp-button">
          RSVP Online
        </button>
<button className="w-full bg-white text-slate-600 border border-slate-200 py-4 rounded-full font-medium tracking-widest text-sm uppercase active:bg-slate-50 transition-colors" id="registry-button">
          Wedding Registry
        </button>
</div>


<footer className="mt-12 text-center">
<p className="font-serif italic text-slate-400 text-sm">&quot;I have found the one whom my soul loves.&quot;</p>
<p className="text-[10px] uppercase tracking-tighter text-slate-300 mt-1">Song of Solomon 3:4</p>
</footer>

</section>

</main>


<script data-purpose="button-handlers" dangerouslySetInnerHTML={{ __html: `
    document.getElementById('rsvp-button')?.addEventListener('click', () => {
      alert('Redirecting to RSVP portal...');
    });

    document.getElementById('registry-button')?.addEventListener('click', () => {
      alert('Opening Wedding Registry...');
    });
` }} />


    </div>
  );
}
