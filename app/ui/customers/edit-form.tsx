'use client';

import { CustomerForm } from '@/app/lib/definitions';
import {
  AtSymbolIcon,
  InformationCircleIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { updateCustomer, CustomerState } from '@/app/lib/actions';
import { useActionState } from 'react';
import { resetTarget } from '@/app/lib/actions';
import { fetchCustomerById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
 
export default function EditCustomerForm({ id }: { id: string }) {
  const [customer, setCustomer] = useState({} as CustomerForm);
    // Hàm fetch lại dữ liệu
    const loadCustomer = async () => {
      const data = await fetchCustomerById(id);
      setCustomer(data);
    };
    // Lần đầu load và khi có realtime event thì fetch lại dữ liệu
    useEffect(() => {
      loadCustomer();
  
      // Lắng nghe realtime chỉ trên customers mà thôi
      const channel = supabase
        .channel('customer-edit')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'customers', filter: `id=eq.${id}`},
          loadCustomer
        )
        .subscribe();
  
      return () => {
        supabase.removeChannel(channel);
      };
    }, []);

  if (!customer) {
    notFound();
  }
  const initialState: CustomerState = { message: null, errors: {} };
  const updateCustomerWithId = updateCustomer.bind(null, customer.id);
  const [state, formAction] = useActionState(updateCustomerWithId, initialState);
  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
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
              required={true}
              autoFocus={true}
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
              required={true}
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
        {/* Image_URL */}
        <div>
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="image_url"
          >
            Image URL
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="image_url"
              type="text"
              name="image_url"
              placeholder="Enter customer image URL"
              defaultValue={customer.image_url}
              aria-describedby="image_url-error"
              required={true}
            />
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
        <Button type="submit">Edit Customer</Button>
      </div>
    </form>
  );
}
