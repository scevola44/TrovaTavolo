import { describe, expect, it } from 'vitest';
import { loginSchema, signupSchema, updateProfileSchema } from './profile';

describe('updateProfileSchema', () => {
  it('accepts minimal valid input', () => {
    const result = updateProfileSchema.safeParse({
      display_name: 'Marco',
      bio: '',
      contact_handle: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a display_name shorter than the minimum', () => {
    expect(updateProfileSchema.safeParse({ display_name: 'a' }).success).toBe(false);
  });

  it('rejects a contact_handle shorter than the minimum', () => {
    expect(
      updateProfileSchema.safeParse({ display_name: 'Marco', contact_handle: 'ab' }).success,
    ).toBe(false);
  });

  it('trims whitespace from display_name before validation', () => {
    const result = updateProfileSchema.safeParse({ display_name: '   Marco   ' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.display_name).toBe('Marco');
  });

  it('accepts input with only display_name when optional fields are omitted', () => {
    expect(updateProfileSchema.safeParse({ display_name: 'Marco' }).success).toBe(true);
  });

  it('rejects a display_name over the maximum length', () => {
    expect(
      updateProfileSchema.safeParse({ display_name: 'a'.repeat(41) }).success,
    ).toBe(false);
  });
});

describe('signupSchema', () => {
  it('accepts a valid email and password', () => {
    expect(signupSchema.safeParse({ email: 'user@example.com', password: 'password123' }).success).toBe(
      true,
    );
  });

  it('rejects non-email strings', () => {
    expect(signupSchema.safeParse({ email: 'notanemail', password: 'password123' }).success).toBe(
      false,
    );
  });

  it('rejects passwords under 8 characters', () => {
    expect(signupSchema.safeParse({ email: 'a@b.co', password: 'short' }).success).toBe(false);
  });

  it('rejects passwords over 72 characters', () => {
    expect(
      signupSchema.safeParse({ email: 'a@b.co', password: 'a'.repeat(73) }).success,
    ).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts any non-empty password (no length constraint at login)', () => {
    expect(loginSchema.safeParse({ email: 'a@b.co', password: 'x' }).success).toBe(true);
  });

  it('rejects a non-email string', () => {
    expect(loginSchema.safeParse({ email: 'notanemail', password: 'x' }).success).toBe(false);
  });
});
