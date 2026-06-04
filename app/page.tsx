import { NotesClient } from "@/components/notes-client"

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Notes',
  url: 'https://fast-notes.vercel.app',
  description:
    'The best free online notepad. Distraction-free writing with instant auto-save to your browser, dark mode, note history, and no sign-up required.',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Auto-save to browser storage',
    'Dark and light mode',
    'Note history and retrieval',
    'Distraction-free writing',
    'No account required',
    'Download notes as text file',
    'Word and character count',
  ],
  screenshot: 'https://fast-notes.vercel.app/og-image.png',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    ratingCount: '1',
    bestRating: '5',
    worstRating: '1',
  },
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NotesClient />
    </>
  )
}
