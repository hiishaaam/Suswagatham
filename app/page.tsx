import Link from 'next/link'

export default function Page() {
  return (
    <div className="flex h-screen overflow-hidden bg-ivory text-ink font-body">
      {/* Sidebar */}
      <aside className="w-[260px] bg-ink text-ivory py-10 px-6 flex flex-col h-full border-r border-gold">
        <Link href="/" className="font-display text-2xl md:text-[28px] font-bold text-gold mb-[60px] tracking-[1px] hover:text-gold-light transition-colors">
          WeddWise
        </Link>
        <nav className="flex flex-col flex-1">
          <Link href="/admin" className="py-3 text-[14px] text-gold opacity-100 font-semibold border-b border-gold uppercase tracking-[2px] hover:text-gold-light transition">
            Event Overview
          </Link>
          <Link href="/admin" className="py-3 text-[14px] text-gold-light/70 border-b border-gold/10 uppercase tracking-[2px] hover:text-gold-light transition">
            Guest List
          </Link>
          <Link href="/admin" className="py-3 text-[14px] text-gold-light/70 border-b border-gold/10 uppercase tracking-[2px] hover:text-gold-light transition">
            Logistics & Venue
          </Link>
          <Link href="/admin" className="py-3 text-[14px] text-gold-light/70 border-b border-gold/10 uppercase tracking-[2px] hover:text-gold-light transition">
            Caterer Portal
          </Link>
          <Link href="/admin" className="py-3 text-[14px] text-gold-light/70 border-b border-gold/10 uppercase tracking-[2px] hover:text-gold-light transition">
            Design Settings
          </Link>
          <Link href="/admin" className="mt-auto py-3 text-[14px] text-gold-light/70 border-b border-gold/10 uppercase tracking-[2px] hover:text-gold-light transition">
            Account Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-10 md:p-[40px_60px] relative overflow-y-auto">
        {/* Header Row */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="font-display text-4xl md:text-[48px] text-ink leading-[1.1] italic">
              Arjun & Meera
            </h1>
            <p className="text-[14px] uppercase tracking-[3px] text-muted mt-2">
              Dec 28, 2024 &bull; Le Méridien, Kochi &bull; Live Preview
            </p>
          </div>
          <Link href="/admin">
            <button className="bg-gold text-ivory border-none py-3 px-7 text-[12px] font-semibold uppercase tracking-[2px] rounded-sm cursor-pointer hover:bg-gold/90 transition shadow-sm">
              Edit Event Details
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-surface border border-gold-light p-6 rounded-sm shadow-card text-center">
            <div className="text-[11px] uppercase tracking-[2px] text-muted mb-3">Total RSVPs</div>
            <div className="font-display text-4xl md:text-[36px] text-gold">428</div>
          </div>
          <div className="bg-surface border border-gold-light p-6 rounded-sm shadow-card text-center">
            <div className="text-[11px] uppercase tracking-[2px] text-muted mb-3">Attending</div>
            <div className="font-display text-4xl md:text-[36px] text-gold">382</div>
          </div>
          <div className="bg-surface border border-gold-light p-6 rounded-sm shadow-card text-center">
            <div className="text-[11px] uppercase tracking-[2px] text-muted mb-3">Veg / Non-Veg</div>
            <div className="font-display text-[24px] md:text-[24px] text-gold mt-2 md:mt-3">156 / 226</div>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-gold my-4" />

        {/* Data Section */}
        <div className="bg-surface border border-gold-light flex-1 rounded-sm flex flex-col mb-10">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr] bg-ivory p-[12px_24px] border-b border-gold-light text-[12px] font-semibold uppercase tracking-[1px] text-muted">
            <div>Guest Name / Family</div>
            <div>Headcount</div>
            <div>Status</div>
            <div>Preference</div>
          </div>
          
          {/* Table Rows */}
          <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr] p-[16px_24px] border-b border-gold-light/30 items-center">
            <div className="font-display text-[18px] text-ink">Adv. Rajasekharan Nair</div>
            <div className="text-[14px]">6 Guests</div>
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-block bg-success/10 text-success">
                Confirmed
              </span>
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-block bg-ivory text-muted border border-gold-light">
                Veg Only
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr] p-[16px_24px] border-b border-gold-light/30 items-center">
            <div className="font-display text-[18px] text-ink">Priya & Rahul Varma</div>
            <div className="text-[14px]">2 Guests</div>
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-block bg-success/10 text-success">
                Confirmed
              </span>
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-block bg-ivory text-muted border border-gold-light">
                Non-Veg
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr] p-[16px_24px] border-b border-gold-light/30 items-center">
            <div className="font-display text-[18px] text-ink">The Menons (Thrissur)</div>
            <div className="text-[14px]">4 Guests</div>
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-block bg-ivory text-muted border border-gold-light">
                Pending
              </span>
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-block bg-ivory text-muted border border-gold-light">
                TBD
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr] p-[16px_24px] border-b border-gold-light/30 items-center">
            <div className="font-display text-[18px] text-ink">Dr. Lakshmi Menon</div>
            <div className="text-[14px]">1 Guest</div>
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-block bg-success/10 text-success">
                Confirmed
              </span>
            </div>
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-block bg-ivory text-muted border border-gold-light">
                Veg Only
              </span>
            </div>
          </div>
        </div>

        {/* QR Preview Widget (Fixed bottom right) */}
        <div className="fixed bottom-10 right-10 w-[140px] h-[140px] border border-gold p-2.5 bg-white flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-sm">
          <div 
            className="w-[100px] h-[100px] bg-[#f5f5f5] opacity-80 mix-blend-multiply" 
            style={{ 
              backgroundImage: 'radial-gradient(var(--color-ink) 1.5px, transparent 1.5px)', 
              backgroundSize: '8px 8px' 
            }}
          />
          <p className="text-[9px] mt-2 text-muted uppercase tracking-wider font-semibold">Unique Event Link</p>
        </div>
      </main>
    </div>
  )
}
