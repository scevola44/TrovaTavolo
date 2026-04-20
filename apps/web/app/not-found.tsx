import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@trova-tavolo/ui/button';

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <section className="py-20">
      <h1 className="text-3xl font-bold text-slate-900">{t('errors.not_found_title')}</h1>
      <p className="mt-4 text-slate-600">{t('errors.not_found_body')}</p>
      <Link href="/" className="mt-8 inline-block">
        <Button>{t('nav.home')}</Button>
      </Link>
    </section>
  );
}
