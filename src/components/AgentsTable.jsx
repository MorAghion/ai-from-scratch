import { useState } from 'react'
import { useLang } from '../App'
import { UsersThree } from '@phosphor-icons/react'

const agents = [
  {
    emoji: '🎯',
    color: '#B8A547',
    name: { he: 'Coordinator', en: 'Coordinator' },
    role: { he: 'מתכנן, עוקב אחר התקדמות, מנתב משימות בין הסוכנים', en: 'Plans, tracks progress, routes tasks between agents' },
    owns: { he: 'agents/ — לא כותב קוד', en: 'agents/ — does not write code' },
  },
  {
    emoji: '🏗️',
    color: '#C2652A',
    name: { he: 'Architect', en: 'Architect' },
    role: { he: 'סכמת בסיס נתונים, מיגרציות, הגדרות RLS, טיפוסי TypeScript', en: 'DB schema, migrations, RLS policies, TypeScript types' },
    owns: { he: 'supabase/migrations/, src/types/', en: 'supabase/migrations/, src/types/' },
  },
  {
    emoji: '🎨',
    color: '#D946EF',
    name: { he: 'Frontend', en: 'Frontend' },
    role: { he: 'קומפוננטות React, עיצוב, תמיכה בעברית ו-RTL', en: 'React components, styling, Hebrew & RTL support' },
    owns: { he: 'src/components/, src/pages/, src/i18n/', en: 'src/components/, src/pages/, src/i18n/' },
  },
  {
    emoji: '⚙️',
    color: '#06B6D4',
    name: { he: 'Backend', en: 'Backend' },
    role: { he: 'Edge Functions, אינטגרציות חיצוניות (OAuth), PWA, CI/CD', en: 'Edge Functions, external integrations (OAuth), PWA, CI/CD' },
    owns: { he: 'supabase/functions/, src/lib/api/', en: 'supabase/functions/, src/lib/api/' },
  },
  {
    emoji: '🧪',
    color: '#10B981',
    name: { he: 'QA', en: 'QA' },
    role: { he: 'טסטים (unit, component, E2E), checklist ידני, רגרסיה', en: 'Tests (unit, component, E2E), manual checklist, regression' },
    owns: { he: 'tests/, e2e/, SANITY_CHECKLIST.md', en: 'tests/, e2e/, SANITY_CHECKLIST.md' },
  },
]

export default function AgentsTable() {
  const [open, setOpen] = useState(false)
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{
      border: '1.5px solid rgba(194, 101, 42, 0.3)',
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
          color: '#C2652A',
          direction: isRtl ? 'rtl' : 'ltr',
          textAlign: isRtl ? 'right' : 'left',
          transition: 'background-color 0.2s ease',
        }}
      >
        <UsersThree size={15} weight="duotone" />
        <span style={{ flex: 1 }}>{isRtl ? 'הגדרות התפקידים של הסוכנים שלי' : 'My agent role definitions'}</span>
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
                  isRtl ? 'סוכן' : 'Agent',
                  isRtl ? 'תפקיד' : 'Role',
                  isRtl ? 'קבצים בבעלותו' : 'Owns',
                ].map((h, i) => (
                  <th key={i} style={{
                    padding: '8px 14px',
                    textAlign: isRtl ? 'right' : 'left',
                    fontWeight: 600,
                    color: '#C2652A',
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, i) => (
                <tr key={i} style={{
                  borderBottom: i < agents.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <td style={{ padding: '9px 14px', whiteSpace: 'nowrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 7, flexDirection: isRtl ? 'row-reverse' : 'row', justifyContent: isRtl ? 'flex-end' : 'flex-start' }}>
                      <span style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: agent.color,
                        flexShrink: 0,
                      }} />
                      <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{agent.emoji} {agent.name[lang]}</span>
                    </span>
                  </td>
                  <td style={{ padding: '9px 14px', color: 'var(--text)', lineHeight: 1.5 }}>
                    {agent.role[lang]}
                  </td>
                  <td style={{ padding: '9px 14px', color: 'var(--text-soft)', fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>
                    {agent.owns[lang]}
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
