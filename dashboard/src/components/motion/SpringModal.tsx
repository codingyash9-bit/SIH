import React, { useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface SpringDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  width?: string
  ariaLabel?: string
}

export const SpringDrawer: React.FC<SpringDrawerProps> = ({
  isOpen,
  onClose,
  children,
  width = '420px',
  ariaLabel = 'Detail drawer',
}) => {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Frosted Pearl Backdrop */}
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Spring Slide-in Drawer */}
          <motion.aside
            className="detail-drawer"
            style={{ width }}
            aria-label={ariaLabel}
            initial={shouldReduceMotion ? { opacity: 0 } : { x: '100%', opacity: 0.8 }}
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : {
                    x: 0,
                    opacity: 1,
                    transition: {
                      type: 'spring',
                      stiffness: 280,
                      damping: 26,
                      mass: 0.9,
                    },
                  }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : {
                    x: '100%',
                    opacity: 0.6,
                    transition: {
                      duration: 0.22,
                      ease: [0.32, 0, 0.67, 0],
                    },
                  }
            }
          >
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

interface SpringModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  ariaLabel?: string
}

export const SpringModal: React.FC<SpringModalProps> = ({
  isOpen,
  onClose,
  children,
  ariaLabel = 'Modal dialog',
}) => {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-label={ariaLabel}>
          <motion.div
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white/85 p-6 shadow-2xl backdrop-blur-xl border border-white/60"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                      type: 'spring',
                      stiffness: 300,
                      damping: 24,
                    },
                  }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    scale: 0.96,
                    y: 8,
                    transition: { duration: 0.18 },
                  }
            }
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
