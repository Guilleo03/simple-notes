import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Notes — Write Freely',
    short_name: 'Notes',
    description:
      'The best free online notepad. Distraction-free writing with instant auto-save, dark mode, and note history. No sign-up required.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9f7f3',
    theme_color: '#333333',
    orientation: 'portrait-primary',
    categories: ['productivity', 'utilities'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/og-image.png',
        sizes: '1200x630',
        type: 'image/png',
      },
    ],
  }
}
