import { createClient } from './client'

export async function sendOTP(phone: string): Promise<{ error: string | null }> {
  try {
    const supabase = createClient()
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`
    
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    })
    
    return { error: error?.message || null }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred' }
  }
}

export async function verifyOTP(phone: string, token: string): Promise<{ error: string | null }> {
  try {
    const supabase = createClient()
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`
    
    const { error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token,
      type: 'sms',
    })
    
    return { error: error?.message || null }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred' }
  }
}

export async function signOut(): Promise<{ error: string | null }> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    return { error: error?.message || null }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred' }
  }
}
