import React, { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  tiltLimit?: number
  onClick?: () => void
  asButton?: boolean
  selected?: boolean
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  tiltLimit = 4.5,
  onClick,
  asButton = false,
  selected = false,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring smoothing for rotation
  const smoothX = useSpring(mouseX, { stiffness: 260, damping: 22 })
  const smoothY = useSpring(mouseY, { stiffness: 260, damping: 22 })

  // Map mouse coordinate relative to center into rotation degrees (-tiltLimit to +tiltLimit)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [tiltLimit, -tiltLimit])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-tiltLimit, tiltLimit])

  // Specular sheen highlight coordinate
  const glareX = useTransform(smoothX, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(smoothY, [-0.5, 0.5], [0, 100])
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.65), transparent 75%)`

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(relativeX)
    mouseY.set(relativeY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const Component = asButton ? motion.button : motion.div

  return (
    <Component
      ref={cardRef as any}
      style={
        shouldReduceMotion
          ? {}
          : {
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
              perspective: 1000,
            }
      }
      whileHover={shouldReduceMotion ? {} : { y: -2, transition: { duration: 0.2 } }}
      whileTap={onClick ? { scale: 0.985 } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden ${className} ${selected ? 'is-selected' : ''}`}
      {...(props as any)}
    >
      {children}
      {!shouldReduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{ background: glareBackground }}
          aria-hidden="true"
        />
      )}
    </Component>
  )
}
