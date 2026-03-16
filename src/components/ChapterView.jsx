import { useState, useEffect } from 'react'
import { MagicWand, Heart } from '@phosphor-icons/react'
import { useLang } from '../App'
import CollapsibleBubble from './CollapsibleBubble'
import ChapterIcon from './ChapterIcon'
import TermCard from './TermCard'
import DetectiveExercise from './DetectiveExercise'
import NeuralNetworkAnimation from './NeuralNetworkAnimation'
import LearningAnimation from './LearningAnimation'
import AttentionAnimation from './AttentionAnimation'
import AgentLoopAnimation from './AgentLoopAnimation'
import AgentShowcase from './AgentShowcase'
import TradeoffTable from './TradeoffTable'
import ContextWindowDiagram from './ContextWindowDiagram'
import EmbeddingTable from './EmbeddingTable'
import SemanticSpaceDiagram from './SemanticSpaceDiagram'
import ANNClusterDiagram from './ANNClusterDiagram'
import WordVectorArithmetic from './WordVectorArithmetic'
import VectorDBPipeline from './VectorDBPipeline'
import CosineSimilarityDiagram from './CosineSimilarityDiagram'
import RAGPipelineDiagram from './RAGPipelineDiagram'
import ChunkSizeTradeoff from './ChunkSizeTradeoff'
import APIRequestDiagram from './APIRequestDiagram'
import YeggeFigures, { YeggeFiguresEpilogue } from './YeggeFigures'
import MCPArchitectureDiagram from './MCPArchitectureDiagram'
import RestaurantAPIDiagram from './RestaurantAPIDiagram'
import YeggeCallout from './YeggeCallout'
import AgentFileView from './AgentFileView'
import BeforeAfterTable from './BeforeAfterTable'
import PricingTable from './PricingTable'
import VibingDays from './VibingDays'
import CostBreakdown from './CostBreakdown'
import CommitTimeline from './CommitTimeline'
import WaveTable from './WaveTable'

// Registry of embeddable components (referenced via @@component:Name in .txt files)
const componentRegistry = {
  NeuralNetworkAnimation,
  LearningAnimation,
  AttentionAnimation,
  AgentLoopAnimation,
  AgentShowcase,
  TradeoffTable,
  ContextWindowDiagram,
  EmbeddingTable,
  SemanticSpaceDiagram,
  ANNClusterDiagram,
  WordVectorArithmetic,
  VectorDBPipeline,
  CosineSimilarityDiagram,
  RAGPipelineDiagram,
  ChunkSizeTradeoff,
  APIRequestDiagram,
  YeggeFigures,
  YeggeFiguresEpilogue,
  MCPArchitectureDiagram,
  RestaurantAPIDiagram,
  AgentFileView,
  BeforeAfterTable,
  PricingTable,
  VibingDays,
  CostBreakdown,
  CommitTimeline,
  WaveTable,
}

// Generate a stable slug from heading text (supports Hebrew + English)
function headingSlug(text) {
  return text.replace(/[^\w\u0590-\u05FF\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-{2,}/g, '-').toLowerCase()
}

// Split text into regular paragraphs and fenced code blocks
function splitCodeBlocks(text) {
  const parts = []
  const regex = /```\w*\n([\s\S]*?)```/g
  let lastIdx = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    const before = text.substring(lastIdx, match.index).trim()
    if (before) parts.push({ type: 'text', content: before })
    parts.push({ type: 'code', content: match[1].trimEnd() })
    lastIdx = match.index + match[0].length
  }
  const after = text.substring(lastIdx).trim()
  if (after) parts.push({ type: 'text', content: after })
  return parts
}

