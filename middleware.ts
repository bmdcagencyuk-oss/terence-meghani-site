import { NextRequest, NextResponse } from 'next/server';
import redirectsData from '@/data/redirects.json';

// Build a lookup map at module load so matching is O(1).
const REDIRECT_MAP = new Map<string, string>(
  redirectsData.permanent.map((r) => [normalize(r.from), r.to]),
);

function normalize(path: string): string {
  // Strip trailing slash unless it's the root
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const key = normalize(pathname);
  const target = REDIRECT_MAP.get(key);
  if (target) {
    const url = req.nextUrl.clone();
    url.pathname = target;
    url.search = search;
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on everything except static assets, API routes, and metadata files
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/).*)',
  ],
};
