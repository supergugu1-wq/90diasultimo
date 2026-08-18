import { redirect } from 'next/navigation'
import Dashboard from '@/components/Dashboard'
import AccessGuard from '@/components/security/AccessGuard'
import { authSupabase } from '@/lib/supabase-auth-server'
import { adminSupabase } from '@/lib/supabase-server'

export default async function Page({ searchParams }: { searchParams: { mode?: string } }) {
  const auth = authSupabase()
  const { data } = await auth.auth.getUser()
  const email = data.user?.email?.trim().toLowerCase()
  if (!email) redirect('/login')
  const admin = adminSupabase()
  const { data: access } = await admin.from('customer_access').select('active').eq('email', email).maybeSingle()
  if (!access?.active) redirect('/login?blocked=1')
  return <AccessGuard><Dashboard initialMode={searchParams?.mode} /></AccessGuard>
}
