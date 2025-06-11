import AcmeLogo from '@/app/ui/acme-logo';
import ResetForm from '@/app/ui/user/resetpass-form';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { supabase } from '@/app/lib/supabaseClient';
import { User } from "@/app/lib/definitions";
import { notFound } from 'next/navigation';
 
export const metadata: Metadata = {
  title: 'Reset Password',
  applicationName: `${process.env.APP_NAME}`,
  description: `The official Web Page of ${process.env.APP_NAME} App, built by Mr. ${process.env.APP_OWNER}.`,
  metadataBase: new URL(`${process.env.APP_HOMEPAGE}`),
  authors: [{name: `${process.env.APP_OWNER}`, url: `${process.env.OWNER_INFOR}`}],
  assets: `${process.env.APP_ASSET}`,
  archives: `${process.env.APP_ARCHIVES}`,
  creator: `${process.env.APP_OWNER}`,
  generator: `${process.env.APP_GENERATOR}`,
  keywords: `${process.env.APP_NAME}, ${process.env.APP_NAME} App, ${process.env.APP_OWNER}`,
  publisher: `${process.env.APP_PUBLISHER}`,
};
 
export default async function SignUpPage(props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  const token = params.token;
  if (!token) notFound();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('token', token)
    .maybeSingle();

  if (error || data === null) notFound();

  const user: User = data;
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <ResetForm email={user.email} name={user.name} image={user.image}/>
        </Suspense>
      </div>
    </main>
  );
}