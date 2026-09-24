import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Server-side gate for the dashboard shell so unauthenticated requests never even render it.
// This is a UX/defense-in-depth layer only - the real security boundary is the Bearer-token +
// RLS check inside each /api/* route handler (see getAuthenticatedUser in src/lib/supabase.ts).
export function proxy(request: NextRequest) {
    const isLoggedIn = request.cookies.get('sb-logged-in')?.value === '1';

    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/dashboard/:path*',
};
