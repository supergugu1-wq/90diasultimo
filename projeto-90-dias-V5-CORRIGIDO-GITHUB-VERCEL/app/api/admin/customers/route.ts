import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import { verifyAdminSession } from '@/lib/session'
export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req.cookies.get('p90_admin')?.value)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const q = req.nextUrl.searchParams.get('q')?.trim().toLowerCase() || ''
  const supabase = adminSupabase()
  let query = supabase.from('customer_access').select('email,active,source,blocked_reason,updated_at,created_at').order('updated_at', { ascending: false }).limit(200)
  if (q) query = query.ilike('email', `%${q}%`)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ customers: data || [] })
}
