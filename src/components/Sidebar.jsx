import React from 'react'
import { useLang } from '../App'
import { BookOpen } from '@phosphor-icons/react'
import ChapterIcon from './ChapterIcon'

export default function Sidebar({ chapters, notebook, activeChapter, onSelect, onGlossary, isOpen, onClose }) {
  const { lang } = useLang()
  const arcs = notebook?.arcs || []

  const sidebarContent = (
    <>
      <div style={{
        fontSize: 11,
        fontFamily: 'var(--font-code)',
        color: 'var(--text-soft)',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 12,
        padding: '0 8px',
      }}>
        {lang === 'he' ? 'פרקים' : 'Chapters'}
      </div>

      {/* Glossary button — only for notebooks with terms */}
      {notebook?.id !== 'vibe-coding' && (
        <button
          onClick={onGlossary}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px dashed var(--border)',
            background: 'transparent',
            color: 'var(--accent)',
            fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: lang === 'he' ? 'right' : 'left',
            direction: lang === 'he' ? 'rtl' : 'ltr',
            marginBottom: 12,
          }}
        >
          <BookOpen size={18} weight="duotone" color='green'/>
          <span>{lang === 'he' ? 'מילון מונחים' : 'Glossary'}</span>
        </button>
      )}

      {arcs.map((arc, arcIdx) => (
        <div key={arcIdx} style={{ marginBottom: 16 }}>
          {/* Arc header */}
          <div style={{
            fontSize: 12,
            fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
            color: 'var(--accent)',
            fontWeight: 600,
            letterSpacing: lang === 'he' ? 0 : 0.5,
            padding: '8px 8px 4px',
            marginTop: arcIdx > 0 ? 4 : 0,
            borderTop: arcIdx > 0 ? '1px solid var(--border)' : 'none',
            paddingTop: arcIdx > 0 ? 12 : 8,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span>{arc.label[lang]}</span>
          </div>

          {/* Chapters in this arc */}
          {chapters.slice(arc.startIndex, arc.endIndex + 1).map((ch, localIdx) => {
            const i = arc.startIndex + localIdx
            const isEpilogue = ch.id === 'epilogue'
            return (
              <React.Fragment key={ch.id}>
                {isEpilogue && (
                  <div style={{ borderTop: '1px solid var(--border)', margin: '8px 8px 4px' }} />
                )}
                <button
                  onClick={() => onSelect(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: i === activeChapter ? 'var(--accent-soft)' : 'transparent',
                    color: i === activeChapter ? 'var(--accent)' : 'var(--text-soft)',
                    fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
                    fontSize: 14,
                    fontWeight: i === activeChapter ? 600 : 400,
                    cursor: 'pointer',
                    opacity: 1,
                    textAlign: lang === 'he' ? 'right' : 'left',
                    direction: lang === 'he' ? 'rtl' : 'ltr',
                    transition: 'all 0.15s ease',
                    marginBottom: 2,
                  }}
                >
                  <span style={{ flexShrink: 0 }}><ChapterIcon name={ch.icon} color={ch.iconColor} size={20} /></span>
                  <span style={{ flex: 1, lineHeight: 1.4 }}>{ch.title[lang] || ch.title.he}</span>
                </button>
              </React.Fragment>
            )
          })}
        </div>
      ))}
    </>
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="sidebar-overlay"
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 200,
            display: 'none', // shown via CSS on mobile
          }}
        />
      )}

      {/* Desktop sidebar */}
      <nav className="sidebar-desktop" style={{
        width: 262,
        flexShrink: 0,
        paddingTop: 24,
        position: 'sticky',
        top: 60,
        height: 'calc(100vh - 60px)',
        overflowY: 'auto',
      }}>
        {sidebarContent}
      </nav>

      {/* Mobile sidebar */}
      <nav className="sidebar-mobile" style={{
        position: 'fixed',
        top: 0,
        [lang === 'he' ? 'right' : 'left']: 0,
        height: '100vh',
        width: 280,
        backgroundColor: 'var(--surface)',
        zIndex: 201,
        padding: '20px 16px',
        transform: isOpen ? 'translateX(0)' : `translateX(${lang === 'he' ? '100%' : '-100%'})`,
        transition: 'transform 0.3s ease',
        borderLeft: lang === 'he' ? 'none' : '1px solid var(--border)',
        borderRight: lang === 'he' ? '1px solid var(--border)' : 'none',
        overflowY: 'auto',
        display: 'none', // shown via CSS on mobile
      }}>
        {sidebarContent}
      </nav>
    </>
  )
}
