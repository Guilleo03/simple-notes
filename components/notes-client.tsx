'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { NotesHistory, type SavedNote } from './notes-history';
import { NotesToolbar } from './notes-toolbar';
import { KOFI_URL, LINKEDIN_URL } from '@/lib/constants';

const THEME_KEY = 'notes_theme';
const HISTORY_KEY = 'notes_history';
const ACTIVE_ID_KEY = 'notes_active_id';

function FooterLinkedinIcon() {
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
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function FooterKofiIcon() {
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
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6" y1="2" y2="4" />
      <line x1="10" x2="10" y1="2" y2="4" />
      <line x1="14" x2="14" y1="2" y2="4" />
    </svg>
  );
}

function generateId() {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function getNoteTitle(content: string): string {
  const firstLine = content.split('\n')[0]?.trim() ?? '';
  return firstLine.slice(0, 60);
}

function getNotePreview(content: string): string {
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  const preview = lines[1] ?? lines[0] ?? '';
  return preview.trim().slice(0, 80);
}

function loadHistory(): SavedNote[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedNote[];
  } catch {
    return [];
  }
}

function saveHistory(notes: SavedNote[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(notes));
}

export function NotesClient() {
  const { t, locale } = useLocale();
  const [content, setContent] = useState('');
  const [activeId, setActiveId] = useState<string>('');
  const [history, setHistory] = useState<SavedNote[]>([]);
  const [saved, setSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mount: load theme, history, and active note
  useEffect(() => {
    const storedTheme =
      (localStorage.getItem(THEME_KEY) as 'light' | 'dark') ?? 'light';
    setTheme(storedTheme);

    const storedHistory = loadHistory();
    setHistory(storedHistory);

    const storedActiveId = localStorage.getItem(ACTIVE_ID_KEY);
    if (storedActiveId) {
      const active = storedHistory.find(n => n.id === storedActiveId);
      if (active) {
        setActiveId(active.id);
        setContent(active.content);
        setMounted(true);
        return;
      }
    }

    // No active note found — start a fresh one
    const id = generateId();
    setActiveId(id);
    setContent('');
    setMounted(true);
  }, []);

  // Apply theme class to <html>
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, mounted]);

  // Auto-save with debounce — upserts the active note in history
  useEffect(() => {
    if (!mounted) return;
    setSaved(false);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const now = Date.now();
      const updatedNote: SavedNote = {
        id: activeId,
        title: getNoteTitle(content),
        preview: getNotePreview(content),
        savedAt: now,
        content,
      };
      setHistory(prev => {
        const without = prev.filter(n => n.id !== activeId);
        const next = [updatedNote, ...without];
        saveHistory(next);
        return next;
      });
      localStorage.setItem(ACTIVE_ID_KEY, activeId);
      setLastSaved(new Date(now));
      setSaved(true);
    }, 800);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [content, activeId, mounted]);

  const wordCount =
    content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
  const charCount = content.length;

  // Create a brand new note
  const handleNew = useCallback(() => {
    const id = generateId();
    setActiveId(id);
    setContent('');
    setSaved(false);
    setLastSaved(null);
    localStorage.setItem(ACTIVE_ID_KEY, id);
    textareaRef.current?.focus();
  }, []);

  const handleClear = useCallback(() => {
    if (content.length === 0) return;
    if (!confirm(t.confirmClear)) return;
    setContent('');
    setSaved(false);
    setLastSaved(null);
    // Remove from history too
    setHistory(prev => {
      const next = prev.filter(n => n.id !== activeId);
      saveHistory(next);
      return next;
    });
    textareaRef.current?.focus();
  }, [content, activeId]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content);
  }, [content]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${getNoteTitle(content) || 'notes'}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content]);

  const handleShare = useCallback(() => {
    import('fflate').then(({ deflateSync, strToU8 }) => {
      const compressed = deflateSync(strToU8(content), { level: 9 });
      const encoded = btoa(String.fromCharCode(...compressed))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      const url = `${window.location.origin}/share#note=${encoded}`;
      navigator.clipboard.writeText(url);
    });
  }, [content]);

  // Restore a note from history
  const handleRestore = useCallback((note: SavedNote) => {
    setActiveId(note.id);
    setContent(note.content);
    setSaved(true);
    setLastSaved(new Date(note.savedAt));
    localStorage.setItem(ACTIVE_ID_KEY, note.id);
  }, []);

  // Delete a note from history
  const handleDeleteNote = useCallback(
    (id: string) => {
      setHistory(prev => {
        const next = prev.filter(n => n.id !== id);
        saveHistory(next);
        return next;
      });
      // If deleting the active note, start fresh
      if (id === activeId) {
        handleNew();
      }
    },
    [activeId, handleNew]
  );

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
      <NotesToolbar
        wordCount={wordCount}
        charCount={charCount}
        saved={saved}
        lastSaved={lastSaved}
        historyCount={history.length}
        onNew={handleNew}
        onClear={handleClear}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onShare={handleShare}
        onOpenHistory={() => setHistoryOpen(true)}
        theme={theme}
        onToggleTheme={() =>
          setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
        }
        t={t}
      />

      <main className="flex-1 overflow-hidden" aria-label={t.appName}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={t.placeholder}
          aria-label={t.placeholder}
          aria-multiline="true"
          spellCheck
          className="w-full h-[calc(100dvh-52px-37px)] resize-none bg-transparent text-foreground font-sans placeholder:text-muted-foreground/40 focus:outline-none leading-relaxed px-6 sm:px-12 md:px-24 lg:px-[max(6rem,calc(50vw-420px))] py-10 text-base sm:text-lg"
          autoFocus
        />
      </main>

      {/* Bottom status bar */}
      <footer className="flex items-center justify-between px-6 py-2 border-t border-border">
        <span className="text-(--subtle) text-xs font-sans sm:hidden">
          {wordCount}
          {t.words[0]} &middot; {charCount}
          {t.characters[0]}
        </span>
        <span className="text-(--subtle) text-xs font-sans hidden sm:inline">
          {history.length > 0
            ? t.savedLocally(history.length)
            : t.autoSavedLocally}
        </span>
        <div className="flex items-center gap-3">
          {saved && lastSaved ? (
            <span
              role="status"
              aria-live="polite"
              className="flex items-center gap-1.5 text-(--subtle) text-xs font-sans">
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full bg-green-500/70 inline-block"
              />
              {t.saved}
            </span>
          ) : (
            <span
              role="status"
              aria-live="polite"
              className="flex items-center gap-1.5 text-(--subtle) text-xs font-sans">
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full bg-amber-500/70 inline-block animate-pulse"
              />
              {t.saving}
            </span>
          )}

          <div className="w-px h-3 bg-border" />

          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on LinkedIn"
            title="View on LinkedIn"
            className="text-(--subtle) hover:text-foreground transition-colors">
            <FooterLinkedinIcon />
          </a>

          <a
            href={KOFI_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Support on Ko-fi"
            title="Support on Ko-fi"
            className="text-(--subtle) hover:text-foreground transition-colors">
            <FooterKofiIcon />
          </a>
        </div>
      </footer>

      <NotesHistory
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        notes={history}
        activeId={activeId}
        onRestore={handleRestore}
        onDelete={handleDeleteNote}
        t={t}
        locale={locale}
      />
    </div>
  );
}
