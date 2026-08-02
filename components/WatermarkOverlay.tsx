// Tiled GG watermark rendered as a transparent SVG pattern overlay.
// Applied over every cover image — full-res stays visible, but the mark
// makes any screenshot unusable as sellable art.
export default function WatermarkOverlay() {
  // Encode a small SVG with rotated "GG" text as a repeating tile.
  const svgMark = `
    <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>
      <text
        x='60' y='64'
        font-family='monospace'
        font-weight='700'
        font-size='22'
        fill='white'
        fill-opacity='0.13'
        text-anchor='middle'
        transform='rotate(-35, 60, 60)'
        letter-spacing='2'
      >GG</text>
    </svg>
  `.trim()

  const encoded = `data:image/svg+xml;utf8,${encodeURIComponent(svgMark)}`

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        backgroundImage: `url("${encoded}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '120px 120px',
        mixBlendMode: 'overlay',
      }}
    />
  )
}
