import AcmeLogo from '@/app/ui/acme-logo';
import Form from '@/app/ui/user/signinhandle-form';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getUserByToken } from '@/app/lib/utils';
import { deleteDatabaseToken } from '@/app/lib/actions';
import { notFound } from 'next/navigation';
 
export const metadata: Metadata = {
  title: 'Sign In Handle',
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
 
export default async function Page(props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  console.log('Sign In Params: ', params); // Log the params to the console for debugging
  const token = params.token;
  console.log('Sign In Token: ', token); // Log the token to the console for debugging
  if (!token) notFound();
  const result = await getUserByToken(token);
  console.log('Sign In Result: ', result); // Log the result to the console for debugging
  if (result === undefined) notFound();
  const user = result;
  console.log('Sign In User: ', user); // Log the user to the console for debugging
  if (user.expires && new Date(user.expires) < new Date()) {
    await deleteDatabaseToken(user.id);
    console.log('Token expired and deleted for user: ', user.id); // Log the deletion for debugging
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