import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check specifically for session_id as requested, but also auth_token for security
    const sessionId = request.cookies.get('session_id')?.value;

    const { pathname } = request.nextUrl;

    const publicPaths = ['/login', '/'];
    const isPublicPath = publicPaths.includes(pathname);

    // If user is accessing a protected path
    if (!isPublicPath) {
        // If session_id is missing, redirect to login
        if (!sessionId) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Optional: If user is already logged in (has session_id) and visits /login, send them to home
    // Optional: If user is already logged in (has session_id) and visits /login, send them to home
    // EXCEPTION: If we are in the OTP step, we must allow /login to render
    const isOtpStep = request.nextUrl.searchParams.get('step') === 'otp';

    if (sessionId && pathname === '/login' && !isOtpStep) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
    ],
};
