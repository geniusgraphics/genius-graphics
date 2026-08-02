'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
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
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs tracking-[0.4em] text-gold uppercase mb-3"
          >
            The Collection
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl md:text-6xl text-cream font-light"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Original Pieces
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-6 font-mono text-xs"
        >
          <span className="text-muted">
            <span className="text-cream font-bold">{available}</span> available
          </span>
          <span className="text-muted/40">·</span>
          <span className="text-muted">
            <span className="text-sold font-bold">{sold}</span> sold
          </span>
        </motion.div>
      </div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-12"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            style={{ pointerEvents: 'auto', cursor: 'none' }}
            className={`px-4 py-2 font-mono text-xs tracking-widest uppercase transition-all duration-300 border ${
              active === cat
                ? 'bg-gold text-obsidian border-gold'
                : 'bg-transparent text-muted border-border hover:border-muted hover:text-cream'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {filtered.map((cover, i) => (
          <motion.div
            key={cover.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CoverCard cover={cover} index={i} />
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-24 text-muted font-mono text-sm tracking-widest">
          No covers in this category yet.
        </div>
      )}
    </section>
  )
}
