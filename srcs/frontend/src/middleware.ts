import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    console.log("Middleware executed");
    
    // Get the "access_token" from cookies
    const accessToken = req.cookies.get('access_token')?.value;

    // Get the current URL path
    const { pathname } = req.nextUrl;

    // If there is a token and user is trying to access signup or signin, redirect to /users/home
    if (accessToken && (pathname.startsWith('/auth/signup') || pathname.startsWith('/auth/signin'))) {
        return NextResponse.redirect(new URL('/users/home', req.url));
    }

    // Protected paths that require authentication
    const protectedPaths = ['/users/home', '/users/settings', '/users/logout', '/users/friend', '/users/chat'];
    
    // If there is no token and user is trying to access protected user routes, redirect to /auth/signin
    if (!accessToken && protectedPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // If there is a token and user is trying to access protected routes, validate the token
    if (accessToken && protectedPaths.some((path) => pathname.startsWith(path))) {
        // try {
        //     const res = await fetch(`http://localhost:8000/api/auth/test_auth/`, {
        //         headers: {
        //             'Cookie': `access_token=${accessToken}`
        //         }
        //     });

        //     if (!res.ok) {
        //         throw new Error('Token validation failed');
        //     }

        //     console.log("Token validated successfully");
        //     return NextResponse.next();
        // } catch (err) {
        //     console.log("Token validation error:", err);
            
        //     // Create a response that redirects to the signin page
        //     const response = NextResponse.redirect(new URL('/auth/signin', req.url));
            
        //     // Delete the access_token by setting it to expire in the past
        //     response.cookies.set('access_token', '', { 
        //         httpOnly: true, 
        //         secure: process.env.NODE_ENV === 'production',
        //         sameSite: 'strict',
        //         expires: new Date(0),
        //         path: '/'
        //     });

        //     return response;
        // } 
    }

    // For all other cases, continue with the request
    return NextResponse.next();
}

// Apply this middleware to the specific routes
export const config = {
    matcher: [
        '/auth/signup', 
        '/auth/signin', 
        '/users/home', 
        '/users/settings', 
        '/users/logout', 
        '/users/friend',
        '/users/chat'
    ],
};

