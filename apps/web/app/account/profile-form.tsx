'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@trova-tavolo/ui/button';
import { Input } from '@trova-tavolo/ui/input';
import { Label } from '@trova-tavolo/ui/label';
import { Textarea } from '@trova-tavolo/ui/textarea';
import { updateProfileAction, type ProfileFormState } from './actions';

export function ProfileForm({
  initialDisplayName,
  initialBio,
  initialContactHandle,
}: {
  initialDisplayName: string;
  initialBio: string;
  initialContactHandle: string;
}) {
  const t = useTranslations('account');
  const [state, formAction, pending] = useActionState<ProfileFormState, FormData>(
    updateProfileAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="display_name">{t('display_name')}</Label>
        <Input
          id="display_name"
          name="display_name"
          defaultValue={initialDisplayName}
          minLength={2}
          maxLength={40}
          required
        />
      </div>
      <div>
        <Label htmlFor="contact_handle">{t('contact_handle')}</Label>
        <Input
          id="contact_handle"
          name="contact_handle"
          defaultValue={initialContactHandle}
          placeholder={t('contact_handle_placeholder')}
          minLength={3}
          maxLength={120}
        />
        <p className="mt-1 text-xs text-slate-500">{t('contact_handle_hint')}</p>
      </div>
      <div>
        <Label htmlFor="bio">{t('bio')}</Label>
        <Textarea id="bio" name="bio" defaultValue={initialBio} maxLength={500} rows={4} />
      </div>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700">{t('saved')}</p> : null}
      <Button type="submit" disabled={pending}>
        {t('save')}
      </Button>
    </form>
  );
}
