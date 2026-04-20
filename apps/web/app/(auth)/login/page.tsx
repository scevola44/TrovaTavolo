'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@trova-tavolo/ui/button';
import { Input } from '@trova-tavolo/ui/input';
import { Label } from '@trova-tavolo/ui/label';
import { loginAction, type AuthFormState } from '../actions';

export default function LoginPage() {
  const t = useTranslations();
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(loginAction, {});

  return (
    <section className="mx-auto max-w-md py-12">
      <h1 className="text-2xl font-bold text-slate-900">{t('auth.login_heading')}</h1>
      <form action={formAction} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        {state.error === 'invalid' ? (
          <p className="text-sm text-red-600">{t('auth.invalid_credentials')}</p>
        ) : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {t('auth.login_submit')}
        </Button>
      </form>
      <p className="mt-6 text-sm text-slate-600">
        {t('auth.login_no_account')}{' '}
        <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
          {t('auth.signup_submit')}
        </Link>
      </p>
    </section>
  );
}
