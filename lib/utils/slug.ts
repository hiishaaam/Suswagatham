import { createAdminClient } from '@/lib/supabase/admin'

export function generateSlug(coupleNames: string): string {
  const base = coupleNames
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces with -
    .replace(/^-+|-+$/g, '')  // Trim outer
  
  const suffix = Math.random().toString(36).substring(2, 6)
  if (!base) return suffix
  return `${base}-${suffix}`
}

export async function checkSlugAvailable(slug: string): Promise<boolean> {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('events').select('id').eq('event_slug', slug).single()
  
  // If data exists, it's not available. (Error 406 means no rows found -> available)
  if (!data) return true
  return false
}
