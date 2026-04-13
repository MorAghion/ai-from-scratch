import { useLang } from '../App'

const docs = [
  { file: 'PRD', desc: { he: 'דרישות מוצר מלאות', en: 'Full product requirements' } },
  { file: 'ARCHITECTURE.md', desc: { he: 'ארכיטקטורה טכנית', en: 'Technical architecture' } },
  { file: 'BACKEND.md', desc: { he: 'הגדרות API, Supabase, Edge Functions', en: 'API definitions, Supabase, Edge Functions' } },
  { file: 'FRONTEND.md', desc: { he: 'מבנה קומפוננטות, ניווט, state', en: 'Component structure, routing, state' } },
  { file: 'SECURITY.md', desc: { he: 'RLS, OAuth, הרשאות', en: 'RLS, OAuth, permissions' } },
  { file: 'ENV.md', desc: { he: 'משתני סביבה ותלויות', en: 'Environment variables and dependencies' } },
  { file: 'UI_DESIGN_SYSTEM.md', desc: { he: 'צבעים, טיפוגרפיה, design tokens', en: 'Colors, typography, design tokens' } },
  { file: 'SCREENS.md', desc: { he: 'מסכי האפליקציה עם mockups סטטיים', en: 'App screens with static mockups' } },
]

const color = '#1E4D8C'

export default function PlanningDocsTable() {
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
      margin: '8px 0 16px',
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily,
        fontSize: 13.5,
        direction: isRtl ? 'rtl' : 'ltr',
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            {[
              isRtl ? 'מסמך' : 'Document',
              isRtl ? 'תיאור' : 'Description',
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
          {docs.map((doc, i) => (
            <tr key={i} style={{
              borderBottom: i < docs.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <td style={{ padding: '9px 14px', whiteSpace: 'nowrap' }}>
                <code style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: 'var(--heading)',
                  background: 'var(--code-bg, rgba(0,0,0,0.06))',
                  padding: '2px 6px',
                  borderRadius: 4,
                }}>{doc.file}</code>
              </td>
              <td style={{ padding: '9px 14px', color: 'var(--text)', lineHeight: 1.6 }}>
                {doc.desc[lang]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
