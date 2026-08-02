import { notFound } from 'next/navigation'
import { getCoverBySlug, covers } from '@/lib/covers-data'
import CoverDetail from './CoverDetail'

export function generateStaticParams() {
  return covers.map((c) => ({ slug: c.slug }))
}

export default async function CoverPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cover = getCoverBySlug(slug)
  if (!cover) notFound()
  return <CoverDetail cover={cover} />
}
