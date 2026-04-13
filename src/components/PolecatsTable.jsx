import { useState } from 'react'
import { useLang } from '../App'
import { UsersThree } from '@phosphor-icons/react'

const polecats = [
  {
    emoji: '🎩',
    color: '#7C3AED',
    name: 'mayor',
    role: { he: 'Orchestrator - אינטגרציה, merges, תיקונים חוצי-מערכת', en: 'Orchestrator - integration, merges, cross-cutting fixes' },
    owns: { he: 'master branch, Bills Hub, ProtectedRoute', en: 'master branch, Bills Hub, ProtectedRoute' },
  },
  {
    emoji: '🏗️',
    color: '#2563EB',
    name: 'nux',
    role: { he: 'ארכיטקט - DB schema, RLS, Supabase, ביקורת מסמכים', en: 'Architect - DB schema, RLS, Supabase, docs audit' },
    owns: { he: 'supabase/migrations/, docs/ARCHITECTURE.md', en: 'supabase/migrations/, docs/ARCHITECTURE.md' },
  },
  {
    emoji: '🎨',
    color: '#DC2626',
    name: 'furiosa',
    role: { he: 'Frontend - app shell, auth, Shopping Hub', en: 'Frontend - app shell, auth, Shopping Hub' },
    owns: { he: 'src/pages/Auth, src/components/hubs/shopping/', en: 'src/pages/Auth, src/components/hubs/shopping/' },
  },
  {
    emoji: '🖼️',
    color: '#D97706',
    name: 'rictus',
    role: { he: 'UX / Frontend - SCREENS.md, Tasks Hub', en: 'UX / Frontend - SCREENS.md, Tasks Hub' },
    owns: { he: 'docs/SCREENS.md, src/components/hubs/tasks/', en: 'docs/SCREENS.md, src/components/hubs/tasks/' },
  },
  {
    emoji: '🔍',
    color: '#059669',
    name: 'dementus',
    role: { he: 'Docs / Review - ביקורת חצי-שדה, SECURITY.md', en: 'Docs / Review - mid-field audit, SECURITY.md' },
    owns: { he: 'docs/REVIEW_NOTES.md, docs/SECURITY.md', en: 'docs/REVIEW_NOTES.md, docs/SECURITY.md' },
  },
  {
    emoji: '⚙️',
    color: '#0891B2',
    name: 'slit',
    role: { he: 'DevOps - ENV.md, CI/CD, Vitest unit tests', en: 'DevOps - ENV.md, CI/CD, Vitest unit tests' },
    owns: { he: 'docs/ENV.md, .github/workflows/', en: 'docs/ENV.md, .github/workflows/' },
  },
  {
    emoji: '📧',
    color: '#7C3AED',
    name: 'toast',
    role: { he: 'Backend - Gmail OAuth Edge Functions', en: 'Backend - Gmail OAuth Edge Functions' },
    owns: { he: 'supabase/functions/gmail-*/', en: 'supabase/functions/gmail-*/' },
  },
  {
    emoji: '📋',
    color: '#CA8A04',
    name: 'capable',
    role: { he: 'Docs / Dashboard - CLAUDE.md, Home Hub dashboard', en: 'Docs / Dashboard - CLAUDE.md, Home Hub dashboard' },
    owns: { he: 'docs/CLAUDE.md, src/pages/HomePage.tsx', en: 'docs/CLAUDE.md, src/pages/HomePage.tsx' },
  },
]

const color = '#1E4D8C'

export default function PolecatsTable() {
  const [open, setOpen] = useState(false)
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{
      border: `1.5px solid rgba(30, 77, 140, 0.3)`,
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
          color,
          direction: isRtl ? 'rtl' : 'ltr',
          textAlign: isRtl ? 'right' : 'left',
          transition: 'background-color 0.2s ease',
        }}
      >
        <UsersThree size={15} weight="duotone" />
        <span style={{ flex: 1 }}>{isRtl ? 'ה-Polecats של HomeHub v2' : 'HomeHub v2 Polecats'}</span>
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
          overflowX: 'auto',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily,
            fontSize: 12.5,
            direction: isRtl ? 'rtl' : 'ltr',
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {[
                  isRtl ? 'Polecat' : 'Polecat',
                  isRtl ? 'תפקיד' : 'Role',
                  isRtl ? 'קבצים בבעלותו' : 'Owns',
                ].map((h, i) => (
                  <th key={i} style={{
                    padding: '8px 14px',
                    textAlign: isRtl ? 'right' : 'left',
                    fontWeight: 600,
                    color,
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {polecats.map((p, i) => (
                <tr key={i} style={{
                  borderBottom: i < polecats.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <td style={{ padding: '9px 14px', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 7, flexDirection: isRtl ? 'row-reverse' : 'row', justifyContent: isRtl ? 'flex-end' : 'flex-start' }}>
                      <span style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: p.color,
                        flexShrink: 0,
                      }} />
                      <span style={{ fontWeight: 600, color: 'var(--heading)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{p.emoji} {p.name}</span>
                    </span>
                  </td>
                  <td style={{ padding: '9px 14px', color: 'var(--text)', lineHeight: 1.5 }}>
                    {p.role[lang]}
                  </td>
                  <td style={{ padding: '9px 14px', color: 'var(--text-soft)', fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>
                    {p.owns[lang]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
