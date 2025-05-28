'use client';

import { useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { logOut } from '@/app/lib/actions';
import { getUser } from '@/auth';

export default function UserGreetingClient({ userEmail }: { userEmail: string | null | undefined}) {

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
          async () => {
            const user = await getUser(userEmail);
            if (user !== undefined){
              const userStatus = user.status
              if (userStatus === 'logout'){
                await logOut();
              }
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