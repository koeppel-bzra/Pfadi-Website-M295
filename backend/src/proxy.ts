import { NextResponse } from 'next/server'

export async function proxy() {
  const res = NextResponse.next();
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', '*');
  res.headers.set('Access-Control-Allow-Headers', '*');
  return res;
}

export const config = {
  matcher: '/api/:path*',
}

