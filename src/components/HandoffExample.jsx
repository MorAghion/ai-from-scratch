import { useState } from 'react'
import { useLang } from '../App'
import { Lightning } from '@phosphor-icons/react'

const fields = [
  { key: 'from / to', he: 'מי מסר ומי מקבל', en: 'Who is handing off and who receives' },
  { key: 'deliverables[]', he: 'רשימת הקבצים שנוצרו או שונו', en: 'List of files created or modified' },
  { key: 'unblocks[]', he: 'אילו משימות נפתחות עכשיו לביצוע', en: 'Which tasks are now unblocked' },
  { key: 'qa_test_cases[]', he: 'תרחישי בדיקה מפורטים — שלבים ותוצאה צפויה לכל בדיקה', en: 'Detailed test scenarios — steps and expected result for each check' },
  { key: 'summary', he: 'תיאור קצר של מה הושלם', en: 'Brief description of what was completed' },
]

const snippet = `{
  "from": "frontend",
  "to": "qa",
  "unblocks": ["qa-007"],
  "deliverables": [
    "src/i18n/he/common.json — full Hebrew translations",
    "src/App.tsx — RTL dir toggle via useEffect",
    (...)
  ],
  "qa_test_cases": [
    {
      "description": "Switch language to Hebrew",
      "steps": ["Open Settings", "Tap 'עברית'", "Observe UI"],
      "expected": "dir becomes 'rtl', layout mirrors, all text in Hebrew"
    }
  ]
}`

export default function HandoffExample() {
  const [open, setOpen] = useState(false)
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{
      border: '1.5px solid rgba(155, 79, 150, 0.3)',
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
          color: '#9B4F96',
          direction: isRtl ? 'rtl' : 'ltr',
          textAlign: isRtl ? 'right' : 'left',
          transition: 'background-color 0.2s ease',
        }}
      >
        <Lightning size={15} weight="duotone" />
        <span style={{ flex: 1 }}>{isRtl ? 'מה כולל קובץ handoff' : 'What a handoff file contains'}</span>
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
