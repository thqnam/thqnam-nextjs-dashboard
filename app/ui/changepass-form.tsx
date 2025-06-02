'use client';
 
import { lusitana } from '@/app/ui/fonts';
import {
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { 
  ArrowLeftIcon,
  ArrowTurnLeftUpIcon,
} from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState, useEffect, useState } from 'react';
import { changeUserPass, ChangePassState, resetTarget } from '@/app/lib/actions';
 
export default async function ChangePassForm() {
  const [passwordInputType, setPasswordInputType] = useState('');
  const [repasswordInputType, setRePasswordInputType] = useState('');
  const changePasswordInputStatus = () => {
    if (passwordInputType === 'password'){
      setPasswordInputType('text');
    } else {
      setPasswordInputType('password');
    }
  }
  const changeRePasswordInputStatus = () => {
    if (repasswordInputType === 'password'){
      setRePasswordInputType('text');
    } else {
      setRePasswordInputType('password');
    }
  }
  useEffect(() => {
    setPasswordInputType('password');
    setRePasswordInputType('password');
  }, []);

  const initialState: ChangePassState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(changeUserPass, initialState);
 
  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Input for Change Pass
        </h1>
        <div className="w-full">
          <div className="mt-4">
            <label
              className="flex items gap-2 mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="newpassword"
            >
              New Password{' '}
              <button type="button" onClick={changePasswordInputStatus}>
                {passwordInputType === 'password' ? '(Unhide)' : '(Hide)'}
              </button>
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="newpassword"
                type={passwordInputType}
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
              className="flex items gap-2 mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="renewpassword"
            >
              Re-New Password{' '}
              <button type="button" onClick={changeRePasswordInputStatus}>
                {repasswordInputType === 'password' ? '(Unhide)' : '(Hide)'}
              </button>
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="renewpassword"
                type={repasswordInputType}
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
        <Button className="mt-4 w-full" aria-disabled={isPending} type='submit'>
          Change Pass <ArrowTurnLeftUpIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <Button className="mt-4 w-full" aria-disabled={isPending} type='reset'>
          Reset Change <ExclamationCircleIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <button 
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
          onClick={() => resetTarget('/dashboard')}
          aria-disabled={isPending}
        >
          Cancel Change <ArrowLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
        </button>
      </div>
    </form>
  );
}