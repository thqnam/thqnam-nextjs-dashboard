import Form from '@/app/ui/invoices/delete-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import UserGreeting from '@/app/ui/UserGreeting';
import { Suspense } from 'react';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Delete Invoices',
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
 
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Delete Invoice',
            href: `/dashboard/invoices/${id}/delete`,
            active: true,
          },
        ]}
      />
      <Suspense>
        <UserGreeting />
      </Suspense>
      <Suspense>
        <Form id={id} />
      </Suspense>
    </main>
  );
}