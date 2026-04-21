'use client'

import { ReactNode } from "react"
import { LazyMotion, domAnimation } from "motion/react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  )
}
