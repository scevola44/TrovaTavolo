'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { ANNOUNCEMENT_KINDS } from '@trova-tavolo/core/constants';
import { Button } from '@trova-tavolo/ui/button';
import { Input } from '@trova-tavolo/ui/input';
import { Label } from '@trova-tavolo/ui/label';
import { Textarea } from '@trova-tavolo/ui/textarea';
import { createAnnouncementAction, type CreateAnnouncementState } from './actions';

type CityOpt = { id: number; name: string; region: string };
type GameOpt = { id: number; slug: string; name_it: string };

export function NewAnnouncementForm({ cities, games }: { cities: CityOpt[]; games: GameOpt[] }) {
  const t = useTranslations('announcement.form');
  const tKind = useTranslations('announcement.kind');
  const [state, formAction, pending] = useActionState<CreateAnnouncementState, FormData>(
    createAnnouncementAction,
    {},
  );

  const defaultGame = games.find((g) => g.slug === 'dnd-5e')?.id;

  return (
    <form action={formAction} className="space-y-6">
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-slate-900">{t('kind')}</legend>
        {ANNOUNCEMENT_KINDS.map((k, i) => (
          <label key={k} className="flex items-center gap-2 text-sm">
            <input type="radio" name="kind" value={k} defaultChecked={i === 0} required />
            {tKind(k)}
          </label>
        ))}
      </fieldset>

      <div>
        <Label htmlFor="city_id">{t('city')}</Label>
        <select
          id="city_id"
          name="city_id"
          required
          className="mt-1 block w-full rounded-md border-0 px-3 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
        >
          <option value="">—</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.region})
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-slate-900">{t('games')}</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {games.map((g) => (
            <label key={g.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="game_ids"
                value={g.id}
                defaultChecked={g.id === defaultGame}
              />
              {g.name_it}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <Label htmlFor="title">{t('title')}</Label>
        <Input
          id="title"
          name="title"
          minLength={4}
          maxLength={120}
          placeholder={t('title_placeholder')}
          required
        />
      </div>

      <div>
        <Label htmlFor="body">{t('body')}</Label>
        <Textarea
          id="body"
          name="body"
          minLength={20}
          maxLength={4000}
          rows={8}
          placeholder={t('body_placeholder')}
          required
        />
      </div>

      {state.error === 'rate_limited' ? (
        <p className="text-sm text-red-600">{t('rate_limited')}</p>
      ) : null}
      {state.error === 'display_name_missing' ? (
        <p className="text-sm text-red-600">{t('display_name_missing')}</p>
      ) : null}
      {state.error === 'validation' ? (
        <p className="text-sm text-red-600">{t('validation_error')}</p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {t('submit')}
      </Button>
    </form>
  );
}
