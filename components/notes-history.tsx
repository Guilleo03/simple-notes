'use client';

import { useEffect, useRef } from 'react';
import type { Locale, Translations } from '@/lib/i18n';

export interface SavedNote {
  id: string;
  title: string;
  preview: string;
  savedAt: number; // timestamp ms
  content: string;
}

interface NotesHistoryProps {
  open: boolean;
  onClose: () => void;
  notes: SavedNote[];
  activeId: string;
  onRestore: (note: SavedNote) => void;
  onDelete: (id: string) => void;
  t: Translations;
  locale: Locale;
}

function formatDate(ts: number, t: Translations, locale: Locale) {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) {
    return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays === 1) return t.timeYesterday;
  if (diffDays < 7) return t.timeDaysAgo(diffDays);
  return d.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}

export function NotesHistory({
  open,
  onClose,
  notes,
  activeId,
  onRestore,
  onDelete,
  t,
  locale,
}: NotesHistoryProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = 'notes-history-heading';
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus the close button when the dialog opens
  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => closeButtonRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay to avoid the opening click from immediately closing
    const id = setTimeout(
      () => document.addEventListener('mousedown', handler),
      50
    );
    return () => {
      clearTimeout(id);
      document.removeEventListener('mousedown', handler);
    };
  }, [open, onClose]);

  // Close on Escape; trap Tab inside the dialog
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (
          e.shiftKey
            ? document.activeElement === first
            : document.activeElement === last
        ) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-foreground/5 backdrop-blur-[2px] transition-opacity duration-200 ${
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className={`fixed top-0 right-0 z-40 h-full w-72 sm:w-80 bg-card border-l border-border flex flex-col shadow-xl transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2
            id={headingId}
            className="text-md font-semibold text-foreground tracking-tight">
            {t.historyTitle}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            title={t.closeHistory}
            aria-label={t.closeHistory}
            type="button"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-(--surface-hover) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <CloseIcon />
          </button>
        </div>

        {/* Note list */}
        <div className="flex-1 overflow-y-auto py-2">
          {notes.length === 0 ? (
            <p className="px-5 py-8 text-md text-muted-foreground text-center">
              {t.historyEmpty}
            </p>
          ) : (
            <ul>
              {notes.map(note => (
                <li key={note.id}>
                  <div
                    className={`group mx-2 mb-1 rounded-md transition-colors ${
                      note.id === activeId
                        ? 'bg-(--surface-hover) text-foreground'
                        : 'text-foreground'
                    }`}>
                    <button
                      type="button"
                      onClick={() => {
                        onRestore(note);
                        onClose();
                      }}
                      aria-label={`${t.restoreNote}: ${note.title || t.historyUntitled}`}
                      aria-current={note.id === activeId ? 'true' : undefined}
                      className="w-full text-left px-3 py-3 rounded-md cursor-pointer hover:bg-(--surface-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-md font-medium truncate leading-snug">
                            {note.title || t.historyUntitled}
                          </p>
                          <p className="text-md text-muted-foreground truncate mt-0.5 leading-snug">
                            {note.preview || t.historyNoPreview}
                          </p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1.5 font-mono">
                            {formatDate(note.savedAt, t, locale)}
                          </p>
                        </div>
                      </div>
                      {note.id === activeId && (
                        <span className="inline-block mt-1.5 text-[10px] font-mono text-muted-foreground/60 tracking-wide uppercase">
                          {t.currentNote}
                        </span>
                      )}
                    </button>
                    <div className="flex justify-end px-2 pb-1">
                      <button
                        type="button"
                        onClick={() => onDelete(note.id)}
                        title={t.deleteNote}
                        aria-label={`${t.deleteNote}: ${note.title || t.historyUntitled}`}
                        className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all shrink-0">
                        <SmallTrashIcon />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-border">
          <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
            {t.historyStorageHint}
          </p>
        </div>
      </div>
    </>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function SmallTrashIcon() {
  return (
    <svg
      aria-hidden="true"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
