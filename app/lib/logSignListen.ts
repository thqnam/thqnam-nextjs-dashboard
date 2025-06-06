'use client';

import { useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { signOut } from 'next-auth/react'
import { getUserByEmail } from '@/app/lib/data';

export default function UserGreetingClient({ userEmail }: { userEmail: string | null | undefined}) {

  const checkUserStatus = async (email : string) => {
    const user = await getUserByEmail(email);
    if (user !== undefined){
      const userStatus = user.status;
      if (userStatus === 'logout'){
        await signOut({ redirectTo: '/' });
      }
    } else {
      await signOut({ redirectTo: '/' });
    }
  };

  useEffect(() => {
    // Không lắng nghe nếu userEmail không hợp lệ
    if (userEmail === '' || userEmail === null || userEmail === undefined){
      return;
    } else {
      checkUserStatus(userEmail);
      const channel = supabase
        .channel('users-status')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'users', filter: `email=eq.${userEmail}` },
          async (payload) => {
            if (payload.new.status === 'logout') {
              await signOut({ redirectTo: '/' });
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'users' },
          async (payload) => {
            if (payload.old?.email === userEmail) {
              await signOut({ redirectTo: '/' });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

  }, [userEmail]);

  return null;
}