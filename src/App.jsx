import { useState, useEffect, createContext, useContext } from 'react'
import { themes } from './data/themes'
import { chapters } from './data/chapters'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ChapterView from './components/ChapterView'
import Glossary from './components/Glossary'

// Contexts
export const ThemeContext = createContext()
export const LangContext = createContext()

export const useTheme = () => useContext(ThemeContext)
export const useLang = () => useContext(LangContext)

function applyThemeVars(theme) {
  const root = document.documentElement
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    root.style.setProperty(cssVar, value)
  })
  root.style.setProperty('--font-heading', theme.fonts.heading)
  root.style.setProperty('--font-body', theme.fonts.body)
  root.style.setProperty('--font-code', theme.fonts.code)
  root.style.setProperty('--font-hebrew', theme.fonts.hebrew)
}

export default function App() {
  const [themeId, setThemeId] = useState(() => localStorage.getItem('theme') || 'warm')
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'he')
  const [activeChapter, setActiveChapter] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [view, setView] = useState('chapter') // 'chapter' | 'glossary'

  const theme = themes[themeId]
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  useEffect(() => {
    applyThemeVars(theme)
    localStorage.setItem('theme', themeId)
  }, [themeId, theme])

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.dir = dir
    document.documentElement.lang = lang
  }, [lang, dir])

  const toggleTheme = () => setThemeId(t => (t === 'warm' ? 'dusk' : 'warm'))
  const toggleLang = () => setLang(l => (l === 'he' ? 'en' : 'he'))

  return (
    <ThemeContext.Provider value={{ theme, themeId, toggleTheme }}>
      <LangContext.Provider value={{ lang, dir, toggleLang }}>
        <div
          className="theme-transition"
          style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg)',
            color: 'var(--text)',
            fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
            direction: dir,
          }}
        >
          <Header
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          />

          <div style={{
            display: 'flex',
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 20px',
            gap: 32,
          }}>
            <Sidebar
              chapters={chapters}
              activeChapter={activeChapter}
              onSelect={(i) => { setActiveChapter(i); setView('chapter'); setSidebarOpen(false) }}
              onGlossary={() => { setView('glossary'); setSidebarOpen(false) }}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />

            <main style={{ flex: 1, minWidth: 0, paddingTop: 24, paddingBottom: 80 }}>
              {view === 'glossary' ? (
                <Glossary
                  onNavigateToChapter={(chapterIndex, tab) => {
                    setActiveChapter(chapterIndex)
                    setView('chapter')
                  }}
                />
              ) : (
                <ChapterView
                  chapter={chapters[activeChapter]}
                  chapterIndex={activeChapter}
                  totalChapters={chapters.length}
                  onPrev={() => setActiveChapter(i => Math.max(0, i - 1))}
                  onNext={() => setActiveChapter(i => Math.min(chapters.length - 1, i + 1))}
                  onNavigate={(chapterId, sectionSlug) => {
                    const idx = chapters.findIndex(c => c.id === chapterId)
                    if (idx !== -1) {
                      setActiveChapter(idx)
                      setView('chapter')
                      if (sectionSlug) {
                        setTimeout(() => {
                          const el = document.getElementById(`section-${sectionSlug}`)
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }, 100)
                      }
                    }
                  }}
                />
              )}
            </main>
          </div>
        </div>
      </LangContext.Provider>
    </ThemeContext.Provider>
  )
}
