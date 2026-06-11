import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter/index.css';
import './globals.css';
import { APP_URL, TITLE, DESCRIPTION } from '@/lib/metadata';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: TITLE,
    template: '%s | Notes',
  },
  description: DESCRIPTION,
  keywords: [
    'online notepad',
    'free notepad',
    'notes app',
    'distraction-free writing',
    'browser notes',
    'quick notes',
    'note taking app',
    'minimalist notes',
    'auto-save notes',
    'dark mode notepad',
    'local storage notes',
    'no login notepad',
    'instant notes',
    'simple notepad online',
  ],
  authors: [{ name: 'Notes App' }],
  creator: 'Notes App',
  publisher: 'Notes App',
  category: 'productivity',
  applicationName: 'Notes',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Notes',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Notes — Write freely, save instantly.',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
    creator: '@notesapp',
  },
  alternates: {
    canonical: APP_URL,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Notes',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9f7f3' },
    { media: '(prefers-color-scheme: dark)', color: '#333333' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
