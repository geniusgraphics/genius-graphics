import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Serves the clean, watermark-free file to verified buyers.
// No time limit — as long as the user is authenticated and owns the purchase,
// they can download indefinitely.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ purchaseId: string }> }
) {
  const { purchaseId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // Verify this purchase belongs to the current user
  const { data: purchase, error } = await supabase
    .from('purchases')
    .select('*, covers(image_file, title)')
    .eq('id', purchaseId)
    .eq('user_id', user.id)
    .single()

  if (error || !purchase) {
    return NextResponse.json({ error: 'Purchase not found' }, { status: 404 })
  }

  // Generate a fresh signed URL from the private 'originals' bucket.
  // Files in this bucket are named: originals/<cover_id>/<image_file>
  const filePath = `${purchase.cover_id}/${purchase.covers.image_file}`
  const { data: signed, error: signedError } = await supabase.storage
    .from('originals')
    .createSignedUrl(filePath, 3600) // 1-hour signed URL, re-generated on each request

  if (signedError || !signed) {
    return NextResponse.json({ error: 'File not available yet' }, { status: 404 })
  }

  // Redirect to the signed URL — browser handles the download
  return NextResponse.redirect(signed.signedUrl)
}
