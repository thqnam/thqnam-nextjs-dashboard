import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import UserGreeting from '@/app/ui/UserGreeting';
import { getSessionEmail } from '@/app/lib/data';
import { Suspense } from 'react';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Create Customer',
  applicationName: `${process.env.APP_NAME}`,
  description: `The official Web Page of ${process.env.APP_NAME} App, built by Mr. ${process.env.APP_OWNER}.`,
  authors: [{name: `${process.env.APP_OWNER}`, url: `${process.env.OWNER_INFOR}`}],
  assets: `${process.env.APP_ASSET}`,
  archives: `${process.env.APP_ARCHIVES}`,
  creator: `${process.env.APP_OWNER}`,
  generator: `${process.env.APP_GENERATOR}`,
  keywords: `${process.env.APP_NAME}, ${process.env.APP_NAME} App, ${process.env.APP_OWNER}`,
  publisher: `${process.env.APP_PUBLISHER}`,
};
 
export default async function Page() {
  const email = await getSessionEmail();
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Customers', href: '/dashboard/customers' },
          {
            label: 'Create Customer',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
      />
      <Suspense>
        <UserGreeting email={email}/>
      </Suspense>
      <Suspense>
        <Form />
      </Suspense>
    </main>
  );
}