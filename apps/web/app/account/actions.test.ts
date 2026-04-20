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

vi.mock('@trova-tavolo/core/supabase/admin', () => ({
  createSupabaseAdminClient: vi.fn(),
}));

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@trova-tavolo/core/supabase/server';
import { createSupabaseAdminClient } from '@trova-tavolo/core/supabase/admin';
import { deleteAccountAction, updateProfileAction } from './actions';

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(data)) fd.set(k, v);
  return fd;
}

const mockGetUser = vi.fn();
const mockUpdate = vi.fn();
const mockSignOut = vi.fn();
const mockDeleteUser = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createSupabaseServerClient).mockResolvedValue({
    auth: { getUser: mockGetUser, signOut: mockSignOut },
    from: vi.fn().mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    }),
  } as never);
  vi.mocked(createSupabaseAdminClient).mockReturnValue({
    auth: { admin: { deleteUser: mockDeleteUser } },
  } as never);
  mockUpdate.mockResolvedValue({ error: null });
  mockDeleteUser.mockResolvedValue({ error: null });
  mockSignOut.mockResolvedValue({});
});

describe('deleteAccountAction', () => {
  it('does nothing when the confirmation word is wrong', async () => {
    await deleteAccountAction(makeFormData({ confirm: 'yes' }));
    expect(createSupabaseServerClient).not.toHaveBeenCalled();
  });

  it('deletes the account and redirects when confirm is ELIMINA', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    mockDeleteUser.mockResolvedValue({ error: null });

    await expect(deleteAccountAction(makeFormData({ confirm: 'ELIMINA' }))).rejects.toThrow('/');
    expect(mockDeleteUser).toHaveBeenCalledWith('user-1');
  });

  it('deletes the account and redirects when confirm is DELETE', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-2' } } });
    mockDeleteUser.mockResolvedValue({ error: null });

    await expect(deleteAccountAction(makeFormData({ confirm: 'DELETE' }))).rejects.toThrow('/');
    expect(mockDeleteUser).toHaveBeenCalledWith('user-2');
  });
});

describe('updateProfileAction', () => {
  it('returns unauthorized when the user is not logged in', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const result = await updateProfileAction(
      {},
      makeFormData({ display_name: 'Marco', bio: '', contact_handle: '' }),
    );
    expect(result).toEqual({ error: 'unauthorized' });
  });

  it('returns a validation error when display_name is too short', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });

    const result = await updateProfileAction(
      {},
      makeFormData({ display_name: 'a', bio: '', contact_handle: '' }),
    );
    expect(result).toEqual({ error: 'validation' });
  });

  it('returns success and revalidates the account page on valid update', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });

    const result = await updateProfileAction(
      {},
      makeFormData({ display_name: 'Marco', bio: '', contact_handle: '' }),
    );
    expect(result).toEqual({ success: true });
    expect(revalidatePath).toHaveBeenCalledWith('/account');
  });

  it('returns the database error message when the update fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    vi.mocked(createSupabaseServerClient).mockResolvedValue({
      auth: { getUser: mockGetUser },
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: { message: 'db error' } }),
        }),
      }),
    } as never);

    const result = await updateProfileAction(
      {},
      makeFormData({ display_name: 'Marco', bio: '', contact_handle: '' }),
    );
    expect(result).toEqual({ error: 'db error' });
  });
});
