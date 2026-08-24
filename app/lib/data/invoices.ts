'use server';

import {
  InvoicesTable,
  InvoiceForm,
} from '@/app/lib/definitions/invoices';
import {
  ImageField,
} from '@/app/lib/definitions/customers';
import { supabase } from '@/app/lib/supabaseClient';

const ITEMS_PER_PAGE = 6;

export async function fetchInvoicesPages(query: string) {
  const orFilter = query
  ? `customers.name.ilike.%${query}%,customers.email.ilike.%${query}%,amount::text.ilike.%${query}%,date::text.ilike.%${query}%,status.ilike.%${query}%`
  : undefined;
  try {
    // Truy vấn invoices, join customers, lọc theo query
    let supabaseQuery = supabase
      .from('invoices')
      .select(`id, customers!inner(name, email), amount, date, status`, { count: 'exact', head: true })
    if (orFilter) {
      supabaseQuery = supabaseQuery.or(orFilter);
    }
    const { count, error } = await supabaseQuery

    if (error) throw error;

    const totalPages = Math.ceil((count ?? 0) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error : any) {
    console.error('Database Error: ', error.message);
    throw new Error('Failed to fetch total number of invoices. Reason: ' + error.message);
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('id, customer_id, amount, status')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Nếu amount lưu dưới dạng cents, chuyển sang dollars
    const invoice: InvoiceForm = {
      ...data,
      amount: data.amount / 100,
    };

    return invoice;
  } catch (error : any) {
    console.error('Database Error: ', error.message);
    throw new Error('Failed to fetch invoice. Reason: ' + error.message);
  }
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const orFilter = query
  ? `customers.name.ilike.%${query}%,customers.email.ilike.%${query}%,amount::text.ilike.%${query}%,date::text.ilike.%${query}%,status.ilike.%${query}%`
  : undefined;

  try {
    let supabaseQuery = supabase
      .from('invoices')
      .select(`id, customer_id, amount, date, status, customers!inner(name, email, image_url)`)
      .order('date', { ascending: false })
      .range(offset, offset + ITEMS_PER_PAGE - 1);
    if (orFilter) {
      supabaseQuery = supabaseQuery.or(orFilter);
    }
    const { data, error } = await supabaseQuery
    if (error) throw error;

    // Map lại dữ liệu về đúng định dạng InvoicesTable[]
    const invoices: InvoicesTable[] = (data ?? []).map((invoice: any) => ({
      id: invoice.id,
      customer_id: invoice.customer_id, // Bổ sung trường này!
      amount: invoice.amount,
      date: invoice.date,
      status: invoice.status,
      name: invoice.customers?.name ?? '',
      email: invoice.customers?.email ?? '',
      image_url: invoice.customers?.image_url ?? '',
    }));

    return invoices;
  } catch (error : any) {
    console.error('Database Error: ', error.message);
    throw new Error('Failed to fetch invoices. Reason: ' + error.message);
  }
}

export async function fetchImageByURL(url: string) {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('id, name, path')
      .eq('path', url)
      .single();

    if (error) throw error;

    return data as ImageField;
  } catch (error : any) {
    console.error('Database Error: ', error.message);
    throw new Error('Failed to fetch image. Reason: ' + error.message);
  }
}

export async function fetchImages() {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('id, name, path')
      .order('name', { ascending: true });

    if (error) throw error;

    return data as ImageField[];
  } catch (error : any) {
    console.error('Database Error: ', error.message);
    throw new Error('Failed to fetch all images. Reason: ' + error.message);
  }
}