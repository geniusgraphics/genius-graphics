'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function Cursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const [variant, setVariant] = useState<'default' | 'hover' | 'view' | 'link'>('default')

  const springConfig = { stiffness: 600, damping: 45 }
  const springX = useSpring(cursorX, springConfig)
  const springY = useSpring(cursorY, springConfig)

  const trailX = useSpring(cursorX, { stiffness: 120, damping: 22 })
  const trailY = useSpring(cursorY, { stiffness: 120, damping: 22 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleEnter = (e: Event) => {
      const el = e.target as HTMLElement
      if (el.dataset.cursor === 'view') setVariant('view')
      else if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.closest('button') || el.closest('a')) setVariant('link')
      else setVariant('hover')
    }

    const handleLeave = () => setVariant('default')

    window.addEventListener('mousemove', move)
    document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', handleEnter)
      el.addEventListener('mouseleave', handleLeave)
    })

    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter)
        el.removeEventListener('mouseleave', handleLeave)
        el.addEventListener('mouseenter', handleEnter)
        el.addEventListener('mouseleave', handleLeave)
      })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', move)
      observer.disconnect()
    }
  }, [cursorX, cursorY])

  return (
    <>
      {/* Trail dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full bg-gold/30"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
          width: variant === 'view' ? 80 : variant === 'link' ? 48 : 32,
          height: variant === 'view' ? 80 : variant === 'link' ? 48 : 32,
        }}
        transition={{ duration: 0 }}
      />

      {/* Main cursor */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {variant === 'view' ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex items-center justify-center w-16 h-16 rounded-full bg-gold"
          >
            <span className="font-mono text-xs font-bold text-obsidian tracking-widest">VIEW</span>
          </motion.div>
        ) : (
          <motion.div
            animate={{
              width: variant === 'link' ? 12 : 8,
              height: variant === 'link' ? 12 : 8,
              backgroundColor: variant === 'link' ? '#c9a84c' : '#f0ede8',
            }}
            transition={{ duration: 0.15 }}
            className="rounded-full"
          />
        )}
      </motion.div>
    </>
  )
}
