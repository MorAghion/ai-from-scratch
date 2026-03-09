import { useLang } from '../App'

const entries = [
  { date: '2.2', amount: 62, label: { he: 'חקירה ראשונית', en: 'Initial exploration' } },
  { date: '10.2', amount: 30, label: { he: 'יום 1 — התחלת הפרויקט', en: 'Day 1 — project start' } },
  { date: '11.2', amount: 153, label: { he: 'חור הארנב של מנוע ההקשר', en: 'Context engine rabbit hole' }, peak: true },
  { date: '17.2', amount: null, label: { he: 'מעבר ל-Claude Max — $100/חודש', en: 'Switched to Claude Max — $100/mo' }, milestone: true },
  { date: '24.2', amount: 16, label: { he: 'שלב מובנה — עלות שולית', en: 'Structured phase — marginal cost' } },
]

const maxAmount = 153

export default function CostBreakdown() {
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{
        borderRadius: 10,
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '10px 14px',
          background: '#F59E0B12',
          borderBottom: '1px solid var(--border)',
          fontFamily: 'var(--font-code)',
          fontSize: 11,
          fontWeight: 700,
          color: '#F59E0B',
          textTransform: 'uppercase',
          letterSpacing: 1,
          textAlign: 'center',
        }}>
          {isRtl ? 'עלות טוקנים — API' : 'Token Cost — API'}
        </div>

        {/* Entries */}
        <div style={{ padding: '10px 0' }}>
          {entries.map((entry, i) => (
            <div key={i} style={{
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              direction: isRtl ? 'rtl' : 'ltr',
              borderBottom: i < entries.length - 1 ? '1px solid var(--border)' : 'none',
              background: entry.milestone ? '#8B5CF608' : entry.peak ? '#EF444408' : 'transparent',
            }}>
              {/* Date */}
              <span style={{
                fontFamily: 'var(--font-code)',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-soft)',
                minWidth: 36,
                textAlign: 'center',
              }}>
                {entry.date}
              </span>

              {/* Bar or milestone */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {entry.amount !== null ? (
                  <div style={{
                    height: 18,
                    borderRadius: 4,
                    background: entry.peak
                      ? 'linear-gradient(90deg, #EF4444, #F59E0B)'
                      : '#F59E0B40',
                    width: `${Math.max((entry.amount / maxAmount) * 100, 8)}%`,
                    display: 'flex',
                    alignItems: 'center',
                    paddingInlineStart: 6,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-code)',
                      fontSize: 10,
                      fontWeight: 700,
                      color: entry.peak ? '#fff' : '#F59E0B',
                    }}>
                      {entry.amount} ₪
                    </span>
                  </div>
                ) : (
                  <div style={{
                    height: 18,
                    borderRadius: 4,
                    background: '#8B5CF620',
                    border: '1px dashed #8B5CF6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-code)',
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#8B5CF6',
                    }}>
                      $100/mo
                    </span>
                  </div>
                )}
                <span style={{
                  fontFamily,
                  fontSize: 11,
                  color: entry.peak ? '#EF4444' : entry.milestone ? '#8B5CF6' : 'var(--text-soft)',
                  fontWeight: entry.peak || entry.milestone ? 600 : 400,
                  lineHeight: 1.3,
                }}>
                  {entry.label[lang]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{
          padding: '10px 14px',
          borderTop: '1px solid var(--border)',
          background: '#F59E0B08',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          direction: isRtl ? 'rtl' : 'ltr',
        }}>
          <span style={{
            fontFamily,
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--heading)',
          }}>
            {isRtl ? 'סה״כ API + מנוי חודש ראשון' : 'Total API + first month subscription'}
          </span>
          <span style={{
            fontFamily: 'var(--font-code)',
            fontSize: 13,
            fontWeight: 700,
            color: '#F59E0B',
          }}>
            ~$170
          </span>
        </div>
      </div>
    </div>
  )
}