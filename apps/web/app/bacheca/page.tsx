import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { BACHECA_PAGE_SIZE } from '@trova-tavolo/core/constants';
import { bachecaFilterSchema } from '@trova-tavolo/core/schemas';
import { createSupabaseServerClient } from '@trova-tavolo/core/supabase/server';
import { Button } from '@trova-tavolo/ui/button';
import { Card, CardMeta, CardTitle } from '@trova-tavolo/ui/card';
import { BachecaFilters } from './filters';

type SearchParams = Record<string, string | string[] | undefined>;

type BachecaRow = {
  id: string;
  kind: 'looking_for_players' | 'looking_for_gm' | 'looking_for_group';
  title: string;
  body: string;
  created_at: string;
  city: { id: number; name: string; region: string } | null;
  author: { id: string; display_name: string | null } | null;
  announcement_games: Array<{
    game: { id: number; slug: string; name_it: string } | null;
  }>;
};

export default async function BachecaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const raw = await searchParams;
  const filters = bachecaFilterSchema.parse({
    kind: raw.kind,
    city_id: raw.city_id,
    game_id: raw.game_id,
    page: raw.page ?? '1',
  });
  const t = await getTranslations();
  const supabase = await createSupabaseServerClient();

  const from = (filters.page - 1) * BACHECA_PAGE_SIZE;
  const to = from + BACHECA_PAGE_SIZE - 1;

  let query = supabase
    .from('announcements')
    .select(
      `
      id, kind, title, body, created_at,
      city:cities ( id, name, region ),
      author:profiles ( id, display_name ),
      announcement_games ( game:games ( id, slug, name_it ) )
    `,
      { count: 'exact' },
    )
    .eq('is_active', true)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .range(from, to);

  if (filters.kind) query = query.eq('kind', filters.kind);
  if (filters.city_id) query = query.eq('city_id', filters.city_id);

  const { data, count } = await query.returns<BachecaRow[]>();
  const announcements = data ?? [];

  const filtered = filters.game_id
    ? announcements.filter((a) =>
        a.announcement_games.some((ag) => ag.game?.id === filters.game_id),
      )
    : announcements;

  const [{ data: cities }, { data: games }] = await Promise.all([
    supabase.from('cities').select('id, name, region').order('name').limit(500),
    supabase.from('games').select('id, slug, name_it').eq('is_active', true).order('name_it'),
  ]);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / BACHECA_PAGE_SIZE));

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('bacheca.heading')}</h1>
        <Link href="/bacheca/nuovo">
          <Button>{t('bacheca.new_cta')}</Button>
        </Link>
      </header>

      <BachecaFilters cities={cities ?? []} games={games ?? []} current={filters} />

      {filtered.length === 0 ? (
        <p className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-500">
          {t('bacheca.no_results')}
        </p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((a) => {
            const gamesForAnnouncement = a.announcement_games
              .map((ag) => ag.game?.name_it)
              .filter((x): x is string => Boolean(x));

            return (
              <li key={a.id}>
                <Link href={`/bacheca/${a.id}`} className="block">
                  <Card className="transition-colors hover:border-indigo-300">
                    <CardTitle>{a.title}</CardTitle>
                    <CardMeta>
                      {t(`announcement.kind.${a.kind}`)} · {t('bacheca.posted_in')}{' '}
                      {a.city?.name ?? '—'} · {t('bacheca.posted_by')}{' '}
                      {a.author?.display_name ?? '—'}
                    </CardMeta>
                    {gamesForAnnouncement.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {gamesForAnnouncement.map((name) => (
                          <span
                            key={name}
                            className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {totalPages > 1 ? (
        <Pagination page={filters.page} totalPages={totalPages} params={raw} />
      ) : null}
    </section>
  );
}

function Pagination({
  page,
  totalPages,
  params,
}: {
  page: number;
  totalPages: number;
  params: SearchParams;
}) {
  const buildHref = (nextPage: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (typeof v === 'string') sp.set(k, v);
    }
    sp.set('page', String(nextPage));
    return `/bacheca?${sp.toString()}`;
  };

  return (
    <nav className="flex items-center justify-between text-sm">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} className="text-indigo-600 hover:text-indigo-500">
          ← Precedente
        </Link>
      ) : (
        <span />
      )}
      <span className="text-slate-500">
        {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={buildHref(page + 1)} className="text-indigo-600 hover:text-indigo-500">
          Successiva →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
