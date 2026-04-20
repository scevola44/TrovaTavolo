import { getRequestConfig } from 'next-intl/server';

const SUPPORTED_LOCALES = ['it', 'en'] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: Locale = 'it';

export default getRequestConfig(async () => {
  // MVP: Italian-first, single-locale deployment. Future: detect via cookie / Accept-Language.
  const locale: Locale = DEFAULT_LOCALE;
  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    timeZone: 'Europe/Rome',
  };
});
