import { useTheme, useLang } from '../App'
import { Moon, Sun, List, HeadCircuit, CaretRight, CaretLeft } from '@phosphor-icons/react'

export default function Header({ onMenuToggle, onHome, notebook, showMenu }) {
  const { themeId, toggleTheme } = useTheme()
  const { lang } = useLang()
  const Caret = lang === 'he' ? CaretLeft : CaretRight

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
      {/* Left: menu + logo + breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {showMenu && (
          <button
            onClick={onMenuToggle}
            className="mobile-menu-btn"
            style={{
              background: 'none', border: 'none', color: 'var(--nav-text)',
              fontSize: 20, cursor: 'pointer', padding: 4,
              display: 'none', // shown via CSS media query
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
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: '-0.02em',
          }}>
            AI From Scratch
          </span>
          <HeadCircuit size={24} weight="duotone" color="pink" />
        </button>

        {notebook && (
          <>
            <Caret size={14} weight="bold" style={{ opacity: 0.4 }} />
            <span style={{
              fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
              fontSize: 14,
              opacity: 0.8,
            }}>
              {notebook.title[lang]}
            </span>
          </>
        )}
      </div>

      {/* Right: controls */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
            ? <Moon size={16} weight="duotone" />
            : <Sun size={16} weight="duotone" />
          }
        </button>

        <button
          disabled
          style={{
            padding: '5px 12px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.25)',
            fontSize: 13,
            fontFamily: 'var(--font-code)',
            fontWeight: 500,
            cursor: 'not-allowed',
            opacity: 0.5,
          }}
          title="English content coming soon"
        >
          EN
        </button>
      </div>
    </header>
  )
}
