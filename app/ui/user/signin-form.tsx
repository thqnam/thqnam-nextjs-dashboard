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
  ArrowTurnDownRightIcon,
  ArrowDownIcon,
  ArrowTurnDownLeftIcon,
} from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useEffect, useState, useActionState } from 'react';
import { authenticate, GoogleSignIn, GithubSignIn } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import zxcvbn from 'zxcvbn';

export default function Form() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '';
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );
  const [showError, setShowError] = useState(true);
  const [passwordInputType, setPasswordInputType] = useState('');
  const [password, setPassword] = useState('');
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  const changePasswordInputStatus = () => {
    if (passwordInputType === 'password'){
      setPasswordInputType('text');
    } else {
      setPasswordInputType('password');
    }
  };

  useEffect(() => {
    setPasswordInputType('password');
  }, []);

  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      setPasswordScore(result.score);
      setPasswordFeedback(result.feedback.warning || result.feedback.suggestions.join(' '));
    } else {
      setPasswordScore(0);
      setPasswordFeedback('');
    }
  }, [password]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setShowError(true);
    if (password && passwordScore < 3) {
      e.preventDefault();
      setPasswordFeedback('Password is not strong enough. Please choose a more complex password.');
    }
  };

  return (
    <form
      action={formAction}
      className="space-y-3"
      onReset={() => setShowError(false)}
      onSubmit={handleSubmit}
      onChange={() => setShowError(false)}
    >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Input for Sign In
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
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="flex items gap-2 mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password{' '}
              <button type="button" onClick={changePasswordInputStatus}>
                {passwordInputType === 'password' ? '(Unhide)' : '(Hide)'}
              </button>
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type={passwordInputType}
                name="password"
                placeholder="Enter your password"
                required
                minLength={10}
                value={password}
                onChange={handlePasswordChange}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {password && (
              <div className="mt-2 text-sm">
                <span>
                  Password strength: {['Very weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordScore]}
                </span>
                {passwordScore < 3 && (
                  <div style={{ color: 'red' }}>
                    {passwordFeedback || 'Password is not strong enough. Please choose a more complex password.'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {showError && errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
        <Button className="mt-4 w-full" aria-disabled={isPending} type='submit'>
          Sign In <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <Button className="mt-4 w-full" aria-disabled={isPending} type='reset'>
          Reset Sign<ExclamationCircleIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <Button className="mt-4 w-full" aria-disabled={isPending} type='button' onClick={async () => await GoogleSignIn()}>
          Google Sign In<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <Button className="mt-4 w-full" aria-disabled={isPending} type='button' onClick={async () => await GithubSignIn()}>
          Github Sign In<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        <Link 
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
          href="/resetpassrequest"
          aria-disabled={isPending}
        >
          Reset Pass Request <ArrowTurnDownRightIcon className="ml-auto h-5 w-5 text-gray-50" />
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
          href="/changemailfromrequest"
          aria-disabled={isPending}
        >
          Change Mail From Request <ArrowTurnDownLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Link>
        <Link 
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
          href="/signdownrequest"
          aria-disabled={isPending}
        >
          Sign Down Request <ArrowDownIcon className="ml-auto h-5 w-5 text-gray-50" />
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