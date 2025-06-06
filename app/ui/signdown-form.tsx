'use client';

import { ImageField, User } from '@/app/lib/definitions';
import Image from 'next/image'; 
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  ExclamationCircleIcon,
  IdentificationIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { 
  ArrowLeftIcon,
  ArrowDownIcon,
} from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState, useEffect, useState } from 'react';
import { 
    deleteUser, 
    DeleteUserState,
    resetTarget 
} from '@/app/lib/actions';
import { fetchImageByURL, getSessionEmail } from '@/app/lib/data';
import { getUserByEmail } from '@/app/lib/data';
import { supabase } from '@/app/lib/supabaseClient';
 
export default async function SignDownForm() {
  const [id, setID] = useState('');
  const [user, setUser] = useState({} as User);
  const [image, setImage] = useState({} as ImageField);
  const loadUser = async () => {
    const idTerm = await getSessionEmail();
    if (idTerm !== ''){
      setID(idTerm);
      const data = await getUserByEmail(idTerm);
      if (data !== undefined){
        setUser(data);
      }
    }
  };
  const loadImage = async () => {
    const data = await fetchImageByURL(user.image);
    setImage(data);
  };

  const loadUserAndImages = async () => {
    const idTerm = await getSessionEmail();
    if (idTerm !== ''){
      setID(idTerm);
      const userTerm = await getUserByEmail(idTerm);
      if (userTerm !== undefined){
        setUser(userTerm);
        const imageTerm = await fetchImageByURL(userTerm.image);
        setImage(imageTerm);
      }
    }
  };

  useEffect(() => {
    loadUserAndImages(); 

    // Lắng nghe realtime chỉ trên customers mà thôi
    const channel = supabase
      .channel('user-delete')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'images' },
        loadImage
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        loadUser
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const initialState: DeleteUserState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(deleteUser, initialState);
  const [showError, setShowError] = useState(true); // State phụ để điều khiển hiển thị lỗi

  if (!user || !image || id === ''){
    return (
      <form className="space-y-3">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Input for Sign Down
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
                    disabled
                  >
                    <option value="" disabled>
                      Select a Image
                    </option>
                  </select>
                  <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
            {/* Re input ID for delete*/}
            <div>
            <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="reid"
            >
                Re Input User ID
            </label>
            <div className="relative">
                <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="reid"
                type="text"
                name="reid"
                disabled
                />
                <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            </div>
          </div>
          <Button className="mt-4 w-full" disabled>
            Sign Down <ArrowDownIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
          <Button className="mt-4 w-full" disabled>
            Reset Sign <ExclamationCircleIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
          <button 
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
            onClick={() => resetTarget('/dashboard')}
          >
            Come Back <ArrowLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
          </button>
        </div>
      </form>
    );

  } else {
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
            Input for Sign Down
          </h1>
          <div className="w-full">
            {/* Image_URL */}
            <div>
              <label
                className="flex items gap-2 mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="image"
              >
                Choose Image{' '}
                <Image
                  src={image.path}
                  className="rounded-full"
                  alt={`${user.name}'s profile image`}
                  width={28}
                  height={28}
                />
              </label>
              <div className="relative">
                <select
                  id="image"
                  name="image"
                  className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  defaultValue={image.path}
                  disabled
                >
                  <option key={image.path} value={image.path}>
                    {image.name}
                  </option>
                </select>
                <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                  defaultValue={user.email}
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
                  defaultValue={user.name}
                  disabled
                />
                <InformationCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {/* Re input ID for delete*/}
            <div>
              <label
                className="flex flex-col mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="reid"
              >
                <p>Re Input User ID:</p>
                <p>{user.id}</p>
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="reid"
                  type="text"
                  name="reid"
                  placeholder='Re input customer ID to confirm deletion'
                  aria-describedby="reid-error"
                  required
                  autoFocus
                />
                <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
              <div id="reid-error" aria-live="polite" aria-atomic="true">
                {showError && state.errors?.reid &&
                  state.errors.reid.map((error: string) => (
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
          <Button className="mt-4 w-full" aria-disabled={isPending}>
            Sign Down <ArrowDownIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
          <Button className="mt-4 w-full" aria-disabled={isPending} type='reset'>
            Reset Sign <ExclamationCircleIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
          <button 
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
            onClick={() => resetTarget('/dashboard')}
            aria-disabled={isPending}
          >
            Come Back <ArrowLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
          </button>
        </div>
      </form>
    );
  }
}