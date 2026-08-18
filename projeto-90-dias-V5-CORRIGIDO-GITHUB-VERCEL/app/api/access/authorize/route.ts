import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import { logSecurityEvent, validateBearerUser, hashValue } from '@/lib/security'

export async function POST(req: NextRequest) {
  const auth = await validateBearerUser(req.headers.get('authorization'))
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const { deviceId, deviceName } = await req.json().catch(() => ({}))
  if (!deviceId || String(deviceId).length < 12) return NextResponse.json({ error: 'Invalid deviceId' }, { status: 400 })
  const supabase = adminSupabase()
  const { data: access } = await supabase.from('customer_access').select('active, blocked_reason').eq('email', auth.email).maybeSingle()
  if (!access?.active) {
    await logSecurityEvent({ email: auth.email, eventType: 'access_denied', ip: req.headers.get('x-forwarded-for'), metadata: { reason: access?.blocked_reason || 'inactive' } })
    return NextResponse.json({ error: 'Access inactive' }, { status: 403 })
  }
  const deviceHash = hashValue(String(deviceId))
  const { data: existing } = await supabase.from('device_sessions').select('id, revoked_at').eq('email', auth.email).eq('device_hash', deviceHash).maybeSingle()
  if (existing && !existing.revoked_at) {
    await supabase.from('device_sessions').update({ last_seen_at: new Date().toISOString() }).eq('id', existing.id)
    return NextResponse.json({ ok: true, deviceRegistered: true })
  }
  const { count } = await supabase.from('device_sessions').select('*', { count: 'exact', head: true }).eq('email', auth.email).is('revoked_at', null)
  const limit = Number(process.env.MAX_ACTIVE_DEVICES || 2)
  if ((count || 0) >= limit) {
    await logSecurityEvent({ email: auth.email, eventType: 'device_limit_exceeded', ip: req.headers.get('x-forwarded-for'), metadata: { limit } })
    return NextResponse.json({ error: 'Device limit reached', limit }, { status: 403 })
  }
  await supabase.from('device_sessions').upsert({ email: auth.email, device_hash: deviceHash, device_name: String(deviceName || 'Dispositivo'), last_seen_at: new Date().toISOString(), revoked_at: null }, { onConflict: 'email,device_hash' })
  await logSecurityEvent({ email: auth.email, eventType: 'device_registered', ip: req.headers.get('x-forwarded-for'), userAgent: req.headers.get('user-agent') })
  return NextResponse.json({ ok: true, deviceRegistered: true })
}
