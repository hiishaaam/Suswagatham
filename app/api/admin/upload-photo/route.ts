import { NextResponse } from 'next/server'
import { uploadCouplePhoto } from '@/lib/storage'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const eventSlug = formData.get('eventSlug') as string

    if (!file || !eventSlug) {
      return NextResponse.json({ success: false, error: 'Missing file or eventSlug' }, { status: 400 })
    }

    const url = await uploadCouplePhoto(file, eventSlug)
    return NextResponse.json({ success: true, url })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
