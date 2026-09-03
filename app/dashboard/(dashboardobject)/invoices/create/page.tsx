import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import UserGreeting from '@/app/ui/UserGreeting';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { standardMetadata } from '@/app/lib/standardMetadata';
 
export const metadata: Metadata = {
  title: 'Create Invoices',
  ...standardMetadata,
};
 
export default async function Page() {
  
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Suspense>
        <UserGreeting />
      </Suspense>
      <Suspense>
        <Form />
      </Suspense>
    </main>
  );
}