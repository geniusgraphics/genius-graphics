import Hero from '@/components/Hero'
import Gallery from '@/components/Gallery'
import Footer from '@/components/Footer'
import { covers, getFeaturedCovers } from '@/lib/covers-data'

export default function HomePage() {
  const featured = getFeaturedCovers().slice(0, 3)

  return (
    <>
      <Hero featured={featured} />

      <Gallery covers={covers} />

      {/* About section */}
      <section id="about" className="py-32 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <p className="font-mono text-xs tracking-[0.4em] text-gold uppercase mb-3">About</p>
            <h2
              className="font-display text-5xl md:text-6xl font-light text-cream leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Art That Works as Hard as Your Music
            </h2>
          </div>
          <div className="space-y-5 text-muted leading-relaxed text-sm">
            <p>
              Every cover in our collection is a standalone original — crafted with intention, priced for artists, and sold to a single owner. When it&apos;s gone, it&apos;s gone.
            </p>
            <p>
              Each piece comes with the option to add short-form motion content — giving your release the full visual identity it deserves across streaming platforms and social media.
            </p>
            <p>
              We protect our work and we protect yours. Every image is watermarked until purchase. After you buy, you receive the clean, full-resolution file — ready for immediate use.
            </p>
            <div className="pt-4 border-t border-border">
              <p className="font-mono text-xs tracking-widest text-muted/60 uppercase">
                Questions? Contact us at{' '}
                <a
                  href="mailto:hello@geniusgraphics.art"
                  className="text-gold hover:text-gold-light underline transition-colors"
                  style={{ pointerEvents: 'auto', cursor: 'none' }}
                >
                  hello@geniusgraphics.art
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee strip */}
      <div className="overflow-hidden border-y border-border py-4 bg-obsidian-2">
        <div
          className="flex gap-0 whitespace-nowrap"
          style={{
            animation: 'marqueeScroll 22s linear infinite',
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="font-mono text-xs tracking-[0.4em] text-muted/40 uppercase inline-flex items-center gap-8 pr-8">
              One Owner <span className="text-gold/30">·</span> Original Art <span className="text-gold/30">·</span> GG Protected <span className="text-gold/30">·</span> Genius Graphics <span className="text-gold/30">·</span>
            </span>
          ))}
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </>
  )
}
