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
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      color="#000000"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5">
      <path d="M4.5 9.5H4C3.05719 9.5 2.58579 9.5 2.29289 9.79289C2 10.0858 2 10.5572 2 11.5V20C2 20.9428 2 21.4142 2.29289 21.7071C2.58579 22 3.05719 22 4 22H4.5C5.44281 22 5.91421 22 6.20711 21.7071C6.5 21.4142 6.5 20.9428 6.5 20V11.5C6.5 10.5572 6.5 10.0858 6.20711 9.79289C5.91421 9.5 5.44281 9.5 4.5 9.5Z"></path>
      <path d="M6.5 4.25C6.5 5.49264 5.49264 6.5 4.25 6.5C3.00736 6.5 2 5.49264 2 4.25C2 3.00736 3.00736 2 4.25 2C5.49264 2 6.5 3.00736 6.5 4.25Z"></path>
      <path
        d="M12.326 9.5H11.5C10.5572 9.5 10.0858 9.5 9.79289 9.79289C9.5 10.0858 9.5 10.5572 9.5 11.5V20C9.5 20.9428 9.5 21.4142 9.79289 21.7071C10.0858 22 10.5572 22 11.5 22H12C12.9428 22 13.4142 22 13.7071 21.7071C14 21.4142 14 20.9428 14 20L14.0001 16.5001C14.0001 14.8433 14.5281 13.5001 16.0879 13.5001C16.8677 13.5001 17.5 14.1717 17.5 15.0001V19.5001C17.5 20.4429 17.5 20.9143 17.7929 21.2072C18.0857 21.5001 18.5572 21.5001 19.5 21.5001H19.9987C20.9413 21.5001 21.4126 21.5001 21.7055 21.2073C21.9984 20.9145 21.9985 20.4432 21.9987 19.5006L22.0001 14.0002C22.0001 11.515 19.6364 9.50024 17.2968 9.50024C15.9649 9.50024 14.7767 10.1531 14.0001 11.174C14 10.5439 14 10.2289 13.8632 9.995C13.7765 9.84686 13.6531 9.72353 13.505 9.63687C13.2711 9.5 12.9561 9.5 12.326 9.5Z"
        strokeLinejoin="round"></path>
    </svg>
  );
}

function FooterKofiIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      color="#000000"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round">
      <path d="M17 5.5H4C3.05719 5.5 2.58579 5.5 2.29289 5.79289C2 6.08579 2 6.55719 2 7.5V14.5C2 16.3856 2 17.3284 2.58579 17.9142C3.17157 18.5 4.11438 18.5 6 18.5H13C13.9319 18.5 14.3978 18.5 14.7654 18.3478C15.2554 18.1448 15.6448 17.7554 15.8478 17.2654C16 16.8978 16 16.4319 16 15.5H17C19.7614 15.5 22 13.2614 22 10.5C22 7.73858 19.7614 5.5 17 5.5Z"></path>
      <path d="M17 13H16V8H17C18.3807 8 19.5 9.11929 19.5 10.5C19.5 11.8807 18.3807 13 17 13Z"></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.58579 9.10051C6.36683 8.29983 7.63317 8.29983 8.41421 9.10051L9 9.70101L9.58579 9.10051C10.3668 8.29983 11.6332 8.29983 12.4142 9.10051C13.1953 9.90118 13.1953 11.1993 12.4142 12L9 15.5L5.58579 12C4.80474 11.1993 4.80474 9.90118 5.58579 9.10051Z"
        strokeLinecap="round"></path>
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
            className="text-(--subtle) hover:text-foreground transition-colors translate-y-0.5">
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
