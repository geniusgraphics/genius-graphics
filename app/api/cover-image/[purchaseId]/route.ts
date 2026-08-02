import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Returns a short-lived signed image URL for displaying the clean cover
// (no watermark) inside the authenticated user's profile page.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  const { purchaseId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: purchase, error } = await supabase
    .from('purchases')
    .select('*, covers(image_file)')
    .eq('id', purchaseId)
    .eq('user_id', user.id)
    .single()

  if (error || !purchase) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const filePath = `${purchase.cover_id}/${purchase.covers.image_file}`
  const { data: signed } = await supabase.storage
    .from('originals')
    .createSignedUrl(filePath, 600) // 10-min URL for inline display

  if (!signed) return NextResponse.json({ error: 'File unavailable' }, { status: 404 })

  return NextResponse.json({ url: signed.signedUrl })
}
