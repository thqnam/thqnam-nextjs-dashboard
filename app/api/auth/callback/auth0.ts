'use server'

import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import { authConfig } from '@/auth.config';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_CLIENT_DOMAIN,
      id: 'auth0',
    })
  ],
});

export async function Auth0SignIn(){
    await signIn('auth0');
}