import { useState } from 'react'
import { useLang } from '../App'

const agents = [
  {
    id: 'research',
    label: { he: 'סוכן מחקר', en: 'Research Agent' },
    emoji: '🔍',
    description: {
      he: 'מקבל נושא, חוקר אותו באינטרנט, ושומר דו"ח מסודר עם מקורות.',
      en: 'Takes a topic, researches it online, and saves a structured report with sources.',
    },
    flow: [
      { action: 'tool_use', tool: 'search_web', he: 'מחפש מידע על הנושא', en: 'Searches for the topic' },
      { action: 'tool_use', tool: 'fetch_page', he: 'שולף תוכן מ-3 דפים', en: 'Fetches content from 3 pages' },
      { action: 'tool_use', tool: 'fetch_page', he: 'שולף עוד דף רלוונטי', en: 'Fetches another relevant page' },
      { action: 'tool_use', tool: 'save_report', he: 'שומר דו"ח מסודר', en: 'Saves structured report' },
      { action: 'end_turn', he: 'מסיים עם סיכום למשתמש', en: 'Finishes with summary to user' },
    ],
    files: {
      'agent.py': {
        sections: [
          {
            label: 'SYSTEM PROMPT',
            color: '#F59E0B',
            lines: [
              'SYSTEM_PROMPT = """',
              'You are a research agent. When given a topic:',
              '1. Search the web for relevant information',
              '2. Fetch content from the best URLs',
              '3. Save a structured report with sources',
              'Be thorough but concise. Always cite sources.',
              '"""',
            ],
          },
          {
            label: { he: 'הנתב — ROUTER', en: 'ROUTER' },
            color: '#8B5CF6',
            lines: [
              'def execute_tool(tool_name, tool_input):',
              '    if tool_name == "search_web":',
              '        return search_web(**tool_input)',
              '    elif tool_name == "fetch_page":',
              '        return fetch_page(**tool_input)',
              '    elif tool_name == "save_report":',
              '        return save_report(**tool_input)',
            ],
          },
          {
            label: { he: 'הלולאה — AGENTIC LOOP', en: 'AGENTIC LOOP' },
            color: '#10B981',
            lines: [
              'def run_agent(topic):',
              '    messages = [{"role": "user", "content": topic}]',
              '',
              '    for i in range(10):',
              '        response = client.messages.create(',
              '            model="claude-sonnet-4-20250514",',
              '            system=SYSTEM_PROMPT,',
              '            tools=tools,        # ← from tools_schema.py',
              '            messages=messages',
              '        )',
              '',
              '        if response.stop_reason == "tool_use":',
              '            # execute tool, send result back',
              '            result = execute_tool(name, input)',
              '            messages.append(...)  # add to history',
              '',
              '        elif response.stop_reason == "end_turn":',
              '            print(response.content) # done!',
              '            return',
            ],
          },
        ],
      },
      'tools.py': {
        sections: [
          {
            label: { he: 'הפועלים — TOOLS', en: 'TOOLS' },
            color: '#3B82F6',
            lines: [
              'def search_web(query, num_results=5):',
              '    """Search the web using Brave Search API."""',
              '    response = requests.get(',
              '        "https://api.search.brave.com/",',
              '        params={"q": query, "count": num_results}',
              '    )',
              '    return response.json()',
              '',
              'def fetch_page(url):',
              '    """Fetch and extract text from a web page."""',
              '    html = requests.get(url).text',
              '    return extract_text(html)',
              '',
              'def save_report(filename, content):',
              '    """Save a markdown report to disk."""',
              '    with open(filename, "w") as f:',
              '        f.write(content)',
              '    return f"Saved {filename}"',
            ],
          },
        ],
      },
      'tools_schema.py': {
        sections: [
          {
            label: { he: 'התפריט — SCHEMA', en: 'SCHEMA' },
            color: '#EC4899',
            lines: [
              'tools = [',
              '  {',
              '    "name": "search_web",',
              '    "description": "Search the web for information",',
              '    "input_schema": {',
              '      "properties": {',
              '        "query": { "type": "string" },',
              '        "num_results": { "type": "integer" }',
              '      },',
              '      "required": ["query"]',
              '    }',
              '  },',
              '  {',
              '    "name": "fetch_page",',
              '    "description": "Fetch content from a URL",',
              '    "input_schema": {',
              '      "properties": {',
              '        "url": { "type": "string" }',
              '      },',
              '      "required": ["url"]',
              '    }',
              '  },',
              '  {',
              '    "name": "save_report",',
              '    "description": "Save a report to a file",',
              '    "input_schema": {',
              '      "properties": {',
              '        "filename": { "type": "string" },',
              '        "content": { "type": "string" }',
              '      },',
              '      "required": ["filename", "content"]',
              '    }',
              '  }',
              ']',
            ],
          },
        ],
      },
    },
  },
  {
    id: 'datenight',
    label: { he: 'סוכן ערב דייט', en: 'Date Night Agent' },
    emoji: '💑',
    description: {
      he: 'בודק לוחות שנה של שני בני זוג, מוצא ערבים פנויים, ומחפש רעיונות לערב דייט בתל אביב.',
      en: 'Checks both partners\' calendars, finds free evenings, and searches for date night ideas in Tel Aviv.',
    },
    flow: [
      { action: 'tool_use', tool: 'get_free_evenings', he: 'בודק לוחות שנה', en: 'Checks calendars' },
      { action: 'tool_use', tool: 'search_restaurants', he: 'מחפש מסעדות איטלקיות', en: 'Searches Italian restaurants' },
      { action: 'tool_use', tool: 'search_events', he: 'מחפש הופעות והצגות', en: 'Searches shows & concerts' },
      { action: 'end_turn', he: 'מציג המלצות עם תאריכים', en: 'Shows recommendations with dates' },
    ],
    files: {
      'agent.py': {
        sections: [
          {
            label: 'SYSTEM PROMPT',
            color: '#F59E0B',
            lines: [
              'SYSTEM_PROMPT = """',
              "You are a date night planner. Your role:",
              "1. Check both partners' calendars",
              '2. Find overlapping free evenings',
              '3. Search for restaurants, events, or',
              '   home date ideas in Tel Aviv',
              '"""',
            ],
          },
          {
            label: { he: 'הנתב — ROUTER', en: 'ROUTER' },
            color: '#8B5CF6',
            lines: [
              'def execute_tool(tool_name, tool_input):',
              '    if tool_name == "get_free_evenings":',
              '        return get_free_evenings()',
              '    elif tool_name == "search_restaurants":',
              '        return search_restaurants(**tool_input)',
              '    elif tool_name == "search_events":',
              '        return search_events(**tool_input)',
              '    elif tool_name == "search_home_ideas":',
              '        return search_home_ideas(**tool_input)',
            ],
          },
          {
            label: { he: 'הלולאה — AGENTIC LOOP', en: 'AGENTIC LOOP' },
            color: '#10B981',
            lines: [
              'def run_agent(request):',
              '    messages = [{"role": "user", "content": request}]',
              '',
              '    for i in range(10):',
              '        response = client.messages.create(',
              '            model="claude-sonnet-4-20250514",',
              '            system=SYSTEM_PROMPT,',
              '            tools=tools,        # ← from tools_schema.py',
              '            messages=messages',
              '        )',
              '',
              '        if response.stop_reason == "tool_use":',
              '            # execute tool, send result back',
              '            result = execute_tool(name, input)',
              '            messages.append(...)  # add to history',
              '',
              '        elif response.stop_reason == "end_turn":',
              '            print(response.content) # done!',
              '            return',
            ],
          },
        ],
      },
      'tools.py': {
        sections: [
          {
            label: { he: 'הפועלים — TOOLS', en: 'TOOLS' },
            color: '#3B82F6',
            lines: [
              'def get_free_evenings():',
              '    """Check Google Calendar for both partners."""',
              '    my_cal = google.calendar.get("me")',
              '    partner_cal = google.calendar.get("partner")',
              '    return find_overlapping_free(my_cal, partner_cal)',
              '',
              'def search_restaurants(location, cuisine=None):',
              '    """Search restaurants by location and cuisine."""',
              '    return yelp.search(location, cuisine)',
              '',
              'def search_events(location, event_type=None):',
              '    """Search local events and shows."""',
              '    return eventbrite.search(location, event_type)',
              '',
              'def search_home_ideas(theme=None):',
              '    """Search for home date night ideas."""',
              '    return pinterest.search("date night", theme)',
            ],
          },
        ],
      },
      'tools_schema.py': {
        sections: [
          {
            label: { he: 'התפריט — SCHEMA', en: 'SCHEMA' },
            color: '#EC4899',
            lines: [
              'tools = [',
              '  {',
              '    "name": "get_free_evenings",',
              '    "description": "Check both calendars for',
              '         free evenings this week",',
              '    "input_schema": {',
              '      "properties": {},',
              '      "required": []',
              '    }',
              '  },',
              '  {',
              '    "name": "search_restaurants",',
              '    "description": "Search restaurants by area",',
              '    "input_schema": {',
              '      "properties": {',
              '        "location": { "type": "string" },',
              '        "cuisine": { "type": "string" }',
              '      },',
              '      "required": ["location"]',
              '    }',
              '  },',
              '  {',
              '    "name": "search_events",',
              '    "description": "Search local events",',
              '    "input_schema": { ... }',
              '  },',
              '  {',
              '    "name": "search_home_ideas",',
              '    "description": "Get home date ideas",',
              '    "input_schema": { ... }',
              '  }',
              ']',
            ],
          },
        ],
      },
    },
  },
]

