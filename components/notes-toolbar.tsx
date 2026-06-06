'use client';

import { useEffect, useState } from 'react';
import type { Translations } from '@/lib/i18n';

interface NotesToolbarProps {
  wordCount: number;
  charCount: number;
  saved: boolean;
  lastSaved: Date | null;
  historyCount: number;
  onNew: () => void;
  onClear: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onOpenHistory: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  t: Translations;
}

export function NotesToolbar({
  wordCount,
  charCount,
  saved,
  lastSaved,
  historyCount,
  onNew,
  onClear,
  onCopy,
  onDownload,
  onOpenHistory,
  theme,
  onToggleTheme,
  t,
}: NotesToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!lastSaved) return;
    const update = () => {
      const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
      if (seconds < 5) setTimeAgo(t.savedAgo(0));
      else if (seconds < 60) setTimeAgo(t.savedAgo(seconds));
      else setTimeAgo(t.timeMinutesAgo(Math.floor(seconds / 60)));
    };
    update();
    const id = setInterval(update, 5000);
    return () => clearInterval(id);
  }, [lastSaved]);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
      {/* Left: branding + save status */}
      <div className="flex items-baseline gap-2 sm:gap-3 min-w-0">
        <span className="font-sans text-foreground font-semibold text-base sm:text-lg tracking-tight select-none shrink-0">
          simple notes.
        </span>
        <span
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-(--subtle) text-xs font-sans transition-opacity hidden sm:inline truncate">
          {saved && lastSaved ? timeAgo : ''}
        </span>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        {/* Stats */}
        <span
          aria-label={`${wordCount} ${t.words}, ${charCount} ${t.characters}`}
          className="text-(--subtle) text-xs font-sans mr-3 hidden sm:inline"
          aria-live="polite">
          {wordCount} {t.words} &middot; {charCount} {t.characters}
        </span>

        {/* New note */}
        <ToolbarButton onClick={onNew} title={t.newNote}>
          <NewIcon />
        </ToolbarButton>

        {/* History */}
        <ToolbarButton
          onClick={onOpenHistory}
          title={t.openHistory}
          badge={historyCount > 0 ? historyCount : undefined}>
          <HistoryIcon />
        </ToolbarButton>

        {/* Copy */}
        <ToolbarButton
          onClick={handleCopy}
          title={copied ? t.copied : t.copyToClipboard}>
          {copied ? <CheckIcon /> : <CopyIcon />}
        </ToolbarButton>

        {/* Download */}
        <ToolbarButton onClick={onDownload} title={t.downloadNote}>
          <DownloadIcon />
        </ToolbarButton>

        {/* Clear */}
        <ToolbarButton onClick={onClear} title={t.clearNote} danger>
          <TrashIcon />
        </ToolbarButton>

        {/* Divider */}
        <div className="w-px h-4 bg-border mx-1" />

        {/* Theme toggle */}
        <ToolbarButton onClick={onToggleTheme} title={t.toggleTheme}>
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </ToolbarButton>

        {/* Divider */}
        <div className="w-px h-4 bg-border mx-1" />

        {/* GitHub */}
        <a
          href="https://github.com/Guilleo03/simple-notes"
          target="_blank"
          rel="noopener noreferrer"
          title="View on GitHub"
          aria-label="View on GitHub"
          className="relative p-1.5 sm:p-2 rounded-md transition-colors text-(--subtle) hover:text-foreground hover:bg-(--surface-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span aria-hidden="true"><GitHubIcon /></span>
        </a>

        {/* Ko-fi */}
        <a
          href="https://ko-fi.com/guilleo03"
          target="_blank"
          rel="noopener noreferrer"
          title="Support on Ko-fi"
          aria-label="Support on Ko-fi"
          className="relative p-1.5 sm:p-2 rounded-md transition-colors text-(--subtle) hover:text-foreground hover:bg-(--surface-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span aria-hidden="true"><KofiIcon /></span>
        </a>
      </div>
    </header>
  );
}

function ToolbarButton({
  children,
  onClick,
  title,
  danger,
  badge,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      type="button"
      className={`relative p-1.5 sm:p-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        danger
          ? 'text-(--subtle) hover:text-destructive hover:bg-destructive/10'
          : 'text-(--subtle) hover:text-foreground hover:bg-(--surface-hover)'
      }`}>
      <span aria-hidden="true">{children}</span>
      {badge !== undefined && (
        <span
          aria-label={`${badge} notes`}
          className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-foreground text-background text-[9px] font-sans font-semibold flex items-center justify-center px-0.5 leading-none">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}

// Icons
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

function CopyIcon() {
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
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function DownloadIcon() {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function TrashIcon() {
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
      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function NewIcon() {
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
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function HistoryIcon() {
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
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function KofiIcon() {
  return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor">
      <path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 2.91.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z" />
    </svg>
  );
}
