import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, Space_Mono } from 'next/font/google'
import './globals.css'
import Cursor from '@/components/Cursor'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'
import Nav from '@/components/Nav'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Genius Graphics — Premium Cover Art',
  description:
    'Premium cover art for visionary artists. Each piece is sold once — exclusive, original, yours.',
  openGraph: {
    title: 'Genius Graphics',
    description: 'Premium cover art. One owner. Yours forever.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${spaceMono.variable}`}
    >
      <head>
        {/* Disable screenshot via drag prevention meta */}
        <meta name="robots" content="noindex, noimageindex" />
      </head>
      <body className="bg-obsidian text-cream antialiased overflow-x-hidden">
        <SmoothScrollProvider>
          <Cursor />
          <Nav />
          <main>{children}</main>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
