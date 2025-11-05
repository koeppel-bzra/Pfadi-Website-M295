import { NextResponse } from 'next/server'

export async function proxy() {
  const res = NextResponse.next();
  // TODO: Add CORS middleware logic here.
  return res;
}

export const config = {
  matcher: '/api/:path*',
}

