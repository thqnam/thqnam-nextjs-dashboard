'use client';

import { CustomerForm, ImageField } from '@/app/lib/definitions';
import Image from 'next/image';
import {
  AtSymbolIcon,
  InformationCircleIcon,
  IdentificationIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { resetTarget, updateCustomer, CustomerState } from '@/app/lib/actions';
import { useActionState } from 'react';
import { notFound } from 'next/navigation';
import { fetchCustomerById, fetchImages } from '@/app/lib/data';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
 
export default function EditCustomerForm({ id }: { id: string }) {
  const [customer, setCustomer] = useState({} as CustomerForm);
  const [images, setImages] = useState([] as ImageField[]);
  const [selectedImage, setSelectedImage] = useState(customer.image_url);
  // Hàm fetch lại dữ liệu
  const loadCustomer = async () => {
    const data = await fetchCustomerById(id);
    if (!data) {
      notFound();
    } else {
      setCustomer(data);
    }
  };
  const loadImages = async () => {
    const data = await fetchImages();
    setImages(data);
  };
  const loadCustomerAndImages = async () => {
    const CustomerTerm = await fetchCustomerById(id);
    if (!CustomerTerm) {
      notFound();
    } else {
      setCustomer(CustomerTerm);
      const ImagesTerm = await fetchImages();
      setImages(ImagesTerm);
    }
  }
  useEffect(() => {
    setSelectedImage(customer.image_url);
  }, [customer.image_url]);
  // Lần đầu load và khi có realtime event thì fetch lại dữ liệu
  useEffect(() => {
    loadCustomerAndImages();

    // Lắng nghe realtime chỉ trên customers mà thôi
    const channel = supabase
      .channel('customer-edit')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers', filter: `id=eq.${id}`},
        loadCustomer
      )
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
  const updateCustomerWithId = updateCustomer.bind(null, customer.id);
  const [state, formAction, isPending] = useActionState(updateCustomerWithId, initialState);
  
  if (!customer || !images){
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
            Cancel Edit
          </button>
          <button
            onClick={() => resetTarget(`/dashboard/customers/${id}/delete`)}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Delete Customer
          </button>
          <button
            disabled
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Reset Customer
          </button>
          <Button type="submit" disabled>Edit Customer</Button>
        </div>
      </form>
    );
  } else {
    return (
      <form action={formAction} onReset={() => {setSelectedImage('')}}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Image_URL */}
          <div>
            <label
              className="flex items gap-2 mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="image_url"
            >
              Choose Image{' '}
              <Image
                src={selectedImage}
                className="rounded-full"
                alt={`${customer.name}'s profile picture`}
                width={28}
                height={28}
              />
            </label>
            <div className="relative">
              <select
                id="image_url"
                name="image_url"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={selectedImage}
                onChange={e => setSelectedImage(e.target.value)}
                aria-describedby="image_url-error"
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
                defaultValue={customer.name}
                aria-describedby="name-error"
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
                defaultValue={customer.email}
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
            aria-disabled={isPending}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel Edit
          </button>
          <button
            onClick={() => resetTarget(`/dashboard/customers/${id}/delete`)}
            aria-disabled={isPending}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Delete Customer
          </button>
          <button
            type='reset'
            aria-disabled={isPending}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Delete Customer
          </button>
          <Button type="submit" aria-disabled={isPending}>Edit Customer</Button>
        </div>
      </form>
    );
  }
}
