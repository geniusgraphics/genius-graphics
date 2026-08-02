'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Play, Lock } from 'lucide-react'
import type { Cover } from '@/types'
import { formatPrice } from '@/lib/utils'
import WatermarkOverlay from './WatermarkOverlay'

interface Props {
  cover: Cover
  index?: number
}

export default function CoverCard({ cover, index = 0 }: Props) {
  const [hovered, setHovered] = useState(false)

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="view"
      className="relative group block overflow-hidden bg-obsidian-3 aspect-square"
    >
      {/* Cover image as background (harder to right-click than <img>) */}
      <div
        className="absolute inset-0 cover-bg transition-transform duration-700 ease-out"
        style={{
          backgroundImage: `url(/covers/${cover.imageFile})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          filter: cover.sold ? 'grayscale(100%) brightness(0.6)' : 'brightness(0.95)',
        } as React.CSSProperties}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />

      {/* GG Watermark */}
      <WatermarkOverlay />

      {/* Sold overlay */}
      {cover.sold && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div
            className="relative"
            style={{
              transform: 'rotate(-25deg)',
              border: '3px solid #CC2200',
              padding: '8px 24px',
            }}
          >
            <span className="font-mono font-bold text-sold text-2xl tracking-[0.3em]">SOLD</span>
          </div>
        </div>
      )}

      {/* Lock icon for sold */}
      {cover.sold && (
        <div className="absolute top-3 right-3 z-20 bg-sold/90 p-1.5 rounded">
          <Lock size={12} className="text-white" />
        </div>
      )}

      {/* Hover reveal panel */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: cover.sold ? '100%' : hovered ? 0 : '100%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-obsidian via-obsidian/95 to-transparent p-5 pt-10"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-mono text-xs tracking-widest text-gold uppercase mb-1">
              {cover.category}
            </p>
            <h3
              className="font-display text-xl text-cream leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {cover.title}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <p className="font-mono text-xs text-muted">from</p>
            <p className="font-mono text-lg font-bold text-gold">{formatPrice(cover.priceImage)}</p>
          </div>
        </div>

        {/* Video badge */}
        {cover.videoCount > 0 && (
          <div className="mt-3 flex items-center gap-1.5">
            <Play size={10} className="text-gold" />
            <span className="font-mono text-xs text-muted">
              +{cover.videoCount} video{cover.videoCount > 1 ? 's' : ''} available
            </span>
          </div>
        )}
      </motion.div>

      {/* Always visible: title at top for accessibility */}
      <div className="absolute top-0 left-0 right-0 z-10 p-3 opacity-0 pointer-events-none" aria-hidden="false">
        <span className="sr-only">{cover.title}</span>
      </div>
    </motion.div>
  )

  if (cover.sold) {
    return cardContent
  }

  return (
    <Link href={`/cover/${cover.slug}`} className="block" style={{ pointerEvents: 'auto', cursor: 'none' }}>
      {cardContent}
    </Link>
  )
}
