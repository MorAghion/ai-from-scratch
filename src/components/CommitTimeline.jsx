import { useLang } from '../App'

const phases = [
  {
    key: 'vibing',
    label: { he: 'Just Vibing', en: 'Just Vibing' },
    dates: { he: '10-18 בפברואר', en: 'Feb 10-18' },
    color: '#F59E0B',
    stats: [
      { value: '61', label: { he: 'קומיטים', en: 'commits' } },
      { value: '0', label: { he: 'PRs', en: 'PRs' }, warn: true },
      { value: '0', label: { he: 'טסטים', en: 'tests' }, warn: true },
      { value: '8', label: { he: 'ימים', en: 'days' } },
    ],
  },
  {
    key: 'pause',
    label: { he: 'ההפסקה', en: 'The Pause' },
    dates: { he: '18-22 בפברואר', en: 'Feb 18-22' },
    color: '#874B7D',
    isPause: true,
    stats: [
      { value: 'PRD', label: { he: 'מסמך דרישות', en: 'requirements doc' } },
      { value: 'CLAUDE.md', label: { he: 'הוראות לסוכן', en: 'agent instructions' } },
      { value: 'BOARD.md', label: { he: 'לוח משימות', en: 'task board' } },
    ],
  },
  {
    key: 'structured',
    label: { he: 'שלב מובנה', en: 'Structured Phase' },
    dates: { he: '22 בפברואר — 2 במרץ', en: 'Feb 22 — Mar 2' },
    color: '#10B981',
    stats: [
      { value: '154', label: { he: 'קומיטים', en: 'commits' } },
      { value: '40+', label: { he: 'PRs', en: 'PRs' } },
      { value: '400+', label: { he: 'טסטים', en: 'tests' } },
      { value: '10', label: { he: 'ימים', en: 'days' } },
    ],
  },
]

export default function CommitTimeline() {
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        {phases.map(phase => (
          <div key={phase.key} style={{
            borderRadius: 10,
            border: `1px solid ${phase.color}30`,
            overflow: 'hidden',
          }}>
            {/* Phase header */}
            <div style={{
              padding: '8px 14px',
              background: `${phase.color}12`,
              borderBottom: `1px solid ${phase.color}20`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              direction: isRtl ? 'rtl' : 'ltr',
            }}>
              <span style={{
                fontFamily,
                fontSize: 13,
                fontWeight: 700,
                color: phase.color,
              }}>
                {phase.label[lang]}
              </span>
              <span style={{
                fontFamily: 'var(--font-code)',
                fontSize: 10,
                color: phase.color,
                opacity: 0.8,
              }}>
                {phase.dates[lang]}
              </span>
            </div>

            {/* Stats */}
            <div style={{
              padding: '10px 14px',
              display: 'flex',
              gap: phase.isPause ? 8 : 16,
              flexWrap: 'wrap',
              direction: isRtl ? 'rtl' : 'ltr',
            }}>
              {phase.stats.map((stat, i) => (
                <div key={i} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: phase.isPause ? 80 : 50,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: phase.isPause ? 11 : 18,
                    fontWeight: 700,
                    color: stat.warn ? '#EF4444' : phase.color,
                  }}>
                    {stat.value}
                  </span>
                  <span style={{
                    fontFamily,
                    fontSize: 10,
                    color: 'var(--text-soft)',
                    textAlign: 'center',
                  }}>
                    {stat.label[lang]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}