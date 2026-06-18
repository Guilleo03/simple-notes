'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { inflateSync, strFromU8 } from 'fflate';
import { useLocale } from '@/hooks/use-locale';

const THEME_KEY = 'notes_theme';

export function SharedNoteClient() {
  const { t } = useLocale();
  const [content, setContent] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read theme from localStorage (same as main app)
    const storedTheme =
      (localStorage.getItem(THEME_KEY) as 'light' | 'dark') ?? 'light';
    setTheme(storedTheme);

    // Decode and decompress note from URL hash
    const hash = window.location.hash;
    const match = hash.match(/^#note=(.+)$/);
    if (match) {
      try {
        // Restore URL-safe base64 back to standard base64
        const base64 = match[1]
          .replace(/-/g, '+')
          .replace(/_/g, '/');
        const binary = atob(base64);
        const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
        const decoded = strFromU8(inflateSync(bytes));
        setContent(decoded);
      } catch {
        setContent('');
      }
    } else {
      setContent('');
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <div
        className="flex h-screen items-center justify-center bg-background"
        role="status"
        aria-label="Loading"
        aria-busy="true">
        <div
          aria-hidden="true"
          className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
        <div className="flex items-baseline gap-2 sm:gap-3 min-w-0">
          <span className="font-sans text-foreground font-semibold text-base sm:text-lg tracking-tight select-none shrink-0">
            simple notes.
          </span>
          <span className="text-(--subtle) text-xs font-sans hidden sm:inline">
            {t.sharedNoteTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Read-only badge */}
          <span className="text-xs font-sans text-(--subtle) border border-border rounded px-2 py-0.5 select-none">
            read-only
          </span>

          {/* Button to open main app */}
          <Link
            href="/"
            className="text-xs font-sans text-(--subtle) hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-(--surface-hover)">
            {t.sharedNoteOpenApp}
          </Link>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
            title={t.toggleTheme}
            aria-label={t.toggleTheme}
            className="p-1.5 sm:p-2 rounded-md text-(--subtle) hover:text-foreground hover:bg-(--surface-hover) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span aria-hidden="true">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </span>
          </button>
        </div>
      </header>

      {/* Note content */}
      <main
        className="flex-1 overflow-y-auto"
        aria-label={t.sharedNoteTitle}>
        {content ? (
          <pre className="w-full h-full font-sans text-foreground leading-relaxed px-6 sm:px-12 md:px-24 lg:px-[max(6rem,calc(50vw-420px))] py-10 text-base sm:text-lg whitespace-pre-wrap break-words">
            {content}
          </pre>
        ) : (
          <p className="px-6 sm:px-12 md:px-24 lg:px-[max(6rem,calc(50vw-420px))] py-10 text-muted-foreground/50 font-sans text-base sm:text-lg">
            {t.sharedNoteEmpty}
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between px-6 py-2 border-t border-border">
        <span className="text-(--subtle) text-xs font-sans">
          {t.sharedNoteTitle}
        </span>
        <span className="text-(--subtle) text-xs font-sans">
          {content
            ? `${content.trim() === '' ? 0 : content.trim().split(/\s+/).length} ${t.words} · ${content.length} ${t.characters}`
            : ''}
        </span>
      </footer>
    </div>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
