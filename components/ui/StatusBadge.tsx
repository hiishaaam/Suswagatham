import React from 'react'

type Status = 'draft' | 'design_pending' | 'preview_sent' | 'live' | 'completed' | string

export default function StatusBadge({ status }: { status: Status }) {
  const config: Record<string, { bg: string, text: string, label: string, pulse?: boolean }> = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Draft' },
    design_pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Design Pending' },
    preview_sent: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Preview Sent' },
    live: { bg: 'bg-success/10', text: 'text-success', label: 'Live', pulse: true },
    completed: { bg: 'bg-muted/10', text: 'text-muted', label: 'Completed' },
  }

  const c = config[status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: status.replace('_', ' ') }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text}`}>
      {c.pulse && <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>}
      {c.label}
    </span>
  )
}
