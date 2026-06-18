import { SharedNoteClient } from '@/components/shared-note-client';

export const metadata = {
  title: 'Shared Note — Simple Notes',
  description: 'A read-only note shared via Simple Notes.',
  robots: { index: false, follow: false },
};

export default function SharePage() {
  return <SharedNoteClient />;
}
