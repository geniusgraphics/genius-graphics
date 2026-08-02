'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import { Play, Lock } from 'lucide-react'
import type { Cover } from '@/types'
import { formatPrice } from '@/lib/utils'
import WatermarkOverlay from './WatermarkOverlay'

interface Props {
  cover: Cover
  index?: number
}

function deriveCleanFile(imageFile: string): string {
  return imageFile.replace('-title.', '-clean.')
}

export default function CoverCard({ cover, index = 0 }: Props) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [3, -3]), { stiffness: 200, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-3, 3]), { stiffness: 200, damping: 30 })

  const glareXPct = useTransform(mouseX, [0, 1], [0, 100])
  const glareYPct = useTransform(mouseY, [0, 1], [0, 100])
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareXPct}% ${glareYPct}%, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.04) 40%, transparent 60%)`

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  const handleMouseLeave = () => {
    setHovered(false)
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  const num = String(index + 1).padStart(2, '0')
  const cleanFile = deriveCleanFile(cover.imageFile)

  const cardContent = (
    <div style={{ perspective: '1200px' }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        data-cursor="view"
        style={{
          rotateX: cover.sold ? 0 : rotateX,
          rotateY: cover.sold ? 0 : rotateY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        className="relative group block overflow-hidden bg-obsidian-3 aspect-square"
      >
        {/* Styled version (default — shown at rest) */}
        <div
          className="absolute inset-0 cover-bg"
          style={{
            backgroundImage: `url(/covers/${cover.imageFile})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: cover.sold ? 'grayscale(100%) brightness(0.55)' : 'brightness(0.92)',
            opacity: hovered && !cover.sold ? 0 : 1,
            transition: 'opacity 0.55s cubic-bezier(0.22,1,0.36,1)',
            willChange: 'opacity',
          } as React.CSSProperties}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />

        {/* Clean version (revealed on hover) */}
        {!cover.sold && (
          <div
            className="absolute inset-0 cover-bg"
            style={{
              backgroundImage: `url(/covers/${cleanFile})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.55s cubic-bezier(0.22,1,0.36,1)',
              willChange: 'opacity',
            } as React.CSSProperties}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          />
        )}

        {/* Gold glare — only mounted on hover */}
        {hovered && !cover.sold && (
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ background: glareBackground }}
          />
        )}

        {/* GG Watermark */}
        <WatermarkOverlay />

        {/* Index */}
        <div className="absolute top-3 left-3 z-20">
          <span className="font-mono text-[10px] text-cream/25 tracking-widest">{num}</span>
        </div>

        {/* NEW badge */}
        {cover.isNew && !cover.sold && (
          <div className="absolute top-3 right-3 z-20">
            <span className="font-mono text-[9px] tracking-[0.25em] text-obsidian bg-gold px-1.5 py-0.5 uppercase">
              New
            </span>
          </div>
        )}

        {/* Styled / Clean indicator — visible at rest, updates on hover */}
        {!cover.sold && (
          <motion.div
            className="absolute bottom-3 left-3 z-20"
            initial={false}
            animate={{ opacity: hovered ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="font-mono text-[9px] tracking-[0.2em] uppercase inline-flex items-center gap-1"
              style={{ color: 'rgba(201,168,76,0.5)' }}
            >
              <span style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: 'rgba(201,168,76,0.5)' }} />
              styled preview
            </span>
          </motion.div>
        )}
        {!cover.sold && (
          <motion.div
            className="absolute bottom-3 left-3 z-20"
            initial={false}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="font-mono text-[9px] tracking-[0.2em] uppercase inline-flex items-center gap-1"
              style={{ color: 'rgba(201,168,76,0.85)' }}
            >
              <span style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: 'rgba(201,168,76,0.85)' }} />
              clean version
            </span>
          </motion.div>
        )}

        {/* Sold stamp */}
        {cover.sold && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div style={{ transform: 'rotate(-25deg)', border: '3px solid #CC2200', padding: '8px 24px' }}>
              <span className="font-mono font-bold text-sold text-2xl tracking-[0.3em]">SOLD</span>
            </div>
          </div>
        )}
        {cover.sold && (
          <div className="absolute top-3 right-3 z-20 bg-sold/90 p-1.5">
            <Lock size={12} className="text-white" />
          </div>
        )}

        {/* Hover panel — slides up */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: cover.sold ? '100%' : hovered ? 0 : '100%' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-obsidian via-obsidian/96 to-transparent p-5 pt-14"
        >
          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
            transition={{ duration: 0.28, delay: 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[10px] tracking-[0.3em] text-gold uppercase mb-1.5">
              {cover.category}
            </p>
            <h3 className="font-display text-xl text-cream leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {cover.title}
            </h3>
          </motion.div>

          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 12 }}
            transition={{ duration: 0.28, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between mt-3 pt-3 border-t border-white/10"
          >
            {cover.videoCount > 0 ? (
              <div className="flex items-center gap-1.5">
                <Play size={9} className="text-gold fill-gold" />
                <span className="font-mono text-[10px] tracking-widest text-muted uppercase">
                  +{cover.videoCount} motion video{cover.videoCount > 1 ? 's' : ''}
                </span>
              </div>
            ) : <span />}
            <div className="text-right">
              <p className="font-mono text-[10px] text-muted/60 tracking-widest">from</p>
              <p className="font-mono text-lg font-bold text-gold leading-none">{formatPrice(cover.priceImage)}</p>
            </div>
          </motion.div>

          {/* Ownership tag in hover panel */}
          <motion.p
            initial={false}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.22 }}
            className="font-mono text-[9px] tracking-[0.25em] text-muted/50 uppercase mt-2"
          >
            1 owner · forever yours
          </motion.p>
        </motion.div>

        <span className="sr-only">{cover.title}</span>
      </motion.div>
    </div>
  )

  if (cover.sold) return cardContent

  return (
    <Link href={`/cover/${cover.slug}`} className="block" style={{ pointerEvents: 'auto', cursor: 'none' }}>
      {cardContent}
    </Link>
  )
}
