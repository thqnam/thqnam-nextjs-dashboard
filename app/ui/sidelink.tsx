'use client';

import { ArrowRightIcon, ArrowUpIcon, ArrowDownIcon ,ArrowTurnDownRightIcon, ArrowTurnDownLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function SideLink() {

  return (
    <>
        <Link
            href="/users/signinrequest"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
            <span>Sign In Request</span> <ArrowRightIcon className="w-5 md:w-6" />
        </Link>
        <Link
            href="/users/resetpassrequest"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
            <span>Reset Pass Request</span> <ArrowTurnDownRightIcon className="w-5 md:w-6" />
        </Link>
        <Link
            href="/users/signuprequest"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
            <span>Sign Up Request</span> <ArrowUpIcon className="w-5 md:w-6" />
        </Link>
        <Link
            href="/users/changemailfromrequest"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
            <span>Change Mail From Request</span> <ArrowTurnDownLeftIcon className="w-5 md:w-6" />
        </Link>
        <Link
            href="/users/resetemailrequest"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
            <span>Reset Email Request</span> <ArrowTurnDownLeftIcon className="w-5 md:w-6" />
        </Link>
        <Link
            href="/users/signdownrequest"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
            <span>Sign Down Request</span> <ArrowDownIcon className="w-5 md:w-6" />
        </Link>
    </>
  );
}
