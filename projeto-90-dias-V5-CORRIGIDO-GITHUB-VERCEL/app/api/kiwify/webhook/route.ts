import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { setCustomerAccess } from '@/lib/access'
import { logSecurityEvent, normalizeEmail } from '@/lib/security'
import { adminSupabase } from '@/lib/supabase-server'

function timingSafeEqual(a: string, b: string) {
  const aa = Buffer.from(a); const bb = Buffer.from(b)
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb)
}

export async function POST(req: NextRequest) {
  const secret = process.env.KIWIFY_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  const provided = req.headers.get('x-webhook-secret') || req.nextUrl.searchParams.get('secret') || ''
  if (!provided || !timingSafeEqual(provided, secret)) {
    await logSecurityEvent({ eventType: 'kiwify_webhook_rejected', ip: req.headers.get('x-forwarded-for') })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  const email = body?.Customer?.email || body?.customer?.email || body?.email
  const raw = body?.order_status || body?.status || body?.event || body?.webhook_event_type || ''
  const status = String(raw).toLowerCase()
  if (!email) return NextResponse.json({ error: 'Customer email not found' }, { status: 422 })

  const activeEvents = ['paid','approved','compra aprovada','order_approved','subscription_renewed']
  const blockedEvents = ['refunded','refund','chargeback','canceled','cancelled','subscription_canceled','reembolso','subscription_late','overdue']
  const active = activeEvents.some(x => status.includes(x)) ? true : blockedEvents.some(x => status.includes(x)) ? false : null
  if (active === null) {
    await logSecurityEvent({ email, eventType: 'kiwify_event_ignored', metadata: { status } })
    return NextResponse.json({ ok: true, ignored: true })
  }
  await setCustomerAccess(email, active, `kiwify:${status}`)
  if (active && process.env.AUTO_INVITE_CUSTOMERS === 'true') {
    const supabase = adminSupabase()
    const normalized = normalizeEmail(email)
    const { data: users } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
    const exists = users?.users?.some(u => u.email?.toLowerCase() === normalized)
    if (!exists) {
      await supabase.auth.admin.inviteUserByEmail(normalized, { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || ''}/login` })
    }
  }
  await logSecurityEvent({ email, eventType: active ? 'kiwify_access_enabled' : 'kiwify_access_blocked', metadata: { status } })
  return NextResponse.json({ ok: true, active })
}
