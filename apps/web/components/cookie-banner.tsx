'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'tt.cookie-consent';

export function CookieBanner() {
  const t = useTranslations('legal.cookies');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setVisible(window.localStorage.getItem(STORAGE_KEY) !== 'accepted');
  }, []);

  if (!visible) return null;

  function accept() {
    window.localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-4 shadow-lg"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-700">
          {t('message')}{' '}
          <Link href="/privacy" className="underline hover:text-slate-900">
            {t('more')}
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          {t('accept')}
        </button>
      </div>
    </div>
  );
}
