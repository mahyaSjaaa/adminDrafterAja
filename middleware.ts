import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  console.log('[middleware] RUNNING - Path:', req.nextUrl.pathname)
  
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname
  const isPublic = pathname === '/' || pathname.startsWith('/auth')

  console.log('[middleware] Path:', pathname, 'Session exists:', !!session)

  if (!session && !isPublic) {
    console.log('[middleware] No session, redirecting from', pathname)
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

// export const config = {
//   matcher: ['/admin', '/admin/:path*'],
// }