import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export function authSupabase() {
  const store = cookies()
  type CookieToSet = {
    name: string
    value: string
    options?: CookieOptions
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase auth environment variables are missing')
  return createServerClient(url, key, {
    cookies: {
      getAll() { return store.getAll() },
      setAll(items: CookieToSet[]) {
        try { items.forEach(({ name, value, options }) => store.set(name, value, options)) } catch {}
      }
    }
  })
}
