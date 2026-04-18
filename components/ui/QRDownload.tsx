'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'

type Props = {
  url: string
  filename?: string
  label?: string
}

export default function QRDownload({ url, filename = 'qr-code.png', label = 'Download QR Code' }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!url) return
    QRCode.toDataURL(url, { width: 400, margin: 2, color: { dark: '#1A1208', light: '#FAF7F0' } })
      .then(setDataUrl)
      .catch(console.error)
  }, [url])

  const handleDownload = () => {
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    a.click()
  }

  if (!dataUrl) return null

  return (
    <div className="flex flex-col items-center gap-4 p-5 border border-gold-light rounded-sm bg-white shadow-sm w-full max-w-sm mx-auto">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt="QR Code Preview" className="w-[100px] h-[100px] object-cover rounded-sm shadow-inner" />
      <button 
        onClick={handleDownload}
        className="w-full py-4 bg-ivory border border-gold text-ink font-body text-[11px] font-bold uppercase tracking-widest rounded-sm flex justify-center items-center gap-2 hover:bg-gold/10 transition-colors"
      >
        <Download size={16} className="text-gold" /> {label}
      </button>
    </div>
  )
}
