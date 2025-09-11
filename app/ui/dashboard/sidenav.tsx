'use client';

import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon, ArrowTurnRightUpIcon, ArrowTurnLeftUpIcon } from '@heroicons/react/24/outline';
// import { OAuthGlobalSignOut, OAuthLocalSignOut } from '@/app/lib/supabaseAuth';
import { resetTarget, logOut, resetSession } from '@/app/lib/actions';
import { useSessionInforContext } from '@/app/lib/sessionInforContext';
import { getSessionInfor } from '@/app/lib/data';
import { useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { getUserSessionByID } from '@/app/lib/utils';
import { Suspense } from 'react';

export default function SideNav() {

  const { setSessionId, setSessionName, setSessionEmail, setSessionImage, setSessionRole } = useSessionInforContext();
  const { sessionId: id, sessionEmail: email, sessionName: name, sessionImage: image, sessionRole: role } = useSessionInforContext();
  const loadSession = async () => {
    const sessionUser = await getSessionInfor();
    const sessionID = `${sessionUser.id}`;
    const sessionEmail = `${sessionUser.email}`;
    const sessionName = `${sessionUser.name}`;
    const sessionImage = `${sessionUser.image}`;
    const sessionRole = `${sessionUser.role}`;
    setSessionId(sessionID);
    const userSession = await getUserSessionByID(sessionID);
    if (userSession !== undefined){
      const userEmail = userSession.email;
      const userName = userSession.name;
      const userImage = userSession.image;
      const userRole = userSession.role;
      if (userEmail === sessionEmail && userName === sessionName && userImage === sessionImage && userRole === sessionRole){
        setSessionEmail(sessionEmail);
        setSessionName(sessionName);
        setSessionImage(sessionImage);
        setSessionRole(sessionRole);
      } else {
        setSessionEmail(userEmail);
        setSessionName(userName);
        setSessionImage(userImage);
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
        { event: 'UPDATE', schema: 'public', table: 'users', filter: `id=eq.${id}` },
        async (payload) => {
          if (( payload.new.name !== name ||
                payload.new.image !== image ||
                payload.new.email !== email ||
                payload.new.role !== role) &&
                payload.new.status !== 'logout'
          ){
            console.log('User session changed from realtime: ', payload.new);
            setSessionEmail(payload.new.email);
            setSessionName(payload.new.name);
            setSessionImage(payload.new.image);
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
  
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <button
        type='button'
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        onClick={() => resetTarget('/dashboard')}
        title="Go to Dashboard"
        aria-label="Go to Dashboard"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </button>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <Suspense>
          <NavLinks />
        </Suspense>
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={() => resetTarget('/dashboard/changeinfor')}
        >
          <button
           type='submit'
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
           type='submit'
           className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <ArrowTurnLeftUpIcon className="w-6" />
            <div className="hidden md:block">Change Pass</div>
          </button>
        </form>
        {/* <form
          action={() => {OAuthGlobalSignOut()}}
        >
          <button 
           className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">OAu GoSign</div>
          </button>
        </form>
        <form
          action={() => {OAuthLocalSignOut()}}
        >
          <button 
           className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">OAu LoSign</div>
          </button>
        </form> */}
        <form
          action={() => {logOut()}}
        >
          <button
           type='submit'
           className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
