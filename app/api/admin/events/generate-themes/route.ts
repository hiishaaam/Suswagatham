import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { couple_names, event_name, event_date, venue_name, mood } = await req.json();

    const prompt = `A user has entered the following wedding event details:
---
Couple: ${couple_names || 'Couple'}
Event: ${event_name || 'Wedding'}
Date: ${event_date || 'TBD'}
Venue: ${venue_name || 'TBD'}
Requested Mood/Vibe: ${mood || 'Elegant and luxurious'}
---

Generate exactly 3 visually distinct, luxury Indian wedding invitation card designs as a JSON array.

Each design must have:
- "theme_id": a unique slug (e.g. "midnight-bloom")
- "theme_name": short poetic name (e.g. "Midnight Bloom", "Golden Durbar", "Rose Petal Dusk")
- "mood": one evocative word (e.g. "Regal", "Romantic", "Festive")
- "background": CSS background string (use rich gradients — e.g. linear-gradient with 3+ stops using deep jewel tones like burgundy, gold, navy, rose, emerald)
- "border_style": a CSS border or box-shadow string (ornate feel)
- "font_heading": Google Fonts name for the couple's names (e.g. "Cormorant Garamond", "Playfair Display", "Cinzel", "Great Vibes", "Tangerine")
- "font_body": Google Fonts name for details text
- "heading_color": hex color for couple names
- "body_color": hex color for details text
- "accent_color": hex color for ornamental dividers
- "layout": one of "centered-portrait", "split-panel", "layered-overlap"

The 3 designs must be clearly different from each other in color palette and vibe (e.g. one traditional, one modern, one vibrant).

Return ONLY a valid JSON array of 3 objects. No markdown blocks, no other text.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            temperature: 0.7,
            responseMimeType: "application/json",
        }
    });

    const text = response.text || "[]";
    const themes = JSON.parse(text);

    return NextResponse.json({ success: true, themes });

  } catch (error: any) {
    console.error('Error generating themes:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
