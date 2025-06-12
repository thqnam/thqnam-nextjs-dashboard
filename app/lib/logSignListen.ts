'use client';

import { useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { LogOut } from '@/app/lib/actions';
import { getUserByEmail } from '@/app/lib/utils';

export default function UserGreetingClient({ userEmail }: { userEmail: string }) {

  const checkUserStatus = async (email : string) => {
    const user = await getUserByEmail(email);
    if (user !== undefined){
      const userStatus = user.status;
      if (userStatus === 'logout'){
        await LogOut();
      }
    } else {
      await LogOut();
    }
  };

  useEffect(() => {
    checkUserStatus(userEmail);
    const channel = supabase
      .channel('users-status')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `email=eq.${userEmail}` },
        async (payload) => {
          if (payload.new.status === 'logout') {
            await LogOut();
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'users' },
        async (payload) => {
          if (payload.old.email === userEmail) {
            await LogOut();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [userEmail]);

  return null;
}