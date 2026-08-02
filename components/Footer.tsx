import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-32 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 border border-gold flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-gold">GG</span>
              </div>
              <span className="font-display text-base tracking-[0.2em] text-cream uppercase" style={{ fontFamily: 'var(--font-display)' }}>
                Genius Graphics
              </span>
            </div>
            <p className="text-muted text-sm max-w-xs leading-relaxed font-sans">
              Premium cover art. Each piece is sold once — making every purchase exclusive to you.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
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
