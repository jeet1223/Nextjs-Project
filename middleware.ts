import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Validate JWT_SECRET exists
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/api/users/login',
  '/api/users/logout',
  '/api/users/refreshToken',
  '/api/users/products',
  '/api/users/cms',
  '/api/users/home',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public routes without authentication
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized: No token provided' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    
    // Check if accessing admin routes
    if (pathname.startsWith('/api/admin')) {
      if (payload.role !== 'admin') {
        return new NextResponse(
          JSON.stringify({ error: 'Forbidden: Admin access required' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    // Add user info to headers for use in API routes
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-user-id', String(payload.id))
    requestHeaders.set('x-user-role', String(payload.role))
    requestHeaders.set('x-user-email', String(payload.email))

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized: Invalid or expired token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export const config = {
  matcher: ['/api/:path*'],
}
