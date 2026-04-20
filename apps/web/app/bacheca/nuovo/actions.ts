'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createAnnouncementSchema } from '@trova-tavolo/core/schemas';
import { createSupabaseServerClient } from '@trova-tavolo/core/supabase/server';
import { MAX_ANNOUNCEMENTS_PER_USER_PER_DAY } from '@trova-tavolo/core/constants';

export type CreateAnnouncementState = { error?: string };

export async function createAnnouncementAction(
  _prev: CreateAnnouncementState,
  formData: FormData,
): Promise<CreateAnnouncementState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single();
  if (!profile?.display_name) return { error: 'display_name_missing' };

  const parsed = createAnnouncementSchema.safeParse({
    kind: formData.get('kind'),
    title: formData.get('title'),
    body: formData.get('body'),
    city_id: formData.get('city_id'),
    game_ids: formData.getAll('game_ids'),
  });
  if (!parsed.success) return { error: 'validation' };

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('announcements')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', user.id)
    .gte('created_at', oneDayAgo);
  if ((count ?? 0) >= MAX_ANNOUNCEMENTS_PER_USER_PER_DAY) return { error: 'rate_limited' };

  const { data: inserted, error } = await supabase
    .from('announcements')
    .insert({
      author_id: user.id,
      kind: parsed.data.kind,
      title: parsed.data.title,
      body: parsed.data.body,
      city_id: parsed.data.city_id,
    })
    .select('id')
    .single();
  if (error || !inserted) return { error: error?.message ?? 'generic' };

  const gameLinks = parsed.data.game_ids.map((game_id) => ({
    announcement_id: inserted.id,
    game_id,
  }));
  const { error: linkError } = await supabase.from('announcement_games').insert(gameLinks);
  if (linkError) return { error: linkError.message };

  revalidatePath('/bacheca');
  redirect(`/bacheca/${inserted.id}`);
}
