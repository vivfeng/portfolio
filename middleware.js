export const config = {
  matcher: '/((?!_vercel/).*)',
};

export default function middleware(request) {
  const expectedPass = process.env.SITE_PASSWORD;
  const expectedUser = process.env.SITE_USERNAME || 'guest';

  if (!expectedPass) {
    return new Response(
      'Site is not configured. Set SITE_PASSWORD in the Vercel project environment variables.',
      { status: 503, headers: { 'Content-Type': 'text/plain' } }
    );
  }

  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const idx = decoded.indexOf(':');
      const user = idx >= 0 ? decoded.slice(0, idx) : '';
      const pass = idx >= 0 ? decoded.slice(idx + 1) : decoded;
      if (user === expectedUser && pass === expectedPass) {
        return;
      }
    } catch {
      // fall through to 401
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Vivian\'s Portfolio"',
      'Content-Type': 'text/plain',
    },
  });
}
