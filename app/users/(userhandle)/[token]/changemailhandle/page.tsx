import AcmeLogo from '@/app/ui/acme-logo';
import Form from '@/app/ui/user/changemailhandle-form';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { getUserByToken } from '@/app/lib/utils';
import { deleteDatabaseToken } from '@/app/lib/actions/functions/users';
import { notFound } from 'next/navigation';
import { standardMetadata } from '@/app/lib/standardMetadata';
 
export const metadata: Metadata = {
  title: 'Change Email Handle',
  ...standardMetadata,
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
          <Form oldemail={user.email} newemail={user.new_email} name={user.name} image={user.image}/>
        </Suspense>
      </div>
    </main>
  );
}