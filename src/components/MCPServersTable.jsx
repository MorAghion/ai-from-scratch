import { useLang } from '../App'

const servers = [
  {
    server: 'GitHub',
    desc: { he: 'קרא/כתוב repos, issues, PRs - ישירות מהשיחה', en: 'Read/write repos, issues, PRs - directly from the conversation' },
  },
  {
    server: 'Slack',
    desc: { he: 'שלח הודעות, קרא channels, חפש שיחות', en: 'Send messages, read channels, search conversations' },
  },
  {
    server: 'Google Drive',
    desc: { he: 'גישה לקבצים ב-Drive, קריאה ועדכון מסמכים', en: 'Access Drive files, read and update documents' },
  },
  {
    server: 'Postgres / SQLite',
    desc: { he: 'שאל בסיסי נתונים בשפה טבעית', en: 'Query databases in natural language' },
  },
  {
    server: 'Filesystem',
    desc: { he: 'גישה לקבצים מקומיים מחוץ לפרויקט הנוכחי', en: 'Access local files outside the current project' },
  },
  {
    server: 'Fetch',
    desc: { he: 'שלח בקשות HTTP, קרא דפים ו-APIs', en: 'Send HTTP requests, read pages and APIs' },
  },
  {
    server: 'Puppeteer',
    desc: { he: 'שלוט בדפדפן, בצע automation על web apps', en: 'Control a browser, automate web apps' },
  },
]

const color = '#1E4D8C'

export default function MCPServersTable() {
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
              isRtl ? 'שרת' : 'Server',
              isRtl ? 'מה הוא עושה' : 'What it does',
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
          {servers.map((s, i) => (
            <tr key={i} style={{
              borderBottom: i < servers.length - 1 ? '1px solid var(--border)' : 'none',
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
                }}>{s.server}</code>
              </td>
              <td style={{ padding: '9px 14px', color: 'var(--text)', lineHeight: 1.6 }}>
                {s.desc[lang]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
