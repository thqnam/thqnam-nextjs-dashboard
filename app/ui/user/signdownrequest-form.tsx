'use client';
 
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { 
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowTurnDownRightIcon,
  ArrowDownIcon,
  ArrowTurnDownLeftIcon,
} from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState, useState } from 'react';
import { deleteUserRequest, DeleteUserRequestState, GoogleSignIn, GithubSignIn } from '@/app/lib/actions';
import Link from 'next/link';
 
export default function Form() {
  const initialState: DeleteUserRequestState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(deleteUserRequest, initialState);
  const [showError, setShowError] = useState(true); // State phụ để điều khiển hiển thị lỗi
 
  return (
    <form
      action={formAction}
      className="space-y-3"
      onReset={() => setShowError(false)} // Ẩn lỗi khi reset
      onSubmit={() => setShowError(true)} // Hiện lại lỗi khi submit
      onChange={() => setShowError(false)} // Ẩn lỗi khi sửa dữ liệu đã nhập
    >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Input for Sign Down Request
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
              {showError && state.errors?.email &&
                state.errors.email.map((error: string) => (
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
          {showError && state.message && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{state.message}</p>
            </>
          )}
        </div>
        <Button className="mt-4 w-full" aria-disabled={isPending} type='submit'>
          Sign Down Request <ArrowDownIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <Button className="mt-4 w-full" aria-disabled={isPending} type='reset'>
          Reset Sign Request <ExclamationCircleIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <Button className="mt-4 w-full" aria-disabled={isPending} type='button' onClick={async () => await GoogleSignIn()}>
          Google Sign In<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <Button className="mt-4 w-full" aria-disabled={isPending} type='button' onClick={async () => await GithubSignIn()}>
          Github Sign In<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <Link
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full"
          href="/signinrequest"
          aria-disabled={isPending}
        >
          Sign In Request<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Link>
        <Link 
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
          href="/resetpassrequest"
          aria-disabled={isPending}
        >
          Reset Pass Request <ArrowTurnDownRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Link>
        <Link 
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
          href="/changemailfromrequest"
          aria-disabled={isPending}
        >
          Change Mail From Request <ArrowTurnDownLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Link>
        <Link 
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
          href="/signuprequest"
          aria-disabled={isPending}
        >
          Sign Up Request <ArrowUpIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Link>
        <Link 
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
          href="/"
          aria-disabled={isPending}
        >
          Come Back <ArrowLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Link>
      </div>
    </form>
  );
}