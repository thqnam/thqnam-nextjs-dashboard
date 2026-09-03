import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import UserGreeting from '@/app/ui/UserGreeting';
import { Metadata } from 'next';
import { standardMetadata } from '@/app/lib/standardMetadata';
 
export const metadata: Metadata = {
  title: 'Not-Found Customer',
  ...standardMetadata,
};
 
export default async function NotFound() {
  
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <UserGreeting />
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested customer.</p>
      <Link
        href="/dashboard/customers"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Go Back
      </Link>
    </main>
  );
}