import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/navigation', () => ({
  redirect: vi.fn().mockImplementation((url: string) => {
    throw Object.assign(new Error(url), { __isRedirect: true });
  }),
}));

vi.mock('@trova-tavolo/core/supabase/server', () => ({
  createSupabaseServerClient: vi.fn(),
}));

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@trova-tavolo/core/supabase/server';
import { loginAction, signupAction } from './actions';

function makeFormData(data: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(data)) fd.set(k, v);
  return fd;
}

const mockSignUp = vi.fn();
const mockSignIn = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(createSupabaseServerClient).mockResolvedValue({
    auth: { signUp: mockSignUp, signInWithPassword: mockSignIn },
  } as never);
});

describe('signupAction', () => {
  it('returns a validation error for an invalid email', async () => {
    const result = await signupAction({}, makeFormData({ email: 'not-an-email', password: 'password123' }));
    expect(result).toEqual({ error: 'validation' });
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('returns a validation error when password is under 8 characters', async () => {
    const result = await signupAction({}, makeFormData({ email: 'user@example.com', password: 'short' }));
    expect(result).toEqual({ error: 'validation' });
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('returns check_email on successful signup', async () => {
    mockSignUp.mockResolvedValue({ error: null });
    const result = await signupAction(
      {},
      makeFormData({ email: 'user@example.com', password: 'password123' }),
    );
    expect(result).toEqual({ message: 'check_email' });
  });

  it('returns the Supabase error message when signup fails', async () => {
    mockSignUp.mockResolvedValue({ error: { message: 'Email already registered' } });
    const result = await signupAction(
      {},
      makeFormData({ email: 'taken@example.com', password: 'password123' }),
    );
    expect(result).toEqual({ error: 'Email already registered' });
  });
});

describe('loginAction', () => {
  it('returns an invalid error for a non-email string', async () => {
    const result = await loginAction({}, makeFormData({ email: 'notanemail', password: 'pw' }));
    expect(result).toEqual({ error: 'invalid' });
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('returns an invalid error when Supabase rejects the credentials', async () => {
    mockSignIn.mockResolvedValue({ error: { message: 'Invalid login credentials' } });
    const result = await loginAction(
      {},
      makeFormData({ email: 'user@example.com', password: 'wrongpassword' }),
    );
    expect(result).toEqual({ error: 'invalid' });
  });

  it('redirects to /account on successful login', async () => {
    mockSignIn.mockResolvedValue({ error: null });
    await expect(
      loginAction({}, makeFormData({ email: 'user@example.com', password: 'correctpassword' })),
    ).rejects.toThrow('/account');
    expect(redirect).toHaveBeenCalledWith('/account');
  });
});
