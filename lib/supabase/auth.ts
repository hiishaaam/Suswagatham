import { createClient } from './client'

export async function sendOTP(phone: string): Promise<{ error: string | null }> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      phone: `+91${phone}`,
    })
    return { error: error?.message || null }
  } catch (err: any) {
    return { error: err.message || 'Failed to send OTP' }
  }
}

export async function verifyOTP(
  phone: string,
  token: string
): Promise<{ error: string | null }> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token,
      type: 'sms',
    })
    return { error: error?.message || null }
  } catch (err: any) {
    return { error: err.message || 'Failed to verify OTP' }
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<{ error: string | null }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    })

    return { error: error?.message || null }
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred' }
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ error: string | null }> {
  try {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
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
