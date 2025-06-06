import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';
import { supabase } from '@/app/lib/supabaseClient';
import { AuthError } from 'next-auth';
import { PostgrestError } from '@supabase/supabase-js';
 
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();
  if (error) {
    console.error('Failed to fetch user by email: Reason', error.message);
    let talada : PostgrestError;
    talada = error;
    talada.message = 'Failed to fetch user by email. Reason' + error.message;
    throw talada;
  } else {
    if (data === null){
      return undefined;
    } else {
      const user = data as User;
      return user;
    }
  }
}

export async function updateUser(id: string, email: string, name: string, image: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({
      name: name,
      email: email,
      image: image,
    })
    .eq('id', id)
    .eq('email', email);
  if (error) {
    console.error('Failed to Pre Google Sign In. Reason: ', error.message);
    let talada : PostgrestError;
    talada = error;
    talada.message = 'Failed to Pre Google Sign In. Reason: ' + error.message;
    throw talada;
  }
}

export async function insertUser(email: string, name: string, image: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .insert([
      {
        name: name,
        email: email,
        image: image,
        status: 'logout',
        email_verified: true,
      },
    ]);

  if (error){
    console.error('Failed to Google Sign In. Reason: ', error.message);
    let talada : PostgrestError;
    talada = error;
    talada.message = 'Failed to Google Sign In. Reason: ' + error.message;
    throw talada;
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
    let talada : PostgrestError;
    talada = error;
    talada.message = 'Failed to fetch user by id. Reason' + error.message;
    throw talada;
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

        if (!user.email_verified) {
          let talada = new AuthError();
          talada.type = 'EmailSignInError';
          throw talada;
        }

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
            let talada = new AuthError();
            talada.type = 'AccessDenied';
            throw talada;
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});