import { useState } from 'react'
import { useLang } from '../App'
import { Ruler } from '@phosphor-icons/react'

const items = [
  { he: 'סטאק טכנולוגי', en: 'Tech stack', desc: { he: 'אילו כלים ולמה (ולמה לא האלטרנטיבות)', en: 'which tools and why (and why not the alternatives)' } },
  { he: 'סכמת בסיס הנתונים', en: 'Database schema', desc: { he: 'טבלאות, קשרים, הרשאות', en: 'tables, relationships, permissions' } },
  { he: 'זרימת אימות', en: 'Auth flow', desc: { he: 'איך המשתמש נכנס, מה קורה מאחורי הקלעים', en: 'how users log in, what happens behind the scenes' } },
  { he: 'היררכיית קומפוננטות', en: 'Component hierarchy', desc: { he: 'איך ה-UI מאורגן', en: 'how the UI is structured' } },
  { he: 'לוגיקת שרת', en: 'Server logic', desc: { he: 'מה רץ ב server-side ולמה', en: 'what runs server-side and why' } },
]

export default function ArchDocChecklist() {
  const [open, setOpen] = useState(false)
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{
      border: `1.5px solid ${open ? 'var(--text-soft)' : 'var(--border)'}`,
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
          color: 'var(--text-soft)',
          direction: isRtl ? 'rtl' : 'ltr',
          textAlign: isRtl ? 'right' : 'left',
          transition: 'background-color 0.2s ease',
        }}
      >
        <Ruler size={15} weight="duotone" />
        <span style={{ flex: 1 }}>{isRtl ? 'מה כולל מסמך ארכיטקטורה טוב' : 'What a good architecture doc includes'}</span>
        <span style={{
          fontSize: 11,
          transition: 'transform 0.2s ease',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          opacity: 0.5,
        }}>▼</span>
      </button>

      {open && (
        <div style={{
          padding: '10px 16px 14px',
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          {items.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
              direction: isRtl ? 'rtl' : 'ltr',
            }}>
              <span style={{ color: 'var(--text-soft)', fontSize: 10, flexShrink: 0 }}>●</span>
              <span style={{ fontFamily, fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--heading)', fontWeight: 600 }}>{item[lang]}</strong>
                {' '}—{' '}
                <span style={{ color: 'var(--text-soft)' }}>{item.desc[lang]}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
