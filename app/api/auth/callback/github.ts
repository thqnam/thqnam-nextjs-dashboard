import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { authConfig } from '@/auth.config';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      id: 'github',
    }),
  ],
});

export async function GithubSignIn(){
    await signIn('github');
}