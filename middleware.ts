import { NextRequest, NextResponse } from 'next/server';

// Defense-in-depth only: the backend's role checks on every admin API call are the real boundary.
// This just stops the admin UI from loading for visitors with no session cookie at all.
//
// The access_token cookie is set by the API host, so this edge check can only see it when the
// backend's COOKIE_DOMAIN is the shared parent domain (e.g. ".houzdey.com"). Turn the gate on by
// setting NEXT_PUBLIC_ADMIN_COOKIE_GATE=true together with COOKIE_DOMAIN; until then it passes through.
//
// File is middleware.ts (not proxy.ts): Next 16 renamed it, but the Cloudflare/OpenNext deploy only
// officially supports the edge middleware, not the Node-runtime proxy.
export function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_ADMIN_COOKIE_GATE !== 'true') {
    return NextResponse.next();
  }

  if (!request.cookies.has('access_token') && !request.cookies.has('refresh_token')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
