'use client'
import { motion } from 'framer-motion'

const steps = [
  {
    num: '01',
    title: 'Browse the Collection',
    desc: 'Every piece is a hand-crafted original. When an artist claims a cover, it\'s permanently removed — no two artists ever share the same artwork. Hover any card to preview the clean file.',
    detail: '28 originals available now',
  },
  {
    num: '02',
    title: 'Choose Your Format',
    desc: 'Pick the cover image, or add the motion bundle — animated 6-second clips for Reels, Shorts, and TikTok. Every purchase includes both the styled preview and the clean blank canvas.',
    detail: 'Image · or · Image + Motion Videos',
  },
  {
    num: '03',
    title: 'Get Both Files Instantly',
    desc: 'Your profile delivers two files: the styled version (typography laid out as a design reference) and the clean version ready for your own text. No waiting, no emails.',
    detail: 'Styled PNG + Clean PNG · 3000 × 3000px',
  },
]

const trustItems = [
  { label: 'Secure Checkout', sub: 'Stripe encrypted' },
  { label: 'High-Res PNG', sub: '3000 × 3000 px' },
  { label: 'Instant Delivery', sub: 'In your profile immediately' },
  { label: 'Commercial License', sub: 'Streaming & social use' },
]

export default function HowItWorks() {
  return (
    <section className="relative border-t border-border overflow-hidden" style={{ background: 'var(--color-obsidian-2, #0c0c0c)' }}>

      {/* Faint decorative text */}
      <div
        className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(10rem, 25vw, 26rem)',
            fontWeight: 300,
            color: 'transparent',
            WebkitTextStroke: '1px rgba(201,168,76,0.04)',
            letterSpacing: '-0.05em',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          HOW IT WORKS
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10">

        {/* Header */}
        <div className="mb-20 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs tracking-[0.4em] text-gold uppercase mb-4"
          >
            How It Works
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1.0, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl md:text-5xl text-cream font-light"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Simple. One-time. Yours forever.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-4 text-muted text-sm max-w-md mx-auto leading-relaxed"
          >
            Exclusive ownership means when you claim a piece, no other artist can ever use it.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-0 relative mb-20">

          {/* Connector line — desktop only */}
          <div
            className="hidden md:block absolute top-[52px] left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-px"
            style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.15), rgba(201,168,76,0.4), rgba(201,168,76,0.15))' }}
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.75, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative px-8 pt-0 pb-8 md:pb-0 flex flex-col items-center text-center md:items-start md:text-left"
            >
              {/* Number badge */}
              <div className="relative mb-8 z-10">
                <div
                  className="w-[52px] h-[52px] flex items-center justify-center border border-gold/40"
                  style={{ background: 'var(--color-obsidian-2, #0c0c0c)' }}
                >
                  <span
                    className="font-mono font-bold text-gold"
                    style={{ fontSize: '11px', letterSpacing: '0.2em' }}
                  >
                    {step.num}
                  </span>
                </div>
              </div>

              <h3
                className="font-display text-xl text-cream font-light mb-3 leading-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {step.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-4">{step.desc}</p>
              <span className="font-mono text-[10px] tracking-widest text-gold/60 uppercase">
                {step.detail}
              </span>

              {/* Mobile step divider */}
              {i < steps.length - 1 && (
                <div className="md:hidden w-px h-10 bg-border/60 mt-6 mx-auto" />
              )}
            </motion.div>
          ))}
        </div>

        {/* "About the text on covers" callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-16 border border-gold/20 bg-gold/[0.03] p-6 md:p-8 flex flex-col md:flex-row gap-5 items-start"
        >
          <div className="shrink-0 w-10 h-10 border border-gold/40 flex items-center justify-center">
            <span className="text-gold font-mono text-xs font-bold">?</span>
          </div>
          <div>
            <p className="font-mono text-xs tracking-widest text-gold uppercase mb-2">Two files, one purchase</p>
            <p className="text-muted text-sm leading-relaxed">
              Every cover comes with <span className="text-cream font-medium">two versions</span>: the <span className="text-cream font-medium">styled preview</span> (showing you exactly how the typography sits on the artwork — a ready-made layout reference) and the <span className="text-cream font-medium">clean file</span> (blank canvas, ready for your own text in Photoshop, Canva, or any design tool).
              Hover any cover in the gallery to see the clean version. If you want us to place your actual artist name and song title in the original style, we offer a custom text edit add-on from your cover page.
            </p>
          </div>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="border-t border-border pt-10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col items-center text-center px-6 py-8"
                style={{ background: 'var(--color-obsidian-2, #0c0c0c)' }}
              >
                {/* Minimal geometric icon */}
                <div className="w-8 h-8 border border-gold/30 flex items-center justify-center mb-4">
                  <TrustIcon index={i} />
                </div>
                <p className="font-mono text-xs tracking-widest text-cream uppercase mb-1">{item.label}</p>
                <p className="font-mono text-[10px] tracking-wider text-muted/60">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}

function TrustIcon({ index }: { index: number }) {
  const icons = [
    // Lock / secure
    <svg key="lock" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="10" height="7" rx="0" stroke="rgba(201,168,76,0.7)" strokeWidth="1.2"/>
      <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="rgba(201,168,76,0.7)" strokeWidth="1.2" fill="none"/>
      <circle cx="7" cy="9.5" r="1" fill="rgba(201,168,76,0.7)"/>
    </svg>,
    // File / image
    <svg key="file" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="1" width="8" height="12" rx="0" stroke="rgba(201,168,76,0.7)" strokeWidth="1.2"/>
      <path d="M10 4l2 2" stroke="rgba(201,168,76,0.7)" strokeWidth="1.2"/>
      <path d="M10 1v3h3" stroke="rgba(201,168,76,0.7)" strokeWidth="1.2" fill="none"/>
      <path d="M4 6h6M4 8.5h4" stroke="rgba(201,168,76,0.7)" strokeWidth="1"/>
    </svg>,
    // Bolt / instant
    <svg key="bolt" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1L3 8h4l-1 5 6-7H8L8 1z" stroke="rgba(201,168,76,0.7)" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
    </svg>,
    // Award / badge
    <svg key="award" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="5.5" r="4" stroke="rgba(201,168,76,0.7)" strokeWidth="1.2"/>
      <path d="M4.5 9l-1.5 4 4-1.5 4 1.5-1.5-4" stroke="rgba(201,168,76,0.7)" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
    </svg>,
  ]
  return icons[index] ?? null
}
