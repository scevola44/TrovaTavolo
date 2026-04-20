'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@trova-tavolo/core/supabase/browser';

export function LogoutButton({ label }: { label: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();

  function handleClick() {
    start(async () => {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.refresh();
      router.push('/');
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="text-slate-700 hover:text-slate-900 disabled:opacity-50"
    >
      {label}
    </button>
  );
}
