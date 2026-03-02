import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const BLOCKED_USER_AGENTS = [
  'sqlmap',
  'nikto',
  'nmap',
  'masscan',
  'zgrab',
];

const BLOCKED_PATHS = [
  '/wp-admin',
  '/wp-login',
  '/phpmyadmin',
  '/.env',
  '/.git',
  '/config.php',
  '/admin.php',
  '/shell',
  '/cmd',
];

function isSuspiciousRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  
  for (const blocked of BLOCKED_USER_AGENTS) {
    if (userAgent.includes(blocked)) {
      return true;
    }
  }

  const pathname = request.nextUrl.pathname.toLowerCase();
  for (const blocked of BLOCKED_PATHS) {
    if (pathname.includes(blocked)) {
      return true;
    }
  }

  const url = request.url.toLowerCase();
  const suspiciousPatterns = [
    'union%20select',
    'union+select',
    '<script',
    'javascript:',
    '../',
    '..\\',
    '%00',
    'eval(',
    'base64_decode',
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (url.includes(pattern)) {
      return true;
    }
  }

  return false;
}

export async function middleware(request: NextRequest) {
  if (isSuspiciousRequest(request)) {
    console.warn(`[SECURITY] Blocked suspicious request: ${request.url}`);
    return new NextResponse('Not Found', { status: 404 });
  }

  let response: NextResponse;
  try {
    response = await Promise.race([
      updateSession(request),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Supabase unreachable')), 3000)
      ),
    ]);
  } catch {
    // Supabase blocked (e.g. India ISP ban) — skip session refresh, let request proceed
    response = NextResponse.next({ request });
  }

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
