'use client'

import { useEffect, useRef } from 'react'

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    let mouse = { x: -1000, y: -1000, radius: 250 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    class Particle {
      x: number
      y: number
      baseX: number
      baseY: number
      baseAngle: number
      distCenter: number
      size: number
      color: string

      constructor(x: number, y: number, cx: number, cy: number) {
        this.x = x
        this.y = y
        this.baseX = x
        this.baseY = y
        
        const dx = x - cx
        const dy = y - cy
        this.baseAngle = Math.atan2(dy, dx)
        this.distCenter = Math.sqrt(dx * dx + dy * dy)
        
        // Size proportional to distance gives a 3D sphere feel
        this.size = Math.max(0.5, (this.distCenter / 300) * 1.5)
        
        const colors = [
          'rgba(201, 168, 76, 0.9)',  // Gold
          'rgba(232, 213, 163, 0.8)', // Light gold
          'rgba(255, 255, 255, 0.4)', // Ivory
          'rgba(201, 168, 76, 0.4)'   // Dim gold
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      draw(cx: number, cy: number) {
        if (!ctx) return
        ctx.save()
        
        // Current angle from center
        const currentAngle = Math.atan2(this.y - cy, this.x - cx)
        
        ctx.translate(this.x, this.y)
        // Orient the dash spherically outward
        ctx.rotate(currentAngle + Math.PI / 2) 
        
        ctx.fillStyle = this.color
        ctx.beginPath()
        // Draw a slim dash
        ctx.ellipse(0, 0, this.size * 0.5, this.size * 2.5, 0, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
      }

      update() {
        // Mouse displacement logic (flowing with cursor)
        let dx = mouse.x - this.baseX
        let dy = mouse.y - this.baseY
        let distance = Math.sqrt(dx * dx + dy * dy)
        
        let targetX = this.baseX
        let targetY = this.baseY

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius
          // Push particles outwards from mouse
          targetX = this.baseX - (dx / distance) * force * 40
          targetY = this.baseY - (dy / distance) * force * 40
        }

        // Smooth easing towards target
        this.x += (targetX - this.x) * 0.1
        this.y += (targetY - this.y) * 0.1
        
        // Gentle rotation of the base over time
        this.baseAngle += 0.001
        const cx = window.innerWidth / 2
        const cy = window.innerHeight / 2
        this.baseX = cx + Math.cos(this.baseAngle) * this.distCenter
        this.baseY = cy + Math.sin(this.baseAngle) * this.distCenter
      }
    }

    const initParticles = () => {
      particles = []
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      
      // Create a grid/spiral of particles for structural "field" look
      const amount = Math.min((canvas.width * canvas.height) / 5000, 600)
      for (let i = 0; i < amount; i++) {
        // distribute them in a galaxy spiral / spherical map
        const radius = Math.random() * Math.max(canvas.width, canvas.height) * 0.6
        const theta = Math.random() * Math.PI * 2
        
        // Make center less dense to read text easily
        if (radius < 150 && Math.random() > 0.2) continue
        
        const x = cx + radius * Math.cos(theta)
        const y = cy + radius * Math.sin(theta)
        particles.push(new Particle(x, y, cx, cy))
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw(cx, cy)
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    resize()
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  )
}
