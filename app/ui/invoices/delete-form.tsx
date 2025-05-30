'use client';

import { InvoiceForm, CustomerForm } from '@/app/lib/definitions';
import Image from 'next/image';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  IdentificationIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { resetTarget, deleteInvoice, DeleteInvoiceState } from '@/app/lib/actions';
import { useActionState } from 'react';
import { fetchInvoiceById, fetchCustomerById } from '@/app/lib/data';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { notFound } from 'next/navigation';
 
export default function DeleteInvoiceForm({ id }: { id: string }) {
  const [invoice, setInvoice] = useState({} as InvoiceForm);
  const [customer, setCustomer] = useState({} as CustomerForm);
  // Hàm fetch lại dữ liệu
  const loadCustomer = async () => {
    const data = await fetchCustomerById(invoice.customer_id);
    setCustomer(data);
  };
  const loadInvoice = async () => {
    const data : InvoiceForm = await fetchInvoiceById(id);
    if (!data) {
      notFound();
    } else {
      setInvoice(data);
    }
  };
  const loadInvoiceAndCustomer = async () => {
    const invoiceTerm = await fetchInvoiceById(id);
    if (!invoiceTerm) {
      notFound();
    } else {
      setInvoice(invoiceTerm);
      const customerTerm = await fetchCustomerById(invoiceTerm.customer_id);
      setCustomer(customerTerm);
    }
  }
  // Lần đầu load và khi có realtime event thì fetch lại dữ liệu
  useEffect(() => {
    loadInvoiceAndCustomer();

    // Lắng nghe realtime trên customers và invoices
    const channel = supabase
      .channel('customers-and-invoice-delete')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers', filter: `id=eq.${invoice.customer_id}`},
        loadCustomer
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'invoices', filter: `id=eq.${id}`},
        loadInvoice
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const initialState: DeleteInvoiceState = { message: null, errors: {} };
  const deleteInvoiceWithId = deleteInvoice.bind(null, invoice.id);
  const [state, formAction, isPending] = useActionState(deleteInvoiceWithId, initialState);

  if (!customer || !invoice) {
    return (
      <form action={formAction}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Customer Name */}
          <div className="mb-4">
            <label htmlFor="customer" className="mb-2 block text-sm font-medium">
              Customer Name
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="name"
                type="text"
                name="name"
                disabled
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Invoice Amount */}
          <div className="mb-4">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium">
              Invoice Amount
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  disabled
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Invoice Status */}
          <fieldset>
            <legend className="mb-2 block text-sm font-medium">
              Invoice Status
            </legend>
            <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    id="pending"
                    name="status"
                    type="radio"
                    value="pending"
                    disabled
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  />
                  <label
                    htmlFor="pending"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                  >
                    Pending <ClockIcon className="h-4 w-4" />
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="paid"
                    name="status"
                    type="radio"
                    value="paid"
                    disabled
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  />
                  <label
                    htmlFor="paid"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Paid <CheckIcon className="h-4 w-4" />
                  </label>
                </div>
              </div>
            </div>
          </fieldset>
          {/* ID */}
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="id"
            >
              Invoice ID
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="id"
                type="text"
                name="id"
                disabled
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
                disabled
              />
              <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-evenly gap-4">
          <button
            disabled
            onClick={() => resetTarget('/dashboard/invoices')}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel Delete
          </button>
          <button
            disabled
            onClick={() => resetTarget(`/dashboard/invoices/${id}/edit`)}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Edit Invoice
          </button>
          <Button type="submit" disabled>Delete Invoice</Button>
        </div>
      </form>
    );
  } else {
    return (
      <form action={formAction}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Customer Name */}
          <div className="mb-4">
            <label htmlFor="customer" className="mb-2 block text-sm font-medium">
              Choose customer
            </label>
            <div className="relative">
              <select
                id="customer"
                name="customerId"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue={invoice.customer_id}
                aria-describedby="customer-error"
                disabled
              >
                <option key={customer.id} value={customer.id}>
                  <Image
                    src={customer.image_url}
                    className="rounded-full"
                    alt={`${customer.name}'s profile picture`}
                    width={28}
                    height={28}
                  />
                  <p>{customer.name}</p>
                </option>
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Invoice Amount */}
          <div className="mb-4">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium">
              Invoice Amount
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  defaultValue={invoice.amount}
                  disabled
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Invoice Status */}
          <fieldset>
            <legend className="mb-2 block text-sm font-medium">
              Invoice Status
            </legend>
            <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    id="pending"
                    name="status"
                    type="radio"
                    value="pending"
                    disabled
                    checked={invoice.status === 'pending'}
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  />
                  <label
                    htmlFor="pending"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                  >
                    Pending <ClockIcon className="h-4 w-4" />
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="paid"
                    name="status"
                    type="radio"
                    value="paid"
                    disabled
                    checked={invoice.status === 'paid'}
                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  />
                  <label
                    htmlFor="paid"
                    className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Paid <CheckIcon className="h-4 w-4" />
                  </label>
                </div>
              </div>
            </div>
          </fieldset>
          {/* ID */}
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="id"
            >
              Invoice ID
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="id"
                type="text"
                name="id"
                defaultValue={invoice.id}
                readOnly
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
                placeholder='Re input invoice ID to confirm deletion'
                aria-describedby="reid-error"
                required
                autoFocus
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
            onClick={() => resetTarget('/dashboard/invoices')}
            aria-disabled={isPending}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel Delete
          </button>
          <button
            onClick={() => resetTarget(`/dashboard/invoices/${id}/edit`)}
            aria-disabled={isPending}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Edit Invoice
          </button>
          <Button type="submit" aria-disabled={isPending}>Delete Invoice</Button>
        </div>
      </form>
    );
  }
}