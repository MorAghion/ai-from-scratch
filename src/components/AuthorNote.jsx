import { useLang } from '../App'

const defaultText = {
  he: 'חשוב לי לציין שהדגש כאן בעיקר הוא על התהליך ופחות על האפליקציה עצמה (למרות שאני מאוד גאה בה!)',
  en: "It's important to me to mention that the focus here is mainly on the process and less on the app itself (though I'm very proud of it!)",
}

const labelText = { he: 'הערה ממני', en: 'A note from me' }

export default function AuthorNote({ text }) {
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'
  const body = text || defaultText[lang]

  return (
    <div style={{
      borderInlineStart: '3px solid #C2652A',
      background: 'rgba(194, 101, 42, 0.04)',
      padding: '10px 14px',
      margin: '12px 0',
      direction: isRtl ? 'rtl' : 'ltr',
      borderRadius: '0 6px 6px 0',
    }}>
      <div style={{
        fontFamily,
        fontSize: 11,
        fontWeight: 700,
        color: '#C2652A',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        marginBottom: 4,
        opacity: 0.85,
      }}>
        {labelText[lang]}
      </div>
      <div style={{
        fontFamily,
        fontSize: 14,
        lineHeight: 1.7,
        color: 'var(--text)',
        fontStyle: 'italic',
      }}>
        {body}
      </div>
    </div>
  )
}
