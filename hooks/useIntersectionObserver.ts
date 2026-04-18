'use client'

import { useState, useEffect, useRef } from 'react'

export function useIntersectionObserver(options: IntersectionObserverInit = {}) {
  const [hasEntered, setHasEntered] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setHasEntered(true)
        observer.unobserve(element)
      }
    }, options)

    observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [options.root, options.rootMargin, options.threshold, options])

  return { ref, hasEntered }
}
