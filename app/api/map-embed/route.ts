import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { lat, lng } = await req.json()
    // Using simple unauthenticated endpoint for MVP to prevent exposing key in client JS.
    const url = `https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_EMBED_KEY}&q=${lat},${lng}&zoom=14`
    return NextResponse.json({ url })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
