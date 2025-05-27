import { auth } from '@/auth';
// import UserGreetingClient from '../lib/logSignListen';

export default async function UserGreeting() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <div className="flex flex-col items-start gap-1 p-4 bg-white rounded-lg shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-gray-700 text-left">
        👋 Welcome, <b>{session.user.name || session.user.email}</b>
      </div>
      <div className="text-sm text-gray-700 text-left md:text-right">
        Email: <b>{session.user.email}</b>
      </div>
      {/* <UserGreetingClient userId={session.user.id} /> */}
    </div>
  );
}