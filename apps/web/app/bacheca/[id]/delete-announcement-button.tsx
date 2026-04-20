'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createSupabaseBrowserClient } from '@trova-tavolo/core/supabase/browser';
import { Button } from '@trova-tavolo/ui/button';

export function DeleteAnnouncementButton({ id, label }: { id: string; label: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  const t = useTranslations('bacheca');

  function handleClick() {
    if (!window.confirm(t('delete_confirm'))) return;
    start(async () => {
      const supabase = createSupabaseBrowserClient();
      await supabase.from('announcements').delete().eq('id', id);
      router.push('/bacheca');
      router.refresh();
    });
  }

  return (
    <Button onClick={handleClick} variant="danger" disabled={pending}>
      {label}
    </Button>
  );
}
