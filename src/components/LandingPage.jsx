import { useState } from 'react'
import { useLang, useTheme } from '../App'
import { notebooks, notebookOrder } from '../data/notebooks'
import { getNotebookChapters } from '../data/chapters'
import ChapterIcon from './ChapterIcon'
import FloatingNodes from './FloatingNodes'

const buzzwords = [
  { text: 'LLM', color: '#C2652A' },
  { text: 'RAG', color: '#3D8B80' },
  { text: 'Transformer', color: '#9B4F96' },
  { text: 'Fine-Tuning', color: '#3D8B80' },
  { text: 'Embeddings', color: '#C2652A' },
  { text: 'Attention', color: '#9B4F96' },
  { text: 'Tokens', color: '#3D8B80' },
  { text: 'Vector DB', color: '#C2652A' },
  { text: 'MCP', color: '#9B4F96' },
  { text: 'Agentic Loop', color: '#3D8B80' },
  { text: 'Backpropagation', color: '#C2652A' },
  { text: 'Neural Network', color: '#9B4F96' },
]

export default function LandingPage({ onSelectNotebook }) {
  const { lang, dir } = useLang()
  const { themeId } = useTheme()
  const isDusk = themeId === 'dusk'
  const [showBuzz, setShowBuzz] = useState(false)

  return (
    <div className="landing-page" style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '40px 20px 20px',
      direction: dir,
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'auto',
    }}>
      {/* Pastel NN background image */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        <img
          src="/images/Gemini_Generated_Image_cpnpo3cpnpo3cpnp.jpg"
          alt=""
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            transform: 'scaleX(-1)',
            opacity: 0.3,
          }}
        />
      </div>
      {/* Animated NN overlay */}
      <FloatingNodes nnOnly />
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(28px, 5vw, 42px)',
        color: 'var(--heading)',
        marginBottom: 8,
        textAlign: 'center',
      }}>
        AI, מההתחלה
      </h1>
      {/* <h2 style={{
        position: 'relative', zIndex: 1,
        fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-heading)',
        fontSize: 'clamp(16px, 3vw, 20px)',
        color: 'var(--heading)',
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 500,
        letterSpacing: '0.02em',
      }}>
        {lang === 'he'
          ? 'המסע שלי לעולם הבינה המלאכותית'
          : 'An interactive learning notebook built from scratch'}
      </h2> */}
      {/* Fade-edge gradient divider with shimmer on mobile */}
      <div className="mobile-divider-shimmer" style={{
        position: 'relative', zIndex: 1,
        minHeight: 3,
        height: 3,
        width: 120,
        flexShrink: 0,
        margin: '4px 0 14px',
        borderRadius: 3,
        background: 'linear-gradient(90deg, transparent, #3D8B80, #9B4F96, transparent)',
        overflow: 'hidden',
      }} />
      <div style={{
        fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
        fontSize: 'clamp(15px, 2.5vw, 17px)',
        color: isDusk ? 'var(--text)' : 'var(--text-soft)',
        fontWeight: 600,
        marginBottom: 12,
        textAlign: 'center',
        maxWidth: 600,
        lineHeight: 1.55,
        letterSpacing: '0.02em',
        position: 'relative', zIndex: 1,
      }}>
        {lang === 'he' ? (<>
          <p style={{ marginBottom: 6, fontSize: 'clamp(17px, 3vw, 20px)' }}>אם אתם אנשי תוכנה, בעלי רקע טכנולוגי או פשוט סקרנים טכנולוגית לגבי עולם <span style={{ whiteSpace: 'nowrap' }}>ה-AI,</span></p>
          <p style={{ marginBottom: 12 }}>יש סיכוי שגם אתם קצת מוצפים מכל ההייפ ו<span
            style={{ display: 'inline' }}
            onClick={() => setShowBuzz(v => !v)}
            onMouseEnter={() => setShowBuzz(true)}
            onMouseLeave={() => setShowBuzz(false)}
          >
            <span style={{ borderBottom: '1px dashed var(--accent)', cursor: 'default' }}>המונחים החדשים</span>
            {showBuzz && (
              <span className="buzzword-tooltip" style={{
                position: 'absolute',
                top: -40,
                left: -296,
                background: 'transparent',
                border: 'none',
                borderRadius: 12,
                padding: '14px 18px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                width: 280,
                justifyContent: 'center',
                zIndex: 10,
                direction: 'ltr',
              }}>
                {buzzwords.map(b => (
                  <span key={b.text} style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: 11,
                    fontWeight: 600,
                    color: b.color,
                    background: `${b.color}15`,
                    padding: '3px 8px',
                    borderRadius: 6,
                    whiteSpace: 'nowrap',
                  }}>{b.text}</span>
                ))}
              </span>
            )}
          </span>.</p>
          <p>המדריכים כאן נועדו לעשות סדר, להסביר את הדברים בצורה ברורה ולהוביל אתכם צעד-אחר-צעד, מהבנה תיאורטית ועד בניה בעצמכם.</p>
        </>) : 'An interactive guide from neural networks to AI agents, with animations, exercises, and a glossary.'}
      </div>
      <p style={{
        position: 'relative', zIndex: 1,
        fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
        fontSize: 'clamp(13px, 2vw, 15px)',
        color: '#C2652A',
        marginBottom: 36,
        textAlign: 'center',
        fontWeight: 600,
        fontStyle: 'italic',
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
      }}>
        {lang === 'he'
          ? 'המסע שלכם לעולם ה-AI יכול להתחיל כאן. ברוכים הבאים!'
          : 'Your AI journey starts here. Welcome!'}
      </p>

      {/* Notebook cards */}
      <div className="notebook-cards" style={{
        position: 'relative', zIndex: 1,
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
              onClick={() => onSelectNotebook(nb.id)}
              className="notebook-card"
              style={{
                flex: '1 1 280px',
                maxWidth: 320,
                padding: '28px 24px',
                borderRadius: 16,
                border: `2px solid ${nb.color}22`,
                background: 'var(--surface)',
                cursor: 'pointer',
                textAlign: 'center',
                direction: dir,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = nb.color
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = `0 8px 24px ${nb.color}15`
              }}
              onMouseLeave={e => {
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
                <h2 style={{
                  fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-heading)',
                  fontSize: 'clamp(18px, 3vw, 22px)',
                  fontWeight: 700,
                  color: 'var(--heading)',
                }}>
                  {nb.title[lang]}
                </h2>
                {nb.teaserCount && (
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
                fontSize: 15,
                color: 'var(--text-soft)',
                lineHeight: 1.6,
                marginBottom: 16,
                flex: 1,
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
