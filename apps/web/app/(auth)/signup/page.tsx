'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@trova-tavolo/ui/button';
import { Input } from '@trova-tavolo/ui/input';
import { Label } from '@trova-tavolo/ui/label';
import { signupAction, type AuthFormState } from '../actions';

export default function SignupPage() {
  const t = useTranslations();
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(signupAction, {});

  return (
    <section className="mx-auto max-w-md py-12">
      <h1 className="text-2xl font-bold text-slate-900">{t('auth.signup_heading')}</h1>
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
            autoComplete="new-password"
            minLength={8}
            required
          />
          <p className="mt-1 text-xs text-slate-500">{t('auth.password_hint')}</p>
        </div>
        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        {state.message === 'check_email' ? (
          <p className="text-sm text-emerald-700">{t('auth.check_email')}</p>
        ) : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {t('auth.signup_submit')}
        </Button>
      </form>
      <p className="mt-6 text-sm text-slate-600">
        {t('auth.signup_already')}{' '}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          {t('auth.login_submit')}
        </Link>
      </p>
    </section>
  );
}
