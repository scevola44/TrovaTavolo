import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@trova-tavolo/core/supabase/server';

export async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  return { supabase, user };
}
