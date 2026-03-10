import { useLang } from '../App'

const rows = [
  {
    before: {
      he: '״איך עושים HTTP request ב-Python עם error handling?״',
      en: '"How do I make an HTTP request in Python with error handling?"',
    },
    after: {
      he: '״תכתבו לי פונקציה שמושכת מידע מ-API, עם retry ו-timeout״',
      en: '"Write me a function that fetches data from an API, with retry and timeout"',
    },
  },
  {
    before: {
      he: 'מחפשים ב-Google ← קוראים דוקומנטציה ← מעתיקים קוד ← מתאימים',
      en: 'Google it → read docs → copy code → adapt',
    },
    after: {
      he: 'מתארים כוונה ← AI כותב ← אתם בודקים ומתקנים',
      en: 'Describe intent → AI writes → you review and fix',
    },
  },
  {
    before: {
      he: '״איך מממשים את זה?״',
      en: '"How do I implement this?"',
    },
    after: {
      he: '״מה אנחנו צריכים שיקרה?״',
      en: '"What do I need to happen?"',
    },
  },
]

const beforeColor = '#94a3b8'
const afterColor = '#9B4F96'

export default function BeforeAfterTable() {
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{
      margin: '20px 0',
      borderRadius: 10,
      border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          padding: '10px 14px',
          background: `${beforeColor}12`,
          fontFamily: 'var(--font-code)',
          fontSize: 11,
          fontWeight: 700,
          color: beforeColor,
          textTransform: 'uppercase',
          letterSpacing: 1,
          textAlign: 'center',
          borderRight: isRtl ? 'none' : '1px solid var(--border)',
          borderLeft: isRtl ? '1px solid var(--border)' : 'none',
        }}>
          {isRtl ? 'לפני' : 'Before'}
        </div>
        <div style={{
          padding: '10px 14px',
          background: `${afterColor}12`,
          fontFamily: 'var(--font-code)',
          fontSize: 11,
          fontWeight: 700,
          color: afterColor,
          textTransform: 'uppercase',
          letterSpacing: 1,
          textAlign: 'center',
        }}>
          {isRtl ? 'אחרי' : 'After'}
        </div>
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
        }}>
          <div style={{
            padding: '10px 14px',
            fontFamily,
            fontSize: 13,
            lineHeight: 1.6,
            color: 'var(--text-soft)',
            direction: isRtl ? 'rtl' : 'ltr',
            borderRight: isRtl ? 'none' : '1px solid var(--border)',
            borderLeft: isRtl ? '1px solid var(--border)' : 'none',
          }}>
            {row.before[lang]}
          </div>
          <div style={{
            padding: '10px 14px',
            fontFamily,
            fontSize: 13,
            lineHeight: 1.6,
            color: 'var(--text)',
            fontWeight: 500,
            direction: isRtl ? 'rtl' : 'ltr',
          }}>
            {row.after[lang]}
          </div>
        </div>
      ))}
    </div>
  )
}
