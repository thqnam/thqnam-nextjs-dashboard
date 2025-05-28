import { getSessionInfor } from '@/app/lib/actions'
import { getUser } from '@/auth';
import { logOut } from '@/app/lib/actions';
import UserGreetingClient from '../lib/logSignListen';

export default async function UserGreeting() {
  const sessionUser = await getSessionInfor();
  
  if (sessionUser){
    const email = sessionUser.email;
    if (email !== '' && email !== null && email !== undefined){
      const user = await getUser(email);
      if (user !== undefined){
        const userStatus = user.status
        if (userStatus === 'logout'){
          await logOut();
        }
      }
    }
    return (
      <div className="flex flex-col items-start gap-1 p-4 bg-white rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-gray-700 text-left">
          👋 Welcome, <b>{sessionUser.name}</b>
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