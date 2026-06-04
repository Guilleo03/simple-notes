"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { NotesToolbar } from "./notes-toolbar"

const STORAGE_KEY = "notes_content"
const THEME_KEY = "notes_theme"

export function NotesClient() {
  const [content, setContent] = useState("")
  const [saved, setSaved] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [font, setFont] = useState<"sans" | "mono">("sans")
  const [focusMode, setFocusMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) ?? ""
    const storedTheme = (localStorage.getItem(THEME_KEY) as "light" | "dark") ?? "light"
    const storedFont = (localStorage.getItem("notes_font") as "sans" | "mono") ?? "sans"
    setContent(stored)
    setTheme(storedTheme)
    setFont(storedFont)
    setMounted(true)
  }, [])

  // Apply theme class to <html>
  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem(THEME_KEY, theme)
  }, [theme, mounted])

  // Auto-save with debounce
  useEffect(() => {
    if (!mounted) return
    setSaved(false)
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, content)
      setLastSaved(new Date())
      setSaved(true)
    }, 800)
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [content, mounted])

  // Focus textarea on focus mode enter
  useEffect(() => {
    if (focusMode) textareaRef.current?.focus()
  }, [focusMode])

  const wordCount = content.trim() === "" ? 0 : content.trim().split(/\s+/).length
  const charCount = content.length

  const handleClear = useCallback(() => {
    if (content.length === 0) return
    if (!confirm("Clear all notes? This cannot be undone.")) return
    setContent("")
    localStorage.removeItem(STORAGE_KEY)
    setLastSaved(null)
    setSaved(false)
    textareaRef.current?.focus()
  }, [content])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content)
  }, [content])

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `notes-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [content])

  const handleToggleFont = useCallback(() => {
    setFont(f => {
      const next = f === "sans" ? "mono" : "sans"
      localStorage.setItem("notes_font", next)
      return next
    })
  }, [])

  // Keyboard shortcut: Escape exits focus mode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && focusMode) setFocusMode(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [focusMode])

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
      </div>
    )
  }

  const fontClass = font === "mono" ? "font-mono" : "font-sans"

  return (
    <div className="flex flex-col h-screen bg-background text-foreground transition-colors duration-300">
      <NotesToolbar
        wordCount={wordCount}
        charCount={charCount}
        saved={saved}
        lastSaved={lastSaved}
        onClear={handleClear}
        onCopy={handleCopy}
        onDownload={handleDownload}
        theme={theme}
        onToggleTheme={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
        font={font}
        onToggleFont={handleToggleFont}
        focusMode={focusMode}
        onToggleFocusMode={() => setFocusMode(f => !f)}
      />

      <main className="flex-1 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={focusMode ? "" : "Start writing…"}
          spellCheck
          className={`
            w-full h-full resize-none bg-transparent text-foreground
            placeholder:text-muted-foreground/40
            focus:outline-none
            leading-relaxed
            transition-all duration-300
            ${fontClass}
            ${focusMode
              ? "px-[max(2rem,calc(50vw-340px))] py-24 text-lg"
              : "px-6 sm:px-12 md:px-24 lg:px-[max(6rem,calc(50vw-420px))] py-10 text-base sm:text-lg"
            }
          `}
          autoFocus
        />
      </main>

      {/* Bottom status bar */}
      {!focusMode && (
        <footer className="flex items-center justify-between px-6 py-2 border-t border-border">
          <span className="text-[var(--subtle)] text-xs font-mono sm:hidden">
            {wordCount}w &middot; {charCount}c
          </span>
          <span className="text-[var(--subtle)] text-xs font-mono hidden sm:inline">
            localStorage · auto-saved
          </span>
          <div className="flex items-center gap-2">
            {saved && lastSaved ? (
              <span className="flex items-center gap-1.5 text-[var(--subtle)] text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500/70 inline-block" />
                saved
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[var(--subtle)] text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500/70 inline-block animate-pulse" />
                saving…
              </span>
            )}
          </div>
        </footer>
      )}
    </div>
  )
}
