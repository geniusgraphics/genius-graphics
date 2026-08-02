'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Cover } from '@/types'

const WORDS_LINE1 = ['VISUALS', 'THAT']
const WORDS_LINE2 = ['DEFINE', 'YOUR', 'SOUND']

function WordReveal({ words, delay = 0 }: { words: string[]; delay?: number }) {
  return (
    <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
      {words.map((word, i) => (
        <div key={word} className="overflow-hidden">
          <motion.span
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, delay: delay + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
            className="block font-display"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {word}
          </motion.span>
        </div>
      ))}
    </div>
  )
}

function Counter({ to, delay = 0 }: { to: number; delay?: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1600
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        setVal(Math.round(eased * to))
        if (t < 1) requestAnimationFrame(tick)
        else setVal(to)
      }
      requestAnimationFrame(tick)
    }, delay * 1000)
    return () => clearTimeout(timer)
  }, [to, delay])
  return <>{val}</>
}

export default function Hero({ featured }: { featured: Cover[] }) {
  const bg1 = featured[0]

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden select-none">

      {/* Single blurred ambient background — most performant */}
      {bg1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="kb-1 absolute inset-0"
          style={{
            backgroundImage: `url(/covers/${bg1.imageFile})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(35px) brightness(0.13)',
            zIndex: 0,
            willChange: 'transform',
          }}
        />
      )}

      {/* Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/80 via-obsidian/55 to-obsidian z-[1]" />

      {/* Two ambient orbs — GPU-composited */}
      <div
        className="absolute pointer-events-none z-[2]"
        style={{
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 68%)',
          top: '0%',
          left: '-8%',
          animation: 'orbFloat1 22s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute pointer-events-none z-[2]"
        style={{
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.045) 0%, transparent 68%)',
          bottom: '8%',
          right: '-4%',
          animation: 'orbFloat2 28s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 flex items-center justify-center gap-4"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="block w-10 h-px bg-gold origin-left"
          />
          <span className="font-mono text-xs tracking-[0.4em] text-gold uppercase">
            Genius Graphics · Est. 2025
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="block w-10 h-px bg-gold origin-right"
          />
        </motion.div>

        {/* Main headline */}
        <div className="text-[clamp(3.5rem,10vw,10rem)] leading-[0.9] font-light mb-6 text-cream relative">
          <WordReveal words={WORDS_LINE1} delay={0.4} />
          <WordReveal words={WORDS_LINE2} delay={0.62} />

          {/* Gold scan sweep — runs once on load */}
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.4, delay: 2.2, times: [0, 0.1, 0.9, 1] }}
          >
            <motion.div
              className="absolute top-0 bottom-0 w-[30%]"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.13), transparent)' }}
              initial={{ x: '-100%' }}
              animate={{ x: '450%' }}
              transition={{ duration: 1.2, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3 }}
          className="mt-10 space-y-3 text-center"
        >
          <p className="text-cream text-base md:text-lg font-sans font-light tracking-wide max-w-lg mx-auto">
            Not a template. Not stock. Not used by anyone else.
          </p>
          <p className="text-muted text-sm font-sans font-light tracking-wide max-w-sm mx-auto">
            Original cover art — sold once, owned forever. Every piece comes with a styled preview and a clean file.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="#collection"
            className="group relative px-8 py-4 bg-gold text-obsidian font-mono text-xs tracking-widest uppercase overflow-hidden flex items-center gap-3"
            style={{ pointerEvents: 'auto', cursor: 'none' }}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 0.8, delay: 2.4, ease: 'easeInOut' }}
            />
            <span className="relative">Explore Collection</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="relative"
            >
              →
            </motion.span>
          </Link>
          <Link
            href="#about"
            className="px-8 py-4 border border-border text-muted font-mono text-xs tracking-widest uppercase hover:border-cream hover:text-cream transition-all duration-500"
            style={{ pointerEvents: 'auto', cursor: 'none' }}
          >
            Our Story
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.9 }}
          className="mt-20 flex items-center justify-center gap-12 text-center"
        >
          <div className="space-y-1">
            <div className="font-display text-3xl text-gold" style={{ fontFamily: 'var(--font-display)' }}>
              <Counter to={28} delay={2.2} />
            </div>
            <div className="font-mono text-xs tracking-widest text-muted uppercase">Originals</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="space-y-1">
            <div className="font-display text-3xl text-gold" style={{ fontFamily: 'var(--font-display)' }}>£3–£12</div>
            <div className="font-mono text-xs tracking-widest text-muted uppercase">Starting from</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="space-y-1">
            <div className="font-display text-3xl text-gold" style={{ fontFamily: 'var(--font-display)' }}>1×</div>
            <div className="font-mono text-xs tracking-widest text-muted uppercase">Owner per piece</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.4 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] tracking-[0.4em] text-muted/40 uppercase">Scroll</span>
        <motion.div
          animate={{ scaleY: [0, 1, 0], y: [0, 0, 10] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', times: [0, 0.5, 1] }}
          className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent origin-top"
        />
      </motion.div>

      <style>{`
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(50px, -35px); }
          66% { transform: translate(-25px, 25px); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-45px, 30px); }
          66% { transform: translate(20px, -20px); }
        }
      `}</style>
    </section>
  )
}
