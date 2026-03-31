import { useState } from 'react'
import { useLang } from '../App'

const days = [
  {
    date: '10.2',
    weekday: { he: 'שלישי', en: 'Tue' },
    commits: 9,
    mood: 'fire',
    apiCost: 92,
    apiNote: { he: 'כולל 62₪ מ-2.2', en: 'Including 62₪ from 2.2' },
    title: { he: 'יום 1 — ״זה עובד?!״', en: 'Day 1 — "It works?!"' },
    details: {
      he: 'רשימת קניות עם צבעים, קטגוריות, מחיקה וניקוי. הסוכן כתב הכל. תיארתי מה אני רוצה, הוא בנה. ההרגשה מטורפת.',
      en: 'Shopping list with colors, categories, delete and clear. The agent wrote everything. I described what I wanted, it built. The feeling is insane.',
    },
    _commits_sample: [
      'Shopping List: delete, clear, categorize',
      'Create: MasterList feature',
    ],
  },
  {
    date: '11.2',
    weekday: { he: 'רביעי', en: 'Wed' },
    commits: 10,
    mood: 'warning',
    apiCost: 153,
    apiNote: { he: '', en: '' },
    title: { he: 'יום 2 — שוברת ומתקנת ואז שוב שוברת', en: 'Day 2 — The rabbit hole' },
    details: {
      he: 'רציתי מנגנון שמזהה את ההקשר של הרשימה ומציע פריטים מתאימים. התחלנו ב-Smart Suggestions, הפך ל-Context Engine, ואז Flexible Memory — וכל פעם שמשהו עבד, שברתי אותו בניסיון לשפר. היום הזה עלה לי 153 ש״ח בטוקנים. על פיצ׳ר אחד.',
      en: 'Wanted a context-aware suggestion engine. Started as Smart Suggestions, became Context Engine, then Flexible Memory — and every time something worked, I broke it trying to improve. This day cost me 153 ILS in tokens. On a single feature.',
    },
    _commits_sample: [
      'Create Context Recognition Mapping Engine',
      'Implement Flexible Memory',
      'Fix: Remove fallback default items',
      'Fix: Batch context items into single state update',
    ],
  },
  {
    date: '12.2',
    weekday: { he: 'חמישי', en: 'Thu' },
    commits: 3,
    mood: 'calm',
    title: { he: 'יום 3 — רפקטור וסדר', en: 'Day 3 — Refactor & order' },
    details: {
      he: 'אחרי הכאוס של אתמול, עצרתי לנשום. במקום לרוץ לפיצ׳ר הבא, ביקשתי מהסוכן לסדר את מה שכבר קיים — מבנה נקי יותר, טיפוסים ברורים, ובניית ה-Task Hub. יום שקט, אבל חשוב.',
      en: 'After yesterday\'s chaos, I paused to breathe. Instead of rushing to the next feature, I asked the agent to organize what already existed — cleaner structure, clear types, and building the Task Hub. A quiet day, but an important one.',
    },
    _commits_sample: [
      'refactor: add BaseItem and Task types',
      'Create Task Hub and Urgent Task SubHub',
    ],
  },
  {
    date: '15.2',
    weekday: { he: 'שבת', en: 'Sat' },
    commits: 7,
    mood: 'explosion',
    title: { he: 'ימים 4-6 — מרשימת קניות לאפליקציה שלמה', en: 'Days 4-6 — From shopping list to full app' },
    details: {
      he: 'יום הסדר ב-12.2 לא ממש החזיק מעמד, ככל שהתקדמנו בפיתוח, הכאוס חזר: תוך 4 שעות האפליקציה עברה מהפך - סריקת ברקודים בעברית, מערכת אייקונים, עיצוב מחדש מלא, ואז עוד עיצוב מחדש כי הראשון שבר דברים. הכל רץ, אבל בלי שום תכנון.',
      en: 'The cleanup day on 12.2 didn\'t last. As development progressed, the chaos returned: within 4 hours the app was transformed - Hebrew barcode scanning, icon system, full redesign, then another redesign because the first one broke things. Everything ran, but with zero planning.',
    },
    _commits_sample: [
      'Fix voucher type stability and enhance OCR',
      'Architecture overhaul: Smart icons, compact header',
      'Complete UI/UX overhaul: Ghost UI, centered header',
    ],
  },
  {
    date: '17.2',
    weekday: { he: 'שני', en: 'Mon' },
    commits: 10,
    mood: 'danger',
    subscription: 320,
    title: { he: 'יום 7 — ה-Migration הגדול', en: 'Day 7 — The Big Migration' },
    details: {
      he: 'הבנתי שצריך להתחיל לתמוך במידע עם Database — שינוי מאסיבי בלחיצה אחת. ואז הכל התפרק: ההתחברות שבורה, המובייל שבור, הקרוסלה שבורה. שעות של תיקונים ברצף. באותו יום הסתכלתי על החשבון של הטוקנים והבנתי שאני צריכה לעבור ל-Claude Max — מנוי של $100 לחודש עם שימוש בלתי מוגבל.',
      en: 'I realized I needed database support — a massive change in one go. Then everything fell apart: auth broken, mobile broken, carousel broken. Hours of fixes in a row. That same day I looked at the token bill and realized I needed Claude Max — $100/month subscription with unlimited usage.',
    },
    _commits_sample: [
      'Migrate all data storage to Supabase',
      'Fix AuthScreen not scrollable on mobile',
      'Fix household join race condition',
      'Fix stuck loading caused by stale invite',
    ],
    milestone: { he: 'מעבר ל-Max — $100/חודש', en: 'Switched to Max — $100/mo' },
  },
  {
    date: '18.2',
    weekday: { he: 'שלישי', en: 'Tue' },
    commits: 19,
    mood: 'danger',
    title: { he: 'יום 8 — יום התיקונים', en: 'Day 8 — Fix day' },
    details: {
      he: 'יום שלם של תיקוני UI בלבד: מקלדת שחוסמת תוכן, חלונות קופצים שנשברים, טפסים שגולשים ב-iOS. אף פיצ׳ר חדש — רק כיבוי שריפות. בסוף היום הבנתי: אי אפשר להמשיך ככה. צריך לעצור, לחשוב, ולתכנן.',
      en: 'A full day of UI fixes only: keyboard blocking content, popups breaking, forms overflowing on iOS. No new features — just putting out fires. By the end of the day I realized: I can\'t keep going like this. I need to stop, think, and plan.',
    },
    _commits_sample: [
      'Fix mobile keyboard obstruction',
      'Fix carousel light-up broken by scroll listener',
      'Fix date/priority overflow on iOS',
      'Fix VouchersHub template modal bounds',
    ],
  },
]

