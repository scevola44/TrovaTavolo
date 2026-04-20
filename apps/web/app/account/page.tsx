import { getTranslations } from 'next-intl/server';
import { requireUser } from '@/lib/require-user';
import { ProfileForm } from './profile-form';
import { DeleteAccountForm } from './delete-account-form';

export default async function AccountPage() {
  const { supabase, user } = await requireUser();
  const t = await getTranslations('account');

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, bio, contact_handle')
    .eq('id', user.id)
    .single();

  return (
    <section className="mx-auto max-w-xl space-y-12 py-10">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{t('heading')}</h1>
        <p className="mt-1 text-sm text-slate-500">{user.email}</p>
      </header>

      <ProfileForm
        initialDisplayName={profile?.display_name ?? ''}
        initialBio={profile?.bio ?? ''}
        initialContactHandle={profile?.contact_handle ?? ''}
      />

      <DeleteAccountForm />
    </section>
  );
}
