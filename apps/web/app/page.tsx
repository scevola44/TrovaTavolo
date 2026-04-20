import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button } from '@trova-tavolo/ui/button';

export default async function HomePage() {
  const t = await getTranslations('home');

  return (
    <section className="py-12 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        {t('heading')}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{t('subheading')}</p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/bacheca">
          <Button size="lg">{t('cta_browse')}</Button>
        </Link>
        <Link href="/bacheca/nuovo">
          <Button size="lg" variant="secondary">
            {t('cta_post')}
          </Button>
        </Link>
      </div>
    </section>
  );
}
