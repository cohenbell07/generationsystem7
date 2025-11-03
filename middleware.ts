import { NextRequest, NextResponse } from 'next/server'
import { isSuperuser } from './lib/utils'

export function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  
  // Check for superuser bypass
  if (isSuperuser(searchParams)) {
    // Add superuser header to request
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-superuser', 'true')
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}