// Pre-compute cumulative costs — subscription persists once purchased
const cumulativeCosts = days.reduce((acc, day, i) => {
  const prev = i > 0 ? acc[i - 1] : { api: 0, sub: 0, total: 0 }
  const api = prev.api + (day.apiCost || 0)
  const sub = day.subscription ? prev.sub + day.subscription : prev.sub
  const total = api + sub
  acc.push({ api, sub, total, dayApi: day.apiCost || 0, hasSub: sub > 0 })
  return acc
}, [])

const maxTotal = cumulativeCosts[cumulativeCosts.length - 1].total

const moodColors = {
  fire: '#F59E0B',
  warning: '#EF4444',
  calm: '#10B981',
  explosion: '#9B4F96',
  danger: '#EF4444',
}

export default function VibingDays() {
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'
  const [activeDay, setActiveDay] = useState(null)

  const cumulative = activeDay !== null ? cumulativeCosts[activeDay] : null

  return (
    <div style={{ margin: '20px 0' }}>
      {/* Day pills */}
      <div style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 12,
        direction: isRtl ? 'rtl' : 'ltr',
      }}>
        {days.map((day, i) => {
          const isActive = activeDay === i
          const color = moodColors[day.mood]
          return (
            <button
              key={i}
              onClick={() => setActiveDay(isActive ? null : i)}
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                border: `2px solid ${isActive ? color : color + '60'}`,
                background: isActive ? color + '20' : color + '08',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                minWidth: 64,
              }}
            >
              <span style={{
                fontFamily: 'var(--font-code)',
                fontSize: 15,
                fontWeight: 800,
                color: isActive ? color : 'var(--heading)',
              }}>
                {day.date}
              </span>
              <span style={{
                fontFamily: 'var(--font-code)',
                fontSize: 11,
                fontWeight: 600,
                color: isActive ? color : 'var(--text-soft)',
              }}>
                {day.commits} commits
              </span>
            </button>
          )
        })}
      </div>

      {/* Expanded day detail */}
      {activeDay !== null && (() => {
        const day = days[activeDay]
        const color = moodColors[day.mood]
        return (
          <div style={{
            borderRadius: 10,
            border: `1px solid ${color}30`,
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease',
          }}>
            {/* Day header */}
            <div style={{
              padding: '10px 14px',
              background: `${color}12`,
              borderBottom: `1px solid ${color}20`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              direction: isRtl ? 'rtl' : 'ltr',
            }}>
              <span style={{
                fontFamily,
                fontSize: 13,
                fontWeight: 700,
                color,
              }}>
                {day.title[lang]}
              </span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {day.milestone && (
                  <span style={{
                    fontFamily: 'var(--font-code)',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#9B4F96',
                    background: '#9B4F9615',
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}>
                    {day.milestone[lang]}
                  </span>
                )}
                <span style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: 10,
                  color,
                  opacity: 0.8,
                }}>
                  {day.commits} commits
                </span>
              </div>
            </div>

            {/* Description */}
            <div style={{
              padding: '10px 14px',
              fontFamily,
              fontSize: 13,
              lineHeight: 1.7,
              color: 'var(--text)',
              direction: isRtl ? 'rtl' : 'ltr',
            }}>
              {day.details[lang]}
            </div>

          </div>
        )
      })()}

      {/* Cost bar — fills based on selected day */}
      <div style={{
        margin: '12px 0 0',
        borderRadius: 8,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        background: 'var(--bg-elevated, #fafafa)',
      }}>
        {/* Label */}
        <div style={{
          padding: '5px 12px 0',
          fontFamily,
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-soft)',
          direction: isRtl ? 'rtl' : 'ltr',
        }}>
          {isRtl ? 'כמה זה עלה לי?' : 'How much did it cost me?'}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 12px 6px',
          direction: isRtl ? 'rtl' : 'ltr',
        }}>
          <span style={{
            fontFamily: 'var(--font-code)',
            fontSize: 10,
            color: 'var(--text-soft)',
            whiteSpace: 'nowrap',
          }}>
            ₪
          </span>

          {/* Stacked bar */}
          <div style={{
            flex: 1,
            height: 18,
            borderRadius: 4,
            background: 'var(--border)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            direction: isRtl ? 'rtl' : 'ltr',
          }}>
            {/* API segment */}
            {cumulative && cumulative.api > 0 && (
              <div style={{
                width: `${(cumulative.api / maxTotal) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #F59E0B, #EF4444cc)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'width 0.4s ease',
                position: 'relative',
                minWidth: 50,
              }}>
                <span style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                }}>
                  API {cumulative.api} ₪
                </span>
              </div>
            )}
            {/* Max segment */}
            {cumulative?.hasSub && (
              <div style={{
                width: `${(cumulative.sub / maxTotal) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #9B4F96, #7C3AED)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'width 0.4s ease',
                animation: 'fadeIn 0.3s ease',
                minWidth: 80,
              }}>
                <span style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                }}>
                  Max $100
                </span>
              </div>
            )}
          </div>

          {/* Total number */}
          <span style={{
            fontFamily: 'var(--font-code)',
            fontSize: 12,
            fontWeight: 700,
            color: cumulative
              ? cumulative.hasSub ? '#9B4F96' : '#F59E0B'
              : 'var(--text-soft)',
            minWidth: 45,
            textAlign: isRtl ? 'left' : 'right',
            transition: 'color 0.3s ease',
          }}>
            {cumulative ? `${cumulative.total} ₪` : '—'}
          </span>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}