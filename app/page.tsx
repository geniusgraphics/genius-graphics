import Hero from '@/components/Hero'
import Gallery from '@/components/Gallery'
import Footer from '@/components/Footer'
import { covers, getFeaturedCovers } from '@/lib/covers-data'
import AnimatedAbout from '@/components/AnimatedAbout'

export default function HomePage() {
  const featured = getFeaturedCovers().slice(0, 3)

  return (
    <>
      <Hero featured={featured} />

      <Gallery covers={covers} />

      <AnimatedAbout />

      {/* Dual marquee strip */}
      <div className="overflow-hidden border-y border-border bg-obsidian-2 py-0">
        {/* Row 1 — left to right */}
        <div className="py-3 flex gap-0 whitespace-nowrap border-b border-border/40" style={{ animation: 'marqueeLeft 24s linear infinite' }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="font-mono text-[10px] tracking-[0.4em] text-muted/35 uppercase inline-flex items-center gap-8 pr-8">
              One Owner <span className="text-gold/25">◆</span> Original Art <span className="text-gold/25">◆</span> GG Protected <span className="text-gold/25">◆</span> Genius Graphics <span className="text-gold/25">◆</span>
            </span>
          ))}
        </div>
        {/* Row 2 — right to left, gold accent */}
        <div className="py-3 flex gap-0 whitespace-nowrap" style={{ animation: 'marqueeRight 20s linear infinite' }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="font-mono text-[10px] tracking-[0.4em] text-gold/20 uppercase inline-flex items-center gap-8 pr-8">
              Premium Cover Art <span className="text-cream/15">◆</span> Exclusive Rights <span className="text-cream/15">◆</span> Est. 2025 <span className="text-cream/15">◆</span> Music Visuals <span className="text-cream/15">◆</span>
            </span>
          ))}
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes marqueeLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}
