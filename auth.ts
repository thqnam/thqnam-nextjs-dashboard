import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';
import { supabase } from '@/app/lib/supabaseClient';
 
export async function getUser(email: string): Promise<User | undefined> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    if (error) {
      throw error
    } else {
      const user = data as User;
      return user;
    }
  } catch (error) {
    console.error('Failed to fetch user: ', error);
    throw new Error('Failed to fetch user.'); 
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
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (passwordsMatch) {
            const { error } = await supabase
              .from('users')
              .update({
                id: user.id,
                email: user.email,
                name: user.name,
                password: user.password,
                status: "login"
              })
              .eq('email', email)
              .eq('status', 'logout');
            if (error) {
              throw error;
            }
            return user;
          }
        }
 
        return null;
      },
    }),
  ],
});