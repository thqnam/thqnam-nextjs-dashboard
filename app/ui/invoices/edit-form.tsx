'use client';

import { CustomerField, InvoiceForm } from '@/app/lib/definitions/invoices';
import Image from 'next/image';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { resetTarget } from '@/app/lib/actions/functions/dashboard';
import { updateInvoice } from '@/app/lib/actions/functions/invoices';
import { InvoiceState } from '@/app/lib/actions/types/invoices';
import { useActionState } from 'react';
import { fetchCustomers } from '@/app/lib/data/customers';
import { fetchInvoiceById } from '@/app/lib/data/invoices';
import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { notFound } from 'next/navigation';
 
export default function EditInvoiceForm({ id }: { id: string }) {
  const [invoice, setInvoice] = useState({} as InvoiceForm);
  const [customers, setCustomers] = useState([] as CustomerField[]);
  const [selectedCustomer, setSelectedCustomer] = useState(invoice.customer_id);
  const [selectedCustomerImage, setSelectedCustomerImage] = useState('');
  const [selectedInvoiceStatus, setSelectedInvoiceStatus] = useState(invoice.status);
  // Hàm fetch lại dữ liệu
  const loadCustomers = async () => {
    const data = await fetchCustomers();
    setCustomers(data);
  };
  const loadInvoice = async () => {
    const data = await fetchInvoiceById(id);
    if (!data) {
      notFound();
    } else {
      setInvoice(data);
      setSelectedInvoiceStatus(data.status);
      setSelectedCustomer(data.customer_id);
      setSelectedCustomerImage(customers.find(c => c.id === data.customer_id)?.image_url || '');
    }
  };
  const loadInvoiceAndCustomers = async () => {
    const InvoiceTerm = await fetchInvoiceById(id);
    if (!InvoiceTerm) {
      notFound();
    } else {
      setInvoice(InvoiceTerm);
      setSelectedInvoiceStatus(InvoiceTerm.status);
      setSelectedCustomer(InvoiceTerm.customer_id);
      setSelectedCustomerImage(customers.find(c => c.id === InvoiceTerm.customer_id)?.image_url || '');
      const CustomersTerm = await fetchCustomers();
      setCustomers(CustomersTerm);
    }
  }
  useEffect(() => {
    setSelectedCustomer(invoice.customer_id);
  }, [invoice.customer_id]);
  useEffect(() => {
    setSelectedInvoiceStatus(invoice.status);
  }, [ invoice.status]);
  useEffect(() => {
    setSelectedCustomerImage(customers.find(c => c.id === invoice.customer_id)?.image_url || '');
  }, [ invoice.customer_id]);
  // Lần đầu load và khi có realtime event thì fetch lại dữ liệu
  useEffect(() => {
    loadInvoiceAndCustomers();

    // Lắng nghe realtime trên customers và invoices
    const channel = supabase
      .channel('customers-and-invoice-edit')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers' },
        loadCustomers
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

  const initialState: InvoiceState = { message: null, errors: {} };
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);
  const [state, formAction, isPending] = useActionState(updateInvoiceWithId, initialState);
  const [showError, setShowError] = useState(true); // State phụ để điều khiển hiển thị lỗi

  if (!customers || !invoice) {
    return (
      <form>
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
                defaultValue=""
                disabled
              >
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Invoice Amount */}
          <div className="mb-4">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium">
              Choose an amount
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
              Set the invoice status
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
        </div>
        <div className="mt-6 flex justify-evenly gap-4">
          <button
            onClick={() => resetTarget('/dashboard/invoices')}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel Edit
          </button>
          <button
            onClick={() => resetTarget(`/dashboard/invoices/${id}/delete`)}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Delete Invoice
          </button>
          <button
            disabled
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Reset Invoice
          </button>
          <Button type="submit" disabled>Edit Invoice</Button>
        </div>
      </form>
    );
  } else {
    return (
      <form
        action={formAction}
        className="space-y-3"
        onReset={() => {setSelectedCustomer(invoice.customer_id); setShowError(false);}} // Ẩn lỗi khi reset
        onSubmit={() => setShowError(true)} // Hiện lại lỗi khi submit
        onChange={() => setShowError(false)} // Ẩn lỗi khi sửa dữ liệu đã nhập
      >
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Customer Name */}
          <div className="mb-4">
            <label htmlFor="customer" className="flex items gap-2 mb-2 text-sm font-medium">
              Choose customer{' '}
              <Image
                src={selectedCustomerImage}
                className="rounded-full"
                alt={`customer's profile picture`}
                width={28}
                height={28}
                hidden={selectedCustomerImage === ''}
              />
            </label>
            <div className="relative">
              <select
                id="customer"
                name="customerId"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={selectedCustomer}
                onChange={e => {
                  setSelectedCustomer(e.target.value);
                  const customer = customers.find(c => c.id === e.target.value);
                  setSelectedCustomerImage(customer?.image_url || '');
                }}
                aria-describedby="customer-error"
                required
                autoFocus
              >
                <option value="" disabled>
                  Select a customer
                </option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <div id="customer-error" aria-live="polite" aria-atomic="true">
              {showError && showError && state.errors?.customerId &&
                state.errors.customerId.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
              ))}
            </div>
          </div>

          {/* Invoice Amount */}
          <div className="mb-4">
            <label htmlFor="amount" className="mb-2 block text-sm font-medium">
              Choose an amount
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter USD amount"
                  defaultValue={invoice.amount}
                  required
                  aria-describedby="amount-error"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div id="amount-error" aria-live="polite" aria-atomic="true">
              {showError && showError && state.errors?.amount &&
                state.errors.amount.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
              ))}
            </div>
          </div>

          {/* Invoice Status */}
          <fieldset>
            <legend className="mb-2 block text-sm font-medium">
              Set the invoice status
            </legend>
            <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    id="pending"
                    name="status"
                    type="radio"
                    value="pending"
                    aria-describedby="status-error"
                    checked={selectedInvoiceStatus === 'pending'}
                    onChange={e => setSelectedInvoiceStatus('pending')}
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
                    aria-describedby="status-error"
                    checked={selectedInvoiceStatus === 'paid'}
                    onChange={e => setSelectedInvoiceStatus('paid')}
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
              <div id="status-error" aria-live="polite" aria-atomic="true">
                {showError && showError && state.errors?.status &&
                  state.errors.status.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                ))}
              </div>
            </div>
          </fieldset>
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
            onClick={() => resetTarget('/dashboard/invoices')}
            disabled={isPending}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel Edit
          </button>
          <button
            type='button'
            onClick={() => resetTarget(`/dashboard/invoices/${id}/delete`)}
            disabled={isPending}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Delete Invoice
          </button>
          <button
            type='reset'
            disabled={isPending}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Reset Invoice
          </button>
          <Button type="submit" disabled={isPending}>Edit Invoice</Button>
        </div>
      </form>
    );
  }
}