const fileTabColors = {
  'agent.py': '#F59E0B',       // amber — system prompt + router + loop
  'tools.py': '#3B82F6',       // blue — tools
  'tools_schema.py': '#EC4899', // pink — schema
  '💡': '#10B981',              // green — execution flow
}
const fileNames = ['agent.py', 'tools.py', 'tools_schema.py', '💡']

export default function AgentFileView() {
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'
  const [agentIdx, setAgentIdx] = useState(0)
  const [activeFile, setActiveFile] = useState('💡')
  const [collapsed, setCollapsed] = useState(false)

  const agent = agents[agentIdx]
  const isRunTab = activeFile === '💡'
  const file = !isRunTab ? agent.files[activeFile] : null

  const accent = '#6366F1'
  const green = '#10B981'

  const getLabel = (label) => {
    if (typeof label === 'string') return label
    return label[lang]
  }

  return (
    <div style={{
      margin: '24px 0',
      borderRadius: 10,
      border: '1px solid var(--border)',
      overflow: 'hidden',
      background: 'var(--surface, #fff)',
    }}>
      {/* Agent toggle */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-elevated, #f8f8f8)',
      }}>
        {agents.map((a, i) => (
          <button
            key={a.id}
            onClick={() => { setAgentIdx(i); setActiveFile('💡'); if (collapsed) setCollapsed(false) }}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: 'none',
              borderBottom: agentIdx === i ? `2px solid ${accent}` : '2px solid transparent',
              marginBottom: -1,
              background: agentIdx === i ? `${accent}08` : 'transparent',
              fontFamily,
              fontSize: 13,
              fontWeight: agentIdx === i ? 700 : 400,
              color: agentIdx === i ? accent : 'var(--text-soft)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {a.emoji} {a.label[lang]}
          </button>
        ))}
        <button
          onClick={() => setCollapsed(c => !c)}
          style={{
            padding: '0 12px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 14,
            color: 'var(--text-soft)',
            opacity: 0.5,
            transition: 'opacity 0.15s ease',
            flexShrink: 0,
          }}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '▼' : '▲'}
        </button>
      </div>

      {!collapsed && <>
      {/* Call chain */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-elevated, #f8f8f8)',
        direction: 'ltr',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px 4px',
      }}>
        {[
          { text: 'run_agent()', color: '#10B981' },
          { text: 'LLM + prompt + tools_schema', color: '#EC4899' },
          { text: 'decides to use tool', color: '#8B5CF6', italic: true },
          { text: 'execute_tool()', color: '#8B5CF6' },
          { text: 'tools.py', color: '#3B82F6' },
        ].map((step, i, arr) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{
              fontFamily: 'var(--font-code)',
              fontSize: 11,
              fontWeight: 600,
              color: step.color,
              fontStyle: step.italic ? 'italic' : 'normal',
              padding: '3px 8px',
              borderRadius: 5,
              border: `1px solid ${step.color}25`,
              background: `${step.color}0A`,
              whiteSpace: 'nowrap',
            }}>
              {step.text}
            </span>
            {i < arr.length - 1 && (
              <span style={{ color: 'var(--text-soft)', opacity: 0.35, fontSize: 11 }}>→</span>
            )}
          </span>
        ))}
      </div>

      {/* IDE file tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        background: '#1e1e1e',
        direction: 'ltr',
      }}>
        {fileNames.map((name, fi) => {
          const isActive = activeFile === name
          const isRun = name === '💡'
          const tabColor = fileTabColors[name]
          return (
            <button
              key={name}
              onClick={() => setActiveFile(name)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderBottom: `2px solid ${isActive ? tabColor : `${tabColor}40`}`,
                borderRight: fi < fileNames.length - 1 && !isRun ? '1px solid #FAF7F244' : 'none',
                marginBottom: -1,
                background: isActive ? '#1e1e1e' : '#2d2d2d',
                fontFamily: 'var(--font-code)',
                fontSize: 12,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? tabColor : '#999',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                marginInlineStart: isRun ? 'auto' : 0,
              }}
            >
              {name}
            </button>
          )
        })}
      </div>

      {/* Code area — file tabs */}
      {!isRunTab && (
        <div style={{
          background: '#1e1e1e',
          padding: '12px 0',
          direction: 'ltr',
          minHeight: 200,
        }}>
          {file.sections.map((section, si) => (
            <div key={si}>
              {/* Section with colored left border */}
              <div style={{
                position: 'relative',
                borderInlineStart: `3px solid ${section.color}`,
                margin: '0 0 8px 0',
              }}>
                {/* Label */}
                <div style={{
                  padding: '2px 12px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: 9,
                    fontWeight: 700,
                    color: section.color,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}>
                    {getLabel(section.label)}
                  </span>
                </div>

                {/* Code lines */}
                <div style={{ padding: '0 12px 4px' }}>
                  {section.lines.map((line, li) => (
                    <div key={li} style={{
                      fontFamily: 'var(--font-code)',
                      fontSize: 11.5,
                      lineHeight: 1.7,
                      color: '#D4D4D4',
                      whiteSpace: 'pre',
                      minHeight: line === '' ? 10 : undefined,
                    }}>
                      <span style={{ color: '#5A5A5A', userSelect: 'none', display: 'inline-block', width: 28, textAlign: 'right', marginRight: 12 }}>
                        {si === 0 ? li + 1 : ''}
                      </span>
                      {colorize(line)}
                    </div>
                  ))}
                </div>
              </div>

              {si < file.sections.length - 1 && (
                <div style={{ height: 6 }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Run tab — description + execution flow */}
      {isRunTab && (
        <div style={{
          padding: '16px 18px',
          minHeight: 200,
          border: '1px solid #1e1e1e',
        }}>
          {/* Description */}
          <p style={{
            fontFamily,
            fontSize: 14,
            lineHeight: 1.7,
            color: 'var(--text)',
            marginTop: 0,
            marginBottom: 16,
            direction: isRtl ? 'rtl' : 'ltr',
          }}>
            {agent.description[lang]}
          </p>

          {/* Flow timeline */}
          <div style={{
            borderRadius: 8,
            border: '1px solid #1e1e1e22',
            background: '#1e1e1e06',
            padding: '12px 14px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
              direction: isRtl ? 'rtl' : 'ltr',
            }}>
              <span style={{
                fontFamily: 'var(--font-code)',
                fontSize: 10,
                fontWeight: 700,
                color: green,
                textTransform: 'uppercase',
                letterSpacing: 1.2,
              }}>
                {isRtl ? 'מה קורה בפועל' : 'Execution Flow'}
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

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              direction: isRtl ? 'rtl' : 'ltr',
            }}>
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
                    <div style={{ padding: '4px 8px 12px', flex: 1 }}>
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
                        fontFamily,
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
      )}

      </>}
      {/* Building blocks legend */}
      <div style={{
        padding: '8px 14px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        justifyContent: 'center',
        background: 'var(--bg-elevated, #f8f8f8)',
      }}>
        {[
          { label: { he: 'לולאה', en: 'Loop' }, color: '#10B981' },
          { label: { he: 'נתב', en: 'Router' }, color: '#8B5CF6' },
          { label: { he: 'כלים', en: 'Tools' }, color: '#3B82F6' },
          { label: { he: 'תפריט', en: 'Schema' }, color: '#EC4899' },
          { label: 'System Prompt', color: '#F59E0B' },
        ].map(item => (
          <div key={typeof item.label === 'string' ? item.label : item.label.en} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}>
            <span style={{
              width: 10,
              height: 3,
              borderRadius: 2,
              background: item.color,
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: 'var(--font-code)',
              fontSize: 9,
              color: 'var(--text-soft)',
            }}>
              {typeof item.label === 'string' ? item.label : item.label[lang]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Simple Python syntax highlighting
function colorize(line) {
  if (!line) return line

  const parts = []
  let rest = line

  // String highlighting (""" and regular strings)
  const stringRegex = /("""[\s\S]*?"""|"[^"]*"|'[^']*')/g
  let match
  let lastIndex = 0
  const temp = []

  while ((match = stringRegex.exec(rest)) !== null) {
    if (match.index > lastIndex) {
      temp.push({ type: 'code', text: rest.slice(lastIndex, match.index) })
    }
    temp.push({ type: 'string', text: match[0] })
    lastIndex = stringRegex.lastIndex
  }
  if (lastIndex < rest.length) {
    temp.push({ type: 'code', text: rest.slice(lastIndex) })
  }

  const keywords = /\b(def|if|elif|else|for|in|range|return|import|from|with|as|and|or|not)\b/g
  const comments = /(#.*$)/

  temp.forEach((part, pi) => {
    if (part.type === 'string') {
      parts.push(
        <span key={pi} style={{ color: '#CE9178' }}>{part.text}</span>
      )
    } else {
      // Handle comments first
      const commentMatch = part.text.match(comments)
      const codeText = commentMatch ? part.text.slice(0, commentMatch.index) : part.text
      const commentText = commentMatch ? commentMatch[0] : null

      // Highlight keywords in code
      let kLast = 0
      const codeParts = []
      let kMatch
      const kRegex = /\b(def|if|elif|else|for|in|range|return|import|from|with|as|and|or|not|None)\b/g

      while ((kMatch = kRegex.exec(codeText)) !== null) {
        if (kMatch.index > kLast) {
          codeParts.push(<span key={`${pi}-c-${kLast}`}>{codeText.slice(kLast, kMatch.index)}</span>)
        }
        codeParts.push(
          <span key={`${pi}-k-${kMatch.index}`} style={{ color: '#C586C0' }}>{kMatch[0]}</span>
        )
        kLast = kRegex.lastIndex
      }
      if (kLast < codeText.length) {
        codeParts.push(<span key={`${pi}-c-${kLast}`}>{codeText.slice(kLast)}</span>)
      }

      parts.push(...codeParts)

      if (commentText) {
        parts.push(
          <span key={`${pi}-comment`} style={{ color: '#6A9955' }}>{commentText}</span>
        )
      }
    }
  })

  return parts
}
