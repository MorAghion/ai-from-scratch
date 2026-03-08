import { useLang } from '../App'

const steps = {
  he: [
    { emoji: '🧑', label: 'אתם', sub: '(Client)', color: '#6366F1' },
    { emoji: '📋', label: 'תפריט', sub: '(Endpoint)', color: '#F59E0B', arrow: true },
    { emoji: '🧑‍🍳', label: 'המלצר', sub: '(API)', color: '#10B981', arrow: true },
    { emoji: '🍳', label: 'המטבח', sub: '(Server)', color: '#EF4444', arrow: true },
  ],
  en: [
    { emoji: '🧑', label: 'You', sub: '(Client)', color: '#6366F1' },
    { emoji: '📋', label: 'Menu', sub: '(Endpoint)', color: '#F59E0B', arrow: true },
    { emoji: '🧑‍🍳', label: 'Waiter', sub: '(API)', color: '#10B981', arrow: true },
    { emoji: '🍳', label: 'Kitchen', sub: '(Server)', color: '#EF4444', arrow: true },
  ],
}

const flow = {
  he: [
    { icon: '➡️', text: 'אתם מזמינים מהתפריט', tech: 'POST /api/order', color: '#F59E0B' },
    { icon: '➡️', text: 'המלצר לוקח את ההזמנה למטבח', tech: 'Request → Server', color: '#10B981' },
    { icon: '⬅️', text: 'המטבח מכין את המנה', tech: 'Server processes', color: '#EF4444' },
    { icon: '⬅️', text: 'המלצר מביא לכם את האוכל', tech: 'Response → Client', color: '#10B981' },
  ],
  en: [
    { icon: '➡️', text: 'You order from the menu', tech: 'POST /api/order', color: '#F59E0B' },
    { icon: '➡️', text: 'Waiter takes order to kitchen', tech: 'Request → Server', color: '#10B981' },
    { icon: '⬅️', text: 'Kitchen prepares the dish', tech: 'Server processes', color: '#EF4444' },
    { icon: '⬅️', text: 'Waiter brings you the food', tech: 'Response → Client', color: '#10B981' },
  ],
}

const mapping = {
  he: { title: 'API = המלצר של התוכנה', bottom: 'בדיוק ככה עובד API — אתם שולחים בקשה, והמלצר (API) מביא את התשובה מהמטבח (השרת).' },
  en: { title: 'API = The Software Waiter', bottom: 'That\'s exactly how an API works — you send a request, and the waiter (API) brings back the answer from the kitchen (server).' },
}

export default function RestaurantAPIDiagram() {
  const { lang } = useLang()
  const s = steps[lang]
  const f = flow[lang]
  const m = mapping[lang]

  return (
    <div style={{
      backgroundColor: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '20px 24px',
      margin: '20px 0',
    }}>
      {/* Title */}
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--heading)',
        textAlign: 'center',
        marginBottom: 20,
      }}>
        {m.title}
      </div>

      {/* Players row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        marginBottom: 24,
        flexWrap: 'wrap',
      }}>
        {s.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            {step.arrow && (
              <span style={{
                fontSize: 18,
                color: 'var(--text-soft)',
                margin: '0 8px',
              }}>⇄</span>
            )}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              minWidth: 70,
            }}>
              <span style={{ fontSize: 32 }}>{step.emoji}</span>
              <span style={{
                fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                color: step.color,
              }}>{step.label}</span>
              <span style={{
                fontFamily: 'var(--font-code)',
                fontSize: 10,
                color: 'var(--text-soft)',
              }}>{step.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Flow steps */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '0 8px',
      }}>
        {f.map((step, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 12px',
            borderRadius: 8,
            backgroundColor: step.color + '08',
            border: `1px solid ${step.color}20`,
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{step.icon}</span>
            <span style={{
              fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
              fontSize: 13,
              color: 'var(--text)',
              flex: 1,
            }}>{step.text}</span>
            <span style={{
              fontFamily: 'var(--font-code)',
              fontSize: 11,
              color: step.color,
              flexShrink: 0,
              opacity: 0.8,
            }}>{step.tech}</span>
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <div style={{
        fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
        fontSize: 13,
        color: 'var(--text-soft)',
        textAlign: 'center',
        marginTop: 16,
        lineHeight: 1.6,
      }}>
        {m.bottom}
      </div>
    </div>
  )
}
