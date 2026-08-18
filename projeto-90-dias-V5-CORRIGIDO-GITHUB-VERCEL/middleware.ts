import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  if (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/admin')) {
    res.headers.set('Cache-Control', 'private, no-store, max-age=0')
    res.headers.set('Pragma', 'no-cache')
  }
  return res
}
export const config = { matcher: ['/dashboard/:path*','/admin/:path*'] }
