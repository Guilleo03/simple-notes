'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { NotesHistory, type SavedNote } from './notes-history';
import { NotesToolbar } from './notes-toolbar';

const THEME_KEY = 'notes_theme';
const HISTORY_KEY = 'notes_history';
const ACTIVE_ID_KEY = 'notes_active_id';

function FooterGitHubIcon() {
  return (
    <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function FooterKofiIcon() {
  return (
    <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 2.91.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z" />
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
          className="w-full h-full resize-none bg-transparent text-foreground font-sans placeholder:text-muted-foreground/40 focus:outline-none leading-relaxed px-6 sm:px-12 md:px-24 lg:px-[max(6rem,calc(50vw-420px))] py-10 text-base sm:text-lg"
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
            href="https://github.com/Guilleo03/simple-notes"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
            title="View on GitHub"
            className="text-(--subtle) hover:text-foreground transition-colors">
            <FooterGitHubIcon />
          </a>

          <a
            href="https://ko-fi.com/guilleo03"
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
