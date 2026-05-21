import { useState } from 'react'
import { useLang } from '../App'
import { FileText } from '@phosphor-icons/react'

const sections = [
  { he: 'Project Overview', en: 'Project Overview', desc: { he: 'תיאור קצר של הפרויקט - מה הוא ולמה', en: 'Short project description — what and why' } },
  { he: 'Stack & Architecture', en: 'Stack & Architecture', desc: { he: 'ה-tech stack וההחלטות הארכיטקטוניות המרכזיות', en: 'Tech stack and key architecture decisions' } },
  { he: 'Conventions', en: 'Conventions', desc: { he: 'איך לכתוב קוד, איך לעשות commits, במה אסור לגעת', en: 'How to write code, how to commit, what not to touch' } },
  { he: 'Build & Test', en: 'Build & Test', desc: { he: 'פקודות להרצה, build, ובדיקות', en: 'Run, build, and test commands' } },
  { he: 'Important Files', en: 'Important Files', desc: { he: 'קבצים קריטיים שClaude חייב להכיר', en: 'Critical files Claude must know about' } },
]

const snippet = `# AI From Scratch - Project Guide

## Project Overview
Hebrew/English interactive learning blog about AI fundamentals
and vibe coding. React 18 SPA with hash-based routing.

## Stack & Architecture
- React 18 + Vite (no SSR, no router library)
- Content lives in src/content/{notebook}/{chapter}/*.he.txt
- React components embed in content via @@component:Name
- import.meta.glob loads all content at build time

## Conventions
- All content Hebrew-first; English is optional
- Component data uses { he: '...', en: '...' } pattern
- Section headings: ## for sections, ### for subsections
- Code blocks: triple-backticks, always dir="ltr"
- Never modify .he.txt files without my approval

## Build & Test
- npm run dev      → Start Vite dev server (port 3000)
- npm run build    → Production build
- npm run preview  → Preview the build locally

## Important Files
- src/components/ChapterView.jsx   → Main chapter renderer
- src/content/loader.js            → Parses .he.txt at build time
- src/data/chapters.js             → Chapter metadata + ordering`

export default function ClaudeMdExample() {
  const [open, setOpen] = useState(false)
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{
      border: '1.5px solid rgba(74, 107, 138, 0.3)',
      borderRadius: 10,
      overflow: 'hidden',
      transition: 'border-color 0.2s ease',
      margin: '8px 0 16px',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '10px 16px',
          border: 'none',
          background: open ? 'var(--surface)' : 'transparent',
          cursor: 'pointer',
          fontFamily,
          fontSize: 13,
          fontWeight: 600,
          color: '#4A6B8A',
          direction: isRtl ? 'rtl' : 'ltr',
          textAlign: isRtl ? 'right' : 'left',
          transition: 'background-color 0.2s ease',
        }}
      >
        <FileText size={15} weight="duotone" />
        <span style={{ flex: 1 }}>{isRtl ? 'דוגמה - CLAUDE.md של הבלוג הזה' : "Example - This blog's CLAUDE.md"}</span>
        <span style={{
          fontSize: 11,
          transition: 'transform 0.2s ease',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          opacity: 0.5,
        }}>▼</span>
      </button>

      {open && (
        <div style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{ padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sections.map((section, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, direction: isRtl ? 'rtl' : 'ltr' }}>
                <span style={{ color: 'var(--text-soft)', fontSize: 10, flexShrink: 0 }}>●</span>
                <span style={{ fontFamily, fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--heading)', fontWeight: 600 }}>{section[lang]}</strong>
                  {' '}—{' '}
                  <span style={{ color: 'var(--text-soft)' }}>{section.desc[lang]}</span>
                </span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', padding: '12px 16px 14px' }}>
            <pre dir="ltr" style={{
              fontFamily: 'var(--font-code)',
              fontSize: 12,
              lineHeight: 1.6,
              color: 'var(--text)',
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '12px 16px',
              overflowX: 'auto',
              whiteSpace: 'pre',
              margin: 0,
            }}>{snippet}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
