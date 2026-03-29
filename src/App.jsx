import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { themes } from './data/themes'
import { notebooks, notebookOrder } from './data/notebooks'
import { getNotebookChapters } from './data/chapters'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ChapterView from './components/ChapterView'
import Glossary from './components/Glossary'
import LandingPage from './components/LandingPage'

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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [view, setView] = useState('chapter') // 'chapter' | 'glossary'

  const theme = themes[themeId]
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  // Parse hash to derive navigation state
  function parseHash() {
    const hash = window.location.hash.replace(/^#\/?/, '')
    if (!hash) return { notebookId: null, chapterId: null }
    const [notebookId, chapterId] = hash.split('/')
    return { notebookId: notebooks[notebookId] ? notebookId : null, chapterId: chapterId || null }
  }

  const [navState, setNavState] = useState(parseHash)

  const activeNotebookId = navState.notebookId
  const activeNotebook = activeNotebookId ? notebooks[activeNotebookId] : null
  const notebookChapters = activeNotebook ? getNotebookChapters(activeNotebook) : []
  const currentView = activeNotebookId ? 'notebook' : 'landing'

  // Derive active chapter index from chapterId in hash
  const activeChapter = (() => {
    if (!navState.chapterId || notebookChapters.length === 0) return 0
    const idx = notebookChapters.findIndex(ch => ch.id === navState.chapterId)
    return idx !== -1 ? idx : 0
  })()

  // Update hash when navigating
  const setActiveChapter = useCallback((indexOrFn) => {
    setNavState(prev => {
      const chapters = prev.notebookId ? getNotebookChapters(notebooks[prev.notebookId]) : []
      const currentIdx = prev.chapterId ? chapters.findIndex(ch => ch.id === prev.chapterId) : 0
      const resolvedIdx = typeof indexOrFn === 'function' ? indexOrFn(currentIdx >= 0 ? currentIdx : 0) : indexOrFn
      const chapter = chapters[resolvedIdx]
      if (chapter && prev.notebookId) {
        window.history.replaceState(null, '', `#/${prev.notebookId}/${chapter.id}`)
        return { ...prev, chapterId: chapter.id }
      }
      return prev
    })
  }, [])

  // Listen to hash changes (browser back/forward)
  useEffect(() => {
    const onHashChange = () => {
      setNavState(parseHash())
      setView('chapter')
      setSidebarOpen(false)
    }
    const onPopState = (e) => {
      if (e.state?.tab) return // handled by ChapterView for tab navigation
      onHashChange()
    }
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

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

  const handleSelectNotebook = (notebookId) => {
    const chapters = getNotebookChapters(notebooks[notebookId])
    const firstChapterId = chapters.length > 0 ? chapters[0].id : ''
    window.location.hash = `#/${notebookId}/${firstChapterId}`
    setNavState({ notebookId, chapterId: firstChapterId })
    setView('chapter')
  }

  const handleHome = () => {
    window.location.hash = ''
    setSidebarOpen(false)
  }

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
            onHome={handleHome}
            onSelectNotebook={handleSelectNotebook}
            notebook={activeNotebook}
            showMenu={currentView === 'notebook'}
            isLanding={currentView === 'landing'}
          />

          {currentView === 'landing' ? (
            <LandingPage onSelectNotebook={handleSelectNotebook} />
          ) : (
            <div style={{
              display: 'flex',
              maxWidth: 1200,
              margin: '0 auto',
              padding: '0 20px',
              gap: 32,
            }}>
              <Sidebar
                chapters={notebookChapters}
                notebook={activeNotebook}
                activeChapter={activeChapter}
                onSelect={(i) => { setActiveChapter(i); setView('chapter'); setSidebarOpen(false) }}
                onGlossary={() => { setView('glossary'); setSidebarOpen(false); window.scrollTo(0, 0) }}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />

              <main style={{ flex: 1, minWidth: 0, paddingTop: 24, paddingBottom: 80 }}>
                {view === 'glossary' ? (
                  <Glossary
                    chapters={notebookChapters}
                    onNavigateToChapter={(chapterIndex, sectionSlug) => {
                      setActiveChapter(chapterIndex)
                      setView('chapter')
                      if (sectionSlug) {
                        setTimeout(() => {
                          const el = document.getElementById(`section-${sectionSlug}`)
                          if (el) {
                            const y = el.getBoundingClientRect().top + window.scrollY - 80
                            window.scrollTo({ top: y, behavior: 'smooth' })
                          }
                        }, 300)
                      }
                    }}
                  />
                ) : (
                  <ChapterView
                    chapter={notebookChapters[activeChapter]}
                    nextChapter={notebookChapters[activeChapter + 1] || null}
                    chapterIndex={activeChapter}
                    totalChapters={notebookChapters.length}
                    onPrev={() => setActiveChapter(i => Math.max(0, i - 1))}
                    onNext={() => setActiveChapter(i => Math.min(notebookChapters.length - 1, i + 1))}
                    onNavigateToNotebook={handleSelectNotebook}
                    onNavigate={(chapterId, sectionSlug) => {
                      // Try current notebook first
                      const idx = notebookChapters.findIndex(c => c.id === chapterId)
                      if (idx !== -1) {
                        const chapter = notebookChapters[idx]
                        if (activeNotebookId && chapter) {
                          window.history.pushState(null, '', `#/${activeNotebookId}/${chapter.id}`)
                          setNavState(prev => ({ ...prev, chapterId: chapter.id }))
                        }
                        setView('chapter')
                      } else {
                        // Search other notebooks
                        for (const nbId of notebookOrder) {
                          const nbChapters = getNotebookChapters(notebooks[nbId])
                          if (nbChapters.find(c => c.id === chapterId)) {
                            window.location.hash = `#/${nbId}/${chapterId}`
                            setNavState({ notebookId: nbId, chapterId })
                            setView('chapter')
                            break
                          }
                        }
                      }
                      if (sectionSlug) {
                        setTimeout(() => {
                          const el = document.getElementById(`section-${sectionSlug}`)
                          if (el) {
                            const y = el.getBoundingClientRect().top + window.scrollY - 80
                            window.scrollTo({ top: y, behavior: 'smooth' })
                          }
                        }, 300)
                      }
                    }}
                  />
                )}
              </main>
            </div>
          )}
        </div>
      </LangContext.Provider>
      <Analytics />
    </ThemeContext.Provider>
  )
}
