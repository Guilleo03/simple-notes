import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const APP_URL = 'https://fast-notes.vercel.app'
const TITLE = 'Notes — Write Freely. Save Instantly.'
const DESCRIPTION =
  'The best free online notepad. Distraction-free writing with instant auto-save to your browser, dark mode, note history, and no sign-up required.'

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
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9f7f3' },
    { media: '(prefers-color-scheme: dark)', color: '#333333' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
