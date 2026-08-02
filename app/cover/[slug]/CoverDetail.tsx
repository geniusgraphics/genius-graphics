'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Check, Clock } from 'lucide-react'
import Link from 'next/link'
import { covers } from '@/lib/covers-data'
import { formatPrice } from '@/lib/utils'
import WatermarkOverlay from '@/components/WatermarkOverlay'
import PurchaseModal from '@/components/PurchaseModal'
import { createClient } from '@/lib/supabase/client'
import Footer from '@/components/Footer'
import VideoPreview from '@/components/VideoPreview'
import type { Cover } from '@/types'

export default function CoverDetail({ cover }: { cover: Cover }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user))
  }, [supabase.auth])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      supabase.from('recently_viewed').upsert({
        user_id: data.user.id,
        cover_id: cover.id,
        viewed_at: new Date().toISOString(),
      })
    })
  }, [cover.id, supabase])

  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="px-6 pt-8 max-w-7xl mx-auto">
          <Link
            href="/#collection"
            className="inline-flex items-center gap-2 text-muted hover:text-cream transition-colors font-mono text-xs tracking-widest uppercase"
            style={{ pointerEvents: 'auto', cursor: 'none' }}
          >
            <ArrowLeft size={14} />
            Back to Collection
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-start">
          {/* Left column: cover image + motion preview */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-square overflow-hidden bg-obsidian-3"
              onContextMenu={(e) => e.preventDefault()}
            >
              <div
                className="absolute inset-0 cover-bg"
                style={{
                  backgroundImage: `url(/covers/${cover.imageFile})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: cover.sold ? 'grayscale(80%) brightness(0.7)' : undefined,
                } as React.CSSProperties}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
              <WatermarkOverlay />

              {cover.sold && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div style={{ transform: 'rotate(-20deg)', border: '4px solid #CC2200', padding: '12px 36px' }}>
                    <span className="font-mono font-bold text-sold text-4xl tracking-[0.3em]">SOLD</span>
                  </div>
                </div>
              )}

              <div className="absolute top-4 left-4 z-10 bg-obsidian/80 backdrop-blur-sm px-3 py-1.5 border border-border">
                <span className="font-mono text-xs tracking-widest text-gold uppercase">{cover.category}</span>
              </div>
            </motion.div>

            {cover.videoFiles && cover.videoFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <VideoPreview videoFiles={cover.videoFiles} />
              </motion.div>
            )}
          </div>

          {/* Right column: Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 sticky top-28"
          >
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-cream font-light leading-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                {cover.title}
              </h1>
              <p className="text-muted leading-relaxed text-sm">{cover.description}</p>
            </div>

            {!cover.sold && (
              <div className="space-y-3">
                <p className="font-mono text-xs tracking-widest text-muted uppercase">Pricing Options</p>
                <div className="border border-border p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-8 bg-muted/30" />
                      <div>
                        <p className="font-mono text-xs tracking-widest text-cream uppercase">Image Only</p>
                        <p className="text-muted text-xs">Full resolution, clean file</p>
                      </div>
                    </div>
                    <span className="font-mono text-xl text-cream">{formatPrice(cover.priceImage)}</span>
                  </div>
                  {cover.videoCount > 0 && (
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-8 bg-gold" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-xs tracking-widest text-gold uppercase">
                              Image + {cover.videoCount} Video{cover.videoCount > 1 ? 's' : ''}
                            </p>
                            <span className="font-mono text-xs bg-gold text-obsidian px-1.5 py-0.5">BEST</span>
                          </div>
                          <p className="text-muted text-xs">Cover + animated motion content</p>
                        </div>
                      </div>
                      <span className="font-mono text-xl text-gold">{formatPrice(cover.priceWithVideos)}</span>
                    </div>
                  )}
                </div>
                {cover.videoCount > 0 && (
                  <div className="flex items-start gap-2 p-3 bg-obsidian-3 border border-border/40">
                    <Clock size={13} className="text-gold shrink-0 mt-0.5" />
                    <p className="text-muted text-xs leading-relaxed">
                      Bought the image only? You have <span className="text-cream">3 months</span> to add the video bundle for a small fee from your profile.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              {[
                'Full-resolution watermark-free file',
                'View & download anytime from your profile',
                cover.videoCount > 0 ? `${cover.videoCount} animated ~6s video${cover.videoCount > 1 ? 's' : ''} (with bundle)` : null,
                'Exclusive single-owner purchase',
              ].filter(Boolean).map((item) => (
                <div key={item as string} className="flex items-center gap-2">
                  <Check size={13} className="text-gold shrink-0" />
                  <span className="text-muted text-xs">{item}</span>
                </div>
              ))}
            </div>

            {cover.sold ? (
              <div className="p-4 border border-sold/40 text-center">
                <p className="font-mono text-xs tracking-widest text-sold uppercase mb-1">This piece has been claimed</p>
                <p className="text-muted text-xs">Browse our other available originals below.</p>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setModalOpen(true)}
                  style={{ pointerEvents: 'auto', cursor: 'none' }}
                  className="flex-1 py-4 bg-gold text-obsidian font-mono text-xs tracking-widest uppercase hover:bg-gold-light transition-colors"
                >
                  Purchase This Piece
                </button>
                <button
                  onClick={() => setSaved(!saved)}
                  style={{ pointerEvents: 'auto', cursor: 'none' }}
                  className={`px-4 py-4 border transition-colors ${saved ? 'border-gold bg-gold/10 text-gold' : 'border-border text-muted hover:border-cream hover:text-cream'}`}
                >
                  <Heart size={16} fill={saved ? 'currentColor' : 'none'} />
                </button>
              </div>
            )}

            <p className="font-mono text-xs text-muted/40 tracking-widest text-center">
              ALL IMAGES PROTECTED · GG WATERMARK · EXCLUSIVE OWNERSHIP
            </p>
          </motion.div>
        </div>
      </div>

      {/* More originals */}
      <div className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="border-t border-border pt-16">
          <p className="font-mono text-xs tracking-[0.4em] text-gold uppercase mb-8">More Originals</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {covers
              .filter((c) => c.id !== cover.id && !c.sold)
              .slice(0, 4)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/cover/${c.slug}`}
                  className="group relative aspect-square overflow-hidden bg-obsidian-3 block"
                  style={{ pointerEvents: 'auto', cursor: 'none' }}
                >
                  <div
                    className="absolute inset-0 cover-bg transition-transform duration-500 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(/covers/${c.imageFile})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <WatermarkOverlay />
                  <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/40 transition-colors duration-300 z-10 flex items-end p-3">
                    <p className="font-display text-sm text-cream opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: 'var(--font-display)' }}>
                      {c.title}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      <Footer />

      {modalOpen && (
        <PurchaseModal
          cover={cover}
          onClose={() => setModalOpen(false)}
          isLoggedIn={isLoggedIn}
        />
      )}
    </>
  )
}
