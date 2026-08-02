'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push(redirect)
    }
    setLoading(false)
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleLogin}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label className="font-mono text-xs tracking-widest text-muted uppercase">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-obsidian-3 border border-border px-4 py-3 text-cream text-sm focus:outline-none focus:border-gold transition-colors font-sans"
          style={{ pointerEvents: 'auto', cursor: 'text' }}
          placeholder="your@email.com"
        />
      </div>
      <div className="space-y-2">
        <label className="font-mono text-xs tracking-widest text-muted uppercase">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-obsidian-3 border border-border px-4 py-3 text-cream text-sm focus:outline-none focus:border-gold transition-colors font-sans"
          style={{ pointerEvents: 'auto', cursor: 'text' }}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="font-mono text-xs text-sold tracking-wide">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{ pointerEvents: 'auto', cursor: 'none' }}
        className="w-full py-4 bg-gold text-obsidian font-mono text-xs tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
      >
        {loading ? 'Signing In…' : 'Sign In'}
      </button>

      <p className="text-center text-muted text-xs">
        No account?{' '}
        <Link
          href={`/auth/register?redirect=${redirect}`}
          className="text-gold hover:text-gold-light underline"
          style={{ pointerEvents: 'auto', cursor: 'none' }}
        >
          Create one
        </Link>
      </p>
    </motion.form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-md space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6"
            style={{ pointerEvents: 'auto', cursor: 'none' }}
          >
            <div className="w-7 h-7 border border-gold flex items-center justify-center">
              <span className="font-mono text-xs font-bold text-gold">GG</span>
            </div>
          </Link>
          <h1
            className="font-display text-4xl text-cream"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Welcome Back
          </h1>
          <p className="text-muted text-sm">Sign in to your Genius Graphics account</p>
        </motion.div>

        <Suspense fallback={<div className="text-muted text-sm text-center">Loading…</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
