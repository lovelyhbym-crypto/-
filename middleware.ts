import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Check if Supabase env vars are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Middleware: Supabase 환경 변수가 설정되지 않았습니다. 인증 체크를 건너뜁니다.');
        // Allow request to proceed without authentication check
        return response;
    }

    try {
        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            request.cookies.set(name, value)
                        );
                        response = NextResponse.next({
                            request,
                        });
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options)
                        );
                    },
                },
            }
        );

        const {
            data: { user },
        } = await supabase.auth.getUser();

        // Protect root path - redirect to login if not authenticated
        if (!user && request.nextUrl.pathname === '/') {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Protect dashboard - redirect to login if not authenticated
        if (!user && request.nextUrl.pathname === '/dashboard') {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // If user is logged in and tries to access login page, redirect to dashboard
        if (user && request.nextUrl.pathname === '/login') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        return response;
    } catch (error) {
        console.error('Middleware error:', error);
        // On error, allow request to proceed
        return response;
    }
}

export const config = {
    matcher: ['/', '/login', '/dashboard'],
};
