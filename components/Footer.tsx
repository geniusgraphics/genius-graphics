'use client'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function EmailCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      await supabase.from('newsletter_subscribers').insert({ email: email.trim() })
      setStatus('done')
    } catch {
      setStatus('done') // silent — don't expose DB errors
    }
  }

  if (status === 'done') {
    return (
      <p className="font-mono text-xs tracking-widest text-gold uppercase">
        ✓ You&apos;re on the list.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-0 w-full max-w-xs">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 bg-transparent border border-border px-3 py-2.5 font-mono text-xs text-cream placeholder:text-muted/40 tracking-widest focus:outline-none focus:border-gold/60 transition-colors min-w-0"
        style={{ cursor: 'text' }}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-4 py-2.5 bg-gold text-obsidian font-mono text-[10px] tracking-widest uppercase hover:bg-gold-light transition-colors shrink-0 disabled:opacity-60"
        style={{ pointerEvents: 'auto', cursor: 'none' }}
      >
        {status === 'loading' ? '…' : 'Notify'}
      </button>
    </form>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-border mt-32 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Brand */}
          <div className="space-y-4 max-w-xs">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 border border-gold flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-gold">GG</span>
              </div>
              <span className="font-display text-base tracking-[0.2em] text-cream uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                Genius Graphics
              </span>
            </div>
            <p className="text-muted text-sm leading-relaxed font-sans">
              Not a template. Not stock. Original cover art sold once — to you, forever.
            </p>

            {/* Social */}
            <div className="flex items-center gap-4 pt-1">
              <a
                href="https://instagram.com/geniusgraphics"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] tracking-widest text-muted/60 hover:text-gold transition-colors uppercase flex items-center gap-2"
                style={{ pointerEvents: 'auto', cursor: 'none' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
                Instagram
              </a>
              <a
                href="mailto:geniusgraphics.info@gmail.com"
                className="font-mono text-[10px] tracking-widest text-muted/60 hover:text-gold transition-colors uppercase"
                style={{ pointerEvents: 'auto', cursor: 'none' }}
              >
                Contact
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-12 md:gap-16">
            <div className="space-y-4">
              <h4 className="font-mono text-xs tracking-widest uppercase text-gold">Collection</h4>
              <nav className="flex flex-col gap-2">
                {['Cars', 'Portraits', 'Nature', 'Abstract'].map((cat) => (
                  <Link
                    key={cat}
                    href={`/?category=${cat}`}
                    className="text-muted hover:text-cream transition-colors text-sm font-sans"
                    style={{ pointerEvents: 'auto', cursor: 'none' }}
                  >
                    {cat}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-mono text-xs tracking-widest uppercase text-gold">Account</h4>
              <nav className="flex flex-col gap-2">
                {[
                  { label: 'Sign In', href: '/auth/login' },
                  { label: 'Register', href: '/auth/register' },
                  { label: 'My Profile', href: '/profile' },
                ].map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-muted hover:text-cream transition-colors text-sm font-sans"
                    style={{ pointerEvents: 'auto', cursor: 'none' }}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Email capture */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs tracking-widest uppercase text-gold">New Drops</h4>
            <p className="text-muted text-xs max-w-[200px] leading-relaxed">
              Be the first to see new covers. One email per drop.
            </p>
            <EmailCapture />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted/60 text-xs font-mono tracking-widest">
            © {new Date().getFullYear()} GENIUS GRAPHICS. ALL RIGHTS RESERVED.
          </p>
          <p className="text-muted/40 text-xs font-mono">
            ALL IMAGES ARE PROTECTED · WATERMARKED · GG
          </p>
        </div>
      </div>
    </footer>
  )
}
