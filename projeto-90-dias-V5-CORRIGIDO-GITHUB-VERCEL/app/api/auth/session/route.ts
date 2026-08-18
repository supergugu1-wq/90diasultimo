import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { signAdminSession } from '@/lib/session'
import { logSecurityEvent } from '@/lib/security'

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a); const bb = Buffer.from(b)
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb)
}

export async function POST(req: NextRequest) {
  const { username = '', secret = '' } = await req.json().catch(() => ({}))
  const expectedUser = process.env.ADMIN_USERNAME || ''
  const expectedSecret = process.env.ADMIN_SECRET || ''
  if (!expectedUser || !expectedSecret || !process.env.SESSION_SECRET) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  const ok = safeEqual(String(username), expectedUser) && safeEqual(String(secret), expectedSecret)
  if (!ok) {
    await logSecurityEvent({ eventType: 'admin_login_failed', ip: req.headers.get('x-forwarded-for'), userAgent: req.headers.get('user-agent') })
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const expiresAt = Date.now() + 4 * 60 * 60 * 1000
  const token = signAdminSession(expectedUser, expiresAt)
  const res = NextResponse.json({ ok: true })
  res.cookies.set('p90_admin', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 60 * 60 * 4, path: '/' })
  await logSecurityEvent({ eventType: 'admin_login_success', ip: req.headers.get('x-forwarded-for'), userAgent: req.headers.get('user-agent') })
  return res
}
