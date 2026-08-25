import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import UserGreeting from '@/app/ui/UserGreeting';
import { Suspense } from 'react';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Edit Invoices',
  icons: `${process.env.APP_ICON}`,
  applicationName: `${process.env.APP_NAME}`,
  description: `The official Web Page of ${process.env.APP_NAME} App, built by Mr. ${process.env.APP_OWNER}.`,
  authors: [{name: `${process.env.APP_OWNER}`, url: `${process.env.OWNER_INFOR}`}],
  assets: `${process.env.APP_ASSET}`,
  archives: `${process.env.APP_ARCHIVES}`,
  creator: `${process.env.APP_OWNER}`,
  generator: `${process.env.APP_GENERATOR}`,
  keywords: `${process.env.APP_NAME}, ${process.env.APP_NAME} App, ${process.env.APP_OWNER}`,
  publisher: `${process.env.APP_PUBLISHER}`,
  openGraph: {
    type: 'website',
    url: `${process.env.OWNER_INFOR}`,
    title: `${process.env.APP_NAME} App`,
    description: `The official Web Page of ${process.env.APP_NAME} App, built by Mr. ${process.env.APP_OWNER}.`,
    siteName: `${process.env.APP_NAME}`,
    images: [{ url: `${process.env.APP_ICON}` }]
  },
  twitter: {
    card: 'summary_large_image',
    site: `${process.env.APP_NAME}`,
    creator: `${process.env.APP_OWNER}`,
    images: [{ url: `${process.env.APP_ICON}` }],
    description: `The official Web Page of ${process.env.APP_NAME} App, built by Mr. ${process.env.APP_OWNER}.`,
    title: `${process.env.APP_NAME} App`
  }
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
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
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