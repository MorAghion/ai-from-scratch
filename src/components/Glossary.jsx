import { useState } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { useLang } from '../App'
export default function Glossary({ chapters, onNavigateToChapter }) {
  const { lang } = useLang()
  const [search, setSearch] = useState('')

  // Collect all terms from all chapters with their source chapter info
  const allTerms = []
  chapters.forEach((ch, chapterIndex) => {
    if (ch.terms && ch.terms[lang]) {
      ch.terms[lang].forEach(t => {
        allTerms.push({
          ...t,
          chapterTitle: ch.title[lang] || ch.title.he,
          chapterIndex,
        })
      })
    }
  })

  // Sort alphabetically by term name
  allTerms.sort((a, b) => a.term.localeCompare(b.term))

  // Filter by search query (matches term, full name, or definition)
  const q = search.trim().toLowerCase()
  const filtered = q
    ? allTerms.filter(t =>
        t.term.toLowerCase().includes(q) ||
        (t.full && t.full.toLowerCase().includes(q)) ||
        (t.definition && t.definition.toLowerCase().includes(q))
      )
    : allTerms

  return (
    <div style={{ maxWidth: 720, paddingTop: 24, paddingBottom: 80 }}>
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 32,
        fontWeight: 700,
        color: 'var(--heading)',
        marginBottom: 8,
      }}>
        {lang === 'he' ? 'מילון מונחים' : 'Glossary'}
      </h1>
      <p style={{
        fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
        fontSize: 14,
        color: 'var(--text-soft)',
        marginBottom: 16,
      }}>
        {lang === 'he'
          ? `${allTerms.length} מונחים מכל הפרקים`
          : `${allTerms.length} terms across all chapters`
        }
      </p>

      {/* Search box */}
      <div style={{
        position: 'relative',
        marginBottom: 24,
      }}>
        <MagnifyingGlass
          size={16}
          weight="bold"
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-soft)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={lang === 'he' ? 'חיפוש מונח...' : 'Search terms...'}
          dir="rtl"
          style={{
            width: '100%',
            padding: '10px 36px 10px 14px',
            fontSize: 14,
            fontFamily: 'var(--font-code)',
            color: 'var(--text)',
            backgroundColor: 'var(--term-bg)',
            border: '1px solid var(--term-border)',
            borderRadius: 8,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <p style={{
          fontFamily: 'var(--font-code)',
          fontSize: 13,
          color: 'var(--text-soft)',
          fontStyle: 'italic',
          textAlign: 'center',
          padding: '32px 0',
        }}>
          {q
            ? (lang === 'he' ? 'לא נמצאו תוצאות' : 'No results found')
            : (lang === 'he' ? 'מונחים יתווספו בקרוב' : 'Terms coming soon')
          }
        </p>
      ) : (
        filtered.map((t, i) => (
          <div key={i} style={{
            padding: '16px 20px',
            backgroundColor: 'var(--term-bg)',
            border: '1px solid var(--term-border)',
            borderRadius: 10,
            marginBottom: 12,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 8,
              marginBottom: 6,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: 15,
                  fontWeight: 700,
                  color: 'var(--accent)',
                }}>
                  {t.term}
                </span>
                {t.full && (
                  <span style={{
                    fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
                    fontSize: 13,
                    color: 'var(--text-soft)',
                  }}>
                    {t.full}
                  </span>
                )}
              </div>
              <button
                onClick={() => onNavigateToChapter(t.chapterIndex, 'terms')}
                style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: 11,
                  color: 'var(--accent)',
                  background: 'var(--accent-soft)',
                  border: 'none',
                  borderRadius: 4,
                  padding: '2px 8px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {t.chapterTitle}
              </button>
            </div>
            <p style={{
              fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
              fontSize: 14,
              lineHeight: 1.7,
              color: 'var(--text)',
              margin: 0,
            }}>
              {t.definition}
            </p>
          </div>
        ))
      )}
    </div>
  )
}
