'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setMenuOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-obsidian/90 backdrop-blur-md border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3" style={{ pointerEvents: 'auto', cursor: 'none' }}>
            <div className="w-8 h-8 border border-gold flex items-center justify-center">
              <span className="font-mono text-xs font-bold text-gold tracking-wider">GG</span>
            </div>
            <span
              className="font-display text-lg tracking-[0.2em] text-cream uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Genius Graphics
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="/#collection">Collection</NavLink>
            <NavLink href="/#about">About</NavLink>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="text-muted hover:text-cream transition-colors text-sm tracking-widest uppercase font-mono"
                  style={{ pointerEvents: 'auto', cursor: 'none' }}
                >
                  <User size={16} />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-muted hover:text-cream transition-colors text-sm tracking-widest uppercase font-mono"
                  style={{ pointerEvents: 'auto', cursor: 'none' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink href="/auth/login">Sign In</NavLink>
                <Link
                  href="/auth/register"
                  className="px-5 py-2 border border-gold text-gold hover:bg-gold hover:text-obsidian transition-all duration-300 text-xs tracking-widest uppercase font-mono"
                  style={{ pointerEvents: 'auto', cursor: 'none' }}
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-cream"
            style={{ pointerEvents: 'auto', cursor: 'none' }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-obsidian/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8"
          >
            <MobileNavLink href="/#collection" onClick={() => setMenuOpen(false)}>Collection</MobileNavLink>
            <MobileNavLink href="/#about" onClick={() => setMenuOpen(false)}>About</MobileNavLink>
            {user ? (
              <>
                <MobileNavLink href="/profile" onClick={() => setMenuOpen(false)}>My Profile</MobileNavLink>
                <button
                  onClick={handleSignOut}
                  className="font-display text-3xl text-muted"
                  style={{ fontFamily: 'var(--font-display)', pointerEvents: 'auto', cursor: 'none' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <MobileNavLink href="/auth/login" onClick={() => setMenuOpen(false)}>Sign In</MobileNavLink>
                <MobileNavLink href="/auth/register" onClick={() => setMenuOpen(false)}>Register</MobileNavLink>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-muted hover:text-cream transition-colors text-xs tracking-widest uppercase font-mono relative group"
      style={{ pointerEvents: 'auto', cursor: 'none' }}
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
    </Link>
  )
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="font-display text-4xl text-cream hover:text-gold transition-colors"
      style={{ fontFamily: 'var(--font-display)', pointerEvents: 'auto', cursor: 'none' }}
    >
      {children}
    </Link>
  )
}
