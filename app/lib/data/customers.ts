'use server';

import {
  CustomerField,
} from '@/app/lib/definitions/invoices';
import {
  CustomersTableType,
  CustomerForm,
} from '@/app/lib/definitions/customers';
import { formatCurrency } from '@/app/lib/utils';
import { supabase } from '@/app/lib/supabaseClient';

const ITEMS_PER_PAGE = 6;

export async function fetchCustomersPages(query: string) {
  try {
    const { count, error } = await supabase
      .from('customers')
      .select('id', { count: 'exact', head: true })
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`);

    if (error) throw error;

    const totalPages = Math.ceil((count ?? 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error : any) {
    console.error('Database Error: ', error.message);
    throw new Error('Failed to fetch total number of customers. Reason: ' + error.message);
  }
}

export async function fetchCustomerById(id: string) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('id, name, email, image_url')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data as CustomerForm;
  } catch (error : any) {
    console.error('Database Error: ', error.message);
    throw new Error('Failed to fetch customer. Reason: ' + error.message);
  }
}

export async function fetchFilteredCustomers(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const { data, error } = await supabase
      .from('customers_with_stats')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .order('name', { ascending: true })
      .range(offset, offset + ITEMS_PER_PAGE - 1);

    if (error) throw error;

    const customers: CustomersTableType[] = (data ?? []).map((customer: any) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (error : any) {
    console.error('Database Error: ', error.message);
    throw new Error('Failed to fetch customer table. Reason: ' + error.message);
  }
}

export async function fetchCustomers() {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('id, name, image_url')
      .order('name', { ascending: true });

    if (error) throw error;

    return data as CustomerField[];
  } catch (error : any) {
    console.error('Database Error: ', error.message);
    throw new Error('Failed to fetch all customers. Reason: ' + error.message);
  }
}