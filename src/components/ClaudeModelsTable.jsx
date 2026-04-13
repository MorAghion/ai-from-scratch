import { useLang } from '../App'

const models = [
  {
    model: 'Opus 4.6',
    context: '1M tokens',
    input: '$5',
    output: '$25',
    bestFor: { he: 'מורכב, ניתוח עמוק, ארכיטקטורה', en: 'Complex tasks, deep analysis, architecture' },
    thinking: true,
    mora: false,
  },
  {
    model: 'Sonnet 4.6',
    context: '1M tokens',
    input: '$3',
    output: '$15',
    bestFor: { he: 'ברירת המחדל - 80% מהזמן', en: 'Default — 80% of the time' },
    thinking: true,
    mora: true,
  },
  {
    model: 'Haiku 4.5',
    context: '200K tokens',
    input: '$1',
    output: '$5',
    bestFor: { he: 'מהיר, זול, pipelines', en: 'Fast, cheap, pipelines' },
    thinking: false,
    mora: false,
  },
]

const color = '#1E4D8C'

export default function ClaudeModelsTable() {
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
              isRtl ? 'מודל' : 'Model',
              'Context',
              isRtl ? 'Input / 1M' : 'Input / 1M',
              isRtl ? 'Output / 1M' : 'Output / 1M',
              isRtl ? 'הכי טוב ל' : 'Best for',
              isRtl ? 'Adaptive Thinking' : 'Adaptive Thinking',
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
          {models.map((m, i) => (
            <tr key={i} style={{
              borderBottom: i < models.length - 1 ? '1px solid var(--border)' : 'none',
              background: m.mora ? 'rgba(30, 77, 140, 0.04)' : 'transparent',
            }}>
              <td style={{ padding: '9px 14px', whiteSpace: 'nowrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: isRtl ? 'row-reverse' : 'row', justifyContent: isRtl ? 'flex-end' : 'flex-start' }}>
                  <code style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: 'var(--heading)',
                    background: 'var(--code-bg, rgba(0,0,0,0.06))',
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}>{m.model}</code>
                  {m.mora && (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: color,
                      background: 'rgba(30, 77, 140, 0.1)',
                      padding: '1px 6px',
                      borderRadius: 10,
                      whiteSpace: 'nowrap',
                    }}>{isRtl ? 'ה-default שלי' : 'my default'}</span>
                  )}
                </span>
              </td>
              <td style={{ padding: '9px 14px', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                {m.context}
              </td>
              <td style={{ padding: '9px 14px', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                {m.input}
              </td>
              <td style={{ padding: '9px 14px', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                {m.output}
              </td>
              <td style={{ padding: '9px 14px', color: 'var(--text)', lineHeight: 1.5 }}>
                {m.bestFor[lang]}
              </td>
              <td style={{ padding: '9px 14px', textAlign: 'center', fontSize: 15 }}>
                {m.thinking ? '✅' : '❌'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{
        padding: '8px 14px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        direction: isRtl ? 'rtl' : 'ltr',
      }}>
        <span style={{ fontSize: 13, flexShrink: 0 }}>⚠️</span>
        <span style={{
          fontFamily,
          fontSize: 11.5,
          color: 'var(--text-soft)',
          lineHeight: 1.5,
        }}>
          {isRtl
            ? <>מחירי API לדוגמה - עלולים להשתנות. <a href="https://docs.anthropic.com/en/docs/about-claude/models/overview" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>בדקו את המחירון העדכני ←</a></>
            : <>API prices are approximate and may change. <a href="https://docs.anthropic.com/en/docs/about-claude/models/overview" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Check current pricing →</a></>
          }
        </span>
      </div>
    </div>
  )
}
