import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createSupabaseServerClient } from '@trova-tavolo/core/supabase/server';
import { LogoutButton } from './logout-button';

export async function TopNav() {
  const t = await getTranslations('nav');
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-indigo-700">
          Trova Tavolo
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/bacheca" className="text-slate-700 hover:text-slate-900">
            {t('bacheca')}
          </Link>
          {user ? (
            <>
              <Link href="/bacheca/nuovo" className="text-slate-700 hover:text-slate-900">
                {t('new')}
              </Link>
              <Link href="/account" className="text-slate-700 hover:text-slate-900">
                {t('account')}
              </Link>
              <LogoutButton label={t('logout')} />
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-700 hover:text-slate-900">
                {t('login')}
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-indigo-600 px-3 py-1.5 font-semibold text-white hover:bg-indigo-500"
              >
                {t('signup')}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
