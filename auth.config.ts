import type { NextAuthConfig } from 'next-auth';
import { getSessionEmail } from './app/lib/actions';
import { getUser } from './auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    session: {
      strategy: 'jwt', // hoặc 'jwt' 'database'
      maxAge: 60 * 60 * 24 * 30, // 30 ngày (tính bằng giây)
      updateAge: 60 * 60 * 24, // 1 ngày (tính bằng giây)
    },
    callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        const email = await getSessionEmail();
        const user = await getUser(email);
        if (isLoggedIn && user?.status === "login") {
          return true;
        } else {
          return false
        }
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;