import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: {
    template: `${process.env.APP_NAME} App | %s`,
    default: `${process.env.APP_NAME} App`,
  },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children} </body>
    </html>
  );
}
