import { useLang } from '../App'
import CollapsibleBubble from './CollapsibleBubble'

const label = {
  he: 'מדריך הקמת GitHub - הרשמי',
  en: 'Official GitHub setup guide',
}

const intro = {
  he: 'GitHub פרסמו מדריך קצר וויזואלי שעובר על הבסיס: יצירת repository, branches, commits ו-pull requests. אין צורך בידע מקדים או טרמינל.',
  en: 'GitHub published a short visual guide covering the basics: creating a repository, branches, commits, and pull requests. No prior knowledge or terminal needed.',
}

const linkText = {
  he: 'GitHub Hello World - מדריך התחלה רשמי ←',
  en: 'GitHub Hello World — Official getting-started guide →',
}

const url = 'https://docs.github.com/en/get-started/quickstart/hello-world'

export default function GitHubSetupGuide() {
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <CollapsibleBubble type="setup" label={label[lang]} defaultOpen={true}>
      <div style={{
        fontFamily,
        fontSize: 14,
        lineHeight: 1.7,
        color: 'var(--text)',
        direction: isRtl ? 'rtl' : 'ltr',
      }}>
        <p style={{ marginBottom: 10 }}>{intro[lang]}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-code)',
            fontSize: 13,
            color: 'var(--accent)',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            fontWeight: 600,
          }}
        >
          {linkText[lang]}
        </a>
      </div>
    </CollapsibleBubble>
  )
}
