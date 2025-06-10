import AcmeLogo from '@/app/ui/acme-logo';
import ResetForm from '@/app/ui/user/resetpass-form';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { supabase } from '@/app/lib/supabaseClient';
import { User } from "@/app/lib/definitions";
import { notFound } from 'next/navigation';
 
export const metadata: Metadata = {
  title: 'Reset Password',
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