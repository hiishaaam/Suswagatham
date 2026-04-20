'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, PlusCircle, Users, BarChart, LogOut, MoreVertical } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/lib/supabase/auth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      // UI only — real authorization is server-side.
      setIsAdmin((user?.app_metadata as any)?.is_admin === true)
      setUserEmail(user?.email || null)
    })

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  // Don't show the sidebar on the login page — render children directly
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const navItems = [
    { name: isAdmin ? 'All Events' : 'My Events', href: '/admin', icon: LayoutDashboard },
    { name: 'New Event', href: '/admin/events/new', icon: PlusCircle },
    ...(isAdmin ? [
      { name: 'Clients', href: '/admin/clients', icon: Users },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
    ] : [])
  ]

  return (
    <div className="flex flex-col md:flex-row h-screen bg-ivory font-body text-ink overflow-hidden">
      {/* Sidebar Desktop / Navbar Mobile */}
      <aside className="w-full md:w-[240px] bg-[#0F0C07] text-ivory/80 flex flex-col md:h-full border-b md:border-b-0 md:border-r border-gold/20 flex-shrink-0 z-20 p-4 md:p-6">
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

        {/* User Profile Card */}
        <div className="relative md:mt-auto pt-4 md:pt-6 border-t md:border-t border-white/10 flex-shrink-0 hidden md:block" ref={menuRef}>
          {showProfileMenu && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-[#1A150C] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors text-left"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
          
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center justify-between w-full p-2 -mx-2 rounded-xl hover:bg-white/5 transition-colors group text-left"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/30 flex items-center justify-center text-gold font-display font-bold text-sm shrink-0">
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm text-ivory font-medium truncate w-[110px]">{userEmail || 'Loading...'}</p>
                <p className="text-[10px] text-gold/60 uppercase tracking-widest mt-0.5">{isAdmin ? 'Global Admin' : 'Client'}</p>
              </div>
            </div>
            <MoreVertical size={16} className="text-ivory/30 group-hover:text-ivory/80 transition-colors shrink-0" />
          </button>
        </div>
        
        {/* Mobile quick logout */}
        <div className="flex md:hidden items-center justify-between mt-2 pt-2 border-t border-white/10">
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-[10px] font-bold">
                {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
              </div>
              <p className="text-xs text-ivory/60 truncate max-w-[100px]">{userEmail}</p>
           </div>
           <button onClick={handleLogout} className="text-ivory/60 hover:text-red-400 p-2">
             <LogOut size={16} />
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-ivory relative">
        {children}
      </main>
    </div>
  )
}
