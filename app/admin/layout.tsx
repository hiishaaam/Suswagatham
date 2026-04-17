'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PlusCircle, Users, BarChart } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Don't show the sidebar on the login page — render children directly
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const navItems = [
    { name: 'All Events', href: '/admin', icon: LayoutDashboard },
    { name: 'New Event', href: '/admin/events/new', icon: PlusCircle },
    { name: 'Clients', href: '/admin/clients', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
  ]

  return (
    <div className="flex flex-col md:flex-row h-screen bg-ivory font-body text-ink overflow-hidden">
      {/* Sidebar Desktop / Navbar Mobile */}
      <aside className="w-full md:w-[240px] bg-[#0F0C07] text-ivory/80 flex flex-col md:h-full border-b md:border-b-0 md:border-r border-gold/20 flex-shrink-0 z-10 p-4 md:p-6">
        <div className="flex items-center justify-between md:justify-start md:mb-12">
          <div className="flex items-center gap-3">
            <div className="text-gold font-display text-2xl font-bold flex items-center justify-center w-8 h-8 rounded border border-gold/50 bg-gold/10">
              W
            </div>
            <span className="font-display text-2xl font-bold text-ivory tracking-wide">
              WeddWise
            </span>
          </div>
        </div>

        <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 hide-scrollbar mt-4 md:mt-0 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm whitespace-nowrap transition-colors border-l-[3px] ${
                  isActive
                    ? 'border-gold text-gold bg-white/5 font-medium'
                    : 'border-transparent hover:bg-white/5 hover:text-ivory'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-gold' : 'text-ivory/60'} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:block mt-auto text-xs text-ivory/40 uppercase tracking-widest pt-6 border-t border-white/5">
          v1.0 MVP
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-ivory relative">
        {children}
      </main>
    </div>
  )
}
