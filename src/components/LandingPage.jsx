import { useState } from 'react'
import { useLang, useTheme } from '../App'
import { notebooks, notebookOrder } from '../data/notebooks'
import { getNotebookChapters } from '../data/chapters'
import ChapterIcon from './ChapterIcon'

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
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '40px 20px 80px',
      direction: dir,
      position: 'relative',
      position: 'relative',
    }}>
      {/* Watercolor background */}
      <img
        src="/images/watercolor.jpg"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 20%',
          opacity: 0.3,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
      <h1 style={{
        position: 'relative', zIndex: 1,
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(28px, 5vw, 42px)',
        color: 'var(--heading)',
        marginBottom: 8,
        textAlign: 'center',
      }}>
        AI, מההתחלה
      </h1>
      <h2 style={{
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
      </h2>
      {/* Fade-edge gradient divider */}
      <div style={{
        position: 'relative', zIndex: 1,
        height: 2,
        width: 120,
        margin: '0 auto 14px',
        borderRadius: 2,
        background: 'linear-gradient(90deg, transparent, #3D8B80, #9B4F96, transparent)',
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
          <p style={{ marginBottom: 12 }}>אם אתם אנשי תוכנה, בעלי רקע טכנולוגי או פשוט סקרנים טכנולוגית לגבי עולם <span style={{ whiteSpace: 'nowrap' }}>ה-AI,</span> יש סיכוי שגם אתם קצת מוצפים מכל ההייפ ו<span
            style={{ display: 'inline' }}
            onClick={() => setShowBuzz(v => !v)}
            onMouseEnter={() => setShowBuzz(true)}
            onMouseLeave={() => setShowBuzz(false)}
          >
            <span style={{ borderBottom: '1px dashed var(--accent)', cursor: 'default' }}>המונחים החדשים</span>
            {showBuzz && (
              <span style={{
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
                textAlign: 'center',
                direction: dir,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
                opacity: nb.comingSoon ? 0.7 : 1,
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
                <h2 style={{
                  fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-heading)',
                  fontSize: 'clamp(18px, 3vw, 22px)',
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

      {/* Author — bottom */}
      <div style={{
        marginTop: 'auto',
        paddingTop: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        position: 'relative',
        zIndex: 1,
      }}>
        <img
          src="/images/profile.jpeg"
          alt="Mor Aghion"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid var(--border)',
          }}
        />
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--text-soft)',
        }}>
          Mor Aghion
        </span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="https://www.linkedin.com/in/mor-aghion-88aa37179/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            style={{ color: 'var(--text-soft)', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#0A66C2'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-soft)'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="https://github.com/MorAghion" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
            style={{ color: 'var(--text-soft)', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#333'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-soft)'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
          </a>
          {/* Email — anti-scrape: assembled at click time, never in HTML source */}
          <a href="#" onClick={e => { e.preventDefault(); const p = ['magh19', '.dev@', 'gmail', '.com']; window.location.href = 'mailto:' + p.join('') }} aria-label="Email"
            style={{ color: 'var(--text-soft)', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#EA4335'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-soft)'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
          </a>
        </div>
      </div>
    </div>
  )
}
