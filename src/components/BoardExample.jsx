import { useState } from 'react'
import { useLang } from '../App'
import { TreeStructure } from '@phosphor-icons/react'

const sections = [
  { he: 'Wave Tracker', en: 'Wave Tracker', desc: { he: 'טבלה עם מספר הגל, משימות, סוכנים, סטטוס ותאריכים', en: 'Table with wave number, tasks, agents, status, and dates' } },
  { he: 'Phase Progress Bars', en: 'Phase Progress Bars', desc: { he: 'סרגלי התקדמות ויזואליים (██) לכל שלב', en: 'Visual progress bars (██) per phase' } },
  { he: 'Human Action Queue', en: 'Human Action Queue', desc: { he: 'משימות שדורשות התערבות אנושית בלבד — migrations, PR merges', en: 'Tasks requiring human action only — migrations, PR merges' } },
  { he: 'Active Agents', en: 'Active Agents', desc: { he: 'מי רץ עכשיו ועל איזו משימה', en: 'Who is running right now and on which task' } },
  { he: 'Completed Log', en: 'Completed Log', desc: { he: 'רשומת ביקורת מלאה של כל משימה שהושלמה', en: 'Full audit trail of every completed task' } },
]

const snippet = `# 📋 HomeHub Agent Board

## 🌊 Wave Tracker

| Wave   | Tasks                    | Agents | Status  |
|--------|--------------------------|--------|---------|
| Wave 1 | arch-001, qa-001, fe-007 | 🏗️🧪🎨 | ✅ Done |
| Wave 8 | fe-bug-017/018 + qa-010  | 🎨🧪   | ✅ Done |
| (...)  |                          |        |         |

## 🚨 Human Action Queue

| Action                          | Urgency     | Status  |
|---------------------------------|-------------|---------|
| supabase db push — apply schema | 🔴 Blocking | ✅ Done |
| Merge master → main to deploy   | 🟡 Ready    | ✅ Done |

## 🖥️ Active Agents
None. Ready for next wave.`

export default function BoardExample() {
  const [open, setOpen] = useState(false)
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{
      border: '1.5px solid rgba(74, 107, 138, 0.3)',
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
          color: '#4A6B8A',
          direction: isRtl ? 'rtl' : 'ltr',
          textAlign: isRtl ? 'right' : 'left',
          transition: 'background-color 0.2s ease',
        }}
      >
        <TreeStructure size={15} weight="duotone" />
        <span style={{ flex: 1 }}>{isRtl ? 'מה כולל ה-BOARD.md' : 'What BOARD.md contains'}</span>
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
            {sections.map((section, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, direction: isRtl ? 'rtl' : 'ltr' }}>
                <span style={{ color: 'var(--text-soft)', fontSize: 10, flexShrink: 0 }}>●</span>
                <span style={{ fontFamily, fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--heading)', fontWeight: 600 }}>{section[lang]}</strong>
                  {' '}—{' '}
                  <span style={{ color: 'var(--text-soft)' }}>{section.desc[lang]}</span>
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
