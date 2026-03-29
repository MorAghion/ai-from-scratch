import { useLang } from '../App'

const tiers = [
  {
    key: 'free',
    label: { he: 'חינם', en: 'Free' },
    color: '#10B981',
    price: { he: '$0', en: '$0' },
    items: [
      { name: 'ChatGPT', note: { he: 'מוגבל בכמות שאילתות', en: 'Limited queries' } },
      { name: 'Gemini', note: { he: 'נדיב יחסית', en: 'Relatively generous' } },
      { name: 'Claude.ai', note: { he: 'מספר שיחות ליום', en: 'A few conversations/day' } },
      { name: 'GitHub Copilot', note: { he: 'לסטודנטים ו-open source', en: 'Students & open source' } },
    ],
  },
  {
    key: 'basic',
    label: { he: 'מנוי בסיסי', en: 'Basic Subscription' },
    color: '#0EA5E9',
    price: { he: '$10-20/חודש', en: '$10-20/mo' },
    items: [
      { name: 'ChatGPT Plus', price: '$20', note: { he: 'מודלים חזקים יותר', en: 'Stronger models' } },
      { name: 'Claude Pro', price: '$20', note: { he: 'יותר שיחות, מודלים מתקדמים', en: 'More chats, advanced models' } },
      { name: 'Cursor Pro', price: '$20', note: { he: 'סוכן IDE מלא', en: 'Full IDE agent' } },
      { name: 'GitHub Copilot', price: '$10-19', note: { he: 'השלמות קוד ב-IDE', en: 'Code completions in IDE' } },
    ],
  },
  {
    key: 'premium',
    label: { he: 'מנוי פרימיום', en: 'Premium Subscription' },
    color: '#9B4F96',
    price: { he: '$100-200/חודש', en: '$100-200/mo' },
    items: [
      { name: 'Claude Max', price: '$100-200', note: { he: 'שימוש כבד עם Claude Code', en: 'Heavy use with Claude Code' } },
      { name: 'ChatGPT Pro', price: '$200', note: { he: 'גישה למודלים החזקים ביותר', en: 'Access to strongest models' } },
      { name: 'Cursor Business', price: '$40', note: { he: 'לצוותים, יותר שימוש', en: 'For teams, more usage' } },
    ],
  },
  {
    key: 'api',
    label: { he: 'רכישת טוקנים (API)', en: 'Token Purchase (API)' },
    color: '#F59E0B',
    price: { he: 'לפי שימוש', en: 'Pay-per-use' },
    subtitle: { he: 'במקום מנוי — משלמים רק על מה ששולחים למודל דרך API', en: 'Instead of a subscription — you only pay for what you send to the model via API' },
    items: [
      { name: { he: 'שיחת צ׳אט', en: 'Chat conversation' }, note: { he: 'סנטים בודדים', en: 'A few cents' } },
      { name: { he: 'בניית פיצ׳ר', en: 'Building a feature' }, note: { he: '$1-10', en: '$1-10' } },
      { name: { he: 'פרויקט שלם (יום)', en: 'Full project (day)' }, note: { he: '$10-50 אם לא נזהרים', en: '$10-50 if not careful' } },
    ],
  },
]

const disclaimer = {
  he: 'המחירים נכונים לתחילת 2026 ועשויים להשתנות. בדקו באתר הספק לפני רכישה.',
  en: 'Prices are as of early 2026 and may change. Check the provider\'s website before purchasing.',
}

export default function PricingTable() {
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12,
      }}>
        {tiers.map(tier => (
          <div key={tier.key} style={{
            borderRadius: 10,
            border: `1px solid ${tier.color}30`,
            overflow: 'hidden',
          }}>
            {/* Tier header */}
            <div style={{
              background: `${tier.color}12`,
              padding: '10px 14px',
              borderBottom: `1px solid ${tier.color}20`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              direction: isRtl ? 'rtl' : 'ltr',
            }}>
              <span style={{
                fontFamily,
                fontSize: 13,
                fontWeight: 700,
                color: tier.color,
              }}>
                {tier.label[lang]}
              </span>
              <span style={{
                fontFamily: 'var(--font-code)',
                fontSize: 11,
                fontWeight: 600,
                color: tier.color,
                opacity: 0.8,
              }}>
                {tier.price[lang]}
              </span>
            </div>

            {/* Subtitle */}
            {tier.subtitle && (
              <div style={{
                padding: '6px 14px',
                fontFamily,
                fontSize: 11,
                color: 'var(--text-soft)',
                lineHeight: 1.4,
                direction: isRtl ? 'rtl' : 'ltr',
                borderBottom: `1px solid ${tier.color}10`,
              }}>
                {tier.subtitle[lang]}
              </div>
            )}

            {/* Items */}
            <div style={{ padding: '8px 0' }}>
              {tier.items.map((item, i) => {
                const itemName = typeof item.name === 'string' ? item.name : item.name[lang]
                return (
                  <div key={i} style={{
                    padding: '6px 14px',
                    direction: isRtl ? 'rtl' : 'ltr',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                      <span style={{
                        fontFamily,
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--heading)',
                      }}>
                        {itemName}
                      </span>
                      {item.price && (
                        <span style={{
                          fontFamily: 'var(--font-code)',
                          fontSize: 10,
                          color: 'var(--text-soft)',
                        }}>
                          ${item.price.replace('$', '')}
                        </span>
                      )}
                    </div>
                    <span style={{
                      fontFamily,
                      fontSize: 11,
                      color: 'var(--text-soft)',
                      lineHeight: 1.4,
                    }}>
                      {item.note[lang]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p style={{
        fontFamily,
        fontSize: 11,
        color: 'var(--text-soft)',
        opacity: 0.6,
        marginTop: 10,
        textAlign: 'center',
        direction: isRtl ? 'rtl' : 'ltr',
      }}>
        {disclaimer[lang]}
      </p>
    </div>
  )
}
