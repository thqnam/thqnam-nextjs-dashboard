'use client';
 
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { 
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowTurnRightDownIcon,
} from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import { changeUserPass, ChangePassState } from '@/app/lib/actions';
import Link from 'next/link';
 
export default function ChangePassForm() {
  const initialState: ChangePassState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(changeUserPass, initialState);
 
  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Input some infor for Change Pass
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                aria-describedby='email-error'
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="email-error" aria-live="polite" aria-atomic="true">
                {state.errors?.email &&
                state.errors.email.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                    </p>
                ))}
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="oldpassword"
            >
              Old Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="oldpassword"
                type="password"
                name="oldpassword"
                placeholder="Enter your old password"
                aria-describedby='oldpassword-error'
                required
                minLength={10}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="oldpassword-error" aria-live="polite" aria-atomic="true">
                {state.errors?.oldpassword &&
                state.errors.oldpassword.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                    </p>
                ))}
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="newpassword"
            >
              New Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="newpassword"
                type="password"
                name="newpassword"
                placeholder="Enter your new password"
                aria-describedby='newpassword-error'
                required
                minLength={10}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="newpassword-error" aria-live="polite" aria-atomic="true">
                {state.errors?.newpassword &&
                state.errors.newpassword.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                    </p>
                ))}
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="renewpassword"
            >
              Re-New Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="renewpassword"
                type="password"
                name="renewpassword"
                placeholder="Re-Enter your new password"
                aria-describedby='renewpassword-error'
                required
                minLength={10}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="renewpassword-error" aria-live="polite" aria-atomic="true">
                {state.errors?.renewpassword &&
                state.errors.renewpassword.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                    </p>
                ))}
            </div>
          </div>
        </div>
        <Button className="mt-4 w-full" aria-disabled={isPending}>
          Change Pass <ArrowTurnRightDownIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {state.message && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{state.message}</p>
            </>
          )}
        </div>
        <Link 
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
          href="/signup"
        >
          Sign Up <ArrowUpIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Link>
        <Link 
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
          href="/signin"
        >
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Link>
        <Link 
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
          href="/"
        >
          Come Back <ArrowLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Link>
      </div>
    </form>
  );
}