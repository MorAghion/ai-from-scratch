import { useState } from 'react'
import { useLang } from '../App'
import { MonitorPlay, Barbell, Flask, Ruler, Wrench } from '@phosphor-icons/react'

const bubbleConfig = {
  video: {
    Icon: MonitorPlay,
    label: { he: 'מה שעזר לי להבין את זה', en: 'What helped me understand this' },
    colorVar: '--bubble-video',
    bgVar: '--bubble-video-bg',
  },
  exercise: {
    Icon: Barbell,
    label: { he: 'נסו בעצמכם', en: 'Try it yourself' },
    colorVar: '--bubble-exercise',
    bgVar: '--bubble-exercise-bg',
  },
  deepDive: {
    Icon: Flask,
    label: { he: 'להעמקה', en: 'Technical Details' },
    colorVar: '--bubble-deep-dive',
    bgVar: '--bubble-deep-dive-bg',
  },
  detail: {
    Icon: Ruler,
    label: { he: 'פרט טכני', en: 'Technical Detail' },
    colorVar: '--text-soft',
    bgVar: '--surface',
  },
  setup: {
    Icon: Wrench,
    label: { he: 'התקנה (פעם אחת)', en: 'Setup (one time)' },
    colorVar: '--text-soft',
    bgVar: '--surface',
  },
}

export default function CollapsibleBubble({ type, label: customLabel, children }) {
  const [open, setOpen] = useState(false)
  const { lang } = useLang()
  const config = bubbleConfig[type]

  if (!config) return null

  const { Icon } = config

  return (
    <div style={{
      border: `1.5px solid ${open ? `var(${config.colorVar})` : 'var(--border)'}`,
      borderRadius: 10,
      overflow: 'hidden',
      transition: 'border-color 0.2s ease',
      marginBottom: 16,
    }}>
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '12px 16px',
          border: 'none',
          background: open ? `var(${config.bgVar})` : 'transparent',
          cursor: 'pointer',
          fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
          fontSize: 14,
          fontWeight: 600,
          color: `var(${config.colorVar})`,
          direction: lang === 'he' ? 'rtl' : 'ltr',
          textAlign: lang === 'he' ? 'right' : 'left',
          transition: 'background-color 0.2s ease',
        }}
      >
        <Icon size={18} weight="duotone" />
        <span style={{ flex: 1 }}>{customLabel || config.label[lang]}</span>
        <span style={{
          fontSize: 12,
          transition: 'transform 0.2s ease',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          opacity: 0.6,
        }}>
          ▼
        </span>
      </button>

      {/* Content — collapsible */}
      {open && (
        <div style={{
          padding: '12px 16px 16px',
          backgroundColor: `var(${config.bgVar})`,
          borderTop: `1px solid var(--border)`,
        }}>
          {children}
        </div>
      )}
    </div>
  )
}
