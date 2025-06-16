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
  ArrowTurnDownRightIcon,
  ArrowDownIcon,
} from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { fetchImages } from '@/app/lib/data';
import { useActionState } from 'react';
import { createUserRequest, CreateUserRequestState } from '@/app/lib/actions';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
// import { OAuthGoogleSignIn, OAuthGithubSignIn } from '@/app/lib/supabaseAuth';
import Link from 'next/link';
 
export default function Form() {
    const [images, setImages] = useState([] as ImageField[]);
    const [selectedImage, setSelectedImage] = useState('');

    //Hàm fetch lại dữ liệu
    const loadImages = async () => {
      const data = await fetchImages();
      setImages(data);
    };
    //Lần đầu load và khi có realtime event thì fetch lại dữ liệu
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
  const initialState: CreateUserRequestState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(createUserRequest, initialState);
  const [showError, setShowError] = useState(true); // State phụ để điều khiển hiển thị lỗi

  if (!images){
    return (
      <form className="space-y-3">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Input for Sign Up Request
          </h1>
          <div className="w-full">
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
                  disabled
                >
                  <option value="" disabled>
                    Select a Image
                  </option>
                </select>
                <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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
                  disabled
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                  disabled
                />
                <InformationCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
          <Button className="mt-4 w-full" disabled>
            Sign Up Requset <ArrowUpIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
          <Button className="mt-4 w-full" disabled>
            Reset Sign Request <ExclamationCircleIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
          {/* <Button className="mt-4 w-full" disabled>
            Google Sign In<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
          <Button className="mt-4 w-full" disabled>
            Github Sign In<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button> */}
          <Link 
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
            href="/signin"
          >
            Sign in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Link>
          <Link 
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
            href="/resetpassrequest"
          >
            Reset Pass Request <ArrowTurnDownRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Link>
          <Link 
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
            href="/signdownrequest"
          >
            Sign Down Request <ArrowTurnDownRightIcon className="ml-auto h-5 w-5 text-gray-50" />
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

  } else {
    return (
      <form
        action={formAction}
        className="space-y-3"
        onReset={() => {
          setSelectedImage(''); 
          setShowError(false);
        }} // Ẩn lỗi khi reset
        onSubmit={() => setShowError(true)} // Hiện lại lỗi khi submit
        onChange={() => setShowError(false)} // Ẩn lỗi khi sửa dữ liệu đã nhập
      >
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Input for Sign Up
          </h1>
          <div className="w-full">
            <div>
              <label
                className="flex items gap-2 mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="image"
              >
                Choose Image{' '}
                <Image
                  src={selectedImage}
                  className="rounded-full"
                  alt={`Choosed profile picture`}
                  width={28}
                  height={28}
                  hidden={selectedImage === ''}
                />
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
                  onChange={e => setSelectedImage(e.target.value)}
                >
                  <option value="" disabled>
                    Select a Image
                  </option>
                  {images.map((image) => (
                    <option key={image.path} value={image.path}>
                      {image.name}
                    </option>
                  ))}
                </select>
                <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <div id="image-error" aria-live="polite" aria-atomic="true">
                {showError && state.errors?.image &&
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
                  required
                />
                <InformationCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="name-error" aria-live="polite" aria-atomic="true">
                {showError && state.errors?.name &&
                  state.errors.name.map((error: string) => (
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
            Sign Up <ArrowUpIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
          <Button className="mt-4 w-full" aria-disabled={isPending} type='reset'>
            Reset Sign <ExclamationCircleIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
          {/* <Button className="mt-4 w-full" aria-disabled={isPending} type='button' onClick={async () => await OAuthGoogleSignIn()}>
            Google Sign In<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
          <Button className="mt-4 w-full" aria-disabled={isPending} type='button' onClick={async () => await OAuthGithubSignIn()}>
            Github Sign In<ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button> */}
          <Link 
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
            href="/signin"
            aria-disabled={isPending}
          >
            Sign in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
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
}