'use server'

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { authConfig } from '@/auth.config';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      id: 'google',
    }),
  ],
});

export async function GoogleSignIn(){
    await signIn('google', {redirect: true, redirectTo: '/dashboard'});
}