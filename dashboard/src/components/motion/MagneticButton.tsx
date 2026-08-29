import React, { useRef, useState } from 'react'
import { motion, useReducedMotion, useSpring } from 'framer-motion'

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  strength?: number
  className?: string
  magneticRadius?: number
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.28,
  className = '',
  magneticRadius = 50,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)

  // Spring physics: stiffness 300, damping 20
  const springConfig = { stiffness: 300, damping: 20 }
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion || !buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    const distance = Math.hypot(distanceX, distanceY)
    if (distance < rect.width / 2 + magneticRadius) {
      x.set(distanceX * strength)
      y.set(distanceY * strength)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <motion.button
      ref={buttonRef}
      style={shouldReduceMotion ? {} : { x, y }}
      whileTap={{ scale: 0.96 }}
      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
}
