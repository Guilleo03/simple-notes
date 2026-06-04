export type Locale = "en" | "es" | "pt" | "fr" | "de" | "it" | "zh"

export interface Translations {
  // Toolbar
  appName: string
  newNote: string
  clearNote: string
  copyToClipboard: string
  copied: string
  downloadNote: string
  openHistory: string
  toggleTheme: string
  words: string
  characters: string
  // Save status
  saving: string
  saved: string
  savedAgo: (seconds: number) => string
  // Textarea
  placeholder: string
  // History panel
  historyTitle: string
  historyEmpty: string
  historyEmptyHint: string
  restoreNote: string
  deleteNote: string
  historyUntitled: string
  historyNoPreview: string
  closeHistory: string
  // Confirm dialogs
  confirmClear: string
  confirmDeleteNote: string
  // Time labels
  timeJustNow: string
  timeYesterday: string
  timeMinutesAgo: (m: number) => string
  timeHoursAgo: (h: number) => string
  timeDaysAgo: (d: number) => string
  // Footer / status bar
  savedLocally: (n: number) => string
  autoSavedLocally: string
  // History misc
  currentNote: string
  historyStorageHint: string
}

const en: Translations = {
  appName: "notes.",
  newNote: "New note",
  clearNote: "Clear note",
  copyToClipboard: "Copy to clipboard",
  copied: "Copied!",
  downloadNote: "Download as .txt",
  openHistory: "Note history",
  toggleTheme: "Toggle theme",
  words: "words",
  characters: "characters",
  saving: "saving…",
  saved: "saved",
  savedAgo: (s) => s === 0 ? `saved · just now` : `saved · ${s}s ago`,
  placeholder: "Start writing…",
  historyTitle: "Note history",
  historyEmpty: "No saved notes yet.",
  historyEmptyHint: "Your notes will appear here as you write.",
  restoreNote: "Restore this note",
  deleteNote: "Delete this note",
  historyUntitled: "Untitled note",
  historyNoPreview: "No preview available.",
  closeHistory: "Close history",
  confirmClear: "Clear this note? This cannot be undone.",
  confirmDeleteNote: "Delete this note from history?",
  timeJustNow: "just now",
  timeYesterday: "Yesterday",
  timeMinutesAgo: (m) => `${m}m ago`,
  timeHoursAgo: (h) => `${h}h ago`,
  timeDaysAgo: (d) => `${d}d ago`,
  savedLocally: (n) => `${n} note${n === 1 ? "" : "s"} saved locally`,
  autoSavedLocally: "auto-saved locally",
  currentNote: "current",
  historyStorageHint: "Notes are saved locally in your browser. Clearing browser data will remove them.",
}

const es: Translations = {
  appName: "notas.",
  newNote: "Nueva nota",
  clearNote: "Borrar nota",
  copyToClipboard: "Copiar al portapapeles",
  copied: "¡Copiado!",
  downloadNote: "Descargar como .txt",
  openHistory: "Historial de notas",
  toggleTheme: "Cambiar tema",
  words: "palabras",
  characters: "caracteres",
  saving: "guardando…",
  saved: "guardado",
  savedAgo: (s) => s === 0 ? `guardado · ahora mismo` : `guardado · hace ${s}s`,
  placeholder: "Empieza a escribir…",
  historyTitle: "Historial de notas",
  historyEmpty: "Aún no hay notas guardadas.",
  historyEmptyHint: "Tus notas aparecerán aquí mientras escribes.",
  restoreNote: "Restaurar esta nota",
  deleteNote: "Eliminar esta nota",
  historyUntitled: "Nota sin título",
  historyNoPreview: "Vista previa no disponible.",
  closeHistory: "Cerrar historial",
  confirmClear: "¿Borrar esta nota? Esto no se puede deshacer.",
  confirmDeleteNote: "¿Eliminar esta nota del historial?",
  timeJustNow: "ahora mismo",
  timeYesterday: "Ayer",
  timeMinutesAgo: (m) => `hace ${m}m`,
  timeHoursAgo: (h) => `hace ${h}h`,
  timeDaysAgo: (d) => `hace ${d}d`,
  savedLocally: (n) => `${n} nota${n === 1 ? "" : "s"} guardada${n === 1 ? "" : "s"} localmente`,
  autoSavedLocally: "guardado automáticamente",
  currentNote: "actual",
  historyStorageHint: "Las notas se guardan localmente en tu navegador. Borrar los datos del navegador las eliminará.",
}

