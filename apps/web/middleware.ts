import { updateSession } from '@trova-tavolo/core/supabase/middleware';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /**
     * All paths except:
     *  - Next.js internals (_next, static)
     *  - Static assets (favicon, images)
     *  - Auth callback (handled by its own route handler)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
