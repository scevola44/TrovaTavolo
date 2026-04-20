import { describe, expect, it } from 'vitest';
import { bachecaFilterSchema, createAnnouncementSchema } from './announcement';

describe('createAnnouncementSchema', () => {
  const validInput = {
    kind: 'looking_for_players',
    title: 'Cerco giocatori per Milano',
    body: 'Campagna settimanale, livello 1, sistema D&D 5e. Dettagli via DM.',
    city_id: 2,
    game_ids: [1],
  };

  it('accepts a valid listing', () => {
    expect(createAnnouncementSchema.safeParse(validInput).success).toBe(true);
  });

  it('coerces stringified numeric ids (form data is always strings)', () => {
    const result = createAnnouncementSchema.safeParse({
      ...validInput,
      city_id: '2',
      game_ids: ['1', '3'],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.city_id).toBe(2);
      expect(result.data.game_ids).toEqual([1, 3]);
    }
  });

  it('rejects a title shorter than the minimum', () => {
    expect(createAnnouncementSchema.safeParse({ ...validInput, title: 'abc' }).success).toBe(false);
  });

  it('rejects a body shorter than the minimum', () => {
    expect(createAnnouncementSchema.safeParse({ ...validInput, body: 'too short' }).success).toBe(
      false,
    );
  });

  it('rejects an unknown announcement kind', () => {
    expect(
      createAnnouncementSchema.safeParse({ ...validInput, kind: 'looking_for_cookies' }).success,
    ).toBe(false);
  });

  it('requires at least one game', () => {
    expect(createAnnouncementSchema.safeParse({ ...validInput, game_ids: [] }).success).toBe(false);
  });

  it('accepts a title at exactly the minimum length', () => {
    expect(createAnnouncementSchema.safeParse({ ...validInput, title: 'abcd' }).success).toBe(true);
  });

  it('accepts a title at exactly the maximum length', () => {
    expect(
      createAnnouncementSchema.safeParse({ ...validInput, title: 'a'.repeat(120) }).success,
    ).toBe(true);
  });

  it('rejects a title one character over the maximum', () => {
    expect(
      createAnnouncementSchema.safeParse({ ...validInput, title: 'a'.repeat(121) }).success,
    ).toBe(false);
  });

  it('accepts a body at exactly the minimum length', () => {
    expect(
      createAnnouncementSchema.safeParse({ ...validInput, body: 'a'.repeat(20) }).success,
    ).toBe(true);
  });

  it('rejects a body one character under the minimum', () => {
    expect(
      createAnnouncementSchema.safeParse({ ...validInput, body: 'a'.repeat(19) }).success,
    ).toBe(false);
  });

  it('accepts a body at exactly the maximum length', () => {
    expect(
      createAnnouncementSchema.safeParse({ ...validInput, body: 'a'.repeat(4000) }).success,
    ).toBe(true);
  });

  it('rejects a body one character over the maximum', () => {
    expect(
      createAnnouncementSchema.safeParse({ ...validInput, body: 'a'.repeat(4001) }).success,
    ).toBe(false);
  });

  it('accepts game_ids at the maximum count of 10', () => {
    expect(
      createAnnouncementSchema.safeParse({ ...validInput, game_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] })
        .success,
    ).toBe(true);
  });

  it('rejects game_ids exceeding the maximum count of 10', () => {
    expect(
      createAnnouncementSchema.safeParse({
        ...validInput,
        game_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      }).success,
    ).toBe(false);
  });

  it('accepts all valid announcement kinds', () => {
    for (const kind of ['looking_for_players', 'looking_for_gm', 'looking_for_group'] as const) {
      expect(createAnnouncementSchema.safeParse({ ...validInput, kind }).success).toBe(true);
    }
  });
});

describe('bachecaFilterSchema', () => {
  it('defaults page to 1 when omitted', () => {
    const result = bachecaFilterSchema.parse({});
    expect(result.page).toBe(1);
  });

  it('ignores unknown filter keys without failing', () => {
    expect(() => bachecaFilterSchema.parse({ page: '2', unknown: 'x' })).not.toThrow();
  });

  it('rejects a non-positive page', () => {
    expect(bachecaFilterSchema.safeParse({ page: '0' }).success).toBe(false);
  });

  it('coerces page from string to number', () => {
    const result = bachecaFilterSchema.parse({ page: '3' });
    expect(result.page).toBe(3);
  });

  it('accepts a valid kind filter', () => {
    const result = bachecaFilterSchema.safeParse({ kind: 'looking_for_gm' });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid kind value', () => {
    expect(bachecaFilterSchema.safeParse({ kind: 'dungeon_master' }).success).toBe(false);
  });
});
