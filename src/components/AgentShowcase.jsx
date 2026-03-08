import { useState } from 'react'
import { useLang } from '../App'

const agents = [
  {
    id: 'research',
    tab: { he: 'סוכן מחקר', en: 'Research Agent' },
    emoji: '🔍',
    description: {
      he: 'מקבל נושא, חוקר אותו באינטרנט, ושומר דו"ח מסודר עם מקורות.',
      en: 'Takes a topic, researches it online, and saves a structured report with sources.',
    },
    systemPrompt: 'You are a research agent. When given a topic:\n1. Search the web and get URLs\n2. Fetch content from relevant URLs\n3. Save a report as .md file\nBe thorough but concise. Always cite sources.',
    tools: [
      { name: 'search_web', desc: { he: 'חיפוש באינטרנט (Brave Search API)', en: 'Web search (Brave Search API)' }, params: 'query, num_results' },
      { name: 'fetch_page', desc: { he: 'שליפת תוכן מדף אינטרנט', en: 'Fetch content from a web page' }, params: 'url' },
      { name: 'save_report', desc: { he: 'שמירת דו"ח לקובץ markdown', en: 'Save report to markdown file' }, params: 'filename, content' },
    ],
    flow: [
      { action: 'tool_use', tool: 'search_web', he: 'מחפש מידע על הנושא', en: 'Searches for the topic' },
      { action: 'tool_use', tool: 'fetch_page', he: 'שולף תוכן מ-3 דפים', en: 'Fetches content from 3 pages' },
      { action: 'tool_use', tool: 'fetch_page', he: 'שולף עוד דף רלוונטי', en: 'Fetches another relevant page' },
      { action: 'tool_use', tool: 'save_report', he: 'שומר דו"ח מסודר', en: 'Saves structured report' },
      { action: 'end_turn', he: 'מסיים עם סיכום למשתמש', en: 'Finishes with summary to user' },
    ],
  },
  {
    id: 'datenight',
    tab: { he: 'סוכן ערב דייט', en: 'Date Night Agent' },
    emoji: '💑',
    description: {
      he: 'בודק לוחות שנה של שני בני זוג, מוצא ערבים פנויים, ומחפש רעיונות לערב דייט בתל אביב.',
      en: 'Checks both partners\' calendars, finds free evenings, and searches for date night ideas in Tel Aviv.',
    },
    systemPrompt: 'You are a date night agent. Your role:\n1. Open my and my partner\'s calendar\n2. Find overlapping free evenings\n3. Search for restaurants, events, or\n   home date ideas in Tel Aviv',
    tools: [
      { name: 'get_free_evenings', desc: { he: 'גישה ל-Google Calendar של שני בני הזוג', en: 'Access both Google Calendars' }, params: '(none)' },
      { name: 'search_restaurants', desc: { he: 'חיפוש מסעדות לפי מיקום ומטבח', en: 'Search restaurants by location & cuisine' }, params: 'location, cuisine?' },
      { name: 'search_events', desc: { he: 'חיפוש אירועים לפי מיקום וסוג', en: 'Search events by location & type' }, params: 'location, event_type?' },
      { name: 'search_home_ideas', desc: { he: 'חיפוש רעיונות לערב ביתי', en: 'Search home date night ideas' }, params: 'theme?' },
    ],
    flow: [
      { action: 'tool_use', tool: 'get_free_evenings', he: 'בודק לוחות שנה', en: 'Checks calendars' },
      { action: 'tool_use', tool: 'search_restaurants', he: 'מחפש מסעדות איטלקיות', en: 'Searches Italian restaurants' },
      { action: 'tool_use', tool: 'search_events', he: 'מחפש הופעות והצגות', en: 'Searches shows & concerts' },
      { action: 'end_turn', he: 'מציג המלצות עם תאריכים', en: 'Shows recommendations with dates' },
    ],
  },
]

const sectionStyle = (accent) => ({
  borderRadius: 8,
  border: `1px solid ${accent}22`,
  background: `${accent}08`,
  padding: '12px 14px',
  marginBottom: 12,
})

const labelStyle = (accent) => ({
  fontFamily: 'var(--font-code)',
  fontSize: 10,
  fontWeight: 700,
  color: accent,
  textTransform: 'uppercase',
  letterSpacing: 1.2,
  marginBottom: 8,
  display: 'block',
})

