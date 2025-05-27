'use server';

import { supabase } from '@/app/lib/supabaseClient';
import { auth } from '@/auth';

export async function globalSignOut() {
  const session = await auth();
  if (!session?.user?.email) return;

  // Lấy user id từ bảng users
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', session.user.email);

  if (userError || !users || users.length === 0) return;

  const userId = users[0].id;

  // Xóa tất cả session của user này
  await supabase
    .from('sessions')
    .delete()
    .eq('user_id', userId);
}