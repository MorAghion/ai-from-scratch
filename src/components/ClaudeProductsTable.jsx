import { useLang } from '../App'

const products = [
  {
    product: 'Claude.ai',
    purpose: { he: 'שיחות, מחקר, artifacts, ניתוח', en: 'Conversations, research, artifacts, analysis' },
    install: false,
    audience: { he: 'כולם', en: 'Everyone' },
  },
  {
    product: 'Claude Code',
    purpose: { he: 'CLI לפיתוח, סוכנים, כתיבת קוד', en: 'CLI for development, agents, coding' },
    install: true,
    audience: { he: 'מפתחים', en: 'Developers' },
  },
  {
    product: 'Claude Desktop',
    purpose: { he: 'MCP gateway, Projects, Cowork', en: 'MCP gateway, Projects, Cowork' },
    install: true,
    audience: { he: 'knowledge workers', en: 'Knowledge workers' },
  },
  {
    product: 'Claude API',
    purpose: { he: 'בניית מוצרים עם Claude', en: 'Building products with Claude' },
    install: true,
    audience: { he: 'developers ו-builders', en: 'Developers & builders' },
  },
  {
    product: 'Managed Agents',
    purpose: { he: 'סוכנים אוטונומיים בסקייל', en: 'Autonomous agents at scale' },
    install: true,
    audience: { he: 'Enterprise', en: 'Enterprise' },
  },
]

const color = '#1E4D8C'

export default function ClaudeProductsTable() {
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
              isRtl ? 'מוצר' : 'Product',
              isRtl ? 'לשם מה' : 'Purpose',
              isRtl ? 'דורש התקנה' : 'Install',
              isRtl ? 'קהל יעד' : 'Audience',
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
          {products.map((p, i) => (
            <tr key={i} style={{
              borderBottom: i < products.length - 1 ? '1px solid var(--border)' : 'none',
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
                }}>{p.product}</code>
              </td>
              <td style={{ padding: '9px 14px', color: 'var(--text)', lineHeight: 1.6 }}>
                {p.purpose[lang]}
              </td>
              <td style={{ padding: '9px 14px', textAlign: 'center', fontSize: 15 }}>
                {p.install ? '✅' : '❌'}
              </td>
              <td style={{ padding: '9px 14px', color: 'var(--text)', lineHeight: 1.6 }}>
                {p.audience[lang]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
