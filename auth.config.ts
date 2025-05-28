import type { NextAuthConfig } from 'next-auth';
import { getUser } from '@/auth';
import { getSessionEmail } from '@/app/lib/actions';


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
      const email = await getSessionEmail();
      if (email !== ''){
        const user = await getUser(email);
        if (user !== undefined){
          const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
          if (isOnDashboard) {
            if (user.status === "login") {
              return true;
            } else {
              return false
            }
          } else if (user.status === "login") {
            return Response.redirect(new URL('/dashboard', nextUrl));
          }
        } else {
          return false;
        }
      } else {
        return true;
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;