const pt: Translations = {
  appName: "notas.",
  newNote: "Nova nota",
  clearNote: "Limpar nota",
  copyToClipboard: "Copiar para a área de transferência",
  copied: "Copiado!",
  downloadNote: "Baixar como .txt",
  openHistory: "Histórico de notas",
  toggleTheme: "Alternar tema",
  words: "palavras",
  characters: "caracteres",
  saving: "salvando…",
  saved: "salvo",
  savedAgo: (s) => s === 0 ? `salvo · agora mesmo` : `salvo · ${s}s atrás`,
  placeholder: "Comece a escrever…",
  historyTitle: "Histórico de notas",
  historyEmpty: "Nenhuma nota salva ainda.",
  historyEmptyHint: "Suas notas aparecerão aqui enquanto você escreve.",
  restoreNote: "Restaurar esta nota",
  deleteNote: "Excluir esta nota",
  historyUntitled: "Nota sem título",
  historyNoPreview: "Pré-visualização não disponível.",
  closeHistory: "Fechar histórico",
  confirmClear: "Limpar esta nota? Isso não pode ser desfeito.",
  confirmDeleteNote: "Excluir esta nota do histórico?",
  timeJustNow: "agora mesmo",
  timeYesterday: "Ontem",
  timeMinutesAgo: (m) => `há ${m}m`,
  timeHoursAgo: (h) => `há ${h}h`,
  timeDaysAgo: (d) => `há ${d}d`,
  savedLocally: (n) => `${n} nota${n === 1 ? "" : "s"} salva${n === 1 ? "" : "s"} localmente`,
  autoSavedLocally: "salvo automaticamente",
  currentNote: "atual",
  historyStorageHint: "As notas são salvas localmente no seu navegador. Limpar os dados do navegador as removerá.",
}

const fr: Translations = {
  appName: "notes.",
  newNote: "Nouvelle note",
  clearNote: "Effacer la note",
  copyToClipboard: "Copier dans le presse-papiers",
  copied: "Copié !",
  downloadNote: "Télécharger en .txt",
  openHistory: "Historique des notes",
  toggleTheme: "Changer de thème",
  words: "mots",
  characters: "caractères",
  saving: "enregistrement…",
  saved: "enregistré",
  savedAgo: (s) => s === 0 ? `enregistré · à l'instant` : `enregistré · il y a ${s}s`,
  placeholder: "Commencez à écrire…",
  historyTitle: "Historique des notes",
  historyEmpty: "Aucune note enregistrée.",
  historyEmptyHint: "Vos notes apparaîtront ici au fil de l'écriture.",
  restoreNote: "Restaurer cette note",
  deleteNote: "Supprimer cette note",
  historyUntitled: "Note sans titre",
  historyNoPreview: "Aperçu non disponible.",
  closeHistory: "Fermer l'historique",
  confirmClear: "Effacer cette note ? Cette action est irréversible.",
  confirmDeleteNote: "Supprimer cette note de l'historique ?",
  timeJustNow: "à l'instant",
  timeYesterday: "Hier",
  timeMinutesAgo: (m) => `il y a ${m}m`,
  timeHoursAgo: (h) => `il y a ${h}h`,
  timeDaysAgo: (d) => `il y a ${d}j`,
  savedLocally: (n) => `${n} note${n === 1 ? "" : "s"} enregistrée${n === 1 ? "" : "s"} localement`,
  autoSavedLocally: "enregistrement automatique",
  currentNote: "actuel",
  historyStorageHint: "Les notes sont enregistrées localement dans votre navigateur. Effacer les données du navigateur les supprimera.",
}

const de: Translations = {
  appName: "notizen.",
  newNote: "Neue Notiz",
  clearNote: "Notiz leeren",
  copyToClipboard: "In die Zwischenablage kopieren",
  copied: "Kopiert!",
  downloadNote: "Als .txt herunterladen",
  openHistory: "Notizverlauf",
  toggleTheme: "Design wechseln",
  words: "Wörter",
  characters: "Zeichen",
  saving: "speichern…",
  saved: "gespeichert",
  savedAgo: (s) => s === 0 ? `gespeichert · gerade eben` : `gespeichert · vor ${s}s`,
  placeholder: "Schreiben beginnen…",
  historyTitle: "Notizverlauf",
  historyEmpty: "Noch keine gespeicherten Notizen.",
  historyEmptyHint: "Ihre Notizen erscheinen hier während Sie schreiben.",
  restoreNote: "Diese Notiz wiederherstellen",
  deleteNote: "Diese Notiz löschen",
  historyUntitled: "Notiz ohne Titel",
  historyNoPreview: "Keine Vorschau verfügbar.",
  closeHistory: "Verlauf schließen",
  confirmClear: "Notiz leeren? Dies kann nicht rückgängig gemacht werden.",
  confirmDeleteNote: "Diese Notiz aus dem Verlauf löschen?",
  timeJustNow: "gerade eben",
  timeYesterday: "Gestern",
  timeMinutesAgo: (m) => `vor ${m}m`,
  timeHoursAgo: (h) => `vor ${h}h`,
  timeDaysAgo: (d) => `vor ${d}T`,
  savedLocally: (n) => `${n} Notiz${n === 1 ? "" : "en"} lokal gespeichert`,
  autoSavedLocally: "automatisch gespeichert",
  currentNote: "aktuell",
  historyStorageHint: "Notizen werden lokal in Ihrem Browser gespeichert. Beim Löschen der Browserdaten werden sie entfernt.",
}

