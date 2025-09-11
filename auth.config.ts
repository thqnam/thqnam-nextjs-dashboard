import type { NextAuthConfig } from 'next-auth';
// import { supabase } from '@/app/lib/supabaseClient';

declare module "next-auth" {
  interface User {
    role?: string;
  }
}

// async function checkLocal() {
//   const {data, error} = await supabase.auth.getUser();
//   if (error || data === null){
//     return false;
//   } else {
//     return true;
//   }
// }

export const authConfig = {
  pages: {
    signIn: '/dashboard',
    signOut: '/signinrequest',
  },
  session: {
    strategy: 'jwt', // hoặc 'jwt' 'database'
    maxAge: 60 * 60 * 24 * 30, // 30 ngày (tính bằng giây)
    updateAge: 60 * 60 * 24, // 1 ngày (tính bằng giây)
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      //const isCheckLocal = await checkLocal();
      const isLoggedIn = !!auth?.user; //|| isCheckLocal;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnCustomer = nextUrl.pathname.startsWith('/dashboard/customers');
      const isAdmin = auth?.user?.role === 'admin';
      if (isOnDashboard) {
        if (isLoggedIn) {
          if (isOnCustomer && isAdmin) {
            return true;
          } else {
            return Response.redirect(new URL('/dashboard', nextUrl));
          }
        } else {
          return Response.redirect(new URL('/signinrequest?callbackUrl=' + nextUrl, nextUrl));
        }
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      } else {
        return true;
      }
    },
    async jwt({ token, user, trigger, profile }) {
      if (user) {
        if (user.id) token.id = user.id;
        if (user.email) token.email = user.email;
        if (user.name) token.name = user.name;
        if (user.image) token.picture = user.image;
        if (user.role) token.role = user.role;
      }
      if (user && trigger === 'update'){
        if (user.email) token.email = user.email;
        if (user.name) token.name = user.name;
        if (user.image) token.picture = user.image;
        if (user.role) token.role = user.role;
      }
      if (trigger === 'signIn' && profile){
        token.id = profile.id;
        token.email = profile.email;
        token.name = profile.name;
        token.picture = profile.picture;
        token.role = profile.role;
      }
      if (trigger === 'update' && profile){
        token.email = profile.email;
        token.name = profile.name;
        token.picture = profile.picture;
        token.role = profile.role;
      }
      return token;
    },
    async session({ session, token, trigger }) {
      if (session.user && typeof token.id === 'string') {
        (session.user as { id: string }).id = token.id;
      }
      if (session.user && typeof token.role === 'string') {
        session.user.role = token.role;
      }
      if (trigger === 'update' && token.email !== null && token.email !== undefined){
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        if (typeof token.role === 'string'){
          session.user.role = token.role;
        }
      }
      return session;
    }
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;