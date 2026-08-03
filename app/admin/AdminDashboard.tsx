'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { covers } from '@/lib/covers-data'
import type { Cover } from '@/types'

const TABS = ['Covers', 'Subscribers', 'Orders'] as const
type Tab = typeof TABS[number]

interface CoverState {
  sold: boolean
  priceImage: number
  priceWithVideos: number
  description: string
}

type OverridesMap = Record<string, CoverState>

export default function AdminDashboard() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<Tab>('Covers')
  const [overrides, setOverrides] = useState<OverridesMap>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<Partial<CoverState>>({})
  const [subscribers, setSubscribers] = useState<{ email: string; created_at: string }[]>([])
  const [orders, setOrders] = useState<{ id: string; user_id: string; cover_id: string; format: string; amount: number; created_at: string }[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoadingData(true)
    try {
      const [ovRes, subRes, ordRes] = await Promise.all([
        supabase.from('cover_overrides').select('*'),
        supabase.from('newsletter_subscribers').select('email, created_at').order('created_at', { ascending: false }),
        supabase.from('purchases').select('*').order('created_at', { ascending: false }),
      ])
      if (ovRes.data) {
        const map: OverridesMap = {}
        for (const row of ovRes.data) {
          map[row.cover_id] = {
            sold: row.sold,
            priceImage: row.price_image,
            priceWithVideos: row.price_with_videos,
            description: row.description,
          }
        }
        setOverrides(map)
      }
      if (subRes.data) setSubscribers(subRes.data)
      if (ordRes.data) setOrders(ordRes.data)
    } catch {
      // tables may not exist yet — degrade gracefully
    }
    setLoadingData(false)
  }

  function getCover(cover: Cover): CoverState {
    const ov = overrides[cover.id]
    return {
      sold: ov?.sold ?? cover.sold,
      priceImage: ov?.priceImage ?? cover.priceImage,
      priceWithVideos: ov?.priceWithVideos ?? cover.priceWithVideos,
      description: ov?.description ?? cover.description,
    }
  }

  async function toggleSold(cover: Cover) {
    const current = getCover(cover)
    const newSold = !current.sold
    setSaving(cover.id)
    await upsertOverride(cover, { sold: newSold })
    setOverrides(prev => ({ ...prev, [cover.id]: { ...current, sold: newSold } }))
    setSaving(null)
  }

  async function saveEdit(cover: Cover) {
    setSaving(cover.id)
    const current = getCover(cover)
    const updated = { ...current, ...editDraft }
    await upsertOverride(cover, updated)
    setOverrides(prev => ({ ...prev, [cover.id]: updated }))
    setSaving(null)
    setEditing(null)
  }

  async function upsertOverride(cover: Cover, patch: Partial<CoverState>) {
    const current = getCover(cover)
    const row = {
      cover_id: cover.id,
      sold: patch.sold ?? current.sold,
      price_image: patch.priceImage ?? current.priceImage,
      price_with_videos: patch.priceWithVideos ?? current.priceWithVideos,
      description: patch.description ?? current.description,
    }
    await supabase.from('cover_overrides').upsert(row, { onConflict: 'cover_id' })
  }

  function startEdit(cover: Cover) {
    const state = getCover(cover)
    setEditDraft({ ...state })
    setEditing(cover.id)
  }

  const soldCount = covers.filter(c => getCover(c).sold).length
  const availableCount = covers.length - soldCount

  return (
    <div className="min-h-screen bg-obsidian text-cream" style={{ cursor: 'default' }}>
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-mono text-xs tracking-widest text-muted hover:text-cream transition-colors uppercase">
            ← Site
          </Link>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border border-gold flex items-center justify-center">
              <span className="font-mono text-[10px] font-bold text-gold">GG</span>
            </div>
            <span className="font-mono text-xs tracking-[0.3em] text-cream uppercase">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-mono text-[10px] tracking-widest text-muted">
            {availableCount} available · {soldCount} sold
          </span>
          <span className="font-mono text-[10px] tracking-widest text-gold/60">
            geniusgraphics.info@gmail.com
          </span>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border px-6">
        <div className="flex gap-0">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 font-mono text-xs tracking-widest uppercase border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-gold text-cream'
                  : 'border-transparent text-muted hover:text-cream'
              }`}
            >
              {tab}
              {tab === 'Subscribers' && subscribers.length > 0 && (
                <span className="ml-2 text-gold">({subscribers.length})</span>
              )}
              {tab === 'Orders' && orders.length > 0 && (
                <span className="ml-2 text-gold">({orders.length})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loadingData ? (
          <div className="flex items-center justify-center py-24">
            <span className="font-mono text-xs tracking-widest text-muted animate-pulse uppercase">Loading…</span>
          </div>
        ) : (
          <>
            {activeTab === 'Covers' && (
              <CoversTab
                covers={covers}
                getCover={getCover}
                editing={editing}
                editDraft={editDraft}
                saving={saving}
                onToggleSold={toggleSold}
                onStartEdit={startEdit}
                onCancelEdit={() => setEditing(null)}
                onSaveEdit={saveEdit}
                onDraftChange={d => setEditDraft(prev => ({ ...prev, ...d }))}
              />
            )}
            {activeTab === 'Subscribers' && (
              <SubscribersTab subscribers={subscribers} />
            )}
            {activeTab === 'Orders' && (
              <OrdersTab orders={orders} />
            )}
          </>
        )}
      </main>
    </div>
  )
}

function CoversTab({
  covers,
  getCover,
  editing,
  editDraft,
  saving,
  onToggleSold,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDraftChange,
}: {
  covers: Cover[]
  getCover: (c: Cover) => CoverState
  editing: string | null
  editDraft: Partial<CoverState>
  saving: string | null
  onToggleSold: (c: Cover) => void
  onStartEdit: (c: Cover) => void
  onCancelEdit: () => void
  onSaveEdit: (c: Cover) => void
  onDraftChange: (d: Partial<CoverState>) => void
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[80px_1fr_100px_80px_80px_120px_100px] gap-4 px-4 py-2 font-mono text-[10px] tracking-widest text-muted uppercase border-b border-border mb-2">
        <span>Image</span>
        <span>Cover</span>
        <span>Category</span>
        <span>£ Image</span>
        <span>£ +Video</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      {covers.map(cover => {
        const state = getCover(cover)
        const isEditing = editing === cover.id
        const isSaving = saving === cover.id

        return (
          <motion.div
            key={cover.id}
            layout
            className={`border transition-colors ${state.sold ? 'border-border/40 bg-white/[0.01]' : 'border-border'}`}
          >
            {isEditing ? (
              /* Edit mode */
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={`/covers/${cover.imageFile}`}
                    alt={cover.title}
                    className="w-16 h-16 object-cover border border-border"
                  />
                  <div>
                    <p className="font-display text-lg text-cream" style={{ fontFamily: 'var(--font-display)' }}>{cover.title}</p>
                    <p className="font-mono text-xs text-muted">{cover.category} · {cover.id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] tracking-widest text-gold uppercase">Price — Image Only (£)</label>
                    <input
                      type="number"
                      value={editDraft.priceImage ?? state.priceImage}
                      onChange={e => onDraftChange({ priceImage: Number(e.target.value) })}
                      className="w-full bg-transparent border border-border px-3 py-2 font-mono text-sm text-cream focus:outline-none focus:border-gold/60"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-[10px] tracking-widest text-gold uppercase">Price — With Videos (£)</label>
                    <input
                      type="number"
                      value={editDraft.priceWithVideos ?? state.priceWithVideos}
                      onChange={e => onDraftChange({ priceWithVideos: Number(e.target.value) })}
                      className="w-full bg-transparent border border-border px-3 py-2 font-mono text-sm text-cream focus:outline-none focus:border-gold/60"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-[10px] tracking-widest text-gold uppercase">Description</label>
                  <textarea
                    value={editDraft.description ?? state.description}
                    onChange={e => onDraftChange({ description: e.target.value })}
                    rows={3}
                    className="w-full bg-transparent border border-border px-3 py-2 font-mono text-sm text-cream focus:outline-none focus:border-gold/60 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => onSaveEdit(cover)}
                    disabled={isSaving}
                    className="px-5 py-2 bg-gold text-obsidian font-mono text-xs tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={onCancelEdit}
                    className="px-5 py-2 border border-border text-muted font-mono text-xs tracking-widest uppercase hover:text-cream transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Row mode */
              <div className="grid grid-cols-[80px_1fr_100px_80px_80px_120px_100px] gap-4 px-4 py-3 items-center">
                <div className="relative">
                  <img
                    src={`/covers/${cover.imageFile}`}
                    alt={cover.title}
                    className={`w-14 h-14 object-cover border border-border/60 ${state.sold ? 'opacity-40' : ''}`}
                  />
                  {cover.isNew && (
                    <span className="absolute -top-1 -right-1 bg-gold text-obsidian font-mono text-[8px] px-1">NEW</span>
                  )}
                </div>
                <div>
                  <p className={`font-display text-sm ${state.sold ? 'text-muted/60' : 'text-cream'}`} style={{ fontFamily: 'var(--font-display)' }}>
                    {cover.title}
                  </p>
                  <p className="font-mono text-[10px] text-muted/50 mt-0.5 truncate max-w-[280px]">{state.description}</p>
                </div>
                <span className="font-mono text-[10px] tracking-widest text-muted uppercase">{cover.category}</span>
                <span className="font-mono text-sm text-cream">£{state.priceImage}</span>
                <span className="font-mono text-sm text-cream">£{state.priceWithVideos}</span>
                <div>
                  <button
                    onClick={() => onToggleSold(cover)}
                    disabled={isSaving}
                    className={`px-3 py-1.5 font-mono text-[10px] tracking-widest uppercase border transition-colors disabled:opacity-50 ${
                      state.sold
                        ? 'border-sold/40 text-sold hover:border-gold hover:text-gold'
                        : 'border-green-600/40 text-green-500 hover:border-sold hover:text-sold'
                    }`}
                  >
                    {isSaving ? '…' : state.sold ? '● Sold' : '○ Available'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onStartEdit(cover)}
                    className="px-3 py-1.5 border border-border text-muted font-mono text-[10px] tracking-widest uppercase hover:border-gold/60 hover:text-gold transition-colors"
                  >
                    Edit
                  </button>
                  <Link
                    href={`/cover/${cover.slug}`}
                    target="_blank"
                    className="px-3 py-1.5 border border-border text-muted font-mono text-[10px] tracking-widest uppercase hover:border-cream hover:text-cream transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

function SubscribersTab({ subscribers }: { subscribers: { email: string; created_at: string }[] }) {
  if (subscribers.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-mono text-xs tracking-widest text-muted uppercase">No subscribers yet</p>
      </div>
    )
  }
  return (
    <div className="space-y-0">
      <div className="grid grid-cols-[1fr_200px] gap-4 px-4 py-2 font-mono text-[10px] tracking-widest text-muted uppercase border-b border-border mb-2">
        <span>Email</span>
        <span>Signed up</span>
      </div>
      {subscribers.map((s, i) => (
        <div key={i} className="grid grid-cols-[1fr_200px] gap-4 px-4 py-3 border-b border-border/30 hover:bg-white/[0.02] transition-colors">
          <span className="font-mono text-sm text-cream">{s.email}</span>
          <span className="font-mono text-xs text-muted">{new Date(s.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
      ))}
    </div>
  )
}

function OrdersTab({ orders }: { orders: { id: string; user_id: string; cover_id: string; format: string; amount: number; created_at: string }[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-mono text-xs tracking-widest text-muted uppercase">No orders yet</p>
        <p className="font-mono text-[10px] text-muted/40 mt-2">Purchases will appear here when Stripe is connected.</p>
      </div>
    )
  }
  return (
    <div className="space-y-0">
      <div className="grid grid-cols-[180px_1fr_120px_100px_160px] gap-4 px-4 py-2 font-mono text-[10px] tracking-widest text-muted uppercase border-b border-border mb-2">
        <span>Order ID</span>
        <span>Cover</span>
        <span>Format</span>
        <span>Amount</span>
        <span>Date</span>
      </div>
      {orders.map((order) => (
        <div key={order.id} className="grid grid-cols-[180px_1fr_120px_100px_160px] gap-4 px-4 py-3 border-b border-border/30 hover:bg-white/[0.02] transition-colors">
          <span className="font-mono text-[10px] text-muted truncate">{order.id.slice(0, 16)}…</span>
          <span className="font-mono text-sm text-cream">{order.cover_id}</span>
          <span className="font-mono text-xs text-muted uppercase">{order.format}</span>
          <span className="font-mono text-sm text-gold">£{(order.amount / 100).toFixed(2)}</span>
          <span className="font-mono text-xs text-muted">{new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
      ))}
    </div>
  )
}
