'use server';

import {
  CustomerField,
  CustomerForm,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  ImageField,
  User
} from './definitions';
import { formatCurrency } from './utils';
import { supabase } from '@/app/lib/supabaseClient';
import { auth } from '@/auth';
import { PostgrestError } from '@supabase/supabase-js';

export async function getSessionInfor() {
  const sessionInfor = await auth();
  if (sessionInfor !== null){
    const sessionUser = sessionInfor.user;
    if (sessionUser !== undefined){
      return sessionUser;
    } else {
      return {};
    }
  } else {
    return {};
  }
}

export async function getSessionID() {
  const sessionUser = await getSessionInfor();
  if (sessionUser){
    const sessionID = sessionUser.id;
    if (sessionID !== '' && sessionID !== null && sessionID !== undefined){
      return sessionID;
    } else {
      return '';
    }
  } else {
    return '';
  }
}

export async function getSessionEmail() {
  const sessionUser = await getSessionInfor();
  if (sessionUser){
    const sessionEmail = sessionUser.email;
    if (sessionEmail !== '' && sessionEmail !== null && sessionEmail !== undefined){
      return sessionEmail;
    } else {
      return '';
    }
  } else {
    return '';
  }
}

export async function fetchRevenue() {
  try {
    const { data, error } = await supabase
    .from('revenue')
    .select('*'); // Lấy tất cả các cột
    if (error) {
      throw error;
    }
    return data as Revenue[]; // Đảm bảo kiểu dữ liệu giống như cũ
  } catch (error : any) {
    console.error('Database Error: ', error.message);
    throw new Error('Failed to fetch revenue data. Reason: ' + error.message);
  }
}

export async function fetchLatestInvoices() {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        amount,
        id,
        customers (
          name,
          image_url,
          email
        )
      `)
      .order('date', { ascending: false })
      .limit(5);

    if (error) {
      throw error;
    }

    // Map lại dữ liệu cho đúng định dạng cũ
    const latestInvoices: LatestInvoiceRaw[] = (data ?? []).map((invoice: any) => ({
      ...invoice,
      id: invoice.id,
      amount: formatCurrency(invoice.amount),
      name: invoice.customers?.name ?? '',
      image_url: invoice.customers?.image_url ?? '',
      email: invoice.customers?.email ?? '',
    }));

    return latestInvoices;
  } catch (error : any) {
    console.error('Database Error: ', error.message)
    throw new Error('Failed to fetch the latest invoices. Reason: ' + error.message);
  }
}

export async function fetchCardData() {
  try {
    // Đếm số lượng invoices
    const { count: numberOfInvoices, error: invoiceCountError } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true });
    if (invoiceCountError) throw invoiceCountError;

    // Đếm số lượng customers
    const { count: numberOfCustomers, error: customerCountError } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });
    if (customerCountError) throw customerCountError;

    // Tính tổng paid và pending
    const { data: statusData, error: statusError } = await supabase
      .from('invoices')
      .select('status, amount');
    if (statusError) throw statusError;

    // Tính tổng paid và pending từ dữ liệu lấy về
    let paid = 0;
    let pending = 0;
    (statusData ?? []).forEach((inv: any) => {
      if (inv.status === 'paid') paid += inv.amount || 0;
      if (inv.status === 'pending') pending += inv.amount || 0;
    });

    return {
      numberOfCustomers: numberOfCustomers ?? 0,
      numberOfInvoices: numberOfInvoices ?? 0,
      totalPaidInvoices: formatCurrency(paid),
      totalPendingInvoices: formatCurrency(pending),
    };
  } catch (error : any) {
    console.error('Database Error: ', error.message);
    throw new Error('Failed to fetch card data. Reason: ' + error.message);
  }
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();
  if (error) {
    console.error('Failed to fetch user by email: Reason', error.message);
    let talada : PostgrestError;
    talada = error;
    talada.message = 'Failed to fetch user by email. Reason' + error.message;
    throw talada;
  } else {
    if (data === null){
      return undefined;
    } else {
      const user = data as User;
      return user;
    }
  }
}

export async function getUserByID(id: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('Failed to fetch user by id: Reason', error.message);
    let talada : PostgrestError;
    talada = error;
    talada.message = 'Failed to fetch user by id. Reason' + error.message;
    throw talada;
  } else {
    if (data === null){
      return undefined;
    } else {
      const user = data as User;
      return user;
    }
  }
}

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
