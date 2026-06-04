"use client"

import { useEffect, useState } from "react"

interface NotesToolbarProps {
  wordCount: number
  charCount: number
  saved: boolean
  lastSaved: Date | null
  historyCount: number
  onNew: () => void
  onClear: () => void
  onCopy: () => void
  onDownload: () => void
  onOpenHistory: () => void
  theme: "light" | "dark"
  onToggleTheme: () => void
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
}: NotesToolbarProps) {
  const [copied, setCopied] = useState(false)
  const [timeAgo, setTimeAgo] = useState("")

  useEffect(() => {
    if (!lastSaved) return
    const update = () => {
      const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000)
      if (seconds < 5) setTimeAgo("just now")
      else if (seconds < 60) setTimeAgo(`${seconds}s ago`)
      else setTimeAgo(`${Math.floor(seconds / 60)}m ago`)
    }
    update()
    const id = setInterval(update, 5000)
    return () => clearInterval(id)
  }, [lastSaved])

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      {/* Left: branding + save status */}
      <div className="flex items-center gap-3">
        <span className="text-foreground font-semibold text-xl tracking-tight select-none">
          notes.
        </span>
        {saved && lastSaved && (
          <span className="text-[var(--subtle)] text-xs font-sans transition-opacity">
            saved {timeAgo}
          </span>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        {/* Stats */}
        <span className="text-[var(--subtle)] text-xs font-sans mr-3 hidden sm:inline">
          {wordCount} {wordCount === 1 ? "word" : "words"} &middot; {charCount} chars
        </span>

        {/* New note */}
        <ToolbarButton onClick={onNew} title="New note">
          <NewIcon />
        </ToolbarButton>

        {/* History */}
        <ToolbarButton onClick={onOpenHistory} title="Note history" badge={historyCount > 0 ? historyCount : undefined}>
          <HistoryIcon />
        </ToolbarButton>

        {/* Copy */}
        <ToolbarButton onClick={handleCopy} title="Copy to clipboard">
          {copied ? <CheckIcon /> : <CopyIcon />}
        </ToolbarButton>

        {/* Download */}
        <ToolbarButton onClick={onDownload} title="Download as .txt">
          <DownloadIcon />
        </ToolbarButton>

        {/* Clear */}
        <ToolbarButton onClick={onClear} title="Clear note" danger>
          <TrashIcon />
        </ToolbarButton>

        {/* Divider */}
        <div className="w-px h-4 bg-border mx-1" />

        {/* Theme toggle */}
        <ToolbarButton onClick={onToggleTheme} title="Toggle theme">
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </ToolbarButton>
      </div>
    </header>
  )
}

function ToolbarButton({
  children,
  onClick,
  title,
  danger,
  badge,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  danger?: boolean
  badge?: number
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`relative p-2 rounded-md transition-colors ${
        danger
          ? "text-[var(--subtle)] hover:text-destructive hover:bg-destructive/10"
          : "text-[var(--subtle)] hover:text-foreground hover:bg-[var(--surface-hover)]"
      }`}
    >
      {children}
      {badge !== undefined && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] rounded-full bg-foreground text-background text-[9px] font-sans font-semibold flex items-center justify-center px-0.5 leading-none">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  )
}

// Icons
function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}


function NewIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  )
}
