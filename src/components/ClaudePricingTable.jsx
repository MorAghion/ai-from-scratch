import { useLang } from '../App'

const plans = [
  {
    plan: 'Free',
    price: { he: 'חינם', en: 'Free' },
    bestFor: { he: 'ניסיון, שימוש קל', en: 'Trying it out, light use' },
    mora: false,
  },
  {
    plan: 'Pro',
    price: { he: '$20 לחודש', en: '$20/mo' },
    bestFor: { he: 'שימוש מאוזן, לא מגיעים ל-rate limit', en: 'Balanced use, not hitting rate limits' },
    mora: false,
  },
  {
    plan: 'Max',
    price: { he: '$100-$200 לחודש', en: '$100–$200/mo' },
    bestFor: { he: 'heavy users - Claude Code intensive, sessions ארוכות', en: 'Heavy users - intensive Claude Code, long sessions' },
    mora: true,
  },
  {
    plan: 'API',
    price: { he: 'לפי שימוש בלבד', en: 'Pay per use' },
    bestFor: { he: 'builders שמטמיעים Claude במוצר', en: 'Builders embedding Claude in a product' },
    mora: false,
  },
  {
    plan: 'Enterprise',
    price: { he: 'מחיר מותאם', en: 'Custom pricing' },
    bestFor: { he: 'ארגונים עם צרכי אבטחה ועמידה בתקנות', en: 'Organizations with security and compliance needs' },
    mora: false,
  },
]

const color = '#1E4D8C'

export default function ClaudePricingTable() {
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
              isRtl ? 'תוכנית' : 'Plan',
              isRtl ? 'מחיר' : 'Price',
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
          {plans.map((p, i) => (
            <tr key={i} style={{
              borderBottom: i < plans.length - 1 ? '1px solid var(--border)' : 'none',
              background: p.mora ? 'rgba(30, 77, 140, 0.04)' : 'transparent',
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
                  }}>{p.plan}</code>
                  {p.mora && (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: color,
                      background: 'rgba(30, 77, 140, 0.1)',
                      padding: '1px 6px',
                      borderRadius: 10,
                      whiteSpace: 'nowrap',
                    }}>{isRtl ? 'הבחירה שלי' : 'my pick'}</span>
                  )}
                </span>
              </td>
              <td style={{ padding: '9px 14px', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>
                {p.price[lang]}
              </td>
              <td style={{ padding: '9px 14px', color: 'var(--text)', lineHeight: 1.6 }}>
                {p.bestFor[lang]}
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
            ? <>מחירים לדוגמה - עלולים להשתנות. <a href="https://www.anthropic.com/pricing" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>בדקו באתר הרשמי ←</a></>
            : <>Prices are approximate and may change. <a href="https://www.anthropic.com/pricing" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Check official pricing →</a></>
          }
        </span>
      </div>
    </div>
  )
}
