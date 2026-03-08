import { useLang } from '../App'
import { notebooks, notebookOrder } from '../data/notebooks'
import { getNotebookChapters } from '../data/chapters'
import ChapterIcon from './ChapterIcon'

export default function LandingPage({ onSelectNotebook }) {
  const { lang, dir } = useLang()

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      direction: dir,
    }}>
      {/* Title */}
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(28px, 5vw, 42px)',
        color: 'var(--heading)',
        marginBottom: 8,
        textAlign: 'center',
      }}>
        AI From Scratch
      </h1>
      <p style={{
        fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
        fontSize: 'clamp(14px, 2.5vw, 18px)',
        color: 'var(--text-soft)',
        marginBottom: 48,
        textAlign: 'center',
        maxWidth: 500,
        lineHeight: 1.6,
      }}>
        {lang === 'he'
          ? 'בחרו מחברת כדי להתחיל ללמוד'
          : 'Choose a notebook to start learning'}
      </p>

      {/* Notebook cards */}
      <div className="notebook-cards" style={{
        display: 'flex',
        gap: 24,
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: 700,
        width: '100%',
      }}>
        {notebookOrder.map(nbId => {
          const nb = notebooks[nbId]
          const chapterCount = getNotebookChapters(nb).length
          return (
            <button
              key={nb.id}
              onClick={() => !nb.comingSoon && onSelectNotebook(nb.id)}
              className="notebook-card"
              disabled={nb.comingSoon}
              style={{
                flex: '1 1 280px',
                maxWidth: 320,
                padding: '28px 24px',
                borderRadius: 16,
                border: `2px solid ${nb.color}22`,
                background: 'var(--surface)',
                cursor: nb.comingSoon ? 'default' : 'pointer',
                textAlign: lang === 'he' ? 'right' : 'left',
                direction: dir,
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
                opacity: nb.comingSoon ? 0.6 : 1,
              }}
              onMouseEnter={e => {
                if (nb.comingSoon) return
                e.currentTarget.style.borderColor = nb.color
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = `0 8px 24px ${nb.color}15`
              }}
              onMouseLeave={e => {
                if (nb.comingSoon) return
                e.currentTarget.style.borderColor = `${nb.color}22`
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Icon */}
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: `${nb.color}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <ChapterIcon name={nb.icon} color={nb.color} size={28} />
              </div>

              {/* Title + badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h2 style={{
                  fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-heading)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--heading)',
                }}>
                  {nb.title[lang]}
                </h2>
                {nb.comingSoon && (
                  <span style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: 10,
                    fontWeight: 600,
                    color: nb.color,
                    background: `${nb.color}15`,
                    padding: '3px 8px',
                    borderRadius: 6,
                    whiteSpace: 'nowrap',
                  }}>
                    {lang === 'he' ? 'בקרוב' : 'Coming Soon'}
                  </span>
                )}
              </div>

              {/* Subtitle */}
              <p style={{
                fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
                fontSize: 14,
                color: 'var(--text-soft)',
                lineHeight: 1.5,
                marginBottom: 16,
              }}>
                {nb.subtitle[lang]}
              </p>

              {/* Chapter count */}
              <div style={{
                fontFamily: 'var(--font-code)',
                fontSize: 12,
                color: nb.color,
                fontWeight: 500,
              }}>
                {chapterCount} {lang === 'he' ? 'פרקים' : 'chapters'}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
