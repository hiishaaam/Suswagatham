import Link from 'next/link'
import { ArrowRight, Users, QrCode, ChefHat, BarChart3 } from 'lucide-react'

export default function Page() {
  return (
    <div className="min-h-screen bg-ivory text-ink font-body flex flex-col">
      {/* Navigation */}
      <nav className="w-full flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="text-gold font-display text-sm font-bold flex items-center justify-center w-8 h-8 rounded border border-gold/50 bg-gold/10">
            W
          </div>
          <span className="font-display text-xl font-bold text-ink tracking-wide">WeddWise</span>
        </div>
        <Link href="/admin/login">
          <button className="bg-ink text-gold px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-sm hover:bg-ink/90 transition-colors shadow-sm">
            Admin Login
          </button>
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center -mt-16">
        <div className="max-w-2xl mx-auto">
          {/* Decorative motif */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-gold/40 w-12"></div>
            <div className="w-3 h-3 border border-gold rotate-45 mx-4"></div>
            <div className="h-px bg-gold/40 w-12"></div>
          </div>

          <h1 className="font-display text-5xl md:text-7xl italic text-ink leading-[1.1] mb-6">
            Elegant Wedding
            <span className="block text-gold">Management</span>
          </h1>

          <p className="text-muted text-base md:text-lg leading-relaxed max-w-lg mx-auto mb-10">
            Smart RSVP tracking, real-time guest dashboards, caterer kitchen reports, and beautiful digital invitations — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admin">
              <button className="bg-gold text-ivory px-8 py-4 text-[12px] font-bold uppercase tracking-widest rounded-sm hover:bg-gold/90 transition-colors shadow-md flex items-center gap-2 w-full sm:w-auto justify-center group">
                Open Dashboard
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/admin/events/new">
              <button className="border border-gold text-gold px-8 py-4 text-[12px] font-bold uppercase tracking-widest rounded-sm hover:bg-gold/5 transition-colors w-full sm:w-auto">
                Create New Event
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Feature Cards */}
      <section className="px-6 md:px-12 pb-16 pt-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Smart RSVP', desc: 'Token-based guest tracking' },
            { icon: BarChart3, label: 'Live Dashboard', desc: 'Real-time headcount updates' },
            { icon: ChefHat, label: 'Kitchen Reports', desc: 'Caterer-ready PDF exports' },
            { icon: QrCode, label: 'QR Invites', desc: 'Unique links per family' },
          ].map((feature, i) => (
            <div key={i} className="bg-white border border-gold-light/50 rounded-sm p-5 shadow-card text-center group hover:border-gold transition-colors">
              <feature.icon size={24} className="text-gold mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-[11px] font-bold uppercase tracking-widest text-ink mb-1">{feature.label}</div>
              <div className="text-[11px] text-muted">{feature.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gold-light/40">
        <p className="text-[10px] text-muted uppercase tracking-widest">
          Suswagatham &middot; Built with WeddWise
        </p>
      </footer>
    </div>
  )
}
