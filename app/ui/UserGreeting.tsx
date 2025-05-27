import { auth } from '@/auth';
// import UserGreetingClient from '../lib/logSignListen';

export default async function UserGreeting() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <div className='flex justify-between items-center p-4 bg-white rounded-lg shadow-sm'>
        <div className="mb-2 text-sm text-gray-700">
            👋 Welcome, <b>{session.user.name || session.user.email}</b>
        </div>
        <div className="mb-2 text-sm text-gray-700">
            Email: <b>{session.user.email}</b>
        </div>
        {/* Lắng nghe realtime đăng xuất */}
        {/* <UserGreetingClient userId={session.user.id} /> */}
    </div>
  );
}