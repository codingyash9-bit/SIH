import React, { useEffect } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

export const AmbientGlow: React.FC = () => {
  const shouldReduceMotion = useReducedMotion()
  const mouseX = useMotionValue(-300)
  const mouseY = useMotionValue(-300)

  // Soft organic trailing spring
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 24 })
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 24 })

  useEffect(() => {
    if (shouldReduceMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [shouldReduceMotion, mouseX, mouseY])

  if (shouldReduceMotion) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at 15% 15%, rgba(255, 153, 51, 0.04) 0%, transparent 45%),
            radial-gradient(circle at 85% 85%, rgba(19, 136, 8, 0.04) 0%, transparent 45%)
          `,
        }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Saffron Primary Cursor Glow */}
      <motion.div
        className="absolute w-[460px] h-[460px] rounded-full blur-[90px] opacity-40 mix-blend-multiply pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(255, 153, 51, 0.32) 0%, rgba(255, 183, 77, 0.15) 45%, transparent 70%)',
        }}
      />
      {/* India Green Off-center Counter Glow */}
      <motion.div
        className="absolute w-[420px] h-[420px] rounded-full blur-[95px] opacity-35 mix-blend-multiply pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-30%',
          translateY: '-20%',
          background: 'radial-gradient(circle, rgba(19, 136, 8, 0.25) 0%, rgba(76, 175, 80, 0.12) 50%, transparent 70%)',
        }}
      />
      {/* Static Subdued Canvas Mesh Accent */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 80% 10%, rgba(255, 153, 51, 0.08) 0%, transparent 35%),
            radial-gradient(circle at 20% 90%, rgba(19, 136, 8, 0.08) 0%, transparent 35%),
            radial-gradient(circle at 50% 50%, rgba(0, 0, 128, 0.02) 0%, transparent 60%)
          `,
        }}
      />
    </div>
  )
}
