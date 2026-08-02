'use client'
import { useEffect, useRef } from 'react'
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
              duration: 1.1,
              delay: delay + i * 0.12,
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

export default function Hero({ featured }: { featured: Cover[] }) {
  const bg1 = featured[0]
  const bg2 = featured[1]
  const bg3 = featured[2]

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Background covers — blurred ambient */}
      {[bg1, bg2, bg3].map((cover, i) =>
        cover ? (
          <motion.div
            key={cover.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: i * 0.4, ease: 'easeOut' }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(/covers/${cover.imageFile})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(40px) brightness(0.15)',
              transform: `scale(1.15) translate(${(i - 1) * 12}%, ${(i - 1) * 4}%)`,
              zIndex: 0,
            }}
          />
        ) : null
      )}

      {/* Dark gradient over background */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/40 to-obsidian z-[1]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-7xl mx-auto">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 flex items-center justify-center gap-4"
        >
          <span className="block w-8 h-px bg-gold" />
          <span className="font-mono text-xs tracking-[0.4em] text-gold uppercase">
            Genius Graphics · Est. 2025
          </span>
          <span className="block w-8 h-px bg-gold" />
        </motion.div>

        {/* Main headline */}
        <div className="text-[clamp(3.5rem,10vw,10rem)] leading-[0.9] font-light mb-6 text-cream">
          <WordReveal words={WORDS_LINE1} delay={0.4} />
          <WordReveal words={WORDS_LINE2} delay={0.6} />
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2 }}
          className="mt-10 text-muted text-base md:text-lg font-sans font-light tracking-wide max-w-md mx-auto"
        >
          Premium cover art. One owner. Yours forever.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="#collection"
            className="group px-8 py-4 bg-gold text-obsidian font-mono text-xs tracking-widest uppercase hover:bg-gold-light transition-all duration-300 flex items-center gap-3"
            style={{ pointerEvents: 'auto', cursor: 'none' }}
          >
            Explore Collection
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </Link>
          <Link
            href="#about"
            className="px-8 py-4 border border-border text-muted font-mono text-xs tracking-widest uppercase hover:border-cream hover:text-cream transition-all duration-300"
            style={{ pointerEvents: 'auto', cursor: 'none' }}
          >
            Our Story
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-20 flex items-center justify-center gap-12 text-center"
        >
          {[
            { value: '18', label: 'Originals' },
            { value: '£3–£12', label: 'Starting from' },
            { value: '1×', label: 'Owner per piece' },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="font-display text-3xl text-gold" style={{ fontFamily: 'var(--font-display)' }}>
                {stat.value}
              </div>
              <div className="font-mono text-xs tracking-widest text-muted uppercase">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-xs tracking-widest text-muted/50 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent"
        />
      </motion.div>
    </section>
  )
}
