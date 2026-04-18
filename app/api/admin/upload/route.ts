import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAuth } from '@/lib/supabase/admin-verify'

export async function POST(req: Request) {
  try {
    const auth = await verifyAuth()
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const fileName = formData.get('fileName') as string

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    // Storage operations need the admin client to bypass RLS on storage
    const supabase = createAdminClient()

    await (supabase.storage as any).createBucket('couple-photos', { public: true }).catch(() => {})

    const filePath = `uploads/${fileName || file.name}`

    const { data, error } = await supabase.storage
      .from('couple-photos')
      .upload(filePath, file, { upsert: true })

    if (error) throw error

    const { data: publicUrlData } = supabase.storage
      .from('couple-photos')
      .getPublicUrl(data.path)

    return NextResponse.json({ success: true, url: publicUrlData.publicUrl })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
