import { useTheme } from '../App'
import { Brain, Moon, Sun, List, HeadCircuitIcon } from '@phosphor-icons/react'

export default function Header({ onMenuToggle }) {
  const { theme, themeId, toggleTheme } = useTheme()
  // lang toggle disabled until EN content is ready

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
      {/* Left: logo + menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onMenuToggle}
          style={{
            background: 'none', border: 'none', color: 'var(--nav-text)',
            fontSize: 20, cursor: 'pointer', padding: 4,
            display: 'none', // Hidden on desktop, shown via media query
          }}
          className="mobile-menu-btn"
          aria-label="Menu"
        >
          <List size={22} weight="bold" />
        </button>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: '-0.02em',
        }}>
          AI From Scratch
        </span>
        <HeadCircuitIcon size={24} weight="duotone" color="pink" />
      </div>

      {/* Right: controls */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Theme toggle */}
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

        {/* Language toggle — disabled until EN content is ready */}
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
