import { useState } from 'react'
import { useLang } from '../App'
import { Flask } from '@phosphor-icons/react'

const snippet = `{
  "mode": "TDD — write tests first, validate after FE merges",
  "workflow": [
    "PHASE 1 (TDD): Write tests that assert expected output.
      Tests will FAIL initially — that is expected and correct.",
    "PHASE 2: Watch agents/handoffs/ for a handoff from fe-bug-017.
      When it arrives, merge FE's branch into yours and run tests.",
    "PHASE 3 (validate): All tests should now pass.
      If any fail, note them in a handoff back to FE.",
    "PHASE 4 (PR): Push your branch and open a PR --base master."
  ]
}`

export default function TDDExample() {
  const [open, setOpen] = useState(false)
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'
  const color = '#2D7D9A'

  return (
    <div style={{
      border: `1.5px solid rgba(45, 125, 154, 0.3)`,
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
          color,
          direction: isRtl ? 'rtl' : 'ltr',
          textAlign: isRtl ? 'right' : 'left',
          transition: 'background-color 0.2s ease',
        }}
      >
        <Flask size={15} weight="duotone" />
        <span style={{ flex: 1 }}>{isRtl ? 'איך נראה TDD workflow אמיתי' : 'What a real TDD workflow looks like'}</span>
        <span style={{
          fontSize: 11,
          transition: 'transform 0.2s ease',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          opacity: 0.5,
        }}>▼</span>
      </button>

      {open && (
        <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
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
