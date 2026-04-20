'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@trova-tavolo/ui/button';
import { Input } from '@trova-tavolo/ui/input';
import { Label } from '@trova-tavolo/ui/label';
import { deleteAccountAction } from './actions';

export function DeleteAccountForm() {
  const t = useTranslations('account');

  return (
    <section className="rounded-lg border border-red-200 bg-red-50 p-5">
      <h2 className="text-lg font-semibold text-red-900">{t('delete_heading')}</h2>
      <p className="mt-1 text-sm text-red-800">{t('delete_description')}</p>
      <form action={deleteAccountAction} className="mt-4 space-y-3">
        <div>
          <Label htmlFor="confirm" className="text-red-900">
            {t('delete_confirm_label')}
          </Label>
          <Input id="confirm" name="confirm" required />
        </div>
        <Button type="submit" variant="danger">
          {t('delete_submit')}
        </Button>
      </form>
    </section>
  );
}
