import AcmeLogo from '@/app/ui/acme-logo';
import ChangeInforForm from '@/app/ui/user/changeinfor-form';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import UserGreeting from '@/app/ui/UserGreeting';
import { getSessionEmail } from '@/app/lib/data';
import { Suspense } from 'react';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Change Infor',
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
 
export default async function ChangeInforPage() {
  const email = await getSessionEmail();
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
        <UserGreeting email={email}/>
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