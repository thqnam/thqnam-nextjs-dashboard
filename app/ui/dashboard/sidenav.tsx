'use client';

import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon, ArrowTurnRightUpIcon, ArrowTurnLeftUpIcon } from '@heroicons/react/24/outline';
import { resetTarget, logOut } from '@/app/lib/actions';
import { getSessionEmail } from '@/app/lib/data';
import { useEffect, useRef } from 'react';
import { getUserByEmail } from '@/auth';

export default function SideNav() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      const email = await getSessionEmail();
      const user = await getUserByEmail(email);
      if (user !== undefined){
        const userStatus = user.status;
        if (userStatus === 'logout' && buttonRef.current){
          buttonRef.current.click();
        }
      }
    };
    checkUserStatus();
  }, []);

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <button
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        onClick={() => resetTarget('/dashboard')}
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </button>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={() => resetTarget('/dashboard/changeinfor')}
        >
          <button 
           className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <ArrowTurnRightUpIcon className="w-6" />
            <div className="hidden md:block">Change Infor</div>
          </button>
        </form>
        <form
          action={() => resetTarget('/dashboard/changepass')}
        >
          <button 
           className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <ArrowTurnLeftUpIcon className="w-6" />
            <div className="hidden md:block">Change Pass</div>
          </button>
        </form>
        <form
          action={() => {logOut()}}
        >
          <button 
           className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
           ref={buttonRef}
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
