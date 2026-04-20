import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center p-6 text-center">
      <div className="relative">
        <h1 
          className="font-display text-[120px] leading-none font-bold text-gold opacity-90 relative z-10"
          style={{ animation: 'float 3s ease-in-out infinite' }}
        >
          404
        </h1>
      </div>
      
      <p className="font-display text-2xl italic text-ink mt-4 mb-8">
        { }
        This invitation wasn't found
      </p>

      {/* Small botanical SVG divider */}
      <div className="flex justify-center mb-8 text-gold/60">
        <svg width="40" height="16" viewBox="0 0 40 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 15C20 15 15 8 10 8C5 8 0 15 0 15C0 15 5 1 10 1C15 1 20 15 20 15Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M20 15C20 15 25 8 30 8C35 8 40 15 40 15C40 15 35 1 30 1C25 1 20 15 20 15Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <Link 
        href="/"
        className="font-body text-sm font-bold uppercase tracking-widest text-ink hover:text-gold transition-colors border-b border-gold-light pb-1"
      >
        Return to WeddWise
      </Link>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}} />
    </div>
  )
}
