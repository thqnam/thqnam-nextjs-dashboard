import AcmeLogo from '@/app/ui/acme-logo';
import ChangeInforForm from '@/app/ui/user/changeinfor-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import UserGreeting from '@/app/ui/UserGreeting';
import { Suspense } from 'react';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Change Infor',
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
 
export default function ChangeInforPage() {
  return (
    <main >
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          {
            label: 'Change Infor',
            href: '/dashboard/changeinfor',
            active: true,
          },
        ]}
      />
      <Suspense>
        <UserGreeting />
      </Suspense>
      <div className="flex items-center justify-center md:h-screen">
        <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
          <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
            <div className="w-32 text-white md:w-36">
              <AcmeLogo />
            </div>
          </div>
          <Suspense>
            <ChangeInforForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}