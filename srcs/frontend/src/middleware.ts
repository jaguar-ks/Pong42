import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    console.log("Middleware executed");
    
    // Get the "access_token" from cookies
    const accessToken = req.cookies.get('access_token')?.value;

    // Get the current URL path
    const { pathname } = req.nextUrl;

    // If there is a token and user is trying to access signup or signin, redirect to /users/home
    if (accessToken && pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/users/home', req.url));
    }

    // If there is no token and user is trying to access protected user routes, redirect to /auth/signin
    if (!accessToken && pathname.startsWith('/users')) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // If there is a token and user is trying to access protected routes, validate the token
    // (You can add token validation logic here if needed)
   
    return NextResponse.next();
}

// Apply this middleware to the specific routes
export const config = {
    matcher: [
        '/auth/:path*',
        '/users/:path*'
    ],
};