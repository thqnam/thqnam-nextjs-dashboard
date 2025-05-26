'use client';

import { CustomerForm } from '@/app/lib/definitions';
import {
  AtSymbolIcon,
  InformationCircleIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { deleteCustomer, DeleteCustomerState } from '@/app/lib/actions';
import { useActionState } from 'react';
import { resetTarget } from '@/app/lib/actions';
import { fetchCustomerById } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
 
export default function DeleteCustomerForm({ id }: { id: string }) {
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
        .channel('customer-delete')
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
  const initialState: DeleteCustomerState = { message: null, errors: {} };
  const deleteCustomerWithId = deleteCustomer.bind(null, customer.id);
  const [state, formAction] = useActionState(deleteCustomerWithId, initialState);
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
              defaultValue={customer.name}
              readOnly={true}
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
              readOnly={true}
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
              defaultValue={customer.image_url}
              readOnly={true}
            />
            <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        {/* ID */}
        <div>
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="id"
          >
            Customer ID
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="id"
              type="text"
              name="id"
              defaultValue={customer.id}
              readOnly={true}
            />
            <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        {/* Re input ID for delete*/}
        <div>
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
            htmlFor="reid"
          >
            Re Input ID
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id="reid"
              type="text"
              name="reid"
              placeholder='Re input customer ID to confirm deletion'
              aria-describedby="reid-error"
              readOnly={false}
            />
            <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
          <div id="reid-error" aria-live="polite" aria-atomic="true">
            {state.errors?.reid &&
              state.errors.reid.map((error: string) => (
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
          Cancel Delete
        </button>
        <button
          onClick={() => resetTarget(`/dashboard/customers/${id}/edit`)}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Edit Customer
        </button>
        <Button type="submit">Delete Customer</Button>
      </div>
    </form>
  );
}
