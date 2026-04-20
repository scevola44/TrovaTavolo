'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ANNOUNCEMENT_KINDS } from '@trova-tavolo/core/constants';

type CityOpt = { id: number; name: string; region: string };
type GameOpt = { id: number; slug: string; name_it: string };

export function BachecaFilters({
  cities,
  games,
  current,
}: {
  cities: CityOpt[];
  games: GameOpt[];
  current: { kind?: string; city_id?: number; game_id?: number };
}) {
  const t = useTranslations('bacheca');
  const tKind = useTranslations('announcement.kind');
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const sp = new URLSearchParams(searchParams.toString());
    if (value) sp.set(key, value);
    else sp.delete(key);
    sp.delete('page');
    router.push(`/bacheca?${sp.toString()}`);
  }

  return (
    <div className="grid gap-3 rounded-md border border-slate-200 bg-white p-4 sm:grid-cols-3">
      <label className="text-sm">
        <span className="block text-slate-700">{t('filter_kind')}</span>
        <select
          value={current.kind ?? ''}
          onChange={(e) => updateFilter('kind', e.target.value)}
          className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        >
          <option value="">{t('filter_all')}</option>
          {ANNOUNCEMENT_KINDS.map((k) => (
            <option key={k} value={k}>
              {tKind(k)}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        <span className="block text-slate-700">{t('filter_city')}</span>
        <select
          value={current.city_id ? String(current.city_id) : ''}
          onChange={(e) => updateFilter('city_id', e.target.value)}
          className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        >
          <option value="">{t('filter_all')}</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.region})
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm">
        <span className="block text-slate-700">{t('filter_game')}</span>
        <select
          value={current.game_id ? String(current.game_id) : ''}
          onChange={(e) => updateFilter('game_id', e.target.value)}
          className="mt-1 block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        >
          <option value="">{t('filter_all')}</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name_it}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
