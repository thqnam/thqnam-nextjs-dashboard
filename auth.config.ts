import type { NextAuthConfig } from 'next-auth';
import { getUserByEmail, updateUser, insertUser } from '@/auth';

export const authConfig = {
  pages: {
      signIn: '/signin',
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
        if (isLoggedIn) {
          return true;
        } else {
          return false;
        }
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      // Nếu đăng nhập bằng OAuth (Google, GitHub, ...)
      if (account && account.provider !== 'credentials') {
        // Kiểm tra user đã tồn tại trong DB chưa
        const dbUser = await getUserByEmail(token.email as string);
        if (dbUser) {
          // Nếu đã có, gán id vào token để đồng bộ với credentials
          token.id = dbUser.id;
          token.name = profile?.name;
          token.email = profile?.email;
          token.picture = profile?.picture;
          await updateUser(token.id as string, token.email as string, token.name as string, token.picture as string);
        } else {
          // Nếu chưa có, tạo user mới trong DB (tùy ý, hoặc để NextAuth tự tạo)
          token.name = profile?.name;
          token.email = profile?.email;
          token.picture = profile?.picture;
          await insertUser(token.email as string, token.name as string, token.picture as string);
          const dbUser = await getUserByEmail(token.email as string);
          if (dbUser){
            // Sau đó lấy lại user và gán id vào token
            token.id = dbUser.id;
          } else {
            console.error('Failed to Post Google Sign In.');
            throw new Error('Failed to Post Google Sign In.');
          }
        }
      }else {
        // Nếu đăng nhập bằng credentials, logic cũ vẫn giữ nguyên
        if (user && user.id) {
          token.id = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === 'string') {
        (session.user as { id: string }).id = token.id;
      }
      return session;
    }
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;