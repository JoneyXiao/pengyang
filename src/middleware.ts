import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const publicRoutes = ['/login', '/register', '/auth/callback']
const adminRoutes = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static assets
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const { user, response, supabase } = await updateSession(request)

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/admin')

  // Redirect authenticated users away from auth pages
  if (user && isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Redirect unauthenticated users to login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Admin route gating — check role
  if (user && adminRoutes.some((route) => pathname.startsWith(route))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.sub)
      .single()

    if (profile?.role !== 'super_admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
