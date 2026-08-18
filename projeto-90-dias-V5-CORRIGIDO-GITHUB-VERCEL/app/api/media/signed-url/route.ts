import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase-server'
import { validateBearerUser, hashValue, logSecurityEvent } from '@/lib/security'

export async function POST(req: NextRequest) {
  const auth = await validateBearerUser(req.headers.get('authorization'))
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const { path, deviceId } = await req.json().catch(() => ({}))
  if (!path || !deviceId || String(path).includes('..')) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const supabase = adminSupabase()
  const { data: access } = await supabase.from('customer_access').select('active').eq('email', auth.email).maybeSingle()
  if (!access?.active) return NextResponse.json({ error: 'Access inactive' }, { status: 403 })
  const { data: device } = await supabase.from('device_sessions').select('id').eq('email', auth.email).eq('device_hash', hashValue(String(deviceId))).is('revoked_at', null).maybeSingle()
  if (!device) return NextResponse.json({ error: 'Unauthorized device' }, { status: 403 })
  const bucket = process.env.PREMIUM_MEDIA_BUCKET || 'premium-media'
  const expires = Math.min(Math.max(Number(process.env.SIGNED_URL_TTL_SECONDS || 180), 60), 900)
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(String(path), expires)
  if (error || !data?.signedUrl) return NextResponse.json({ error: 'Media unavailable' }, { status: 404 })
  await logSecurityEvent({ email: auth.email, eventType: 'media_url_issued', metadata: { path, expires } })
  return NextResponse.json({ url: data.signedUrl, expiresIn: expires })
}
