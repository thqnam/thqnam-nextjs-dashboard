import InvoicesPagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import UserGreeting from '@/app/ui/UserGreeting';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import { getSessionEmail } from '@/app/lib/data';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Invoices',
  applicationName: 'QNED',
  description: 'The official Dashboard of QNED App, built by Mr. Thiều Huỳnh Quang Nam.',
  metadataBase: new URL('https://qned.vercel.app/'),
  authors: [{name: 'Thiều Huỳnh Quang Nam', url: 'https://thqnam-myself.vercel.app/'}],
  assets: 'https://qned.vercel.app/public',
  archives: 'https://qned.vercel.app/public/customers',
  creator: 'Thiều Huỳnh Quang Nam',
  generator: 'Next.js',
  keywords: 'QNED, Thiều Huỳnh Quang Nam',
  publisher: 'Vercel firm'
};
 
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const email = await getSessionEmail();
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { 
            label: 'Invoices', 
            href: '/dashboard/invoices',
            active: true,
          },
        ]}
      />
      <Suspense>
        <UserGreeting email={email}/>
      </Suspense>
      <div className="w-full">
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search invoices..." />
          <CreateInvoice />
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <Table query={query} currentPage={currentPage} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <InvoicesPagination query={query}/>
        </div>
      </div>
    </main>
  );
}