import type { NextAuthConfig } from 'next-auth';
import { SupabaseAdapter } from '@auth/supabase-adapter';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    adapter: SupabaseAdapter({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      secret: process.env.SUPABASE_SERVICE_ROLE_KEY!, // Lấy từ Supabase Project Settings > API > Service Role Key
    }),
    session: {
      strategy: 'database', // hoặc 'jwt' 'database'
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