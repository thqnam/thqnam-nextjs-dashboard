import AcmeLogo from '@/app/ui/acme-logo';
import Form from '@/app/ui/user/signinhandle-form';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getUserByToken } from '@/app/lib/utils';
import { deleteDatabaseToken } from '@/app/lib/actions/functions/users';
import { notFound } from 'next/navigation';
 
export const metadata: Metadata = {
  title: 'Sign In Handle',
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
    url: `${process.env.APP_HOMEPAGE}`,
    title: `${process.env.APP_NAME} App`,
    description: `The official Web Page of ${process.env.APP_NAME} App, built by Mr. ${process.env.APP_OWNER}.`,
    siteName: `${process.env.APP_NAME}`,
    images: [{ url: `${process.env.APP_ICON}`, alt: `${process.env.APP_NAME}'s picture` }]
  },
  twitter: {
    card: 'summary_large_image',
    site: `${process.env.APP_HOMEPAGE}`,
    creator: `${process.env.APP_OWNER}`,
    images: [{ url: `${process.env.APP_ICON}`, alt: `${process.env.APP_NAME}'s picture` }],
    description: `The official Web Page of ${process.env.APP_NAME} App, built by Mr. ${process.env.APP_OWNER}.`,
    title: `${process.env.APP_NAME} App`
  }
};
 
export default async function Page(props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  const token = params.token;
  if (!token) notFound();
  const result = await getUserByToken(token);
  if (result === undefined) notFound();
  const user = result;
  if (user.expires && new Date(user.expires) < new Date()) {
    await deleteDatabaseToken(user.id);
    notFound();
  }

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <Form email={user.email} name={user.name} image={user.image}/>
        </Suspense>
      </div>
    </main>
  );
}