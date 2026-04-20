import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createSupabaseServerClient } from '@trova-tavolo/core/supabase/server';
import { DeleteAnnouncementButton } from './delete-announcement-button';

type AnnouncementDetail = {
  id: string;
  kind: 'looking_for_players' | 'looking_for_gm' | 'looking_for_group';
  title: string;
  body: string;
  created_at: string;
  author_id: string;
  city: { id: number; name: string; region: string } | null;
  author: { id: string; display_name: string | null; contact_handle: string | null } | null;
  announcement_games: Array<{
    game: { id: number; slug: string; name_it: string } | null;
  }>;
};

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations();
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from('announcements')
    .select(
      `
      id, kind, title, body, created_at, author_id,
      city:cities ( id, name, region ),
      author:profiles ( id, display_name, contact_handle ),
      announcement_games ( game:games ( id, slug, name_it ) )
    `,
    )
    .eq('id', id)
    .single();

  if (!data) notFound();
  const announcement = data as unknown as AnnouncementDetail;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const gameNames = announcement.announcement_games
    .map((ag) => ag.game?.name_it)
    .filter((x): x is string => Boolean(x));

  const isOwner = user?.id === announcement.author_id;
  const contactHandle = announcement.author?.contact_handle ?? null;

  return (
    <article className="mx-auto max-w-2xl space-y-6 py-8">
      <Link href="/bacheca" className="text-sm text-indigo-600 hover:text-indigo-500">
        ← {t('nav.bacheca')}
      </Link>

      <header>
        <h1 className="text-3xl font-bold text-slate-900">{announcement.title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {t(`announcement.kind.${announcement.kind}`)} · {t('bacheca.posted_in')}{' '}
          {announcement.city?.name ?? '—'} · {t('bacheca.posted_by')}{' '}
          {announcement.author?.display_name ?? '—'}
        </p>
      </header>

      {gameNames.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {gameNames.map((name) => (
            <span
              key={name}
              className="rounded bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
            >
              {name}
            </span>
          ))}
        </div>
      ) : null}

      <div className="whitespace-pre-wrap text-slate-800">{announcement.body}</div>

      <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
        <p className="font-medium text-slate-700">{t('bacheca.contact_label')}</p>
        {user ? (
          <p className="mt-1 text-slate-600">{contactHandle ?? t('bacheca.contact_missing')}</p>
        ) : (
          <p className="mt-1 text-slate-600">
            <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
              {t('bacheca.contact_locked')}
            </Link>
          </p>
        )}
      </section>

      {isOwner ? (
        <DeleteAnnouncementButton id={announcement.id} label={t('bacheca.delete')} />
      ) : null}
    </article>
  );
}
