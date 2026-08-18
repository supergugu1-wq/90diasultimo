import crypto from 'crypto'
import { adminSupabase } from './supabase-server'

export function normalizeEmail(email: string) { return email.trim().toLowerCase() }
export function hashValue(value: string) { return crypto.createHash('sha256').update(value).digest('hex') }

export async function logSecurityEvent(input: {
  email?: string | null; eventType: string; ip?: string | null; userAgent?: string | null; metadata?: Record<string, unknown>
}) {
  const supabase = adminSupabase()
  await supabase.from('security_events').insert({
    email: input.email ? normalizeEmail(input.email) : null,
    event_type: input.eventType,
    ip_hash: input.ip ? hashValue(input.ip) : null,
    user_agent: input.userAgent || null,
    metadata: input.metadata || {}
  })
}

export async function validateBearerUser(authHeader: string | null) {
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!token) return { ok: false as const, status: 401, error: 'Missing bearer token' }
  const supabase = adminSupabase()
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user?.email) return { ok: false as const, status: 401, error: 'Invalid session' }
  return { ok: true as const, user: data.user, email: normalizeEmail(data.user.email) }
}
