import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminDashboard from './AdminDashboard'

const ADMIN_EMAIL = 'geniusgraphics.info@gmail.com'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/admin')
  }

  if (user.email !== ADMIN_EMAIL) {
    redirect('/')
  }

  return <AdminDashboard />
}
