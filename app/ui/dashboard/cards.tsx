'use client';

import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { supabase } from '@/app/lib/supabaseClient';
import { useEffect, useState, memo } from 'react';
import { fetchCardData } from '@/app/lib/data/dashboard';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default function CardWrapper() {
  // Tách state cho từng biến
  const [numberOfInvoices, setNumberOfInvoices] = useState(0);
  const [numberOfCustomers, setNumberOfCustomers] = useState(0);
  const [totalPaidInvoices, setTotalPaidInvoices] = useState('');
  const [totalPendingInvoices, setTotalPendingInvoices] = useState('');

  // Hàm cập nhật từng state riêng biệt
  const loadCardData = async () => {
    const data = await fetchCardData();
    setNumberOfInvoices(data.numberOfInvoices);
    setNumberOfCustomers(data.numberOfCustomers);
    setTotalPaidInvoices(data.totalPaidInvoices);
    setTotalPendingInvoices(data.totalPendingInvoices);
  };

  useEffect(() => {
    loadCardData();

    const channel = supabase
      .channel('cards-data')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'invoices' },
        loadCardData
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers' },
        loadCardData
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <MemoCard title="Collected" value={totalPaidInvoices} type="collected" />
      <MemoCard title="Pending" value={totalPendingInvoices} type="pending" />
      <MemoCard title="Total Invoices" value={numberOfInvoices} type="invoices" />
      <MemoCard title="Total Customers" value={numberOfCustomers} type="customers" />
    </>
  );
}

// Dùng React.memo để Card chỉ render lại khi props thay đổi
const MemoCard = memo(function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
});