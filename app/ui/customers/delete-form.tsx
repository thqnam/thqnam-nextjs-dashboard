'use client';

import { CustomerForm, ImageField } from '@/app/lib/definitions/customers';
import Image from 'next/image';
import {
  AtSymbolIcon,
  InformationCircleIcon,
  IdentificationIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { deleteCustomer } from '@/app/lib/actions/functions/customers';
import { DeleteCustomerState } from '@/app/lib/actions/types/customers';
import { useActionState } from 'react';
import { resetTarget } from '@/app/lib/actions/functions/dashboard';
import { fetchImageByURL } from '@/app/lib/data/invoices';
import { fetchCustomerById } from '@/app/lib/data/customers';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
 
export default function DeleteCustomerForm({ id }: { id: string }) {
  const [customer, setCustomer] = useState({} as CustomerForm);
  const [image, setImage] = useState({} as ImageField);
  // Hàm fetch lại dữ liệu
  const loadCustomer = async () => {
    const data = await fetchCustomerById(id);
    if (!data){
      notFound();
    } else {
      setCustomer(data);
    }
  };
  const loadImage = async () => {
    const data = await fetchImageByURL(customer.image_url);
    setImage(data);
  };
  const loadCustomerAndImage = async () => {
    const customerTerm = await fetchCustomerById(id);
    if (!customerTerm){
      notFound();
    } else {
      setCustomer(customerTerm);
      const imageTerm = await fetchImageByURL(customerTerm.image_url);
      setImage(imageTerm);
    }
  }
  // Lần đầu load và khi có realtime event thì fetch lại dữ liệu
  useEffect(() => {
    loadCustomerAndImage();

    // Lắng nghe realtime chỉ trên customers mà thôi
    const channel = supabase
      .channel('customer-delete')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers', filter: `id=eq.${id}`},
        loadCustomer
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'images' },
        loadImage
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!customer) {
    notFound();
  }
  const initialState: DeleteCustomerState = { message: null, errors: {} };
  const deleteCustomerWithId = deleteCustomer.bind(null, customer.id);
  const [state, formAction, isPending] = useActionState(deleteCustomerWithId, initialState);
  const [showError, setShowError] = useState(true); // State phụ để điều khiển hiển thị lỗi

  if (!customer || !image){
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
          {/* Re input ID for delete*/}
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="reid"
            >
              Re Input Customer ID
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
        <div className="mt-6 flex justify-evenly gap-4">
          <button
            onClick={() => resetTarget('/dashboard/customers')}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel Delete
          </button>
          <button
            onClick={() => resetTarget(`/dashboard/customers/${id}/edit`)}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Edit Customer
          </button>
          <button
            disabled
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Reset Customer
          </button>
          <Button type="submit" disabled>Delete Customer</Button>
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
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Image_URL */}
          <div>
            <label
              className="flex items gap-2 mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="image_url"
            >
              Choose Image{' '}
              <Image
                src={image.path}
                className="rounded-full"
                alt={`${image.name} image name`}
                width={28}
                height={28}
              />
            </label>
            <div className="relative">
              <select
                id="image_url"
                name="image_url"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={customer.image_url}
                aria-describedby="image_url-error"
                disabled
              >
                <option key={image.path} value={image.path}>
                  {image.name}
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
                defaultValue={customer.name}
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
                defaultValue={customer.email}
                disabled
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {/* Re input ID for delete*/}
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="reid"
            >
              Re Input Customer ID: {customer.id}
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
        </div>
        <div className="mt-6 flex justify-evenly gap-4">
          <button
            type='button'
            onClick={() => resetTarget('/dashboard/customers')}
            disabled={isPending}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel Delete
          </button>
          <button
            type='button'
            onClick={() => resetTarget(`/dashboard/customers/${id}/edit`)}
            disabled={isPending}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Edit Customer
          </button>
          <button
            type='reset'
            disabled={isPending}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Reset Customer
          </button>
          <Button type="submit" disabled={isPending}>Delete Customer</Button>
        </div>
      </form>
    );
  }
}
