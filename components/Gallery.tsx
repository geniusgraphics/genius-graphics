'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CoverCard from './CoverCard'
import type { Cover, Category } from '@/types'
import { categories } from '@/lib/covers-data'

export default function Gallery({ covers }: { covers: Cover[] }) {
  const [active, setActive] = useState<Category>('All')

  const filtered = active === 'All' ? covers : covers.filter((c) => c.category === active)
  const available = covers.filter((c) => !c.sold).length
  const sold = covers.filter((c) => c.sold).length

  return (
    <section id="collection" className="px-6 py-24 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs tracking-[0.4em] text-gold uppercase mb-3"
          >
            The Collection
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-5xl md:text-6xl text-cream font-light"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Original Pieces
            </motion.h2>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center gap-6 font-mono text-xs"
        >
          <span className="text-muted">
            <span className="text-cream font-bold">{available}</span> available
          </span>
          <span className="text-muted/30">·</span>
          <span className="text-muted">
            <span className="text-sold font-bold">{sold}</span> sold
          </span>
        </motion.div>
      </div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-12"
      >
        {categories.map((cat, i) => (
          <motion.button
            key={cat}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            onClick={() => setActive(cat)}
            style={{ pointerEvents: 'auto', cursor: 'none' }}
            className={`relative px-4 py-2 font-mono text-xs tracking-widest uppercase transition-all duration-300 border overflow-hidden ${
              active === cat
                ? 'bg-gold text-obsidian border-gold'
                : 'bg-transparent text-muted border-border hover:border-gold/50 hover:text-cream'
            }`}
          >
            {active === cat && (
              <motion.span
                layoutId="activeFilter"
                className="absolute inset-0 bg-gold"
                style={{ zIndex: -1 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((cover, i) => (
            <motion.div
              key={cover.id}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: -20 }}
              transition={{
                duration: 0.45,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <CoverCard cover={cover} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 text-muted font-mono text-sm tracking-widest"
        >
          No covers in this category yet.
        </motion.div>
      )}
    </section>
  )
}
