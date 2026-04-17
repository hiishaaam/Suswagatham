'use client'

import { useEffect, useState, useRef } from 'react'

export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
      if (entry.isIntersecting && !hasEntered) {
        setHasEntered(true)
      }
    }, { threshold: 0.1, ...options })

    const currentRef = ref.current
    if (currentRef) observer.observe(currentRef)

    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [options, hasEntered])

  return { ref, isIntersecting, hasEntered }
}
