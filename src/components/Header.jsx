import { useState, useRef, useEffect } from 'react' // useState/useRef/useEffect used by NotebookDropdown
import { useTheme, useLang } from '../App'
import { Moon, Sun, List, CaretDown } from '@phosphor-icons/react'
import { notebooks, notebookOrder } from '../data/notebooks'
import ChapterIcon from './ChapterIcon'

const AuthorLinks = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <img
      src="/images/profile.jpeg"
      alt="Mor Aghion"
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        objectFit: 'cover',
        border: '1.5px solid rgba(255,255,255,0.2)',
      }}
    />
    <span style={{
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--nav-text)',
      opacity: 0.8,
    }}>
      Mor Aghion
    </span>
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <a href="https://www.linkedin.com/in/mor-aghion-88aa37179/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
        style={{ color: 'var(--nav-text)', opacity: 0.6, transition: 'opacity 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </a>
      <a href="https://github.com/MorAghion" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
        style={{ color: 'var(--nav-text)', opacity: 0.6, transition: 'opacity 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
      </a>
      <a href="#" onClick={e => { e.preventDefault(); const p = ['magh19', '.dev@', 'gmail', '.com']; window.location.href = 'mailto:' + p.join('') }} aria-label="Email"
        style={{ color: 'var(--nav-text)', opacity: 0.6, transition: 'opacity 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
      </a>
    </div>
  </div>
)

const Controls = ({ themeId, toggleTheme }) => (
  <>
    <button
      onClick={toggleTheme}
      style={{
        padding: '5px 12px',
        borderRadius: 6,
        border: '1px solid rgba(255,255,255,0.15)',
        background: 'transparent',
        color: 'var(--nav-text)',
        fontSize: 13,
        fontFamily: 'var(--font-body)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
      title={themeId === 'warm' ? 'Switch to Dusk Studio' : 'Switch to Warm Editorial'}
    >
      {themeId === 'warm'
        ? <Moon size={14} weight="duotone" />
        : <Sun size={14} weight="duotone" />
      }
    </button>
  </>
)

function NotebookDropdown({ notebook, lang, onSelectNotebook }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          background: 'none', border: 'none', color: 'var(--nav-text)',
          cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', gap: 8,
        }}
      >
        {notebook && <ChapterIcon name={notebook.icon} color={notebook.color} size={18} />}
        <span style={{
          fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
          fontWeight: 600,
          fontSize: 14,
        }}>
          {notebook ? notebook.title[lang] : ''}
        </span>
        <CaretDown size={12} weight="bold" style={{
          opacity: 0.5,
          transform: open ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s ease',
        }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: dir === 'rtl' ? 0 : 'auto',
          left: dir === 'rtl' ? 'auto' : 0,
          marginTop: 8,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: 6,
          minWidth: 200,
          maxWidth: 'calc(100vw - 40px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 200,
        }}>
          {notebookOrder.map(nbId => {
            const nb = notebooks[nbId]
            const isActive = notebook?.id === nbId
            return (
              <button
                key={nbId}
                onClick={() => { setOpen(false); onSelectNotebook(nbId) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '10px 12px', borderRadius: 8,
                  border: 'none', background: isActive ? 'var(--accent-soft)' : 'transparent',
                  color: 'var(--text)', cursor: 'pointer',
                  fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
                  fontSize: 14, fontWeight: isActive ? 600 : 400,
                  textAlign: dir === 'rtl' ? 'right' : 'left',
                  direction: dir,
                }}
              >
                <ChapterIcon name={nb.icon} color={nb.color} size={20} />
                {nb.title[lang]}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Social icons only (no photo/name)
const SocialIcons = ({ size = 14 }) => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <a href="https://www.linkedin.com/in/mor-aghion-88aa37179/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
      style={{ color: 'var(--nav-text)', opacity: 0.5, transition: 'opacity 0.15s', display: 'flex' }}
      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
      onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    </a>
    <a href="https://github.com/MorAghion" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
      style={{ color: 'var(--nav-text)', opacity: 0.5, transition: 'opacity 0.15s', display: 'flex' }}
      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
      onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
    </a>
    <a href="#" onClick={e => { e.preventDefault(); const p = ['magh19', '.dev@', 'gmail', '.com']; window.location.href = 'mailto:' + p.join('') }} aria-label="Email"
      style={{ color: 'var(--nav-text)', opacity: 0.5, transition: 'opacity 0.15s', display: 'flex' }}
      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
      onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
    </a>
  </div>
)

// Author section — landing: always full, notebook: full on desktop, photo+popup on mobile
function AuthorSection({ isLanding }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 8, direction: 'ltr', position: 'relative' }}>
      {/* Photo — always visible, clickable on mobile notebooks */}
      <button
        onClick={() => !isLanding && setOpen(v => !v)}
        className={isLanding ? '' : 'header-author-photo-btn'}
        style={{
          background: 'none', border: 'none', padding: 0,
          cursor: isLanding ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center',
        }}
      >
        <img
          src="/images/profile.jpeg"
          alt="Mor Aghion"
          style={{
            width: 28, height: 28, borderRadius: '50%', objectFit: 'cover',
            border: '1.5px solid rgba(255,255,255,0.25)',
          }}
        />
      </button>

      {/* Name + icons — always on landing, hidden on mobile for notebooks */}
      <div className={isLanding ? '' : 'header-author-extras'} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          fontWeight: 500,
          color: 'var(--nav-text)',
        }}>
          Mor Aghion
        </span>
        <SocialIcons size={14} />
      </div>

      {/* Mobile popup — only for notebook pages */}
      {!isLanding && open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: 8,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '12px 16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          zIndex: 200,
          display: 'none',
          alignItems: 'center',
          gap: 12,
          whiteSpace: 'nowrap',
        }}
        className="header-author-popup"
        >
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--text)',
            fontWeight: 500,
          }}>
            Mor Aghion
          </span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <a href="https://www.linkedin.com/in/mor-aghion-88aa37179/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              style={{ color: 'var(--text-soft)', display: 'flex' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://github.com/MorAghion" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              style={{ color: 'var(--text-soft)', display: 'flex' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
            <a href="#" onClick={e => { e.preventDefault(); const p = ['magh19', '.dev@', 'gmail', '.com']; window.location.href = 'mailto:' + p.join('') }} aria-label="Email"
              style={{ color: 'var(--text-soft)', display: 'flex' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

// --- TEMPORARY: change this to 'A', 'B', 'C', or 'D' to preview ---
const RIGHT_SIDE_OPTION = 'B'

export default function Header({ onMenuToggle, onHome, onSelectNotebook, notebook, showMenu, isLanding }) {
  const { themeId, toggleTheme } = useTheme()
  const { lang } = useLang()

  return (
    <header style={{
      backgroundColor: 'var(--nav)',
      color: 'var(--nav-text)',
      padding: '14px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--border)',
    }}>
      {/* Left side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isLanding ? null : (
          <>
            {showMenu && (
              <button
                onClick={onMenuToggle}
                className="mobile-menu-btn"
                style={{
                  background: 'none', border: 'none', color: 'var(--nav-text)',
                  fontSize: 20, cursor: 'pointer', padding: 4,
                  display: 'none',
                }}
                aria-label="Menu"
              >
                <List size={22} weight="bold" />
              </button>
            )}
            <button
              onClick={onHome}
              style={{
                background: 'none', border: 'none', color: 'var(--nav-text)',
                cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 17,
                letterSpacing: '-0.02em',
              }}>
                <span style={{ fontFamily: 'var(--font-heading)' }}>AI</span><span style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}>,</span> מההתחלה
              </span>
            </button>
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)', margin: '0 2px' }} />
            <NotebookDropdown
              notebook={notebook}
              lang={lang}
              onSelectNotebook={onSelectNotebook}
            />
          </>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {isLanding ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, direction: 'ltr' }}>
            <Controls themeId={themeId} toggleTheme={toggleTheme} />
            <div style={{ width: 2, height: 22, background: 'rgba(255,255,255,0.35)' }} />
            <AuthorSection isLanding />
          </div>
        ) : RIGHT_SIDE_OPTION === 'A' ? (
          /* A: Icons only, no name */
          <>
            <SocialIcons size={14} />
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
            <Controls themeId={themeId} toggleTheme={toggleTheme} />
          </>
        ) : RIGHT_SIDE_OPTION === 'B' ? (
          /* B: same as landing */
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, direction: 'ltr' }}>
            <Controls themeId={themeId} toggleTheme={toggleTheme} />
            <div className="header-notebook-divider" style={{ width: 2, height: 22, background: 'rgba(255,255,255,0.35)' }} />
            <AuthorSection isLanding={false} />
          </div>
        ) : RIGHT_SIDE_OPTION === 'C' ? (
          /* C: Controls only */
          <Controls themeId={themeId} toggleTheme={toggleTheme} />
        ) : (
          /* D: Compact — controls + divider + small social icons */
          <>
            <Controls themeId={themeId} toggleTheme={toggleTheme} />
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.15)', margin: '0 4px' }} />
            <SocialIcons size={14} />
          </>
        )}
      </div>
    </header>
  )
}
