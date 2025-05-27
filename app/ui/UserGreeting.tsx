import { auth } from '@/auth';

export default async function UserGreeting() {
  const session = await auth();
  if (!session?.user) return null;
  return (
    <div className="mb-2 text-sm text-gray-700">
      👋 Welcome, <b>{session.user.name || session.user.email}</b>
    </div>
  );
}