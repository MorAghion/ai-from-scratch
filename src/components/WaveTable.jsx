import { useLang } from '../App'

const agentColors = {
  architect: { color: '#3B82F6', emoji: '' },
  frontend: { color: '#D946EF', emoji: '' },
  backend: { color: '#06B6D4', emoji: '' },
  qa: { color: '#10B981', emoji: '' },
}

const waves = [
  {
    name: 'Wave 1',
    date: '22.2',
    tasks: [
      { id: 'arch-001', name: { he: 'סכמת vouchers', en: 'Vouchers schema' }, agent: 'architect' },
      { id: 'qa-001', name: { he: 'תשתית טסטים', en: 'Test infrastructure' }, agent: 'qa' },
      { id: 'fe-007', name: { he: 'אודיט responsive', en: 'Responsive audit' }, agent: 'frontend' },
    ],
    result: { he: '3 משימות במקביל, 2:45 שעות', en: '3 tasks in parallel, 2:45 hours' },
  },
  {
    name: 'Wave 8',
    date: '25.2',
    tasks: [
      { id: 'fe-bug-017', name: { he: 'אודיט i18n', en: 'i18n audit' }, agent: 'frontend' },
      { id: 'fe-bug-018', name: { he: 'תיקון הקשר עברית', en: 'Hebrew context fix' }, agent: 'frontend' },
      { id: 'fe-bug-019', name: { he: 'תיקון autoCategorize', en: 'autoCategorize fix' }, agent: 'frontend' },
      { id: 'qa-010', name: { he: 'טסטים TDD ל-i18n', en: 'TDD tests for i18n' }, agent: 'qa' },
      { id: 'qa-011', name: { he: 'טסטים TDD להקשר', en: 'TDD tests for context' }, agent: 'qa' },
      { id: 'qa-012', name: { he: 'טסטים TDD לקטגוריות', en: 'TDD tests for categories' }, agent: 'qa' },
    ],
    result: { he: '6 משימות במקביל, 58 קומיטים, 6 PRs — יום אחד', en: '6 tasks in parallel, 58 commits, 6 PRs — one day' },
  },
  {
    name: 'Wave 9',
    date: '25.2',
    tasks: [
      { id: 'be-002', name: { he: 'PWA — manifest, service worker', en: 'PWA — manifest, service worker' }, agent: 'backend' },
      { id: 'qa-013', name: { he: 'טסטים TDD ל-PWA', en: 'TDD tests for PWA' }, agent: 'qa' },
    ],
    result: { he: 'PWA חי, 400 טסטים עוברים', en: 'PWA live, 400 tests passing' },
  },
]

export default function WaveTable() {
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {waves.map(wave => (
          <div key={wave.name} style={{
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
                color: 'var(--text-soft)',
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
              color: 'var(--text-soft)',
              textTransform: 'capitalize',
            }}>
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}