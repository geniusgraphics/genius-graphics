'use client'
import { useRef, useState } from 'react'
import { Play, Lock } from 'lucide-react'
import WatermarkOverlay from './WatermarkOverlay'

interface VideoPreviewProps {
  videoFiles: string[]
  isPurchased?: boolean
}

export default function VideoPreview({ videoFiles, isPurchased = false }: VideoPreviewProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  if (!videoFiles || videoFiles.length === 0) return null

  return (
    <div className="space-y-4">
      <p className="font-mono text-xs tracking-[0.4em] text-gold uppercase">
        Motion Content · {videoFiles.length} Clip{videoFiles.length > 1 ? 's' : ''}
      </p>

      {/* Main video player */}
      <div
        className="relative aspect-square overflow-hidden bg-obsidian-3"
        onContextMenu={(e) => e.preventDefault()}
      >
        <video
          ref={videoRef}
          key={videoFiles[activeIndex]}
          src={`/videos/${videoFiles[activeIndex]}`}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ pointerEvents: 'none' }}
        />

        {!isPurchased && <WatermarkOverlay />}

        {!isPurchased && (
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-obsidian/90 to-transparent p-4">
            <div className="flex items-center gap-2">
              <Lock size={11} className="text-gold" />
              <span className="font-mono text-xs tracking-widest text-gold/80 uppercase">
                Full quality unlocked after purchase
              </span>
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3 z-20">
          <div className="bg-obsidian/70 backdrop-blur-sm px-2 py-1 flex items-center gap-1.5">
            <Play size={9} className="text-gold fill-gold" />
            <span className="font-mono text-xs text-gold">MOTION</span>
          </div>
        </div>
      </div>

      {/* Thumbnail strip for multiple videos */}
      {videoFiles.length > 1 && (
        <div className="flex gap-2">
          {videoFiles.map((file, i) => (
            <button
              key={file}
              onClick={() => setActiveIndex(i)}
              style={{ pointerEvents: 'auto', cursor: 'none' }}
              className={`relative flex-1 aspect-square overflow-hidden border transition-colors ${
                activeIndex === i ? 'border-gold' : 'border-border hover:border-cream/40'
              }`}
            >
              <video
                src={`/videos/${file}`}
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ pointerEvents: 'none' }}
              />
              <div className={`absolute inset-0 transition-colors ${activeIndex === i ? 'bg-transparent' : 'bg-obsidian/50'}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
