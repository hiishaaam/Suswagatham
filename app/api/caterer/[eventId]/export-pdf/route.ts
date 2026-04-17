import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

// Helper to draw text
const drawLine = (page: any, text: string, font: any, size: number, x: number, y: number, color: any = rgb(0.1, 0.07, 0.03)) => {
  page.drawText(text, { x, y, size, font, color })
  return y - (size + 6)
}

export async function GET(req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params
    const { searchParams } = new URL(req.url)
    const access = searchParams.get('access')

    if (!access) return new Response('Unauthorized', { status: 401 })

    const supabase = createAdminClient()

    const { data: accessRecord, error: accessErr } = await supabase
      .from('caterer_access')
      .select('caterer_name')
      .eq('event_id', eventId)
      .eq('access_token', access)
      .single()

    if (accessErr || !accessRecord) return new Response('Unauthorized', { status: 401 })

    // Fetch required data
    const { data: event } = await supabase.from('events').select('*').eq('id', eventId).single()
    const { data: summary } = await (supabase.from('event_summary') as any).select('*').eq('event_id', eventId).single()
    const { data: subEvents } = await supabase.from('sub_events').select('*').eq('event_id', eventId).order('display_order', { ascending: true })
    const { data: rsvps } = await (supabase.from('rsvps') as any).select('guest_count, food_preference, sub_event_id').eq('event_id', eventId).eq('attending', true)

    // Calculate SubEvents
    const rsvpsData = rsvps || []
    const subEventsDataArr = subEvents as any[] || []

    const subEventsData = subEventsDataArr.map(se => {
      const seRsvps = rsvpsData.filter((r: any) => r.sub_event_id === se.id)
      const total = seRsvps.reduce((sum: number, r: any) => sum + (r.guest_count || 0), 0)
      const vegCount = seRsvps.filter((r: any) => r.food_preference === 'veg' || r.food_preference === 'both').reduce((sum: number, r: any) => sum + (r.guest_count || 0), 0)
      const nonVegCount = seRsvps.filter((r: any) => r.food_preference === 'non_veg' || r.food_preference === 'both').reduce((sum: number, r: any) => sum + (r.guest_count || 0), 0)
      return { ...se, total, vegCount, nonVegCount }
    })

    let finalVeg = 0
    let finalNonVeg = 0
    let finalTotal = summary?.total_headcount || 0

    rsvpsData.forEach((r: any) => {
      if (r.food_preference === 'veg') finalVeg += r.guest_count
      if (r.food_preference === 'non_veg') finalNonVeg += r.guest_count
      if (r.food_preference === 'both') {
        finalVeg += r.guest_count
        finalNonVeg += r.guest_count
      }
    })

    // Init PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4 Size
    const { width, height } = page.getSize()
    
    // Embed fonts
    const fontTimesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const fontTimesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
    const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const colorGold = rgb(0.79, 0.66, 0.30)
    const colorInk = rgb(0.1, 0.07, 0.03)
    const colorGray = rgb(0.4, 0.4, 0.4)

    let y = height - 50

    const rawEvent = event as any

    // Header Branding
    y = drawLine(page, 'WeddWise Kitchen Report', fontHelveticaBold, 20, 50, y, colorGold)
    y -= 10
    
    // Event Details
    y = drawLine(page, `${rawEvent?.couple_names} Wedding`, fontTimesBold, 24, 50, y, colorInk)
    y -= 5
    y = drawLine(page, `Date: ${new Date(rawEvent?.event_date).toLocaleDateString()}`, fontHelvetica, 12, 50, y, colorGray)
    y = drawLine(page, `Venue: ${rawEvent?.venue_name || 'TBA'}`, fontHelvetica, 12, 50, y, colorGray)
    y = drawLine(page, `Prepared For: ${(accessRecord as any).caterer_name}`, fontHelvetica, 12, 50, y, colorGray)
    
    y -= 20
    page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: colorGold })
    y -= 30

    // Main Stats
    y = drawLine(page, 'TOTAL CONFIRMED GUESTS', fontHelveticaBold, 14, 50, y, colorGray)
    y -= 10
    y = drawLine(page, `${finalTotal}`, fontTimesBold, 48, 50, y, colorGold)
    y -= 20

    // Food Split Table Header
    y = drawLine(page, 'Dietary Split Overview', fontHelveticaBold, 14, 50, y, colorInk)
    y -= 10
    page.drawText('Category', { x: 50, y, size: 12, font: fontHelveticaBold, color: colorGray })
    page.drawText('Confirmed', { x: 200, y, size: 12, font: fontHelveticaBold, color: colorGray })
    page.drawText('+10% Buffer (Prepare For)', { x: 350, y, size: 12, font: fontHelveticaBold, color: colorGray })
    y -= 10
    page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.5, color: colorGray })
    y -= 20

    // Veg Row
    page.drawText('Vegetarian', { x: 50, y, size: 12, font: fontHelvetica })
    page.drawText(`${finalVeg}`, { x: 200, y, size: 12, font: fontHelvetica })
    page.drawText(`${Math.ceil(finalVeg * 1.1)}`, { x: 350, y, size: 12, font: fontHelveticaBold })
    y -= 20

    // NonVeg Row
    page.drawText('Non-Vegetarian', { x: 50, y, size: 12, font: fontHelvetica })
    page.drawText(`${finalNonVeg}`, { x: 200, y, size: 12, font: fontHelvetica })
    page.drawText(`${Math.ceil(finalNonVeg * 1.1)}`, { x: 350, y, size: 12, font: fontHelveticaBold })
    y -= 40


    // Subevents
    if (subEventsData.length > 0) {
      y = drawLine(page, 'Sub-Event Breakdown', fontHelveticaBold, 14, 50, y, colorInk)
      y -= 10
      page.drawText('Event Name', { x: 50, y, size: 12, font: fontHelveticaBold, color: colorGray })
      page.drawText('Total', { x: 250, y, size: 12, font: fontHelveticaBold, color: colorGray })
      page.drawText('Veg', { x: 350, y, size: 12, font: fontHelveticaBold, color: colorGray })
      page.drawText('Non-Veg', { x: 450, y, size: 12, font: fontHelveticaBold, color: colorGray })
      y -= 10
      page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.5, color: colorGray })
      y -= 20

      subEventsData.forEach((se: any) => {
        page.drawText(se.name, { x: 50, y, size: 12, font: fontHelvetica })
        page.drawText(`${se.total}`, { x: 250, y, size: 12, font: fontHelveticaBold })
        page.drawText(`${se.vegCount}`, { x: 350, y, size: 12, font: fontHelvetica })
        page.drawText(`${se.nonVegCount}`, { x: 450, y, size: 12, font: fontHelvetica })
        y -= 20
      })
    }

    // Footer
    page.drawText(`Generated by WeddWise on ${new Date().toLocaleString()}`, { 
      x: 50, y: 30, size: 10, font: fontHelvetica, color: colorGray 
    })

    const pdfBytes = await pdfDoc.save()
    const buffer = Buffer.from(pdfBytes)

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="WeddWise_KitchenReport_${rawEvent?.couple_names.replace(/\s+/g, '')}.pdf"`,
      },
    })
  } catch (error: any) {
    return new Response('Error generating PDF: ' + error.message, { status: 500 })
  }
}
