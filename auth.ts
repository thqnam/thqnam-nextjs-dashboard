import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';
import { supabase } from '@/app/lib/supabaseClient';
 
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const { data, error, count } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();
  if (error) {
    console.error('Failed to fetch user by email: Reason', error.message);
    throw new Error('Failed to fetch user by email. Reason' + error.message); 
  } else {
    if (count === 0){
      return undefined;
    } else {
      const user = data as User;
      return user;
    }
  }
}

export async function getUserByID(id: string): Promise<User | undefined> {
  const { data, error, count } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('Failed to fetch user by id: Reason', error.message);
    throw new Error('Failed to fetch user by id. Reason' + error.message); 
  } else {
    if (count === 0){
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
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUserByEmail(email);
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