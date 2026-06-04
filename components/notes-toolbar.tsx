"use client"

import { useEffect, useState } from "react"

interface NotesToolbarProps {
  wordCount: number
  charCount: number
  saved: boolean
  lastSaved: Date | null
  onClear: () => void
  onCopy: () => void
  onDownload: () => void
  theme: "light" | "dark"
  onToggleTheme: () => void
  font: "sans" | "mono"
  onToggleFont: () => void
  focusMode: boolean
  onToggleFocusMode: () => void
}

export function NotesToolbar({
  wordCount,
  charCount,
  saved,
  lastSaved,
  onClear,
  onCopy,
  onDownload,
  theme,
  onToggleTheme,
  font,
  onToggleFont,
  focusMode,
  onToggleFocusMode,
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

  if (focusMode) {
    return (
      <button
        onClick={onToggleFocusMode}
        title="Exit focus mode"
        className="fixed top-4 right-4 z-50 text-[var(--subtle)] hover:text-foreground transition-colors text-xs font-mono tracking-widest uppercase opacity-40 hover:opacity-100"
      >
        esc
      </button>
    )
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      {/* Left: branding */}
      <div className="flex items-center gap-3">
        <span className="text-foreground font-semibold text-sm tracking-tight select-none">
          notes.
        </span>
        {saved && lastSaved && (
          <span className="text-[var(--subtle)] text-xs font-mono transition-opacity">
            saved {timeAgo}
          </span>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1">
        {/* Stats */}
        <span className="text-[var(--subtle)] text-xs font-mono mr-3 hidden sm:inline">
          {wordCount} {wordCount === 1 ? "word" : "words"} &middot; {charCount} chars
        </span>

        {/* Font toggle */}
        <ToolbarButton onClick={onToggleFont} title={font === "sans" ? "Switch to mono" : "Switch to sans"}>
          {font === "sans" ? (
            <MonoIcon />
          ) : (
            <SansIcon />
          )}
        </ToolbarButton>

        {/* Focus mode */}
        <ToolbarButton onClick={onToggleFocusMode} title="Enter focus mode">
          <FocusIcon />
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
        <ToolbarButton onClick={onClear} title="Clear notes" danger>
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
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-md transition-colors ${
        danger
          ? "text-[var(--subtle)] hover:text-destructive hover:bg-destructive/10"
          : "text-[var(--subtle)] hover:text-foreground hover:bg-[var(--surface-hover)]"
      }`}
    >
      {children}
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

function FocusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
    </svg>
  )
}

function MonoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  )
}

function SansIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7V4h16v3M9 20h6M12 4v16" />
    </svg>
  )
}
