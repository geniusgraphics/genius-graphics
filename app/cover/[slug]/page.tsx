import { notFound } from 'next/navigation'
import { getCoverBySlug, covers } from '@/lib/covers-data'
import { createClient } from '@/lib/supabase/server'
import CoverDetail from './CoverDetail'

export function generateStaticParams() {
  return covers.map((c) => ({ slug: c.slug }))
}

export const dynamic = 'force-dynamic'

export default async function CoverPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cover = getCoverBySlug(slug)
  if (!cover) notFound()

  // Merge any admin overrides from Supabase
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('cover_overrides')
      .select('*')
      .eq('cover_id', cover.id)
      .maybeSingle()
    if (data) {
      const merged = {
        ...cover,
        sold: data.sold ?? cover.sold,
        priceImage: data.price_image ?? cover.priceImage,
        priceWithVideos: data.price_with_videos ?? cover.priceWithVideos,
        description: data.description ?? cover.description,
      }
      return <CoverDetail cover={merged} />
    }
  } catch {
    // table not created yet — fall through to static data
  }

  return <CoverDetail cover={cover} />
}
