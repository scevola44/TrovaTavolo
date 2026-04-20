'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { updateProfileSchema } from '@trova-tavolo/core/schemas';
import { createSupabaseServerClient } from '@trova-tavolo/core/supabase/server';
import { createSupabaseAdminClient } from '@trova-tavolo/core/supabase/admin';

export type ProfileFormState = { error?: string; success?: boolean };

export async function updateProfileAction(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'unauthorized' };

  const parsed = updateProfileSchema.safeParse({
    display_name: formData.get('display_name'),
    bio: formData.get('bio') ?? '',
    contact_handle: formData.get('contact_handle') ?? '',
  });
  if (!parsed.success) return { error: 'validation' };

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: parsed.data.display_name,
      bio: parsed.data.bio || null,
      contact_handle: parsed.data.contact_handle || null,
    })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/account');
  return { success: true };
}

export async function deleteAccountAction(formData: FormData): Promise<void> {
  const confirm = formData.get('confirm');
  if (confirm !== 'ELIMINA' && confirm !== 'DELETE') return;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const admin = createSupabaseAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw new Error(error.message);

  await supabase.auth.signOut();
  redirect('/');
}
