import { createClient } from './client'

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
