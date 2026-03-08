import { useLang } from '../App'

const rows = [
  {
    con: { he: 'איבוד ניואנסים: בסיכום תמיד הולך לאיבוד מידע קטן (למשל, צבע החולצה של החשוד).', en: 'Loss of nuance: summaries always lose small details (e.g., the color of the suspect\'s shirt).' },
    pro: { he: 'מפנה מקום: מאפשר שיחות שנמשכות לנצח.', en: 'Frees space: enables conversations that last forever.' },
  },
  {
    con: { he: 'עלות עיבוד: צריך להפעיל מודל AI נוסף (ה-Summarizer) וזה לוקח זמן.', en: 'Processing cost: requires running an additional AI model (the Summarizer), which takes time.' },
    pro: { he: 'מהירות: פחות טוקנים = עיבוד מהיר יותר של ההודעה הבאה.', en: 'Speed: fewer tokens = faster processing of the next message.' },
  },
  {
    con: { he: 'סיכון להטיות: הסיכום עצמו הוא פרשנות של המודל, והוא עלול "להחליט" שמשהו לא חשוב למרות שהוא כן.', en: 'Bias risk: the summary is the model\'s interpretation — it may "decide" something is unimportant when it isn\'t.' },
    pro: { he: 'מיקוד: עוזר למודל לא להתבלבל ממידע לא רלוונטי.', en: 'Focus: helps the model not get confused by irrelevant information.' },
  },
]

const red = '#EF4444'
const green = '#10B981'

export default function TradeoffTable() {
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{
      margin: '20px 0',
      borderRadius: 10,
      border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          padding: '10px 14px',
          background: `${red}12`,
          fontFamily: 'var(--font-code)',
          fontSize: 11,
          fontWeight: 700,
          color: red,
          textTransform: 'uppercase',
          letterSpacing: 1,
          textAlign: 'center',
          borderRight: isRtl ? 'none' : '1px solid var(--border)',
          borderLeft: isRtl ? '1px solid var(--border)' : 'none',
        }}>
          {isRtl ? 'חיסרון הסיכום' : 'Summarization Cost'}
        </div>
        <div style={{
          padding: '10px 14px',
          background: `${green}12`,
          fontFamily: 'var(--font-code)',
          fontSize: 11,
          fontWeight: 700,
          color: green,
          textTransform: 'uppercase',
          letterSpacing: 1,
          textAlign: 'center',
        }}>
          {isRtl ? 'יתרון הסיכום' : 'Summarization Benefit'}
        </div>
      </div>

      {/* Rows */}
      {rows.map((row, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none',
        }}>
          <div style={{
            padding: '10px 14px',
            fontFamily,
            fontSize: 13,
            lineHeight: 1.6,
            color: 'var(--text)',
            borderRight: isRtl ? 'none' : '1px solid var(--border)',
            borderLeft: isRtl ? '1px solid var(--border)' : 'none',
            background: `${red}05`,
          }}>
            {row.con[lang]}
          </div>
          <div style={{
            padding: '10px 14px',
            fontFamily,
            fontSize: 13,
            lineHeight: 1.6,
            color: 'var(--text)',
            background: `${green}05`,
          }}>
            {row.pro[lang]}
          </div>
        </div>
      ))}
    </div>
  )
}
