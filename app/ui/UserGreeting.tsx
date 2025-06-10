'use client';

import { getSessionInfor } from '@/app/lib/data'
import UserGreetingClient from '@/app/lib/logSignListen';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';
import Image from 'next/image';

export default async function UserGreeting() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadSession = async () => {
      const sessionUser = await getSessionInfor();
      setEmail(`${sessionUser.email || ''}`);
      setName(`${sessionUser.name || ''}`);
      setImage(`${sessionUser.image || ''}`);
    };
    loadSession();
  }, []);

  useEffect(() => {
    if (!email) return;

    const channel = supabase
      .channel('user-session')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `email=eq.${email}` },
        async (payload) => {
          if (
            payload.new.name !== payload.old.name ||
            payload.new.image !== payload.old.image
          ) {
            router.refresh();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [email, router]);

  // const { data: { session } } = await supabase.auth.getSession();
  // const sessionOAuth = session;
  
  if (email === '' || name === '' || image === ''){

    return (
      <div className="flex flex-col items-start gap-1 p-4 bg-white rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-700 text-left">
          👋 Welcome
        </div>
        <div className="text-sm text-gray-700 text-left md:text-right">
          Email:
        </div>
      </div>
    );

  } else {
    return (
      <div className="flex flex-col items-start gap-1 p-4 bg-white rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-700 text-left">
          👋 Welcome{' '}<Image
            src={image}
            className="rounded-full"
            alt={`${name}'s profile image`}
            width={28}
            height={28}
          />{' '}<b>{name}</b>
        </div>
        <div className="text-sm text-gray-700 text-left md:text-right">
          Email: <b>{email}</b>
        </div>
        <UserGreetingClient userEmail={email} />
      </div>
    );
  }
  // else if (sessionOAuth !== null){

  //   const user = sessionOAuth.user;
  //   const email = user.email || '';
  //   const name: string = user.user_metadata.full_name || user.user_metadata.name || '';
  //   const image: string = user.user_metadata.avatar_url || user.user_metadata.picture || '';
  //   return (
  //     <div className="flex flex-col items-start gap-1 p-4 bg-white rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
  //       <div className="flex items-center gap-2 text-sm text-gray-700 text-left">
  //         👋 Welcome{' '}<Image
  //           src={`${image}`}
  //           className="rounded-full"
  //           alt={`${name}'s profile image`}
  //           width={28}
  //           height={28}
  //           hidden={image === ''}
  //         />{' '}<b>{name}</b>
  //       </div>
  //       <div className="text-sm text-gray-700 text-left md:text-right">
  //         Email: <b>{email}</b>
  //       </div>
  //       <UserGreetingClient userEmail={email} />
  //     </div>
  //   );

  // } 
}