'use client';

import { getSessionInfor } from '@/app/lib/data';
import { getUserSessionByID } from '@/app/lib/utils';
import UserGreetingClient from '@/app/lib/logSignListen';
import { resetSession } from '@/app/lib/actions';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import Image from 'next/image';
import { useSessionInforContext } from '@/app/lib/sessionInforContext';

export default function UserGreeting({ id }: { id: string }) {
  const { setSessionId, setSessionName, setSessionEmail, setSessionImage, setSessionRole } = useSessionInforContext();
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const loadSession = async () => {
    setSessionId(id);
    const userSession = await getUserSessionByID(id);
    if (userSession !== undefined){
      const userEmail = userSession.email;
      const userName = userSession.name;
      const userImage = userSession.image;
      const userRole = userSession.role;
      const sessionUser = await getSessionInfor();
      const sessionEmail = `${sessionUser.email}`;
      const sessionName = `${sessionUser.name}`;
      const sessionImage = `${sessionUser.image}`;
      const sessionRole = `${sessionUser.role}`;
      if (userEmail === sessionEmail && userName === sessionName && userImage === sessionImage && userRole === sessionRole){
        setEmail(sessionEmail);
        setSessionEmail(sessionEmail);
        setName(sessionName);
        setSessionName(sessionName);
        setImage(sessionImage);
        setSessionImage(sessionImage);
        setRole(sessionRole);
        setSessionRole(sessionRole);
      } else {
        setEmail(userEmail);
        setSessionEmail(userEmail);
        setName(userName);
        setSessionName(userName);
        setImage(userImage);
        setSessionImage(userImage);
        setRole(userRole);
        setSessionRole(userRole);
        await resetSession(userEmail, userName, userImage, userRole);
      }
    }
  };

  useEffect(() => {

    loadSession();

    const channel = supabase
      .channel('user-session')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `email=eq.${email}` },
        async (payload) => {
          if (( payload.new.name !== name ||
                payload.new.image !== image ||
                payload.new.email !== email ||
                payload.new.role !== role) &&
                payload.new.status !== 'logout'
          ){
            setEmail(payload.new.email);
            setSessionEmail(payload.new.email);
            setName(payload.new.name);
            setSessionName(payload.new.name);
            setImage(payload.new.image);
            setSessionImage(payload.new.image);
            setRole(payload.new.role);
            setSessionRole(payload.new.role);
            await resetSession(payload.new.email, payload.new.name, payload.new.image, payload.new.role);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
        <UserGreetingClient id={id} />
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