export default function AgentShowcase() {
  const { lang } = useLang()
  const [activeIdx, setActiveIdx] = useState(0)
  const agent = agents[activeIdx]
  const accent = '#6366F1'
  const green = '#10B981'

  return (
    <div style={{
      margin: '24px 0',
      borderRadius: 12,
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      overflow: 'hidden',
    }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
      }}>
        {agents.map((a, i) => (
          <button
            key={a.id}
            onClick={() => setActiveIdx(i)}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              borderBottom: activeIdx === i ? `2px solid ${accent}` : '2px solid transparent',
              marginBottom: -1,
              background: activeIdx === i ? `${accent}08` : 'transparent',
              fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
              fontSize: 14,
              fontWeight: activeIdx === i ? 700 : 400,
              color: activeIdx === i ? accent : 'var(--text-soft)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {a.emoji} {a.tab[lang]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '16px 18px' }}>
        {/* Description */}
        <p style={{
          fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--text)',
          marginBottom: 16,
          marginTop: 0,
        }}>
          {agent.description[lang]}
        </p>

        {/* System Prompt */}
        <div style={sectionStyle(accent)}>
          <span style={labelStyle(accent)}>System Prompt</span>
          <pre style={{
            fontFamily: 'var(--font-code)',
            fontSize: 11,
            lineHeight: 1.6,
            color: 'var(--text)',
            margin: 0,
            whiteSpace: 'pre-wrap',
            opacity: 0.85,
          }}>
            {agent.systemPrompt}
          </pre>
        </div>

        {/* Tool Definitions — Function Calling */}
        <div style={sectionStyle(accent)}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ ...labelStyle(accent), marginBottom: 0 }}>Tool Definitions</span>
            <span style={{
              fontFamily: 'var(--font-code)',
              fontSize: 9,
              fontWeight: 600,
              color: accent,
              padding: '2px 8px',
              borderRadius: 4,
              border: `1px solid ${accent}30`,
              background: `${accent}0A`,
              letterSpacing: 0.5,
            }}>
              FUNCTION CALLING
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {agent.tools.map((t) => (
              <div key={t.name} style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
                padding: '6px 10px',
                borderRadius: 6,
                background: `${accent}0A`,
              }}>
                <code style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: 12,
                  fontWeight: 700,
                  color: accent,
                  whiteSpace: 'nowrap',
                }}>
                  {t.name}
                </code>
                <span style={{
                  fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--text-soft)',
                  flex: 1,
                }}>
                  {t.desc[lang]}
                </span>
                <code style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: 10,
                  color: 'var(--text-soft)',
                  opacity: 0.6,
                  whiteSpace: 'nowrap',
                }}>
                  ({t.params})
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Execution Flow — Agentic Loop */}
        <div style={sectionStyle(green)}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ ...labelStyle(green), marginBottom: 0 }}>
              {lang === 'he' ? 'מה קורה בפועל' : 'Execution Flow'}
            </span>
            <span style={{
              fontFamily: 'var(--font-code)',
              fontSize: 9,
              fontWeight: 600,
              color: green,
              padding: '2px 8px',
              borderRadius: 4,
              border: `1px solid ${green}30`,
              background: `${green}0A`,
              letterSpacing: 0.5,
            }}>
              AGENTIC LOOP
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {agent.flow.map((f, i) => {
              const isEnd = f.action === 'end_turn'
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'stretch' }}>
                  {/* Timeline line */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 24,
                    flexShrink: 0,
                  }}>
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: isEnd ? green : accent,
                      border: `2px solid ${isEnd ? green : accent}`,
                      marginTop: 6,
                      flexShrink: 0,
                    }} />
                    {i < agent.flow.length - 1 && (
                      <div style={{
                        width: 2,
                        flex: 1,
                        background: `${accent}30`,
                        minHeight: 16,
                      }} />
                    )}
                  </div>

                  {/* Step content */}
                  <div style={{
                    padding: '4px 8px 12px',
                    flex: 1,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <code style={{
                        fontFamily: 'var(--font-code)',
                        fontSize: 10,
                        fontWeight: 700,
                        color: isEnd ? green : accent,
                        padding: '1px 6px',
                        borderRadius: 3,
                        background: isEnd ? `${green}15` : `${accent}12`,
                      }}>
                        {f.action}
                      </code>
                      {f.tool && (
                        <code style={{
                          fontFamily: 'var(--font-code)',
                          fontSize: 10,
                          color: 'var(--text-soft)',
                        }}>
                          → {f.tool}
                        </code>
                      )}
                    </div>
                    <span style={{
                      fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
                      fontSize: 12,
                      color: 'var(--text)',
                      opacity: 0.8,
                    }}>
                      {f[lang]}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
