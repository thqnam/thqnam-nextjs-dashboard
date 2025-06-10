'use client';
 
import { useEffect } from 'react';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Error Invoices',
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
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}