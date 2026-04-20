import { createClient } from '@supabase/supabase-js';

/**
 * Service-role client. Bypasses RLS.
 * Use exclusively from trusted server contexts (route handlers, server actions)
 * and only for operations the anon key cannot perform, e.g. deleting auth.users.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase URL or service role key in environment.');
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
