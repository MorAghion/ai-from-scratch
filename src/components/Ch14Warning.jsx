import { Warning } from '@phosphor-icons/react'
import { useLang } from '../App'

const content = {
  he: 'חלק זה הוא טכני ומעצבן, אבל כמו לצחצח שיניים - חייבים לעשות את זה. וכמו כל דבר, בקשו הדרכה מהסוכן שתבחרו לעבוד איתו.',
  en: 'This is a technical and annoying part, but like brushing your teeth — you have to do it. And like anything else, ask the agent you choose to work with for guidance.',
}

const labelText = { he: 'אזהרה', en: 'Warning' }

export default function Ch14Warning() {
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{
      border: '1.5px solid var(--bubble-warning)',
      borderRadius: 10,
      background: 'var(--bubble-warning-bg)',
      padding: '12px 16px',
      marginBottom: 16,
      direction: isRtl ? 'rtl' : 'ltr',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
      }}>
        <Warning size={18} weight="duotone" color="var(--bubble-warning)" />
        <span style={{
          fontFamily,
          fontSize: 13,
          fontWeight: 700,
          color: 'var(--bubble-warning)',
          letterSpacing: '0.02em',
        }}>
          {labelText[lang]}
        </span>
      </div>
      <div style={{
        fontFamily,
        fontSize: 14,
        lineHeight: 1.7,
        color: 'var(--text)',
      }}>
        {content[lang]}
      </div>
    </div>
  )
}
