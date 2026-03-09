import { useState } from 'react'
import { useLang } from '../App'

const days = [
  {
    date: '10.2',
    weekday: { he: 'שלישי', en: 'Tue' },
    commits: 9,
    mood: 'fire',
    apiCost: 30,
    apiNote: { he: 'חיוב מ-10.2', en: 'Billed 10.2' },
    title: { he: 'יום 1 — ״זה עובד?!״', en: 'Day 1 — "It works?!"' },
    details: {
      he: 'רשימת קניות עם צבעים, קטגוריות, מחיקה וניקוי. הסוכן כתב הכל. תיארתי מה אני רוצה, הוא בנה. ההרגשה? מטורפת.',
      en: 'Shopping list with colors, categories, delete and clear. The agent wrote everything. I described what I wanted, it built. The feeling? Insane.',
    },
    commits_sample: [
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
    apiNote: { he: 'חיוב מ-11.2', en: 'Billed 11.2' },
    title: { he: 'יום 2 — חור הארנב', en: 'Day 2 — The rabbit hole' },
    details: {
      he: '10 קומיטים על פיצ׳ר אחד. רציתי מנגנון שמזהה הקשר ומציע פריטים. התחיל ב-Smart Suggestions, הפך ל-Context Engine, אז Bubbles, אז Flexible Memory — ואז: fix, break, fix, break, fix.',
      en: '10 commits on one feature. Wanted a context-aware suggestion engine. Started as Smart Suggestions, became Context Engine, then Bubbles, then Flexible Memory — then: fix, break, fix, break, fix.',
    },
    commits_sample: [
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
      he: 'עצרתי לרגע לסדר. הוספתי טיפוסים (BaseItem, Task), שיפרתי את מבנה ה-MasterList. יום שקט יחסית.',
      en: 'Paused to organize. Added types (BaseItem, Task), improved MasterList structure. A relatively quiet day.',
    },
    commits_sample: [
      'refactor: add BaseItem and Task types',
      'Create Task Hub and Urgent Task SubHub',
    ],
  },
  {
    date: '15.2',
    weekday: { he: 'שבת', en: 'Sat' },
    commits: 7,
    mood: 'explosion',
    title: { he: 'ימים 4-6 — פיצוץ סקופ', en: 'Days 4-6 — Scope explosion' },
    details: {
      he: 'OCR עם תמיכה בעברית, ניווט קרוסלה, ואז — "Architecture overhaul" ו-"Complete UI/UX overhaul". קפיצות ענק בלי תכנון. מרשימת קניות לארבעה הבים ב-5 ימים.',
      en: 'OCR with Hebrew support, carousel navigation, then — "Architecture overhaul" and "Complete UI/UX overhaul". Huge jumps with no plan. From a shopping list to four hubs in 5 days.',
    },
    commits_sample: [
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
    subscription: 370,
    title: { he: 'יום 7 — ה-Migration הגדול', en: 'Day 7 — The Big Migration' },
    details: {
      he: 'commit אחד: "Migrate all data storage from localStorage to Supabase". שינוי מאסיבי. ואז 10 תיקונים ברצף — auth שבור, מובייל שבור, קרוסלה שבורה. באותו יום עברתי ל-Claude Max.',
      en: 'One commit: "Migrate all data storage from localStorage to Supabase". Massive change. Then 10 consecutive fixes — auth broken, mobile broken, carousel broken. Same day I switched to Claude Max.',
    },
    commits_sample: [
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
      he: '19 קומיטים. אפס פיצ׳רים חדשים. כולם תיקונים. מקלדת חוסמת, מודאלים שוברים גבולות, טפסים גולשים ב-iOS. הבנתי: צריך לעצור ולחשוב.',
      en: '19 commits. Zero new features. All fixes. Keyboard blocking content, modals breaking bounds, forms overflowing on iOS. I realized: need to stop and think.',
    },
    commits_sample: [
      'Fix mobile keyboard obstruction',
      'Fix carousel light-up broken by scroll listener',
      'Fix date/priority overflow on iOS',
      'Fix VouchersHub template modal bounds',
    ],
  },
]

// Pre-compute cumulative costs
const cumulativeCosts = days.reduce((acc, day, i) => {
  const prev = i > 0 ? acc[i - 1] : { api: 62, total: 62 } // starts with 62 ILS from Feb 2 exploration
  const api = prev.api + (day.apiCost || 0)
  const total = api + (day.subscription || 0)
  acc.push({ api, total, dayApi: day.apiCost || 0, subscription: day.subscription || 0 })
  return acc
}, [])

const maxTotal = cumulativeCosts[cumulativeCosts.length - 1].total

const moodColors = {
  fire: '#F59E0B',
  warning: '#EF4444',
  calm: '#10B981',
  explosion: '#8B5CF6',
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

      {/* Cost bar — always visible, fills based on selected day */}
      <div style={{
        margin: '0 0 12px',
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

          {/* Bar tracks */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* API bar */}
            <div style={{
              height: 14,
              borderRadius: 4,
              background: 'var(--border)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 4,
                width: cumulative ? `${Math.max((cumulative.api / maxTotal) * 100, 3)}%` : '0%',
                background: 'linear-gradient(90deg, #F59E0B60, #EF444480)',
                transition: 'width 0.4s ease',
              }} />
            </div>
            {/* Max subscription bar — only when active */}
            {cumulative?.subscription > 0 && (
              <div style={{
                height: 14,
                borderRadius: 4,
                background: 'var(--border)',
                position: 'relative',
                overflow: 'hidden',
                animation: 'fadeIn 0.3s ease',
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 4,
                  width: `${(cumulative.subscription / maxTotal) * 100}%`,
                  background: 'linear-gradient(90deg, #8B5CF660, #8B5CF6)',
                  transition: 'width 0.4s ease',
                }} />
                <span style={{
                  position: 'absolute',
                  insetInlineStart: 6,
                  top: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: 'var(--font-code)',
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#fff',
                }}>
                  Claude Max $100/mo
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
              ? cumulative.subscription > 0 ? '#8B5CF6' : '#F59E0B'
              : 'var(--text-soft)',
            minWidth: 45,
            textAlign: isRtl ? 'left' : 'right',
            transition: 'color 0.3s ease',
          }}>
            {cumulative ? `${cumulative.total} ₪` : '—'}
          </span>
        </div>

        {/* Breakdown labels */}
        {cumulative && (
          <div style={{
            padding: '0 12px 6px',
            display: 'flex',
            gap: 12,
            direction: isRtl ? 'rtl' : 'ltr',
          }}>
            <span style={{
              fontFamily: 'var(--font-code)',
              fontSize: 9,
              color: '#F59E0B',
            }}>
              API: {cumulative.api} ₪
              {cumulative.dayApi > 0 && (
                <span style={{ opacity: 0.6 }}> (+{cumulative.dayApi})</span>
              )}
            </span>
          </div>
        )}
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
                    color: '#8B5CF6',
                    background: '#8B5CF615',
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

            {/* Sample commits */}
            <div style={{
              padding: '8px 14px 10px',
              borderTop: `1px solid ${color}10`,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}>
              {day.commits_sample.map((commit, j) => (
                <div key={j} style={{
                  fontFamily: 'var(--font-code)',
                  fontSize: 10,
                  color: 'var(--text-soft)',
                  lineHeight: 1.5,
                  direction: 'ltr',
                  textAlign: isRtl ? 'right' : 'left',
                }}>
                  <span style={{ color: color, opacity: 0.6 }}>{'>'}</span>{' '}
                  {commit}
                </div>
              ))}
            </div>
          </div>
        )
      })()}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}