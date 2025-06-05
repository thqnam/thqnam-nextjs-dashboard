import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';
import { supabase } from '@/app/lib/supabaseClient';
 
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();
  if (error) {
    console.error('Failed to fetch user by email: Reason', error.message);
    throw new Error('Failed to fetch user by email. Reason' + error.message); 
  } else {
    if (data === null){
      return undefined;
    } else {
      const user = data as User;
      return user;
    }
  }
}

export async function getUserByID(id: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('Failed to fetch user by id: Reason', error.message);
    throw new Error('Failed to fetch user by id. Reason' + error.message); 
  } else {
    if (data === null){
      return undefined;
    } else {
      const user = data as User;
      return user;
    }
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(10) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await getUserByEmail(email);
        if (!user) return null;

        // --- Rate limit logic ---
        const now = new Date();
        const MAX_ATTEMPTS = 5;
        const BLOCK_TIME_MINUTES = 5;

        // Kiểm tra số lần sai và thời gian block
        if (
          user.failed_attempts !== undefined &&
          user.last_failed_at !== undefined &&
          user.failed_attempts >= MAX_ATTEMPTS
        ) {
          const lastFailed = new Date(user.last_failed_at);
          const diffMinutes = (now.getTime() - lastFailed.getTime()) / 60000;
          if (diffMinutes < BLOCK_TIME_MINUTES) {
            throw new Error('You have entered too many incorrect attempts. Please try again in 5 minutes.');
          }
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          // Cập nhật số lần sai và thời điểm
          await supabase
            .from('users')
            .update({
              failed_attempts: (user.failed_attempts || 0) + 1,
              last_failed_at: now.toISOString(),
            })
            .eq('id', user.id);
          return null;
        }

        // Nếu đúng mật khẩu, reset lại số lần sai
        await supabase
          .from('users')
          .update({
            failed_attempts: 0,
            last_failed_at: null,
          })
          .eq('id', user.id);

        if (!user.email_verified) {
          throw new Error('You need to verify your email before logging in.');
        }

        // Đăng nhập thành công, cập nhật status như cũ
        const { error } = await supabase
          .from('users')
          .update({
            status: "login"
          })
          .eq('email', email)
          .eq('status', 'logout');
        if (error) {
          throw error;
        }
        return user;
      },
    }),
  ],
});