// Render text with inline **bold**, [text](url) external links, [text](#chapter:id:section) internal links, and [text](#tab:tabId) tab links
function renderTextWithLinks(text, onNavigate, onTabSwitch) {
  const inlineIconMap = { MagicWand, Heart }
  const inlineRegex = /@@ltr:([^@]+)@@|::icon:(\w+)::|{(#[0-9a-fA-F]{6}):([^}]+)\}|{big:([^}]+)\}|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\((https?:\/\/[^)]+)\)|\[([^\]]+)\]\(#chapter:([^):]+)(?::([^)]+))?\)|\[([^\]]+)\]\(#tab:([^)]+)\)/g
  const parts = []
  let lastIdx = 0
  let match
  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIdx) parts.push(text.substring(lastIdx, match.index))
    if (match[1]) {
      // @@ltr:text@@ — force LTR direction for embedded English in RTL paragraphs
      parts.push(<span key={match.index} dir="ltr" style={{ display: 'inline-block', unicodeBidi: 'bidi-override' }}>{renderTextWithLinks(match[1], onNavigate, onTabSwitch)}</span>)
    } else if (match[2]) {
      // ::icon:Name:: — inline Phosphor icon
      const Icon = inlineIconMap[match[2]]
      if (Icon) parts.push(<Icon key={match.index} size={18} weight="duotone" style={{ verticalAlign: 'middle', marginInline: 2 }} />)
    } else if (match[3] && match[4]) {
      // {#color:text} — colored inline text
      parts.push(<span key={match.index} style={{ color: match[3], fontWeight: 700 }}>{match[4]}</span>)
    } else if (match[5]) {
      // {big:text} — slightly larger inline text
      parts.push(<span key={match.index} style={{ fontSize: '1.15em', fontWeight: 600, color: 'var(--heading)' }}>{match[5]}</span>)
    } else if (match[6]) {
      // `code` — inline code
      parts.push(<code key={match.index} style={{ fontFamily: 'var(--font-code)', fontSize: '0.9em', background: 'var(--code-bg, #f3f0ea)', padding: '2px 6px', borderRadius: 4, direction: 'ltr', unicodeBidi: 'embed' }}>{match[6]}</code>)
    } else if (match[7]) {
      parts.push(<strong key={match.index} style={{ color: 'var(--heading)', fontWeight: 600 }}>{match[7]}</strong>)
    } else if (match[8]) {
      // *italic* — single asterisk
      parts.push(<em key={match.index} style={{ fontStyle: 'italic' }}>{match[8]}</em>)
    } else if (match[9]) {
      parts.push(
        <a key={match.index} href={match[10]} target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
          {match[9]}
        </a>
      )
    } else if (match[11] && match[12]) {
      const chapterId = match[12]
      const sectionSlug = match[13] || null
      parts.push(
        <a key={match.index} href="#" onClick={(e) => {
          e.preventDefault()
          onNavigate?.(chapterId, sectionSlug)
        }}
          style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>
          {match[11]}
        </a>
      )
    } else if (match[14] && match[15]) {
      // [text](#tab:tabId) — switch tab within current chapter
      const tabId = match[15]
      parts.push(
        <a key={match.index} href="#" onClick={(e) => {
          e.preventDefault()
          onTabSwitch?.(tabId)
          window.scrollTo(0, 0)
        }}
          style={{ color: 'var(--accent)', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}>
          {match[14]}
        </a>
      )
    }
    lastIdx = match.index + match[0].length
  }
  if (lastIdx < text.length) parts.push(text.substring(lastIdx))
  return parts.length > 1 ? parts : text
}


const allTabs = [
  { id: 'content', label: { he: 'תוכן', en: 'Content' } },
  { id: 'brief', label: { he: 'על מדריך זה', en: 'Brief' } },
  { id: 'terms', label: { he: 'מונחים', en: 'Terms' } },
  { id: 'detective', label: { he: 'תרגיל הבלש', en: 'Detective' } },
]

function hasTabContent(ch, tabId, lang) {
  if (tabId === 'content') return true
  if (tabId === 'brief') return ch.brief && ch.brief[lang] && ch.brief[lang].length > 0
  if (tabId === 'terms') return ch.terms && ch.terms[lang] && ch.terms[lang].length > 0
  if (tabId === 'detective') return ch.detective && ch.detective[lang] && ch.detective[lang].length > 0
  return false
}

export default function ChapterView({ chapter, chapterIndex, totalChapters, onPrev, onNext, onNavigate, onNavigateToNotebook }) {
  const { lang, dir } = useLang()
  const ch = chapter
  const visibleTabs = allTabs.filter(tab => hasTabContent(ch, tab.id, lang))
  const [activeTab, setActiveTab] = useState('content')

  // Reset tab and scroll to top when chapter changes
  useEffect(() => {
    setActiveTab('content')
    window.scrollTo(0, 0)
  }, [chapterIndex])

  // Navigate through tabs first, then chapters
  const handleNext = () => {
    const tabIdx = visibleTabs.findIndex(t => t.id === activeTab)
    if (tabIdx < visibleTabs.length - 1) {
      setActiveTab(visibleTabs[tabIdx + 1].id)
      window.scrollTo(0, 0)
    } else {
      onNext()
    }
  }

  const handlePrev = () => {
    const tabIdx = visibleTabs.findIndex(t => t.id === activeTab)
    if (tabIdx > 0) {
      setActiveTab(visibleTabs[tabIdx - 1].id)
      window.scrollTo(0, 0)
    } else {
      onPrev()
    }
  }

  return (
    <article style={{ maxWidth: 720, width: '100%', overflowX: 'hidden' }}>
      {/* Chapter header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8,
        }}>
          <span style={{
            fontFamily: 'var(--font-code)',
            fontSize: 13,
            color: 'var(--accent)',
            fontWeight: 500,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}>
            {chapterIndex === 0
              ? (lang === 'he' ? 'פרולוג' : 'Prologue')
              : chapterIndex === totalChapters - 1
                ? (lang === 'he' ? 'נספח' : 'Appendix')
                : `${lang === 'he' ? 'פרק' : 'Chapter'} ${chapterIndex}`
            }
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(26px, 4vw, 36px)',
          fontWeight: 700,
          color: 'var(--heading)',
          lineHeight: 1.3,
          margin: 0,
        }}>
          <span style={{ marginRight: dir === 'rtl' ? 0 : 10, marginLeft: dir === 'rtl' ? 10 : 0 }}>
            <ChapterIcon name={ch.icon} color={ch.iconColor} size={32} />
          </span>
          {ch.title[lang] || ch.title.he}
        </h1>
      </div>

      {/* Tab switcher */}
      <div style={{
        display: 'flex',
        gap: 0,
        marginBottom: 24,
        borderBottom: '2px solid var(--border)',
      }}>
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -2,
              background: 'transparent',
              fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
              fontSize: 14,
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-soft)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label[lang]}
          </button>
        ))}
      </div>

      {/* === Content Tab === */}
      {activeTab === 'content' && (
        <>
          {/* Hook — personal narrative */}
          {ch.hook && ch.hook[lang] && ch.hook[lang].length > 0 && (
            <div style={{ marginBottom: 28 }}>
              {ch.hook[lang].map((section, i) => {
                if (section.type === 'image') {
                  const isGastown = section.src.includes('gastown')
                  const isTeaser = section.src.includes('teaser')
                  return (
                    <div key={i} style={{ position: 'relative', marginBottom: 20, marginTop: 12 }}>
                      <img src={section.src} alt={section.alt} style={{ width: '100%', borderRadius: isTeaser ? 0 : 10, border: isTeaser ? 'none' : '1px solid var(--border)', background: isTeaser ? 'var(--bg)' : undefined }} />
                      {section.src.includes('claude.png') && (
                        <div style={{
                          position: 'absolute',
                          top: '51%',
                          left: '6%',
                          width: '55%',
                          height: '20%',
                          background: '#141923',
                          pointerEvents: 'none',
                          borderRadius: 2,
                        }} />
                      )}
                      {isGastown && (
                        <span style={{
                          position: 'absolute',
                          top: ch.id === 'epilogue' ? '45%' : '2%',
                          left: ch.id === 'epilogue' ? '7%' : '2%',
                          background: '#EF4444',
                          color: '#fff',
                          fontFamily: 'var(--font-code)',
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 4,
                          whiteSpace: 'nowrap',
                          pointerEvents: 'none',
                        }}>
                          {ch.id === 'epilogue'
                            ? (lang === 'he' ? 'אני כאן ↓' : 'I am here ↓')
                            : (lang === 'he' ? 'התחלתי כאן ↓' : 'I started here ↓')
                          }
                        </span>
                      )}
                      {isGastown && ch.id === 'epilogue' && (
                        <span style={{
                          position: 'absolute',
                          top: '0%',
                          left: '50%',
                          background: '#c36f01',
                          color: '#fff',
                          fontFamily: 'var(--font-code)',
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 4,
                          whiteSpace: 'nowrap',
                          pointerEvents: 'none',
                        }}>
                          {lang === 'he' ? 'אח שלי עדיין כאן חחחחחח ↓' : 'My brother is still here lol ↓'}
                        </span>
                      )}
                    </div>
                  )
                }
                if (section.type === 'component') {
                  const Comp = componentRegistry[section.name]
                  return Comp ? <div key={i} style={{ maxWidth: '100%', overflowX: 'auto' }}><Comp /></div> : null
                }
                if (section.type === 'yegge') {
                  return (
                    <YeggeCallout key={i}>
                      <span style={{ whiteSpace: 'pre-line' }}>
                        {renderTextWithLinks(section.content, onNavigate, setActiveTab)}
                      </span>
                    </YeggeCallout>
                  )
                }
                return (
                  <div key={i} style={{
                    fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
                    fontSize: 16,
                    lineHeight: 1.85,
                    color: 'var(--text)',
                    whiteSpace: 'pre-line',
                  }}>
                    {renderTextWithLinks(section.content, onNavigate, setActiveTab)}
                  </div>
                )
              })}
            </div>
          )}

          {/* Video bubble */}
          {ch.videos && ch.videos.length > 0 && (
            <CollapsibleBubble type="video">
              {ch.videos.map((v, i) => (
                <div key={i} style={{ marginBottom: i < ch.videos.length - 1 ? 16 : 0 }}>
                  {v.note[lang] && (
                    <p style={{
                      fontSize: 14,
                      color: 'var(--text)',
                      fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
                      marginBottom: 8,
                      lineHeight: 1.6,
                    }}>
                      {v.note[lang]}
                    </p>
                  )}
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-code)',
                      fontSize: 13,
                      color: 'var(--accent)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    ↗ {v.title}
                  </a>
                </div>
              ))}
            </CollapsibleBubble>
          )}

          {/* Content sections */}
          {ch.content && ch.content[lang] && ch.content[lang].length > 0 ? (
            <div style={{ marginBottom: 24 }}>
              {ch.content[lang].map((section, i) => {
                if (section.type === 'heading') {
                  return (
                    <h2 key={i} id={`section-${headingSlug(section.content)}`} style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(20px, 3vw, 24px)',
                      fontWeight: 600,
                      color: 'var(--heading)',
                      marginTop: 32,
                      marginBottom: 12,
                      scrollMarginTop: 70,
                    }}>
                      {renderTextWithLinks(section.content, onNavigate, setActiveTab)}
                    </h2>
                  )
                }
                if (section.type === 'image') {
                  return (
                    <div key={i} style={{ marginBottom: 20, marginTop: 12 }}>
                      <img
                        src={section.src}
                        alt={section.alt}
                        style={{
                          width: '100%',
                          borderRadius: 10,
                          border: '1px solid var(--border)',
                        }}
                      />
                    </div>
                  )
                }
                if (section.type === 'component') {
                  const Comp = componentRegistry[section.name]
                  return Comp ? <div key={i} style={{ maxWidth: '100%', overflowX: 'auto' }}><Comp /></div> : null
                }
                const blocks = splitCodeBlocks(section.content)
                return (
                  <div key={i} style={{ marginBottom: 16 }}>
                    {blocks.map((block, j) =>
                      block.type === 'code' ? (
                        <pre key={j} dir="ltr" style={{
                          fontFamily: 'var(--font-code)',
                          fontSize: 13,
                          lineHeight: 1.6,
                          backgroundColor: 'var(--bg)',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          padding: '12px 16px',
                          margin: '12px 0',
                          overflowX: 'auto',
                          whiteSpace: 'pre-wrap',
                          textAlign: 'left',
                          color: 'var(--text)',
                        }}>
                          {block.content}
                        </pre>
                      ) : (
                        <div key={j} style={{
                          fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
                          fontSize: 16,
                          lineHeight: 1.85,
                          color: 'var(--text)',
                          whiteSpace: 'pre-line',
                        }}>
                          {renderTextWithLinks(block.content, onNavigate, setActiveTab)}
                        </div>
                      )
                    )}
                  </div>
                )
              })}
            </div>
          ) : !(ch.hook?.[lang]?.length > 0) ? (
            <div style={{
              padding: '32px 0',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              marginBottom: 24,
            }}>
              <p style={{
                fontFamily: 'var(--font-code)',
                fontSize: 13,
                color: 'var(--text-soft)',
                fontStyle: 'italic',
                textAlign: 'center',
              }}>
                {lang === 'he'
                  ? 'תוכן הפרק ייכנס בקרוב'
                  : 'Chapter content coming soon'
                }
              </p>
            </div>
          ) : null}


        </>
      )}

      {/* === Brief Tab === */}
      {activeTab === 'brief' && (
        <div style={{ marginBottom: 24 }}>
          {ch.brief && ch.brief[lang] && ch.brief[lang].map((section, i) => {
            if (section.type === 'heading') {
              return (
                <h2 key={i} style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 22,
                  fontWeight: 600,
                  color: 'var(--heading)',
                  marginTop: i === 0 ? 0 : 32,
                  marginBottom: 12,
                }}>
                  {renderTextWithLinks(section.content, onNavigate, setActiveTab)}
                </h2>
              )
            }
            if (section.type === 'image') {
              const isGastown = section.src.includes('gastown')
              const isFullWidth = isGastown
              return (
                <div key={i} style={{ position: 'relative', marginBottom: 20, marginTop: 12, textAlign: 'center' }}>
                  <img
                    src={section.src}
                    alt={section.alt}
                    style={{
                      width: isFullWidth ? '100%' : undefined,
                      maxWidth: isFullWidth ? undefined : 320,
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                    }}
                  />
                  {isGastown && (
                    <div style={{
                      position: 'absolute',
                      top: '18%',
                      left: '6%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      pointerEvents: 'none',
                    }}>
                      <span style={{
                        background: '#EF4444',
                        color: '#fff',
                        fontFamily: 'var(--font-code)',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 4,
                        whiteSpace: 'nowrap',
                      }}>
                        {lang === 'he' ? 'התחלתי כאן' : 'I started here'} ↓
                      </span>
                    </div>
                  )}
                </div>
              )
            }
            if (section.type === 'component') {
              const Comp = componentRegistry[section.name]
              return Comp ? <div key={i} style={{ maxWidth: '100%', overflowX: 'auto' }}><Comp /></div> : null
            }
            if (!section.content) return null
            const blocks = splitCodeBlocks(section.content)
            return (
              <div key={i} style={{ marginBottom: 16 }}>
                {blocks.map((block, j) =>
                  block.type === 'code' ? (
                    <pre key={j} dir="ltr" style={{
                      fontFamily: 'var(--font-code)',
                      fontSize: 13,
                      lineHeight: 1.6,
                      backgroundColor: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      padding: '12px 16px',
                      margin: '12px 0',
                      overflowX: 'auto',
                      whiteSpace: 'pre-wrap',
                      textAlign: 'left',
                      color: 'var(--text)',
                    }}>
                      {block.content}
                    </pre>
                  ) : (
                    <div key={j} style={{
                      fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
                      fontSize: 15,
                      lineHeight: 1.85,
                      color: 'var(--text)',
                      whiteSpace: 'pre-line',
                    }}>
                      {renderTextWithLinks(block.content, onNavigate, setActiveTab)}
                    </div>
                  )
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* === Terms Tab === */}
      {activeTab === 'terms' && (
        <div>
          {ch.terms && ch.terms[lang] && ch.terms[lang].length > 0 ? (
            ch.terms[lang].map((t, i) => (
              <TermCard key={i} term={t.term} full={t.full} definition={t.definition} section={t.section}
                onNavigateToSection={(slug) => {
                  setActiveTab('content')
                  setTimeout(() => {
                    const el = document.getElementById(`section-${slug}`)
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }, 100)
                }}
              />
            ))
          ) : (
            <div style={{
              padding: '32px 0',
              textAlign: 'center',
            }}>
              <p style={{
                fontFamily: 'var(--font-code)',
                fontSize: 13,
                color: 'var(--text-soft)',
                fontStyle: 'italic',
              }}>
                {lang === 'he'
                  ? 'מונחים לפרק זה יתווספו בקרוב'
                  : 'Terms for this chapter coming soon'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* === Detective Exercise Tab === */}
      {activeTab === 'detective' && (
        <DetectiveExercise content={ch.detective && ch.detective[lang]} files={ch.detectiveFiles} />
      )}

      {/* Navigation — hidden for teaser chapters */}
      {ch.id !== 'vibe-coding-teaser' && <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
        paddingTop: 20,
        borderTop: '1px solid var(--border)',
      }}>
        <button
          onClick={handlePrev}
          disabled={chapterIndex === 0 && visibleTabs.findIndex(t => t.id === activeTab) === 0}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--text-soft)',
            cursor: 'pointer',
            opacity: (chapterIndex === 0 && visibleTabs.findIndex(t => t.id === activeTab) === 0) ? 0.3 : 1,
            transition: 'all 0.15s ease',
          }}
        >
          {dir === 'rtl' ? '→' : '←'} {lang === 'he' ? 'הקודם' : 'Previous'}
        </button>
        {ch.id === 'epilogue' && visibleTabs.findIndex(t => t.id === activeTab) === visibleTabs.length - 1 ? (
          <button
            onClick={() => onNavigateToNotebook?.('vibe-coding')}
            style={{
              padding: '10px 16px', borderRadius: 8, border: 'none', background: '#9B4F96',
              fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
              fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer',
              transition: 'all 0.2s ease', letterSpacing: lang === 'he' ? 0 : 0.3,
              marginTop: 14,
            }}>
            {lang === 'he' ? 'למדריך Vibe Coding' : 'To the Vibe Coding Notebook'} {dir === 'rtl' ? '←' : '→'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={chapterIndex === totalChapters - 1 && visibleTabs.findIndex(t => t.id === activeTab) === visibleTabs.length - 1}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--accent)',
              fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              cursor: 'pointer',
              opacity: (chapterIndex === totalChapters - 1 && visibleTabs.findIndex(t => t.id === activeTab) === visibleTabs.length - 1) ? 0.3 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {lang === 'he' ? 'הבא' : 'Next'} {dir === 'rtl' ? '←' : '→'}
          </button>
        )}
      </div>}
      </article>
  )
}
