import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/navigation', () => ({
  redirect: vi.fn().mockImplementation((url: string) => {
    throw Object.assign(new Error(url), { __isRedirect: true });
  }),
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

vi.mock('@trova-tavolo/core/supabase/server', () => ({
  createSupabaseServerClient: vi.fn(),
}));

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@trova-tavolo/core/supabase/server';
import { MAX_ANNOUNCEMENTS_PER_USER_PER_DAY } from '@trova-tavolo/core/constants';
import { createAnnouncementAction } from './actions';

function makeValidFormData(): FormData {
  const fd = new FormData();
  fd.set('kind', 'looking_for_players');
  fd.set('title', 'Cerco giocatori per Milano');
  fd.set('body', 'Campagna settimanale, livello 1, sistema D&D 5e. Dettagli via DM.');
  fd.set('city_id', '2');
  fd.append('game_ids', '1');
  return fd;
}

const mockGetUser = vi.fn();
const mockProfileSingle = vi.fn();
const mockCountQuery = vi.fn();
const mockInsertSingle = vi.fn();
const mockGameInsert = vi.fn();

function setupSupabaseMock() {
  const profileQueryBuilder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: mockProfileSingle,
  };

  const countQueryBuilder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: mockCountQuery,
  };

  const insertAnnouncementBuilder = {
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: mockInsertSingle,
      }),
    }),
  };

  const insertGamesBuilder = {
    insert: mockGameInsert,
  };

  const mockFrom = vi.fn()
    .mockImplementationOnce(() => profileQueryBuilder)
    .mockImplementationOnce(() => countQueryBuilder)
    .mockImplementationOnce(() => insertAnnouncementBuilder)
    .mockImplementationOnce(() => insertGamesBuilder);

  vi.mocked(createSupabaseServerClient).mockResolvedValue({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  } as never);
}

beforeEach(() => {
  vi.clearAllMocks();
  setupSupabaseMock();
  mockProfileSingle.mockResolvedValue({ data: { display_name: 'Marco' } });
  mockCountQuery.mockResolvedValue({ count: 0 });
  mockInsertSingle.mockResolvedValue({ data: { id: 'ann-1' }, error: null });
  mockGameInsert.mockResolvedValue({ error: null });
});

describe('createAnnouncementAction', () => {
  it('redirects to /login when the user is not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(createAnnouncementAction({}, makeValidFormData())).rejects.toThrow('/login');
    expect(redirect).toHaveBeenCalledWith('/login');
  });

  it('returns display_name_missing when the profile has no display_name', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockProfileSingle.mockResolvedValue({ data: null });

    const result = await createAnnouncementAction({}, makeValidFormData());
    expect(result).toEqual({ error: 'display_name_missing' });
  });

  it('returns a validation error when the form data is invalid', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockProfileSingle.mockResolvedValue({ data: { display_name: 'Marco' } });

    const fd = makeValidFormData();
    fd.set('title', 'abc'); // too short (< 4 chars)

    const result = await createAnnouncementAction({}, fd);
    expect(result).toEqual({ error: 'validation' });
  });

  it('returns rate_limited when the user has reached the daily announcement limit', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockCountQuery.mockResolvedValue({ count: MAX_ANNOUNCEMENTS_PER_USER_PER_DAY });

    const result = await createAnnouncementAction({}, makeValidFormData());
    expect(result).toEqual({ error: 'rate_limited' });
  });

  it('redirects to the new announcement page on success', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });

    await expect(createAnnouncementAction({}, makeValidFormData())).rejects.toThrow('/bacheca/ann-1');
    expect(redirect).toHaveBeenCalledWith('/bacheca/ann-1');
  });
});
