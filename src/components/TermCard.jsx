import { useLang } from '../App'

export default function TermCard({ term, full, definition, section, onNavigateToSection }) {
  const { lang } = useLang()

  return (
    <div style={{
      padding: '16px 20px',
      backgroundColor: 'var(--term-bg)',
      border: '1px solid var(--term-border)',
      borderRadius: 10,
      marginBottom: 12,
      cursor: section && onNavigateToSection ? 'pointer' : undefined,
    }}
      onClick={section && onNavigateToSection ? () => onNavigateToSection(section) : undefined}
    >
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 6,
      }}>
        <span style={{
          fontFamily: 'var(--font-code)',
          fontSize: 15,
          fontWeight: 700,
          color: 'var(--accent)',
        }}>
          {term}
        </span>
        {full && (
          <span style={{
            fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
            fontSize: 13,
            color: 'var(--text-soft)',
          }}>
            {full}
          </span>
        )}
      </div>
      <p style={{
        fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
        fontSize: 14,
        lineHeight: 1.7,
        color: 'var(--text)',
        margin: 0,
      }}>
        {definition}
      </p>
    </div>
  )
}
