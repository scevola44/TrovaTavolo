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
});
