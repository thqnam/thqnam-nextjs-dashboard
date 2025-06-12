import AcmeLogo from '@/app/ui/acme-logo';
import { ArrowRightIcon, ArrowUpIcon, ArrowTurnDownRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from '@/app/ui/home.module.css';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import { Metadata } from 'next';
import { supabase } from '@/app/lib/supabaseClient';
import { User } from "@/app/lib/definitions";
import { notFound } from 'next/navigation';
 
export const metadata: Metadata = {
  title: 'Verify Email',
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
  let reponseMessage : string;
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

  if (user.expires && new Date(user.expires) < new Date()) {
    await supabase
        .from('users')
        .delete()
        .eq('id', user.id);
    reponseMessage = 'Your verify email request token has expired.';
  }

  await supabase
    .from('users')
    .update({ 
        email_verified: true, 
        token: null, 
        expires: null
    })
    .eq('id', user.id);
  reponseMessage = 'Email of your account verified successfully !';

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <AcmeLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <div
            className={styles.shape}
          />
          <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>{reponseMessage}</strong> 
          </p>
          <Link
            href="/signin"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Sign In</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
          <Link
            href="/signup"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Sign Up</span> <ArrowUpIcon className="w-5 md:w-6" />
          </Link>
          <Link
            href="/forgotpass"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Forgot Password</span> <ArrowTurnDownRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/hero-desktop.png"
            width={1000}
            height={760}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <Image
            src="/hero-mobile.png"
            width={560}
            height={620}
            className="block md:hidden"
            alt="Screenshot of the dashboard project showing mobile version"
          />
        </div>
      </div>
    </main>
  );
}