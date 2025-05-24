'use client';
 
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { resetTarget } from '@/app/lib/actions';
import postgres from 'postgres';

const listenSocket = postgres(process.env.POSTGRES_URL!, { publications: 'watchingall' });
let lisSock : any;

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];

export default async function NavLinks() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  let completedURL : string;
  if (searchParams.size > 0){
    const params = new URLSearchParams(searchParams);
    searchParams.forEach((value, key) => {
      params.set(key, value);
    });
    completedURL = `${pathname}?${params.toString()}`;
  } else {
    completedURL = `${pathname}`;
  }
  if (lisSock !== null) {
    lisSock.unsubscribe();
  }
  lisSock = await listenSocket.subscribe(
    '*',
    (row, { command, relation }) => {
      replace(completedURL);
    }
  )
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
            <button
              key={link.name}
              onClick={() => resetTarget(link.href)}
              className={clsx(
                'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                {
                  'bg-sky-100 text-blue-600': pathname === link.href,
                },
              )}
            >
              <LinkIcon className="w-6" />
              <p className="hidden md:block">{link.name}</p>
            </button>
          );
      })}
    </>
  );
}
