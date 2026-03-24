import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const response = NextResponse.next();

    // 1. Geo-Location & Currency Logic (Mocked for Demo, fits Vercel Edge)
    const country = request.headers.get('x-vercel-ip-country') || 'GB';
    const currency = country === 'US' ? 'USD' : country === 'EU' ? 'EUR' : 'GBP';

    // 2. Time-Based Nature Mode Logic
    // We can get the client time if provided in headers, or default to GMT
    const hour = new Date().getUTCHours();
    const isNight = hour >= 20 || hour <= 6;
    const natureMode = isNight ? 'deep-forest' : 'morning-mist';

    // 3. Admin Route Protection
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.cookies.get('jwt');
        const role = request.cookies.get('userRole')?.value;

        if (!token || role !== 'admin') {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('from', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // 4. Set custom headers or cookies for the frontend to consume
    response.headers.set('x-aethelgard-geo', country);
    response.headers.set('x-aethelgard-currency', currency);
    response.headers.set('x-aethelgard-nature-mode', natureMode);

    // Set cookies for persistence
    response.cookies.set('natureMode', natureMode, { path: '/' });
    response.cookies.set('preferredCurrency', currency, { path: '/' });

    return response;
}

// Ensure middleware runs only on page routes
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
