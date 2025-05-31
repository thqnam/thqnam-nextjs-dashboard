'use client';

import { useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { signOut } from '@/auth';

export default async function UserGreetingClient({ userEmail }: { userEmail: string | null | undefined}) {

  useEffect(() => {
    // Không lắng nghe nếu userEmail không hợp lệ
    if (userEmail === '' || userEmail === null || userEmail === undefined){
      return;
    } else {
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
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

  }, [userEmail]);

  return null;
}