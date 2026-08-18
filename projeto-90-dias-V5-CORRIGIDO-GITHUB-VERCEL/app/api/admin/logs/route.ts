import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/session'
import { adminSupabase } from '@/lib/supabase-server'
export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req.cookies.get('p90_admin')?.value)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = adminSupabase()
  const { data, error } = await supabase.from('security_events').select('email,event_type,user_agent,metadata,created_at').order('created_at', { ascending: false }).limit(100)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ logs: data || [] })
}
