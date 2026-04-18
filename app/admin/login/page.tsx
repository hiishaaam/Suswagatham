'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const useSupabaseAuth = process.env.NEXT_PUBLIC_USE_SUPABASE_ADMIN_AUTH !== 'false'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const payload = useSupabaseAuth 
        ? { email, phone, password } 
        : { password }

      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0C07] flex items-center justify-center p-6 text-ivory">
      <div className="max-w-sm w-full bg-white/5 border border-gold/20 p-10 rounded-sm shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <div className="text-gold font-display text-2xl font-bold inline-flex items-center justify-center w-12 h-12 rounded border border-gold/50 bg-gold/10 mb-4">W</div>
          <h1 className="font-display text-3xl font-bold mb-2 tracking-wide">Admin Portal</h1>
          <p className="text-xs text-white/50 uppercase tracking-widest">Authorized Personnel Only</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          {useSupabaseAuth && (
            <>
              <div>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Admin Email"
                  className="w-full bg-white/5 border border-gold/30 rounded-sm p-4 text-ivory placeholder-ivory/30 focus:outline-none focus:border-gold focus:bg-white/10 transition-all mb-2"
                />
                <p className="text-[10px] text-white/30 text-center uppercase tracking-widest mb-4">or</p>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Admin Phone"
                  className="w-full bg-white/5 border border-gold/30 rounded-sm p-4 text-ivory placeholder-ivory/30 focus:outline-none focus:border-gold focus:bg-white/10 transition-all"
                />
              </div>
            </>
          )}
          <div>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={useSupabaseAuth ? "Admin Password" : "Enter access keyword"}
              className="w-full bg-white/5 border border-gold/30 rounded-sm p-4 text-ivory placeholder-ivory/30 focus:outline-none focus:border-gold focus:bg-white/10 transition-all"
            />
          </div>
          {error && <p className="text-error text-[10px] uppercase tracking-widest text-center animate-pulse">{error}</p>}
          <button 
            type="submit"
            disabled={loading || !password || (useSupabaseAuth && !email && !phone)}
            className="w-full bg-gold text-ink font-body text-sm font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-gold-light transition-colors disabled:opacity-50 flex justify-center items-center h-[52px]"
          >
            {loading ? <Loader2 size={18} className="animate-spin text-ink" /> : 'Authenticate'}
          </button>
        </form>
      </div>
    </div>
  )
}
