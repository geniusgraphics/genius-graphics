'use client'
import { useEffect, useRef, useState } from 'react'
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
            transition={{
              duration: 1.2,
              delay: delay + i * 0.13,
              ease: [0.22, 1, 0.36, 1],
            }}
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
  const bg2 = featured[1]
  const bg3 = featured[2]

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden select-none">

      {/* Background covers — Ken Burns */}
      {[bg1, bg2, bg3].map((cover, i) =>
        cover ? (
          <motion.div
            key={cover.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: i * 0.5, ease: 'easeOut' }}
            className={`absolute inset-0 kb-${i + 1}`}
            style={{
              backgroundImage: `url(/covers/${cover.imageFile})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(50px) brightness(0.12)',
              zIndex: 0,
            }}
          />
        ) : null
      )}

      {/* Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/50 to-obsidian z-[1]" />

      {/* Ambient orbs */}
      <motion.div
        className="absolute pointer-events-none z-[2]"
        style={{
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.055) 0%, transparent 68%)',
          top: '5%',
          left: '-10%',
        }}
        animate={{ x: [0, 60, -30, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute pointer-events-none z-[2]"
        style={{
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 68%)',
          bottom: '10%',
          right: '-5%',
        }}
        animate={{ x: [0, -50, 20, 0], y: [0, 40, -25, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
      <motion.div
        className="absolute pointer-events-none z-[2]"
        style={{
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,237,232,0.025) 0%, transparent 68%)',
          top: '40%',
          left: '55%',
        }}
        animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
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
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="block w-10 h-px bg-gold origin-left"
          />
          <span className="font-mono text-xs tracking-[0.4em] text-gold uppercase">
            Genius Graphics · Est. 2025
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="block w-10 h-px bg-gold origin-right"
          />
        </motion.div>

        {/* Main headline */}
        <div className="text-[clamp(3.5rem,10vw,10rem)] leading-[0.9] font-light mb-6 text-cream relative">
          <WordReveal words={WORDS_LINE1} delay={0.4} />
          <WordReveal words={WORDS_LINE2} delay={0.62} />

          {/* Gold scan sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.4, delay: 2.2, times: [0, 0.1, 0.9, 1] }}
          >
            <motion.div
              className="absolute top-0 bottom-0 w-[30%]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.12), transparent)',
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '450%' }}
              transition={{ duration: 1.2, delay: 2.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3 }}
          className="mt-10 text-muted text-base md:text-lg font-sans font-light tracking-wide max-w-md mx-auto"
        >
          Premium cover art. One owner. Yours forever.
        </motion.p>

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
            {/* Button shimmer */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 0.8, delay: 2.2, ease: 'easeInOut' }}
            />
            <span className="relative">Explore Collection</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="relative"
            >
              →
            </motion.span>
          </Link>
          <Link
            href="#about"
            className="px-8 py-4 border border-border text-muted font-mono text-xs tracking-widest uppercase hover:border-cream hover:text-cream transition-all duration-400"
            style={{ pointerEvents: 'auto', cursor: 'none' }}
          >
            Our Story
          </Link>
        </motion.div>

        {/* Stats — counter animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.9 }}
          className="mt-20 flex items-center justify-center gap-12 text-center"
        >
          {/* Dividers */}
          <div className="space-y-1">
            <div className="font-display text-3xl text-gold" style={{ fontFamily: 'var(--font-display)' }}>
              <Counter to={28} delay={2.2} />
            </div>
            <div className="font-mono text-xs tracking-widest text-muted uppercase">Originals</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="space-y-1">
            <div className="font-display text-3xl text-gold" style={{ fontFamily: 'var(--font-display)' }}>
              £3–£12
            </div>
            <div className="font-mono text-xs tracking-widest text-muted uppercase">Starting from</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="space-y-1">
            <div className="font-display text-3xl text-gold" style={{ fontFamily: 'var(--font-display)' }}>
              1×
            </div>
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
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', times: [0, 0.5, 1] }}
          className="w-px h-10 bg-gradient-to-b from-gold/60 to-transparent origin-top"
        />
      </motion.div>
    </section>
  )
}
