'use server';

import {
  Revenue,
  LatestInvoiceRaw,
} from '@/app/lib/definitions/dashboard';
import { formatCurrency } from '@/app/lib/utils';
import { supabase } from '@/app/lib/supabaseClient';
import { auth } from '@/auth';

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

export async function getSessionRole() {
  const sessionUser = await getSessionInfor();
  if (sessionUser){
    const sessionRole = sessionUser.role;
    if (sessionRole !== '' && sessionRole !== null && sessionRole !== undefined){
      return sessionRole;
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