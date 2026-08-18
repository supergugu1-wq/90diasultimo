import crypto from 'crypto'

function secret() {
  const value = process.env.SESSION_SECRET
  if (!value || value.length < 32) throw new Error('SESSION_SECRET must have at least 32 characters')
  return value
}

export function signAdminSession(username: string, expiresAt: number) {
  const payload = Buffer.from(JSON.stringify({ username, expiresAt })).toString('base64url')
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function verifyAdminSession(token?: string | null) {
  if (!token) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  const expected = crypto.createHmac('sha256', secret()).update(payload).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString())
    return parsed.username === process.env.ADMIN_USERNAME && Number(parsed.expiresAt) > Date.now()
  } catch { return false }
}
