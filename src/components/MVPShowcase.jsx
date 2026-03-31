import { useState } from 'react'
import { useLang } from '../App'
import { CaretDown } from '@phosphor-icons/react'

const features = [
  { gif: '/images/carousel.gif', still: '/images/carousel-still.jpg', label: { he: '4 הבים עם ניווט קרוסלה', en: '4 hubs with carousel navigation' } },
  { gif: '/images/supermarket.gif', still: '/images/supermarket-still.jpg', label: { he: 'רשימת קניות עם הצעות חכמות', en: 'Shopping list with smart suggestions' } },
  { gif: '/images/voucher.gif', still: '/images/voucher-still.jpg', label: { he: 'סריקת ברקוד עם OCR', en: 'Barcode scanning with OCR' } },
]

const stack = [
  { name: 'React 19', desc: 'UI Framework', color: '#61DAFB' },
  { name: 'TypeScript', desc: 'Typed JavaScript', color: '#3178C6' },
  { name: 'Vite', desc: 'Build Tool', color: '#646CFF' },
  { name: 'Tailwind CSS', desc: 'Styling', color: '#06B6D4' },
  { name: 'Supabase', desc: 'Database + Auth', color: '#3FCF8E' },
  { name: 'Vercel', desc: 'Hosting + Deploy', color: '#000' },
  { name: 'tesseract.js', desc: 'OCR Engine', color: '#C2652A' },
]

const missingGroups = [
  {
    label: { he: 'תהליך', en: 'Process' },
    items: {
      he: ['בלי טסטים, בלי בקשות משיכה, בלי ענפים', 'כל הקוד נדחף ישירות לענף הראשי'],
      en: ['No tests, no pull requests, no branches', 'All code pushed straight to main'],
    },
  },
  {
    label: { he: 'איכות', en: 'Quality' },
    items: {
      he: ['מנגנון ההתחברות שביר', 'באגים במובייל בכל מקום', 'טקסטים בעברית ואנגלית מעורבבים בקוד בלי מבנה תרגום'],
      en: ['Fragile authentication', 'Mobile bugs everywhere', 'Hebrew and English text mixed in code with no translation structure'],
    },
  },
  {
    label: { he: 'ידע', en: 'Knowledge' },
    items: {
      he: ['אני היחידה שמבינה מה קורה בקוד — אין תיעוד, אין סדר'],
      en: ['I\'m the only one who understands the code — no documentation, no structure'],
    },
  },
]

export default function MVPShowcase() {
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'
  const [stackOpen, setStackOpen] = useState(false)

  return (
    <div style={{ margin: '20px 0', direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* What we built */}
      <div style={{
        borderRadius: 12,
        border: '1px solid #10B98140',
        overflow: 'hidden',
        marginBottom: 16,
      }}>
        <div style={{
          padding: '12px 16px',
          background: '#10B98112',
          borderBottom: '1px solid #10B98120',
          fontFamily,
          fontSize: 15,
          fontWeight: 700,
          color: '#10B981',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          {isRtl ? 'רחפו מעל התמונות כדי לראות את האפליקציה בפעולה' : 'Hover images to see in motion'}
        </div>

        {/* GIFs */}
        <div style={{
          display: 'flex',
          gap: 12,
          padding: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              flex: '1 1 140px',
              maxWidth: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}>
              <img
                src={f.still}
                alt={f.label[lang]}
                onMouseEnter={e => e.currentTarget.src = f.gif}
                onMouseLeave={e => e.currentTarget.src = f.still}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                }}
              />
              <span style={{
                fontFamily,
                fontSize: 11,
                color: 'var(--text-soft)',
                textAlign: 'center',
                lineHeight: 1.4,
              }}>
                {f.label[lang]}
              </span>
            </div>
          ))}
        </div>

        {/* Tech stack collapsible */}
        <div style={{ padding: '0 16px 12px' }}>
          <button
            onClick={() => setStackOpen(v => !v)}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily,
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-soft)',
              width: '100%',
            }}
          >
            <CaretDown size={12} weight="bold" style={{
              transform: stackOpen ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s ease',
            }} />
            Tech Stack
          </button>
          {stackOpen && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              padding: '10px 0 0',
            }}>
              {stack.map((s, i) => (
                <span key={i} style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: 11,
                  color: s.color,
                  background: `${s.color}12`,
                  padding: '3px 10px',
                  borderRadius: 6,
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  gap: 4,
                  alignItems: 'baseline',
                }}>
                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                  <span style={{ fontWeight: 400, opacity: 0.7, fontSize: 10 }}>— {s.desc}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* What was missing */}
      <div style={{
        borderRadius: 12,
        border: '1px solid #EF444440',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 16px',
          background: '#EF444412',
          borderBottom: '1px solid #EF444420',
          fontFamily,
          fontSize: 15,
          fontWeight: 700,
          color: '#EF4444',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span>✗</span>
          {isRtl ? 'מה לא היה' : 'What was missing'}
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {missingGroups.map((group, gi) => (
            <div key={gi}>
              <div style={{
                fontFamily: 'var(--font-code)',
                fontSize: 10,
                fontWeight: 600,
                color: '#EF4444',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 6,
                opacity: 0.7,
              }}>
                {group.label[lang]}
              </div>
              {group.items[lang].map((item, i) => (
                <div key={i} style={{
                  fontFamily,
                  fontSize: 13,
                  color: 'var(--text)',
                  lineHeight: 1.5,
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                  marginBottom: 4,
                }}>
                  <span style={{ color: '#EF4444', fontSize: 10, flexShrink: 0 }}>●</span>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          padding: '8px 16px 14px',
          fontFamily,
          fontSize: 14,
          fontStyle: 'italic',
          color: 'var(--text-soft)',
        }}>
          {isRtl ? '״זה עובד, אבל...״' : '"It works, but..."'}
        </div>
      </div>
    </div>
  )
}
