import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Enforce a single local/live entrypoint for Tina: only "/admin".
// We rewrite /admin to the static public/admin/index.html so the URL
// stays /admin and the dev server assets load correctly. This avoids
// any nested /~/admin recursion inside Tina preview.
export function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl
	if (pathname === '/admin' || pathname === '/admin/') {
		// Always serve the static admin shell, keeping the URL as /admin
		const url = req.nextUrl.clone()
		url.pathname = '/admin/index.html'
		return NextResponse.rewrite(url)
	}
	return NextResponse.next()
}

export const config = {
	matcher: ['/admin', '/admin/'],
}
