'use client';

import { useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { getUserByEmail } from '@/auth';
import { logOut } from '@/app/lib/actions';

export default function UserGreetingClient({ userEmail }: { userEmail: string | null | undefined}) {

  const checkUserStatus = async (email : string) => {
    const user = await getUserByEmail(email);
    if (user !== undefined){
      const userStatus = user.status;
      if (userStatus === 'logout'){
        await logOut();
      }
    } else {
      await logOut();
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
              await logOut();
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'DELETE', schema: 'public', table: 'users' },
          async (payload) => {
            if (payload.old?.email === userEmail) {
              await logOut();
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