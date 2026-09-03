import AcmeLogo from '@/app/ui/acme-logo';
import SideLink from '@/app/ui/sidelink';
import styles from '@/app/ui/home.module.css';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Change Email To Reponse',
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
  classification: "Business",
  category: "Technology",
  openGraph: {
    type: 'website',
    url: `${process.env.APP_HOMEPAGE}`,
    title: `${process.env.APP_NAME} App`,
    description: `The official Web Page of ${process.env.APP_NAME} App, built by Mr. ${process.env.APP_OWNER}.`,
    siteName: `${process.env.APP_NAME}`,
    locale: "vi_VN",
    alternateLocale: ["en_US"],
    emails: ["thieuhuynhquangnam1996@gmail.com"],
    countryName: "Vietnam",
    phoneNumbers: ["+84937821788"],
    images: [
      { 
        url: `${process.env.APP_ICON}`, 
        alt: `${process.env.APP_NAME}'s picture`,
        type: "image/png",
        secureUrl: `${process.env.APP_ICON}`,
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: `${process.env.APP_HOMEPAGE}`,
    creator: `${process.env.APP_OWNER}`,
    description: `The official Web Page of ${process.env.APP_NAME} App, built by Mr. ${process.env.APP_OWNER}.`,
    title: `${process.env.APP_NAME} App`,
    creatorId: "@NamThieu1996",
    images: [
      { 
        url: `${process.env.APP_ICON}`, 
        alt: `${process.env.APP_NAME}'s picture`,
        type: "image/png",
        secureUrl: `${process.env.APP_ICON}`,
      }
    ],
  }
};

export default function Page() {
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
            <strong>Change Mail To Request successful !</strong>{' '}
            But you need to complete your Change Mail To Request.{' '}
            Please check your email box to find your change mail to link email.{' '}
            For verify your this Change Mail To Request.{' '}
            If you do not see the email, check your spam or promotions folder.{' '}
          </p>
          <SideLink />
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
