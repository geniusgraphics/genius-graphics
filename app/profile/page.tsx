'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { LogOut, Heart, Clock, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getCoverById } from '@/lib/covers-data'
import WatermarkOverlay from '@/components/WatermarkOverlay'
import { formatPrice, daysUntilDeadline } from '@/lib/utils'
import type { Cover, Purchase } from '@/types'
import Footer from '@/components/Footer'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<{ email?: string; user_metadata?: { display_name?: string } } | null>(null)
  const [purchases, setPurchases] = useState<(Purchase & { cover: Cover | undefined })[]>([])
  const [saved, setSaved] = useState<Cover[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<Cover[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      const [{ data: purchaseData }, { data: savedData }, { data: viewedData }] = await Promise.all([
        supabase.from('purchases').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('saved_covers').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('recently_viewed').select('*').eq('user_id', user.id).order('viewed_at', { ascending: false }).limit(4),
      ])

      setPurchases(
        (purchaseData ?? []).map((p: Purchase) => ({ ...p, cover: getCoverById(p.coverId) }))
      )
      setSaved((savedData ?? []).map((s: { coverId: string }) => getCoverById(s.coverId)).filter(Boolean) as Cover[])
      setRecentlyViewed((viewedData ?? []).map((v: { cover_id: string }) => getCoverById(v.cover_id)).filter(Boolean) as Cover[])
      setLoading(false)
    }
    load()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-xs tracking-widest text-muted uppercase animate-pulse">Loading…</div>
      </div>
    )
  }

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Artist'
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <>
      <div className="min-h-screen pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Header */}
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-5"
            >
              <div className="w-16 h-16 border border-gold flex items-center justify-center bg-obsidian-3">
                <span className="font-mono text-xl font-bold text-gold">{initials}</span>
              </div>
              <div>
                <h1
                  className="font-display text-3xl text-cream"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {displayName}
                </h1>
                <p className="text-muted text-xs font-mono">{user?.email}</p>
              </div>
            </motion.div>
            <button
              onClick={handleSignOut}
              style={{ pointerEvents: 'auto', cursor: 'none' }}
              className="flex items-center gap-2 text-muted hover:text-cream transition-colors font-mono text-xs tracking-widest uppercase"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <ShoppingBag size={16} />, value: purchases.length, label: 'Purchased' },
              { icon: <Heart size={16} />, value: saved.length, label: 'Saved' },
              { icon: <Clock size={16} />, value: recentlyViewed.length, label: 'Viewed Recently' },
            ].map((stat) => (
              <div key={stat.label} className="border border-border p-5 text-center">
                <div className="text-muted flex justify-center mb-2">{stat.icon}</div>
                <div
                  className="font-display text-3xl text-gold"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-muted tracking-widest uppercase mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Recently viewed */}
          {recentlyViewed.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Clock size={14} className="text-gold" />
                <h2 className="font-mono text-xs tracking-widest text-gold uppercase">Recently Viewed</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {recentlyViewed.map((cover) => (
                  <Link
                    key={cover.id}
                    href={`/cover/${cover.slug}`}
                    className="group relative aspect-square overflow-hidden block bg-obsidian-3"
                    style={{ pointerEvents: 'auto', cursor: 'none' }}
                  >
                    <div
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(/covers/${cover.imageFile})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                    <WatermarkOverlay />
                    <div className="absolute inset-x-0 bottom-0 z-10 p-3 bg-gradient-to-t from-obsidian/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="font-display text-xs text-cream" style={{ fontFamily: 'var(--font-display)' }}>
                        {cover.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Saved */}
          {saved.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Heart size={14} className="text-gold" />
                <h2 className="font-mono text-xs tracking-widest text-gold uppercase">Saved</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {saved.map((cover) => (
                  <Link
                    key={cover.id}
                    href={`/cover/${cover.slug}`}
                    className="group relative aspect-square overflow-hidden block bg-obsidian-3"
                    style={{ pointerEvents: 'auto', cursor: 'none' }}
                  >
                    <div
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(/covers/${cover.imageFile})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: cover.sold ? 'grayscale(100%)' : undefined,
                      }}
                      onContextMenu={(e) => e.preventDefault()}
                    />
                    <WatermarkOverlay />
                    {cover.sold && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <span className="font-mono text-xs text-sold border border-sold px-2 py-1 tracking-widest">SOLD</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Purchases */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag size={14} className="text-gold" />
              <h2 className="font-mono text-xs tracking-widest text-gold uppercase">My Purchases</h2>
            </div>
            {purchases.length === 0 ? (
              <div className="border border-border p-12 text-center space-y-4">
                <p className="text-muted text-sm">No purchases yet.</p>
                <Link
                  href="/#collection"
                  className="inline-block font-mono text-xs tracking-widest text-gold uppercase hover:text-gold-light transition-colors underline"
                  style={{ pointerEvents: 'auto', cursor: 'none' }}
                >
                  Browse Collection
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {purchases.map(({ cover, ...purchase }) => (
                  cover && (
                    <div key={purchase.id} className="border border-border p-5 flex items-center gap-5">
                      <div className="relative w-16 h-16 shrink-0 overflow-hidden">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `url(/covers/${cover.imageFile})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                          onContextMenu={(e) => e.preventDefault()}
                        />
                        <WatermarkOverlay />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-lg text-cream truncate" style={{ fontFamily: 'var(--font-display)' }}>
                          {cover.title}
                        </p>
                        <p className="font-mono text-xs text-muted capitalize">
                          {purchase.purchaseType === 'with_videos' ? 'Image + Videos' : 'Image Only'}
                          {' · '}
                          {formatPrice(purchase.amountPaid)}
                        </p>
                        {purchase.purchaseType === 'image_only' && purchase.videoUpgradeDeadline && (
                          <p className="font-mono text-xs text-gold mt-1">
                            Video upgrade: {daysUntilDeadline(purchase.createdAt)} days left
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <a
                          href={`/api/download/${purchase.id}`}
                          style={{ pointerEvents: 'auto', cursor: 'none' }}
                          className="font-mono text-xs tracking-widest text-gold uppercase hover:text-gold-light transition-colors"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}
