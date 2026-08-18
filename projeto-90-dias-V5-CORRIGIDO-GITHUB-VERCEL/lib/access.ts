import { adminSupabase } from './supabase-server'
import { normalizeEmail } from './security'

export async function setCustomerAccess(email: string, active: boolean, source: string) {
  const supabase = adminSupabase()
  const normalized = normalizeEmail(email)
  const { error } = await supabase.from('customer_access').upsert({
    email: normalized,
    active,
    source,
    blocked_reason: active ? null : source,
    updated_at: new Date().toISOString()
  }, { onConflict: 'email' })
  if (error) throw error
  if (!active) {
    await supabase.from('device_sessions').update({ revoked_at: new Date().toISOString() }).eq('email', normalized).is('revoked_at', null)
  }
}
