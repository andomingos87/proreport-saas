import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // No protótipo, não há autenticação real
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/contacts/:path*',
    '/billing/:path*',
    '/reports/:path*',
    '/settings/:path*',
    '/inspections/:path*',
    '/contracts/:path*',
    '/emails/:path*',
    '/auth/:path*'
  ],
} 