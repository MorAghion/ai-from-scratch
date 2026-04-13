import { useLang } from '../App'

const modes = [
  {
    mode: 'Default',
    edits: { he: 'בשאלה', en: 'Ask first' },
    commands: { he: 'בשאלה', en: 'Ask first' },
    bestFor: { he: 'קוד חדש או לא מוכר', en: 'New or unfamiliar code' },
  },
  {
    mode: 'AcceptEdits',
    edits: { he: '✅ חופשי', en: '✅ Free' },
    commands: { he: 'בשאלה', en: 'Ask first' },
    bestFor: { he: 'iteration מהיר', en: 'Fast iteration' },
  },
  {
    mode: 'Plan',
    edits: { he: '❌ קורא בלבד', en: '❌ Read-only' },
    commands: { he: '❌ קורא בלבד', en: '❌ Read-only' },
    bestFor: { he: 'סקירה לפני פעולה גדולה', en: 'Review before big changes' },
  },
  {
    mode: 'Auto',
    edits: { he: '✅ חופשי', en: '✅ Free' },
    commands: { he: '✅ חופשי', en: '✅ Free' },
    bestFor: { he: 'משימות מוגדרות היטב עם CLAUDE.md חזק', en: 'Well-defined tasks with strong CLAUDE.md' },
  },
]

const color = '#1E4D8C'

export default function PermissionModesTable() {
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
              isRtl ? 'מצב' : 'Mode',
              isRtl ? 'עורך קבצים' : 'File edits',
              isRtl ? 'מריץ פקודות' : 'Commands',
              isRtl ? 'הכי טוב ל' : 'Best for',
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
          {modes.map((m, i) => (
            <tr key={i} style={{
              borderBottom: i < modes.length - 1 ? '1px solid var(--border)' : 'none',
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
                }}>{m.mode}</code>
              </td>
              <td style={{ padding: '9px 14px', color: 'var(--text)', lineHeight: 1.5 }}>
                {m.edits[lang]}
              </td>
              <td style={{ padding: '9px 14px', color: 'var(--text)', lineHeight: 1.5 }}>
                {m.commands[lang]}
              </td>
              <td style={{ padding: '9px 14px', color: 'var(--text)', lineHeight: 1.5 }}>
                {m.bestFor[lang]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
