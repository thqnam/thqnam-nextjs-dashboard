import type { NextAuthConfig } from 'next-auth';
// import postgres from 'postgres';
// import { resetTarget } from '@/app/lib/actions';

// const listenSocket = postgres(process.env.POSTGRES_URL!, { publications: 'watchingall' });
// let lisSock : postgres.SubscriptionHandle;

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) {
          // lisSock = await listenSocket.subscribe(
          //     '*',
          //     (row, { command, relation }) => {
          //       resetTarget(nextUrl.pathname + nextUrl.search);
          //     }
          //   )
          return true;
        } else {
          // lisSock.unsubscribe();
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