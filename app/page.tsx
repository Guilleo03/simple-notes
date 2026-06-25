import { NotesClient } from '@/components/notes-client';
import { APP_URL, DESCRIPTION } from '@/lib/metadata';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Simple Notes',
  url: APP_URL,
  description: DESCRIPTION,
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
  screenshot: `${APP_URL}/og-image.png`,
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="sr-only">
        <h1>Simple Notes — Free Online Notepad, No Sign-Up Required</h1>
        <p>
          Write notes instantly in your browser. No account or sign-up required.
          Your notes auto-save locally, work offline, and never leave your
          device. Includes dark mode, note history, and word count.
        </p>
        <ul>
          <li>Auto-save to browser storage — no data loss</li>
          <li>Dark and light mode</li>
          <li>Note history and retrieval</li>
          <li>Download notes as .txt file</li>
          <li>No login, no ads, completely free</li>
        </ul>
      </section>
      <NotesClient />
    </>
  );
}
