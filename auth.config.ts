import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    session: {
      strategy: 'jwt', // hoặc 'jwt' 'database'
      maxAge: 60 * 60 * 24 * 30, // 30 ngày (tính bằng giây)
      updateAge: 60 * 60 * 24, // 1 ngày (tính bằng giây)
      generateSessionToken() {
        return crypto.randomUUID(); // Tạo token duy nhất
      },
    },
    callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) {
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