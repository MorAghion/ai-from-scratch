import { useState } from 'react'
import { useLang } from '../App'
import { File } from '@phosphor-icons/react'

const fields = [
  { key: 'id', he: 'מזהה ייחודי של המשימה (למשל fe-001)', en: 'Unique task identifier (e.g. fe-001)' },
  { key: 'phase + priority + status', he: 'שלב, עדיפות וסטטוס נוכחי', en: 'Phase, priority, and current status' },
  { key: 'depends_on + blocks', he: 'גרף התלויות — אילו משימות חוסמות אותה ואילו היא חוסמת', en: 'Dependency graph — what blocks it and what it blocks' },
  { key: 'acceptance_criteria', he: 'רשימת תנאים מדויקים לסיום — הסוכן יודע בדיוק מתי הוא סיים', en: 'Exact checklist of completion conditions — the agent knows precisely when it\'s done' },
  { key: 'files_to_touch', he: 'רשימת הקבצים שמותר לגעת בהם — אין ניחושים', en: 'List of files allowed to touch — no guessing' },
  { key: 'completion_summary', he: 'מולא על ידי הסוכן בסיום — תיעוד של מה השתנה ולמה', en: 'Filled in by the agent on completion — documents what changed and why' },
]

const snippet = `{
  "id": "fe-001",
  "status": "done",
  "depends_on": ["arch-001"],
  "blocks": ["qa-002"],
  "acceptance_criteria": [
    "VoucherCard.tsx created in src/components/vouchers/",
    "Displays: name, value (₪ formatted), issuer, expiry date",
    (...)
  ],
  "files_to_touch": [
    "src/components/vouchers/VoucherCard.tsx (create)",
    (...)
  ]
}`

export default function TaskJsonExample() {
  const [open, setOpen] = useState(false)
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{
      border: '1.5px solid rgba(212, 160, 23, 0.3)',
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
          color: '#D4A017',
          direction: isRtl ? 'rtl' : 'ltr',
          textAlign: isRtl ? 'right' : 'left',
          transition: 'background-color 0.2s ease',
        }}
      >
        <File size={15} weight="duotone" />
        <span style={{ flex: 1 }}>{isRtl ? 'מה כולל כל task.json' : 'What each task.json contains'}</span>
        <span style={{
          fontSize: 11,
          transition: 'transform 0.2s ease',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          opacity: 0.5,
        }}>▼</span>
      </button>

      {open && (
        <div style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{ padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {fields.map((field, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, direction: isRtl ? 'rtl' : 'ltr' }}>
                <span style={{ color: 'var(--text-soft)', fontSize: 10, flexShrink: 0 }}>●</span>
                <span style={{ fontFamily, fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                  <code dir="ltr" style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    background: 'var(--code-bg, rgba(0,0,0,0.06))',
                    padding: '1px 5px',
                    borderRadius: 4,
                    color: 'var(--heading)',
                  }}>{field.key}</code>
                  {' '}—{' '}
                  <span style={{ color: 'var(--text-soft)' }}>{field[lang]}</span>
                </span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', padding: '12px 16px 14px' }}>
            <pre dir="ltr" style={{
              fontFamily: 'var(--font-code)',
              fontSize: 12,
              lineHeight: 1.6,
              color: 'var(--text)',
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '12px 16px',
              overflowX: 'auto',
              whiteSpace: 'pre',
              margin: 0,
            }}>{snippet}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
