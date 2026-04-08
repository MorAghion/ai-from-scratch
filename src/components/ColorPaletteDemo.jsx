import { useLang } from '../App'

const palettes = [
  {
    name: 'A — Warm Earthy',
    colors: [
      { label: 'AgentsTable', color: '#C2652A' },
      { label: 'TaskJson', color: '#B8A547' },
      { label: 'WaveTable', color: '#4A7C59' },
      { label: 'Board', color: '#4A6B8A' },
      { label: 'Handoff', color: '#9B4F96' },
    ],
  },
  {
    name: 'B — Cool Dev',
    colors: [
      { label: 'AgentsTable', color: '#3B82F6' },
      { label: 'TaskJson', color: '#8B5CF6' },
      { label: 'WaveTable', color: '#06B6D4' },
      { label: 'Board', color: '#10B981' },
      { label: 'Handoff', color: '#F59E0B' },
    ],
  },
  {
    name: 'C — Muted Tones',
    colors: [
      { label: 'AgentsTable', color: '#7C6D8A' },
      { label: 'TaskJson', color: '#6B8A6D' },
      { label: 'WaveTable', color: '#4A7C8A' },
      { label: 'Board', color: '#8A6B4A' },
      { label: 'Handoff', color: '#8A4A6B' },
    ],
  },
]

export default function ColorPaletteDemo() {
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, margin: '12px 0', direction: isRtl ? 'rtl' : 'ltr' }}>
      {palettes.map(palette => (
        <div key={palette.name}>
          <div style={{ fontFamily, fontSize: 12, fontWeight: 700, color: 'var(--text-soft)', marginBottom: 8 }}>
            {palette.name}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {palette.colors.map(({ label, color }) => (
              <div key={label} style={{
                border: `1.5px solid ${color}`,
                borderRadius: 10,
                overflow: 'hidden',
                minWidth: 120,
                flex: '1 1 120px',
              }}>
                {/* Simulated deepdive header */}
                <div style={{
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0
                  }} />
                  <span style={{ fontFamily: 'var(--font-code)', fontSize: 11, color, fontWeight: 600 }}>
                    {label}
                  </span>
                  <span style={{ marginInlineStart: 'auto', fontSize: 10, color, opacity: 0.5 }}>▼</span>
                </div>
                {/* Color swatch */}
                <div style={{ height: 6, background: color, opacity: 0.15 }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
