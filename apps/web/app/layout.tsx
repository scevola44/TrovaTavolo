import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { TopNav } from '@/components/top-nav';
import { CookieBanner } from '@/components/cookie-banner';
import { Footer } from '@/components/footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trova Tavolo',
  description: 'Italian TTRPG player, GM, and group finder.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Rome">
          <TopNav />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
