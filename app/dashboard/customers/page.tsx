import CustomersPagination from '@/app/ui/customers/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/customers/table';
import { CreateCustomer } from '@/app/ui/customers/buttons';
import { lusitana } from '@/app/ui/fonts';
import { CustomersTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import UserGreeting from '@/app/ui/UserGreeting';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Customers',
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
  
  return (
    <div className="w-full">
      <UserGreeting />
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
        <CreateCustomer />
      </div>
      <Suspense key={query + currentPage} fallback={<CustomersTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <CustomersPagination query={query} />
      </div>
    </div>
  );
}