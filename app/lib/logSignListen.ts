'use client';

import { useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function UserGreetingClient({ userId }: { userId: string | undefined}) {
  const router = useRouter();

  useEffect(() => {
    if (!userId) return; // Không lắng nghe nếu userId không hợp lệ

    const channel = supabase
      .channel('sessions-realtime')
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'sessions', filter: `user_id=eq.${userId}` },
        () => {
          supabase.removeChannel(channel);
          router.replace('/login');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, router]);

  return null;
}