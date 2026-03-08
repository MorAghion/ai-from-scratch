import { useLang } from '../App'

const amber = '#F59E0B'
const blue = '#3B82F6'
const accent = '#6366F1'
const green = '#10B981'

const labels = {
  he: {
    title: 'Request / Response — מחזור בקשה ותשובה',
    agent: 'הסוכן',
    agentSub: 'Client',
    server: 'השרת',
    serverSub: 'API',
    request: 'Request →',
    response: '← Response',
    reqLines: [
      { text: 'POST /api/chat', color: amber },
      { text: 'Authorization: Bearer sk-...', color: null },
      { text: '{ "message": "מי רצח?" }', color: null },
    ],
    resLines: [
      { text: 'Status: 200 OK', color: green },
      { text: '{ "answer": "רוברט הוא החשוד..." }', color: null },
    ],
  },
  en: {
    title: 'Request / Response — The Basic Cycle',
    agent: 'Agent',
    agentSub: 'Client',
    server: 'Server',
    serverSub: 'API',
    request: 'Request →',
    response: '← Response',
    reqLines: [
      { text: 'POST /api/chat', color: amber },
      { text: 'Authorization: Bearer sk-...', color: null },
      { text: '{ "message": "Who killed?" }', color: null },
    ],
    resLines: [
      { text: 'Status: 200 OK', color: green },
      { text: '{ "answer": "Robert is the suspect..." }', color: null },
    ],
  },
}

function CodeBlock({ lines, borderColor }) {
  return (
    <div style={{
      backgroundColor: 'var(--bg)',
      border: `1px solid ${borderColor}30`,
      borderRadius: 6,
      padding: '8px 12px',
      fontFamily: 'var(--font-code)',
      fontSize: 11,
      lineHeight: 1.7,
    }}>
      {lines.map((line, i) => (
        <div key={i} style={{ color: line.color || 'var(--text-soft)' }}>
          {line.text}
        </div>
      ))}
    </div>
  )
}

function EntityBox({ emoji, label, sub, color }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      padding: '16px 20px',
      borderRadius: 10,
      backgroundColor: color + '08',
      border: `1.5px solid ${color}30`,
      minWidth: 80,
    }}>
      <span style={{ fontSize: 28 }}>{emoji}</span>
      <span style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 14,
        fontWeight: 600,
        color,
      }}>{label}</span>
      <span style={{
        fontFamily: 'var(--font-code)',
        fontSize: 10,
        color: 'var(--text-soft)',
      }}>{sub}</span>
    </div>
  )
}

export default function APIRequestDiagram() {
  const { lang } = useLang()
  const t = labels[lang] || labels.he

  return (
    <div dir="ltr" style={{
      backgroundColor: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '20px 24px',
      margin: '20px 0',
    }}>
      {/* Title */}
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--heading)',
        textAlign: 'center',
        marginBottom: 20,
      }}>
        {t.title}
      </div>

      {/* Main layout: Agent | Arrows+Details | Server */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        justifyContent: 'center',
      }}>
        {/* Agent */}
        <EntityBox emoji="🤖" label={t.agent} sub={t.agentSub} color={accent} />

        {/* Middle: arrows + code blocks */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          flex: 1,
          maxWidth: 320,
        }}>
          {/* Request */}
          <div>
            <div style={{
              fontFamily: 'var(--font-code)',
              fontSize: 12,
              fontWeight: 600,
              color: amber,
              marginBottom: 4,
            }}>{t.request}</div>
            <CodeBlock lines={t.reqLines} borderColor={amber} />
          </div>

          {/* Response */}
          <div>
            <div style={{
              fontFamily: 'var(--font-code)',
              fontSize: 12,
              fontWeight: 600,
              color: blue,
              marginBottom: 4,
            }}>{t.response}</div>
            <CodeBlock lines={t.resLines} borderColor={blue} />
          </div>
        </div>

        {/* Server */}
        <EntityBox emoji="🖥️" label={t.server} sub={t.serverSub} color={green} />
      </div>
    </div>
  )
}
