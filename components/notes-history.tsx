"use client"

import { useEffect, useRef } from "react"

export interface SavedNote {
  id: string
  title: string
  preview: string
  savedAt: number // timestamp ms
  content: string
}

interface NotesHistoryProps {
  open: boolean
  onClose: () => void
  notes: SavedNote[]
  activeId: string
  onRestore: (note: SavedNote) => void
  onDelete: (id: string) => void
}

function formatDate(ts: number) {
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  return d.toLocaleDateString([], { month: "short", day: "numeric" })
}

export function NotesHistory({
  open,
  onClose,
  notes,
  activeId,
  onRestore,
  onDelete,
}: NotesHistoryProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    // Delay to avoid the opening click from immediately closing
    const id = setTimeout(() => document.addEventListener("mousedown", handler), 50)
    return () => {
      clearTimeout(id)
      document.removeEventListener("mousedown", handler)
    }
  }, [open, onClose])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-foreground/5 backdrop-blur-[2px] transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Note history"
        className={`fixed top-0 right-0 z-40 h-full w-72 sm:w-80 bg-card border-l border-border flex flex-col shadow-xl transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="text-sm font-semibold text-foreground tracking-tight">History</span>
          <button
            onClick={onClose}
            title="Close history"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-[var(--surface-hover)] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Note list */}
        <div className="flex-1 overflow-y-auto py-2">
          {notes.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground text-center">
              No saved notes yet.
            </p>
          ) : (
            <ul>
              {notes.map((note) => (
                <li key={note.id}>
                  <div
                    className={`group mx-2 mb-1 px-3 py-3 rounded-md cursor-pointer transition-colors ${
                      note.id === activeId
                        ? "bg-[var(--surface-hover)] text-foreground"
                        : "hover:bg-[var(--surface-hover)] text-foreground"
                    }`}
                    onClick={() => {
                      onRestore(note)
                      onClose()
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate leading-snug">
                          {note.title || "Untitled"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5 leading-snug">
                          {note.preview || "Empty note"}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1.5 font-mono">
                          {formatDate(note.savedAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(note.id)
                        }}
                        title="Delete this note"
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex-shrink-0 mt-0.5"
                      >
                        <SmallTrashIcon />
                      </button>
                    </div>
                    {note.id === activeId && (
                      <span className="inline-block mt-1.5 text-[10px] font-mono text-muted-foreground/60 tracking-wide uppercase">
                        current
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-border">
          <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
            Notes are saved locally in your browser. Clearing browser data will remove them.
          </p>
        </div>
      </div>
    </>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function SmallTrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}
