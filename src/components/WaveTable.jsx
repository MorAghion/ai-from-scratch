import React, { useState } from 'react'
import { useLang } from '../App'
import { Waves } from '@phosphor-icons/react'

const agentColors = {
  architect: { color: '#3B82F6', emoji: '' },
  frontend: { color: '#D946EF', emoji: '' },
  backend: { color: '#4A7C59', emoji: '' },
  qa: { color: '#10B981', emoji: '' },
}

const waves = [
  {
    name: 'Wave 1',
    date: '22.2',
    tasks: [
      { id: 'arch-001', name: { he: 'סכמת vouchers', en: 'Vouchers schema' }, agent: 'architect' },
      { id: 'qa-001', name: { he: 'תשתית טסטים', en: 'Test infrastructure' }, agent: 'qa' },
      { id: 'fe-007', name: { he: 'התאמה למסכי מובייל', en: 'Responsive audit' }, agent: 'frontend' },
    ],
    result: { he: '3 משימות במקביל, 2:45 שעות', en: '3 tasks in parallel, 2:45 hours' },
  },
  {
    name: 'Wave 5',
    date: '23.2',
    tasks: [
      { id: 'fe-bug-008', name: { he: 'תיקון קרוסלה', en: 'Carousel fix' }, agent: 'frontend' },
      { id: 'fe-bug-009', name: { he: 'מחיקת master list', en: 'Master list delete' }, agent: 'frontend' },
      { id: 'fe-bug-010', name: { he: 'הוספת רשימה חדשה', en: 'Add-list flow' }, agent: 'frontend' },
      { id: 'fe-bug-011', name: { he: 'כפתורי עריכה', en: 'Edit toolbar' }, agent: 'frontend' },
      { id: 'fe-bug-012', name: { he: 'מיקום חלונות פופ-אפ', en: 'Modal centering' }, agent: 'frontend' },
      { id: 'qa-regression', name: { he: 'טסטי רגרסיה', en: 'Regression tests' }, agent: 'qa' },
    ],
    result: { he: '5 תיקוני באגים + רגרסיה במקביל — PR #11 מורג׳', en: '5 bug fixes + regression in parallel — PR #11 merged' },
  },
  {
    name: 'Wave 8',
    date: '25.2',
    tasks: [
      { id: 'fe-bug-017', name: { he: 'אודיט i18n', en: 'i18n audit' }, agent: 'frontend' },
      { id: 'fe-bug-018', name: { he: 'זיהוי הקשר בעברית', en: 'Hebrew context fix' }, agent: 'frontend' },
      { id: 'fe-bug-019', name: { he: 'תיקון autoCategorize', en: 'autoCategorize fix' }, agent: 'frontend' },
      { id: 'qa-010', name: { he: 'בדיקת שלמות התרגומים', en: 'TDD tests for i18n' }, agent: 'qa' },
      { id: 'qa-011', name: { he: 'טסטים TDD להקשר', en: 'TDD tests for context' }, agent: 'qa' },
      { id: 'qa-012', name: { he: 'טסטים TDD לקטגוריות', en: 'TDD tests for categories' }, agent: 'qa' },
    ],
    result: { he: '6 משימות במקביל, 58 קומיטים, 6 PRs — יום אחד', en: '6 tasks in parallel, 58 commits, 6 PRs — one day' },
  },
  {
    name: 'Wave 9',
    date: '25.2',
    tasks: [
      { id: 'be-002', name: { he: 'אפליקציה שעובדת אופליין', en: 'PWA — manifest, service worker' }, agent: 'backend' },
      { id: 'qa-013', name: { he: 'טסטים TDD ל-PWA', en: 'TDD tests for PWA' }, agent: 'qa' },
    ],
    result: { he: 'PWA חי, 400 טסטים עוברים', en: 'PWA live, 400 tests passing' },
  },
]

export default function WaveTable() {
  const [open, setOpen] = useState(false)
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{
      border: '1.5px solid rgba(74, 124, 89, 0.3)',
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
          color: '#4A7C59',
          direction: isRtl ? 'rtl' : 'ltr',
          textAlign: isRtl ? 'right' : 'left',
          transition: 'background-color 0.2s ease',
        }}
      >
        <Waves size={15} weight="duotone" />
        <span style={{ flex: 1 }}>{isRtl ? 'מערכת הגלים שלי' : 'My wave system'}</span>
        <span style={{
          fontSize: 11,
          transition: 'transform 0.2s ease',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          opacity: 0.5,
        }}>▼</span>
      </button>

      {open && (
      <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '16px' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {waves.map((wave, idx) => (
          <React.Fragment key={wave.name}>
            {idx > 0 && (
              <div style={{
                textAlign: 'right',
                color: '#4A7C59',
                fontSize: 13,
                fontFamily: 'var(--font-code)',
                fontWeight: 700,
                letterSpacing: 4,
              }}>...</div>
            )}
          <div style={{
            borderRadius: 10,
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}>
            {/* Wave header */}
            <div style={{
              padding: '8px 14px',
              background: 'var(--bg-elevated, #f8f8f8)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              direction: isRtl ? 'rtl' : 'ltr',
            }}>
              <span style={{
                fontFamily: 'var(--font-code)',
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--heading)',
              }}>
                {wave.name}
              </span>
              <span style={{
                fontFamily: 'var(--font-code)',
                fontSize: 10,
                color: '#4A7C59',
              }}>
                {wave.date}
              </span>
            </div>

            {/* Tasks */}
            <div style={{ padding: '6px 0' }}>
              {wave.tasks.map(task => {
                const agent = agentColors[task.agent]
                return (
                  <div key={task.id} style={{
                    padding: '4px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    direction: isRtl ? 'rtl' : 'ltr',
                  }}>
                    {/* Agent dot */}
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: agent.color,
                      flexShrink: 0,
                    }} />
                    {/* Task ID */}
                    <span style={{
                      fontFamily: 'var(--font-code)',
                      fontSize: 10,
                      color: agent.color,
                      fontWeight: 600,
                      minWidth: 70,
                    }}>
                      {task.id}
                    </span>
                    {/* Task name */}
                    <span style={{
                      fontFamily,
                      fontSize: 12,
                      color: 'var(--text)',
                    }}>
                      {task.name[lang]}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Result */}
            <div style={{
              padding: '6px 14px',
              borderTop: '1px solid var(--border)',
              background: '#10B98108',
              direction: isRtl ? 'rtl' : 'ltr',
            }}>
              <span style={{
                fontFamily,
                fontSize: 11,
                color: '#10B981',
                fontWeight: 600,
              }}>
                {wave.result[lang]}
              </span>
            </div>
          </div>
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        marginTop: 8,
        display: 'flex',
        gap: 14,
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        {Object.entries(agentColors).map(([name, { color }]) => (
          <div key={name} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: color,
            }} />
            <span style={{
              fontFamily: 'var(--font-code)',
              fontSize: 9,
              color: '#4A7C59',
              textTransform: 'capitalize',
            }}>
              {name}
            </span>
          </div>
        ))}
      </div>
      </div>
      )}
    </div>
  )
}