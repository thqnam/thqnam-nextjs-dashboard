import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';
import { authConfig } from '@/auth.config';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { supabase } from '@/app/lib/supabaseClient';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/app/lib/utils';
import { profile } from 'console';
 
export const { auth, signIn, signOut, unstable_update } = NextAuth({
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

        const passwordsMatch = bcrypt.compareSync(password, user.password);

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
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      id: 'google',
      async profile(profile){
        const User = {
          id: profile.id as string || profile.sub as string,
          name: profile.name as string || profile.fullname as string,
          image: profile.image as string || profile.picture as string || profile.avatar_url as string,
          email: profile.email as string,
        }
        await unstable_update({user:{id: User.id, name: User.name, image: User.image, email: User.email}})
        return User;
      },
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      id: 'github',
      async profile(profile){
        const User = {
          id: new String(profile.id).valueOf() || profile.sub as string,
          name: profile.name as string || profile.fullname as string,
          image: profile.image as string || profile.picture as string || profile.avatar_url as string,
          email: profile.email as string,
        }
        await unstable_update({user:{id: User.id, name: User.name, image: User.image, email: User.email}})
        return User;
      },
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
});