import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) throw new Error('No file uploaded')

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    const filePath = `photos/${fileName}`

    const supabase = createAdminClient()

    // Ensure bucket exists (best effort without throwing if it does)
    await (supabase.storage as any).createBucket('couple-photos', { public: true }).catch(() => {})

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error } = await supabase.storage
      .from('couple-photos')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (error) throw error

    const { data: publicUrlData } = supabase.storage
      .from('couple-photos')
      .getPublicUrl(filePath)

    return NextResponse.json({ success: true, url: publicUrlData.publicUrl })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