const it: Translations = {
  appName: "note.",
  newNote: "Nuova nota",
  clearNote: "Cancella nota",
  copyToClipboard: "Copia negli appunti",
  copied: "Copiato!",
  downloadNote: "Scarica come .txt",
  openHistory: "Cronologia note",
  toggleTheme: "Cambia tema",
  words: "parole",
  characters: "caratteri",
  saving: "salvataggio…",
  saved: "salvato",
  savedAgo: (s) => s === 0 ? `salvato · proprio ora` : `salvato · ${s}s fa`,
  placeholder: "Inizia a scrivere…",
  historyTitle: "Cronologia note",
  historyEmpty: "Nessuna nota salvata.",
  historyEmptyHint: "Le tue note appariranno qui mentre scrivi.",
  restoreNote: "Ripristina questa nota",
  deleteNote: "Elimina questa nota",
  historyUntitled: "Nota senza titolo",
  historyNoPreview: "Anteprima non disponibile.",
  closeHistory: "Chiudi cronologia",
  confirmClear: "Cancellare questa nota? L'azione è irreversibile.",
  confirmDeleteNote: "Eliminare questa nota dalla cronologia?",
  timeJustNow: "proprio ora",
  timeYesterday: "Ieri",
  timeMinutesAgo: (m) => `${m}m fa`,
  timeHoursAgo: (h) => `${h}h fa`,
  timeDaysAgo: (d) => `${d}g fa`,
  savedLocally: (n) => `${n} nota${n === 1 ? "" : "e"} salvata${n === 1 ? "" : "e"} localmente`,
  autoSavedLocally: "salvataggio automatico",
  currentNote: "attuale",
  historyStorageHint: "Le note sono salvate localmente nel tuo browser. La cancellazione dei dati del browser le rimuoverà.",
}

const zh: Translations = {
  appName: "笔记.",
  newNote: "新建笔记",
  clearNote: "清除笔记",
  copyToClipboard: "复制到剪贴板",
  copied: "已复制！",
  downloadNote: "下载为 .txt",
  openHistory: "笔记历史",
  toggleTheme: "切换主题",
  words: "字",
  characters: "字符",
  saving: "保存中…",
  saved: "已保存",
  savedAgo: (s) => s === 0 ? `已保存 · 刚刚` : `已保存 · ${s}秒前`,
  placeholder: "开始写作…",
  historyTitle: "笔记历史",
  historyEmpty: "暂无已保存的笔记。",
  historyEmptyHint: "您的笔记将在写作时显示在此处。",
  restoreNote: "恢复此笔记",
  deleteNote: "删除此笔记",
  historyUntitled: "无标题笔记",
  historyNoPreview: "无法预览。",
  closeHistory: "关闭历史",
  confirmClear: "清除此笔记？此操作无法撤销。",
  confirmDeleteNote: "从历史记录中删除此笔记？",
  timeJustNow: "刚刚",
  timeYesterday: "昨天",
  timeMinutesAgo: (m) => `${m}分钟前`,
  timeHoursAgo: (h) => `${h}小时前`,
  timeDaysAgo: (d) => `${d}天前`,
  savedLocally: (n) => `本地已保存 ${n} 条笔记`,
  autoSavedLocally: "已自动保存",
  currentNote: "当前",
  historyStorageHint: "笔记保存在您的浏览器本地。清除浏览器数据将删除所有笔记。",
}

export const translations: Record<Locale, Translations> = { en, es, pt, fr, de, it, zh }

export const supportedLocales: Locale[] = ["en", "es", "pt", "fr", "de", "it", "zh"]

export function resolveLocale(browserLang: string): Locale {
  const tag = browserLang.toLowerCase()
  // Exact match first (e.g. "pt-BR" → "pt")
  for (const locale of supportedLocales) {
    if (tag === locale || tag.startsWith(`${locale}-`)) return locale
  }
  return "en"
}
