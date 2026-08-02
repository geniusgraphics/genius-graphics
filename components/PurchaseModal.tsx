'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, ImageIcon, Check, Clock } from 'lucide-react'
import Link from 'next/link'
import type { Cover } from '@/types'
import { formatPrice } from '@/lib/utils'
import WatermarkOverlay from './WatermarkOverlay'

interface Props {
  cover: Cover
  onClose: () => void
  isLoggedIn: boolean
}

export default function PurchaseModal({ cover, onClose, isLoggedIn }: Props) {
  const [selected, setSelected] = useState<'image' | 'bundle'>('bundle')

  const price = selected === 'image' ? cover.priceImage : cover.priceWithVideos
  const savings = cover.priceWithVideos - cover.priceImage

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-lg"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 30 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl bg-obsidian-2 border border-border overflow-hidden"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 text-muted hover:text-cream transition-colors"
            style={{ pointerEvents: 'auto', cursor: 'none' }}
          >
            <X size={20} />
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Cover preview */}
            <div className="relative w-full md:w-56 shrink-0 aspect-square overflow-hidden">
              <div
                className="absolute inset-0 cover-bg"
                style={{
                  backgroundImage: `url(/covers/${cover.imageFile})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
                onContextMenu={(e) => e.preventDefault()}
              />
              <WatermarkOverlay />
            </div>

            {/* Options */}
            <div className="flex-1 p-6 md:p-8 space-y-6">
              <div>
                <p className="font-mono text-xs tracking-widest text-gold uppercase mb-1">{cover.category}</p>
                <h2
                  className="font-display text-2xl md:text-3xl text-cream"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {cover.title}
                </h2>
              </div>

              <p className="text-muted text-sm leading-relaxed">{cover.description}</p>

              {/* Options */}
              <div className="space-y-3">
                {/* Bundle */}
                {cover.videoCount > 0 && (
                  <button
                    onClick={() => setSelected('bundle')}
                    style={{ pointerEvents: 'auto', cursor: 'none' }}
                    className={`w-full text-left p-4 border transition-all duration-200 relative ${
                      selected === 'bundle'
                        ? 'border-gold bg-gold/5'
                        : 'border-border hover:border-muted'
                    }`}
                  >
                    {selected === 'bundle' && (
                      <span className="absolute top-2 right-2 font-mono text-xs bg-gold text-obsidian px-2 py-0.5 tracking-widest">
                        BEST VALUE
                      </span>
                    )}
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${selected === 'bundle' ? 'border-gold bg-gold' : 'border-muted'}`}>
                        {selected === 'bundle' && <Check size={10} className="text-obsidian" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Play size={12} className="text-gold" />
                          <span className="font-mono text-xs tracking-widest text-cream uppercase">
                            Image + {cover.videoCount} Video{cover.videoCount > 1 ? 's' : ''}
                          </span>
                        </div>
                        <p className="text-muted text-xs">
                          Full cover art + {cover.videoCount} animated ~6-second video{cover.videoCount > 1 ? 's' : ''}
                        </p>
                      </div>
                      <span className="font-mono text-gold font-bold text-lg">{formatPrice(cover.priceWithVideos)}</span>
                    </div>
                  </button>
                )}

                {/* Image only */}
                <button
                  onClick={() => setSelected('image')}
                  style={{ pointerEvents: 'auto', cursor: 'none' }}
                  className={`w-full text-left p-4 border transition-all duration-200 ${
                    selected === 'image'
                      ? 'border-gold bg-gold/5'
                      : 'border-border hover:border-muted'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${selected === 'image' ? 'border-gold bg-gold' : 'border-muted'}`}>
                      {selected === 'image' && <Check size={10} className="text-obsidian" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <ImageIcon size={12} className="text-muted" />
                        <span className="font-mono text-xs tracking-widest text-cream uppercase">Image Only</span>
                      </div>
                      <p className="text-muted text-xs">Full cover art file, no videos</p>
                    </div>
                    <span className="font-mono text-cream font-bold text-lg">{formatPrice(cover.priceImage)}</span>
                  </div>
                </button>
              </div>

              {/* Video upgrade note */}
              {selected === 'image' && cover.videoCount > 0 && (
                <div className="flex items-start gap-2 p-3 bg-obsidian-3 border border-border/50">
                  <Clock size={13} className="text-gold shrink-0 mt-0.5" />
                  <p className="text-muted text-xs leading-relaxed">
                    You have <span className="text-cream">3 months</span> after purchase to add the video
                    {cover.videoCount > 1 ? 's' : ''} for a small upgrade fee. After that, contact admin.
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="space-y-3 pt-2">
                {isLoggedIn ? (
                  <Link
                    href={`/checkout/${cover.id}?type=${selected}`}
                    className="block w-full text-center py-4 bg-gold text-obsidian font-mono text-xs tracking-widest uppercase hover:bg-gold-light transition-colors"
                    style={{ pointerEvents: 'auto', cursor: 'none' }}
                  >
                    Purchase · {formatPrice(price)}
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href={`/auth/register?redirect=/cover/${cover.slug}`}
                      className="block w-full text-center py-4 bg-gold text-obsidian font-mono text-xs tracking-widest uppercase hover:bg-gold-light transition-colors"
                      style={{ pointerEvents: 'auto', cursor: 'none' }}
                    >
                      Create Account to Purchase · {formatPrice(price)}
                    </Link>
                    <p className="text-center text-muted text-xs">
                      Already have an account?{' '}
                      <Link
                        href={`/auth/login?redirect=/cover/${cover.slug}`}
                        className="text-gold hover:text-gold-light underline"
                        style={{ pointerEvents: 'auto', cursor: 'none' }}
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                )}
                <p className="text-center font-mono text-xs text-muted/60 tracking-widest">
                  SECURE CHECKOUT · THIS COVER REMAINS AVAILABLE UNTIL PURCHASE
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
