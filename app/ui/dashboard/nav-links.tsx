'use client';
 
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { resetTarget } from '@/app/lib/actions';
import { useState, useEffect } from 'react';
import { useSessionInforContext } from '@/app/ui/sessionInforContext';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.

const userLinks = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
];

const adminLinks = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Invoices',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  { name: 'Customers', href: '/dashboard/customers', icon: UserGroupIcon },
];

type Link = {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export default function NavLinks() {
  const pathname = usePathname();
  const [links, setLinks] = useState<Link[]>([]);
  const { sessionRole } = useSessionInforContext();
  
  useEffect(() => {
    if (sessionRole === 'admin') {
      setLinks(adminLinks);
    } else {
      setLinks(userLinks);
    }
  }, [sessionRole]);
  
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
            <button
              type="button"
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

