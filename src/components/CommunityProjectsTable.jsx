import { useLang } from '../App'

const projects = [
  {
    name: 'obra/superpowers',
    url: 'https://github.com/obra/superpowers',
    stars: '149K',
    desc: {
      he: 'מתקינים פעם אחת - Claude Code מקבל מתודולוגיה קבועה: TDD, תכנון לפני קוד, subagents. ה-install הכי בעל ערך שיש.',
      en: 'Install once — Claude Code gets a persistent methodology: TDD, plan-before-code, subagents. Highest-leverage install there is.',
    },
  },
  {
    name: 'OpenHands/OpenHands',
    url: 'https://github.com/OpenHands/OpenHands',
    stars: '71K',
    desc: {
      he: 'Claude רץ בתוך sandbox ומסיים features מקצה לקצה - כותב, מריץ, מדבג ומתקן בלי שתצטרכו להתערב.',
      en: 'Claude runs inside a sandbox and completes features end-to-end — writes, runs, debugs and fixes without you intervening.',
    },
  },
  {
    name: 'hesreallyhim/awesome-claude-code',
    url: 'https://github.com/hesreallyhim/awesome-claude-code',
    stars: '38K',
    desc: {
      he: 'האינדקס של כל האקוסיסטם - skills, hooks, MCP servers, plugins. המקום הראשון לפתוח כשרוצים למצוא משהו.',
      en: 'The index of the entire ecosystem — skills, hooks, MCP servers, plugins. First place to open when looking for something.',
    },
  },
  {
    name: 'yamadashy/repomix',
    url: 'https://github.com/yamadashy/repomix',
    stars: '23K',
    desc: {
      he: '`npx repomix` בתיקיית הפרויקט - מקבלים קובץ אחד עם כל הקוד, מוכן להדבקה ל-Claude.',
      en: 'Run `npx repomix` in your project — get one file with all the code, ready to paste into Claude.',
    },
  },
  {
    name: 'JuliusBrussee/caveman',
    url: 'https://github.com/JuliusBrussee/caveman',
    stars: '23.5K',
    desc: {
      he: 'skill שגורם לClaude לדבר בסגנון מינימלי וחוסך ~25% מה-tokens (לא 75% שמבטיחים בכותרות - זה רק output tokens). הכי ויראלי ב-GitHub ב-אפריל 2026.',
      en: 'Skill that makes Claude speak minimally, saving ~25% of tokens in practice (the "75%" in headlines is output-only). Most viral repo on GitHub in April 2026.',
    },
  },
]

const color = '#1E4D8C'

export default function CommunityProjectsTable() {
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 10,
      overflow: 'hidden',
      margin: '8px 0 16px',
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        direction: isRtl ? 'rtl' : 'ltr',
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            {[
              isRtl ? 'פרויקט' : 'Project',
              isRtl ? 'מה הוא עושה' : 'What it does',
            ].map((h, i) => (
              <th key={i} style={{
                padding: '10px 16px',
                textAlign: isRtl ? 'right' : 'left',
                fontWeight: 600,
                color,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-body)',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.map((p, i) => (
            <tr key={i} style={{
              borderBottom: i < projects.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    display: 'block',
                    marginBottom: 4,
                  }}
                >
                  {p.name}
                </a>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-soft)',
                }}>
                  ⭐ {p.stars}
                </span>
              </td>
              <td style={{
                padding: '12px 16px',
                color: 'var(--text)',
                lineHeight: 1.7,
                fontSize: 14,
                fontFamily,
                verticalAlign: 'top',
              }}>
                {p.desc[lang]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
