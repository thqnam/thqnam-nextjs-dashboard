'use client';

import { ImageField } from '@/app/lib/definitions';
import Image from 'next/image';
import {
  AtSymbolIcon,
  InformationCircleIcon,
  IdentificationIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { resetTarget, createCustomer, CustomerState } from '@/app/lib/actions';
import { fetchImages } from '@/app/lib/data';
import { useActionState } from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';

export default function Form() {
  const [images, setImages] = useState([] as ImageField[]);
  const [selectedImage, setSelectedImage] = useState('');
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
      .channel('customers-create')
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
  const initialState: CustomerState = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(createCustomer, initialState);

  if (!images){
    return (
      <form >
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Image_URL */}
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="image_url"
            >
              Choose Image
            </label>
            <div className="relative">
              <select
                id="image_url"
                name="image_url"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                disabled
              >
                <option value="" disabled>
                  Select a Image
                </option>
              </select>
              <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {/* Name */}
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
          {/* Email */}
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
        </div>
        <div className="mt-6 flex justify-evenly gap-4">
          <button
            onClick={() => resetTarget('/dashboard/customers')}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel Create
          </button>
          <Button type="submit" disabled>Create Customer</Button>
        </div>
      </form>
    );

  } else {
    return (
      <form action={formAction}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Image_URL */}
          <div>
            <label
              className="flex items gap-2 mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="image_url"
            >
              Choose Image{' '}<Image
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
                id="image_url"
                name="image_url"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                autoFocus
                required
                aria-describedby="image_url-error"
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
            <div id="image_url-error" aria-live="polite" aria-atomic="true">
              {state.errors?.image_url &&
                state.errors.image_url.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
          {/* Name */}
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
                placeholder="Enter customer name"
                aria-describedby="name-error"
                required
                autoFocus
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
          {/* Email */}
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
                placeholder="Enter customer email"
                aria-describedby="email-error"
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
        </div>
        <div className="mt-6 flex justify-evenly gap-4">
          <button
            onClick={() => resetTarget('/dashboard/customers')}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel Create
          </button>
          <Button type="submit" aria-disabled={isPending}>Create Customer</Button>
        </div>
      </form>
    );
  }
}
