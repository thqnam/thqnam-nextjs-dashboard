import type { NextAuthConfig } from 'next-auth';
// import { supabase } from '@/app/lib/supabaseClient';

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
    signIn: '/signin',
    signOut: '/',
    newUser: '/signupreponse',
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
      if (isOnDashboard) {
        if (isLoggedIn) {
          return true;
        } else {
          return false;
        }
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      } else {
        return true;
      }
    },
    async jwt({ token, user, trigger }) {
      if (user && user.id) {
        token.id = user.id;
        if (trigger === "update") {
          token.name = user.name;
          token.picture = user.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === 'string') {
        (session.user as { id: string }).id = token.id;
      }
      if (session.user && typeof token.name === 'string') {
        (session.user as { name: string }).name = token.name;
      }
      if (session.user && typeof token.picture === 'string') {
        (session.user as { image: string }).image = token.picture;
      }
      return session;
    }
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;