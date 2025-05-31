import { getSessionInfor } from '@/app/lib/data'
import UserGreetingClient from '../lib/logSignListen';
import Image from 'next/image';

export default async function UserGreeting() {
  const sessionUser = await getSessionInfor();
  
  if (sessionUser){

    return (
      <div className="flex flex-col items-start gap-1 p-4 bg-white rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-700 text-left">
          👋 Welcome{' '}<Image
            src={`${sessionUser.image}`}
            className="rounded-full"
            alt={`${sessionUser.name}'s profile image`}
            width={28}
            height={28}
          />{' '}<b>{sessionUser.name}</b>
        </div>
        <div className="text-sm text-gray-700 text-left md:text-center">
          Id: <b>{sessionUser.id}</b>
        </div>
        <div className="text-sm text-gray-700 text-left md:text-right">
          Email: <b>{sessionUser.email}</b>
        </div>
        <UserGreetingClient userEmail={sessionUser.email} />
      </div>
    );

  } else {
    return null;
  }
}