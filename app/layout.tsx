import type { Metadata, Viewport } from 'next';
import './globals.css';
import PrivyProviderWrapper from '@/app/providers/PrivyProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Faith - Deploy Tokens on Solana',
  description: 'Deploy tokens, track real-time markets, and manage your Solana portfolio — all in one platform',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Faith - Deploy Tokens on Solana',
    description: 'Deploy tokens, track real-time markets, and manage your Solana portfolio — all in one platform',
    images: [
      {
        url: '/emb.png',
        width: 1200,
        height: 630,
        alt: 'Faith Platform',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({  
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Indie+Flower&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-archivo">
        <PrivyProviderWrapper>
          {children}
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}
