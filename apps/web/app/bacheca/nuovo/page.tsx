import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { requireUser } from '@/lib/require-user';
import { NewAnnouncementForm } from './new-announcement-form';

export default async function NewAnnouncementPage() {
  const { supabase, user } = await requireUser();
  const t = await getTranslations('announcement.form');

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', user.id)
    .single();
  if (!profile?.display_name) redirect('/account?reason=display_name_required');

  const [{ data: cities }, { data: games }] = await Promise.all([
    supabase.from('cities').select('id, name, region').order('name').limit(500),
    supabase.from('games').select('id, slug, name_it').eq('is_active', true).order('name_it'),
  ]);

  return (
    <section className="mx-auto max-w-2xl space-y-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900">{t('heading')}</h1>
      <NewAnnouncementForm cities={cities ?? []} games={games ?? []} />
    </section>
  );
}
