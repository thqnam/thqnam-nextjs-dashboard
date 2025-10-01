'use client';

import { useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { LogOut } from '@/app/lib/actions';
import { getUserByID } from '@/app/lib/utils';
import { useSessionInforContext } from '@/app/ui/sessionInforContext';

export default function UserGreetingClient() {
  
  const { sessionId: id } = useSessionInforContext();

  const checkUserStatus = async (id : string) => {
    const user = await getUserByID(id);
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
    checkUserStatus(id);
    const channel = supabase
      .channel('users-status')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${id}` },
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
          if (payload.old.id === id) {
            await LogOut();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [id]);

  return null;
}