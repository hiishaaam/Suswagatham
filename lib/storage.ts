import { createAdminClient } from './supabase/admin'

export async function uploadCouplePhoto(file: File, eventSlug: string): Promise<string> {
  if (file.size > 5 * 1024 * 1024) throw new Error('File size exceeds 5MB limit')
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Only JPG, PNG, and WEBP formats are allowed')
  }

  const supabase = createAdminClient()
  const ext = file.name.split('.').pop()
  const timestamp = Date.now()
  const path = `events/${eventSlug}/couple-${timestamp}.${ext}`

  const { data, error } = await supabase.storage
    .from('couple-photos')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) throw error

  const { data: publicUrlData } = supabase.storage.from('couple-photos').getPublicUrl(path)
  return publicUrlData.publicUrl
}

export async function deleteCouplePhoto(url: string): Promise<void> {
  const supabase = createAdminClient()
  const urlParts = url.split('/couple-photos/')
  if (urlParts.length !== 2) return
  
  const path = urlParts[1]
  const { error } = await supabase.storage.from('couple-photos').remove([path])
  if (error) throw error
}
