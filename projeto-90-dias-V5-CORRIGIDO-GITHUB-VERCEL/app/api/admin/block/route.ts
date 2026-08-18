import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSession } from '@/lib/session'
import { setCustomerAccess } from '@/lib/access'
import { adminSupabase } from '@/lib/supabase-server'
import { logSecurityEvent, normalizeEmail } from '@/lib/security'
export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req.cookies.get('p90_admin')?.value)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { email, active, reason } = await req.json().catch(() => ({}))
  if (!email || typeof active !== 'boolean') return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const normalized = normalizeEmail(email)
  await setCustomerAccess(normalized, active, active ? 'admin:reactivated' : `admin:${reason || 'manual_block'}`)
  const supabase = adminSupabase()
  if (!active) await supabase.from('device_sessions').update({ revoked_at: new Date().toISOString() }).eq('email', normalized).is('revoked_at', null)
  await logSecurityEvent({ email: normalized, eventType: active ? 'admin_access_enabled' : 'admin_access_blocked', metadata: { reason: reason || null } })
  return NextResponse.json({ ok: true })
}
