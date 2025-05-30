'use client';

import { ImageField } from '@/app/lib/definitions';
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
import { 
    changeUserInfor, 
    ChangeInforState,
    getSessionInfor, 
    resetTarget 
} from '@/app/lib/actions';
import { fetchImages } from '@/app/lib/data';
import { supabase } from '@/app/lib/supabaseClient';
 
export default async function ChangeInforForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([] as ImageField[]);
  const loadInfor = async () => {
    const infor = await getSessionInfor();
    setEmail(`${infor.email}`);
    setName(`${infor.name}`);
    setImage(`${infor.image}`);
  };
  const loadImages = async () => {
    const data = await fetchImages();
    setImages(data);
  };

  useEffect(() => {
    loadInfor();
    loadImages(); 

    // Lắng nghe realtime chỉ trên customers mà thôi
    const channel = supabase
      .channel('user-edit')
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

  const initialState: ChangeInforState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(changeUserInfor, initialState);
 
  return (
    <form action={formAction} className="space-y-3">
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
                    defaultValue={image}
                    aria-describedby="image-error"
                    disabled={email === '' || name === '' || image === '' || !images}
                    required
                    autoFocus
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
                <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                disabled={email === '' || name === '' || image === '' || !images}
                placeholder="Enter your email"
                aria-describedby='email-error'
                defaultValue={email}
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
                disabled={email === '' || name === '' || image === '' || !images}
                placeholder="Enter your nick name"
                aria-describedby='name-error'
                defaultValue={name}
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
        </div>
        <Button className="mt-4 w-full" aria-disabled={isPending} disabled={email === '' || name === '' || image === '' || !images}>
          Change Infor <ArrowTurnRightUpIcon className="ml-auto h-5 w-5 text-gray-50" />
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
        <button 
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 mt-4 w-full" 
          onClick={() => resetTarget('/dashboard')}
        >
          Cancel Change <ArrowLeftIcon className="ml-auto h-5 w-5 text-gray-50" />
        </button>
      </div>
    </form>
  );
}