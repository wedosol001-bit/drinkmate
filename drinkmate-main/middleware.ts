import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Rewrite locale-prefixed routes (/ar, /en) to the underlying non-prefixed pages
// Keeps the URL with /ar or /en while serving the same page tree
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip Next.js internals and static assets (handled by config.matcher too)
  if (pathname.startsWith('/_next')) return NextResponse.next()

  // Arabic prefix
  if (pathname === '/ar' || pathname.startsWith('/ar/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/ar(\/|$)/, '/')
    return NextResponse.rewrite(url)
  }

  // English prefix (optional, keeps parity if used)
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/en(\/|$)/, '/')
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

// Apply middleware to all routes except Next internals and common static files
export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:css|js|map|png|jpg|jpeg|gif|svg|ico|webp|mp4|webm|ogg|json|txt)).*)',
  ],
}


