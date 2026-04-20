import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function Footer() {
  const t = await getTranslations('legal');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {year} Trova Tavolo</p>
        <nav className="flex gap-4">
          <Link href="/privacy" className="hover:text-slate-700">
            {t('privacy')}
          </Link>
          <Link href="/termini" className="hover:text-slate-700">
            {t('terms')}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
