'use client';
 
import { lusitana } from '@/app/ui/fonts';
import { ImageField } from '@/app/lib/definitions';
import Image from 'next/image';
import {
  AtSymbolIcon,
  IdentificationIcon,
  InformationCircleIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { 
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
} from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { fetchImages } from '@/app/lib/data';
import { useActionState } from 'react';
import { createUser, UserState } from '@/app/lib/actions';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import Link from 'next/link';
 
export default function SignUpForm() {
    const [images, setImages] = useState([] as ImageField[]);
    // Hàm fetch lại dữ liệu
    const loadImages = async () => {
    const data = await fetchImages();
        setImages(data);
    };
    // Lần đầu load và khi có realtime event thì fetch lại dữ liệu
    useEffect(() => {
        loadImages();

    // Lắng nghe realtime trên customers và invoices
    const channel = supabase
        .channel('user-create')
        .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'images' },
        loadImages
        )
        .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);
  const initialState: UserState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(createUser, initialState);
 
  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Input some infor for Sign Up
        </h1>
        <div className="w-full">
            {/* Image_URL */}
            <div>
            <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="image"
            >
                Choose Image
            </label>
            <div className="relative">
                <select
                id="image"
                name="image"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                autoFocus
                required
                aria-describedby="image-error"
                disabled={!images}
                >
                <option value="" disabled>
                    Select a Image
                </option>
                {images.map((image) => (
                    <option key={image.path} value={image.path}>
                    <Image
                        src={image.path}
                        className="rounded-full"
                        alt={`${image.name} image name`}
                        width={28}
                        height={28}
                    />
                    <p>{image.name}</p>
                    </option>
                ))}
                </select>
                <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="image-error" aria-live="polite" aria-atomic="true">
                {state.errors?.image &&
                state.errors.image.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                    </p>
                ))}
            </div>
            </div>
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
                disabled={!images}
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
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="name"
            >
              Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="name"
                type="text"
                name="name"
                placeholder="Enter your nick name"
                aria-describedby='name-error'
                disabled={!images}
                required
              />
              <InformationCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="name-error" aria-live="polite" aria-atomic="true">
                {state.errors?.name &&
                state.errors.name.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                    </p>
                ))}
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                aria-describedby='password-error'
                disabled={!images}
                required
                minLength={10}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="password-error" aria-live="polite" aria-atomic="true">
                {state.errors?.password &&
                state.errors.password.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                    </p>
                ))}
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="repassword"
            >
              Re-Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="repassword"
                type="password"
                name="repassword"
                placeholder="Re-Enter your password"
                aria-describedby='repassword-error'
                disabled={!images}
                required
                minLength={10}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="repassword-error" aria-live="polite" aria-atomic="true">
                {state.errors?.repassword &&
                state.errors.repassword.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                    </p>
                ))}
            </div>
          </div>
        </div>
        <Button className="mt-4 w-full" aria-disabled={isPending} disabled={!images}>
          Sign Up <ArrowUpIcon className="ml-auto h-5 w-5 text-gray-50" />
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