// Auto-generated Template: BirthdayInvitation
import React from 'react';
import Script from 'next/script';

import Image from 'next/image';
export default function BirthdayInvitation() {
  return (
    <div className={`bg-[#FFF9E5] text-[#4A4A4A] min-h-screen flex flex-col items-center`} style={{ minHeight: '100dvh' }}>
      <Script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" strategy="lazyOnload" />
      <Script 
        id="tailwind-config-BirthdayInvitation" 
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{ __html: "tailwind.config = {}" }}
      />
      <style dangerouslySetInnerHTML={{__html: `

      `}} />
      

<main className="w-full max-w-md mx-auto min-h-screen flex flex-col px-6 py-8 relative overflow-hidden bg-dots">

<header className="text-center mb-6" data-purpose="invitation-header">
<span className="inline-block px-4 py-1 bg-white rounded-full text-[#5A9BD5] font-semibold text-sm uppercase tracking-widest shadow-sm mb-4">
        You&apos;re Invited!
      </span>
<h1 className="text-4xl md:text-5xl font-bold leading-tight text-[#FF8B3D] drop-shadow-sm">
        Leo&apos;s Wild <br/>
<span className="text-[#76A855]">2nd Birthday!</span>
</h1>
</header>


<section className="mb-8 flex justify-center" data-purpose="hero-image-container">
<div className="relative w-full aspect-square max-w-[320px] rounded-3xl overflow-hidden shadow-xl border-8 border-white transform -rotate-1">
<Image alt="Watercolor illustrations of a lion, monkey, and elephant with balloons for Leo's 2nd birthday" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcqOKyG4hTRNH6QReJlM-W4KMKh_NxyAOc-txrvdCOi2X_F2hxYlyVWbIdhZ635m7lFzCjSHN-005KJe43w50XIYYdtJSCXozeRg0v9qZYg1rKL-e-9xvjskm6il4pDmp0hzhtZnj9fRZajinXw_-sDDEM6ufDW4bpNVQj2TCxC83FghQ-ilryoaEvC2WHsR1NIWSqy16suxuwuO8OBsXiOcPevde1DVPr1hsNLyrMqrcGN9CQ7HHKnatdiM_QlxxhvvRGOUXrdut2" fill />
</div>
</section>


<section className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg space-y-6 text-center" data-purpose="event-details">

<div className="space-y-1">
<div className="flex items-center justify-center gap-2 text-[#5A9BD5]">
<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
</svg>
<h2 className="text-xl font-bold">When</h2>
</div>
<p className="text-lg font-medium text-gray-700">Saturday, July 27th</p>
<p className="text-md text-gray-500 italic">Starting at 10:00 AM</p>
</div>

<div className="border-t-2 border-dashed border-[#FFF9E5] w-1/2 mx-auto"></div>

<div className="space-y-1">
<div className="flex items-center justify-center gap-2 text-[#76A855]">
<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
<path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
</svg>
<h2 className="text-xl font-bold">Where</h2>
</div>
<p className="text-lg font-medium text-gray-700">The Jungle House</p>
<p className="text-md text-gray-500">123 Party Lane, Adventure City</p>
</div>
</section>


<footer className="mt-auto pt-8 pb-4 w-full" data-purpose="invitation-footer">
<button className="w-full bg-[#FF8B3D] hover:bg-[#ff7b24] text-white text-xl font-bold py-4 rounded-2xl shadow-lg transform active:scale-95 transition-all duration-150" id="rsvp-button" type="button">
        RSVP to Sarah by July 13th
      </button>
<p className="text-center mt-4 text-sm text-gray-400">
        Can&apos;t wait to see you there! 🦒🦓🐘
      </p>
</footer>

</main>

<script data-purpose="event-handlers" dangerouslySetInnerHTML={{ __html: `
    // Simple interaction for the RSVP button
    document.getElementById('rsvp-button')?.addEventListener('click', function() {
      alert('Opening RSVP contact for Sarah...');
    });
` }} />

    </div>
  );
}
