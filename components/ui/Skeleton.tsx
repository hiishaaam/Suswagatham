import React from 'react'

type SkeletonProps = {
  width?: string
  height?: string
  className?: string
  variant?: 'text' | 'card' | 'circle'
}

export default function Skeleton({ width, height, className = '', variant = 'text' }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gold-light/20 relative overflow-hidden'
  
  let variantClasses = ''
  switch (variant) {
    case 'text':
      variantClasses = 'rounded-full h-4 w-3/4'
      break
    case 'card':
      variantClasses = 'rounded-2xl h-32 w-full'
      break
    case 'circle':
      variantClasses = 'rounded-full h-12 w-12'
      break
  }

  const styles: React.CSSProperties = {}
  if (width) styles.width = width
  if (height) styles.height = height

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`} style={styles}>
       <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  )
}
