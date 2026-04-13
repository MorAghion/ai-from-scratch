import { useLang } from '../App'

const commands = [
  {
    cmd: '/clear',
    what: { he: 'מאפס את ה-context של השיחה', en: 'Resets the conversation context' },
    when: { he: 'כשClaude מבולבל או תקוע', en: "When Claude is confused or stuck" },
  },
  {
    cmd: '/compact',
    what: { he: 'מדחס את היסטוריית השיחה לסיכום', en: 'Compresses conversation history to a summary' },
    when: { he: 'sessions ארוכים לפני שהcontext נגמר', en: 'Long sessions before context runs out' },
  },
  {
    cmd: '/plan',
    what: { he: 'עובר למצב read-only (Plan mode)', en: 'Switches to read-only Plan mode' },
    when: { he: 'לפני שינויים גדולים', en: 'Before large changes' },
  },
  {
    cmd: '/init',
    what: { he: 'סורק את הפרויקט ויוצר CLAUDE.md ראשוני', en: 'Scans project and creates initial CLAUDE.md' },
    when: { he: 'פרויקט חדש שאין לו CLAUDE.md', en: 'New project without CLAUDE.md' },
  },
  {
    cmd: '/help',
    what: { he: 'מציג את כל הפקודות הזמינות', en: 'Shows all available commands' },
    when: { he: 'תמיד שימושי', en: 'Always useful' },
  },
  {
    cmd: '/cost',
    what: { he: 'מציג עלות ה-tokens של ה-session הנוכחי', en: 'Shows token cost for the current session' },
    when: { he: 'מעקב תקציב', en: 'Budget tracking' },
  },
]

const color = '#1E4D8C'

export default function SlashCommandsTable() {
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
              isRtl ? 'פקודה' : 'Command',
              isRtl ? 'מה היא עושה' : 'What it does',
              isRtl ? 'מתי' : 'When',
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
          {commands.map((c, i) => (
            <tr key={i} style={{
              borderBottom: i < commands.length - 1 ? '1px solid var(--border)' : 'none',
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
                  direction: 'ltr',
                  display: 'inline-block',
                }}>{c.cmd}</code>
              </td>
              <td style={{ padding: '9px 14px', color: 'var(--text)', lineHeight: 1.6 }}>
                {c.what[lang]}
              </td>
              <td style={{ padding: '9px 14px', color: 'var(--text-soft, var(--text))', lineHeight: 1.5, fontSize: 13 }}>
                {c.when[lang]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
