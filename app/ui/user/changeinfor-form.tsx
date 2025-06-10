'use client';

import { 
  ImageField, 
  User 
} from '@/app/lib/definitions';
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
  ArrowTurnRightUpIcon,
} from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    changeUserInfor, 
    ChangeInforState,
    resetTarget 
} from '@/app/lib/actions';
import { 
  fetchImages, 
  getSessionEmail,
} from '@/app/lib/data';
import { getUserByEmail } from '../../lib/utils';
import { supabase } from '@/app/lib/supabaseClient';
 
export default async function ChangeInforForm() {
  const [id, setID] = useState('');
  const [user, setUser] = useState({} as User);
  const [images, setImages] = useState([] as ImageField[]);
  const [selectedImage, setSelectedImage] = useState(user.image);
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
  const loadImages = async () => {
    const data = await fetchImages();
    setImages(data);
  };

  useEffect(() => {
    setSelectedImage(user.image);
  }, [user.image]);

  useEffect(() => {
    loadUser();
    loadImages(); 

    // Lắng nghe realtime chỉ trên customers mà thôi
    const channel = supabase
      .channel('user-edit')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'images' },
        loadImages
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

  const router = useRouter();
  const initialState: ChangeInforState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(changeUserInfor, initialState);
  const [showError, setShowError] = useState(true); // State phụ để điều khiển hiển thị lỗi

  useEffect(() => {
    if (state.message === 'Successful') {
      router.push('/dashboard');
    }
  }, [state.message, router]);

  if (!user || id === ''){
    return (
      <form className="space-y-3">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Input for Change Infor
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
          </div>
          <Button className="mt-4 w-full" disabled>
            Change Infor <ArrowTurnRightUpIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
          <Button className="mt-4 w-full" disabled>
            Reset Change <ExclamationCircleIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
          <button 
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
            onClick={() => resetTarget('/dashboard')}
          >
            Cancel Change <ArrowLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
          </button>
        </div>
      </form>
    );

  } else {
    return (
      <form
        action={formAction}
        className="space-y-3"
        onReset={() => {setSelectedImage(selectedImage); setShowError(false);}} // Ẩn lỗi khi reset
        onSubmit={() => setShowError(true)} // Hiện lại lỗi khi submit
        onChange={() => setShowError(false)} // Ẩn lỗi khi sửa dữ liệu đã nhập
      >
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Input for Change Infor
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
                  src={selectedImage}
                  className="rounded-full"
                  alt={`${user.name}'s profile image`}
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
                  value={selectedImage}
                  onChange={e => setSelectedImage(e.target.value)}
                  aria-describedby="image-error"
                  required
                  autoFocus
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
                <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                  defaultValue={user.name}
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
            hidden={state.message === 'Successful'}
          >
            {showError && state.message && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{state.message}</p>
              </>
            )}
          </div>
          <Button className="mt-4 w-full" aria-disabled={isPending} type='submit'>
            Change Infor <ArrowTurnRightUpIcon className="ml-auto h-5 w-5 text-gray-50" />
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
}