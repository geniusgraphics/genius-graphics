'use client'
import { motion } from 'framer-motion'

const paragraphs = [
  'Most artists release their music with the same five Canva templates. Different song, same cover. We built Genius Graphics to change that — one original per artist, no exceptions, no duplicates, ever.',
  'Every piece ships with two files: a styled preview showing you exactly how the typography sits, and a clean blank canvas ready for your own text. Add motion videos for a complete visual identity across streaming and social.',
  'We believe what you look like is part of what you sound like. When your cover is exclusive, your release feels exclusive. That\'s not vanity — it\'s strategy.',
]

export default function AnimatedAbout() {
  return (
    <section id="about" className="py-32 px-6 border-t border-border relative overflow-hidden">

      {/* Decorative background number */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(12rem, 22vw, 22rem)',
          lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: '1px rgba(201,168,76,0.06)',
          fontWeight: 300,
          letterSpacing: '-0.05em',
          userSelect: 'none',
        }}
      >
        GG
      </motion.div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start relative z-10">
        {/* Left — heading */}
        <div className="space-y-6">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs tracking-[0.4em] text-gold uppercase"
          >
            About
          </motion.p>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 1.0, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl md:text-6xl font-light text-cream leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Art That Works as Hard as Your Music
            </motion.h2>
          </div>

          {/* Animated gold line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-px bg-gradient-to-r from-gold to-transparent origin-left"
            style={{ width: '80%' }}
          />
        </div>

        {/* Right — staggered paragraphs */}
        <div className="space-y-6">
          {paragraphs.map((text, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.75, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-muted leading-relaxed text-sm"
            >
              {text}
            </motion.p>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="pt-6 border-t border-border"
          >
            <p className="font-mono text-xs tracking-widest text-muted/50 uppercase">
              Questions?{' '}
              <a
                href="mailto:hello@geniusgraphics.art"
                className="text-gold hover:text-gold-light underline transition-colors"
                style={{ pointerEvents: 'auto', cursor: 'none' }}
              >
                hello@geniusgraphics.art
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
