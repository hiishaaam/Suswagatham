import React from 'react'

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

export default function LoadingSpinner({ size = 'md', fullScreen = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-16 h-16 border-3'
  }

  const spinner = (
    <div className={`relative ${sizeClasses[size]}`}>
      <div className="absolute inset-0 rounded-full border-t-gold border-r-gold border-b-transparent border-l-transparent animate-spin"></div>
      <div className="absolute inset-0 rounded-full border-t-transparent border-r-transparent border-b-gold-light border-l-gold-light animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ivory">
        {spinner}
        <div className="mt-6 font-display text-2xl font-bold text-gold tracking-widest uppercase">WeddWise</div>
      </div>
    )
  }

  return spinner
}
