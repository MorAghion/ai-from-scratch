import { useLang } from '../App'
import { ChartBar } from '@phosphor-icons/react'

export default function YeggeCallout({ children }) {
  const { lang } = useLang()

  return (
    <div style={{
      background: '#3D8B800C',
      borderRight: lang === 'he' ? '3px solid #3D8B80' : 'none',
      borderLeft: lang === 'he' ? 'none' : '3px solid #3D8B80',
      borderRadius: 8,
      padding: '14px 18px',
      margin: '16px 0',
    }}>
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 13,
        fontWeight: 600,
        color: '#3D8B80',
        marginBottom: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        direction: lang === 'he' ? 'rtl' : 'ltr',
      }}>
        <ChartBar size={16} weight="duotone" />
        {lang === 'he' ? 'איפה אנחנו בדיאגרמה של ייגי?' : "Where are we in Yegge's diagram?"}
      </div>
      <div style={{
        fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
        fontSize: 14,
        color: 'var(--text-soft)',
        lineHeight: 1.6,
        direction: lang === 'he' ? 'rtl' : 'ltr',
        textAlign: lang === 'he' ? 'right' : 'left',
      }}>
        {children}
      </div>
    </div>
  )
}
