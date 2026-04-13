import { useLang } from '../App'

const cast = [
  {
    emoji: '🎩',
    name: 'The Mayor',
    desc: {
      he: 'ה-Chief of Staff של המערכת. אתם מדברים איתו - הוא זה שמפרש את הכוונה שלכם, מחליט אילו polecats להפעיל, עוקב אחרי ההתקדמות, ומסנתז את העבודה לפני merge. אתם לא מדברים עם הסוכנים ישירות.',
      en: 'The system\'s Chief of Staff. You talk to him - he interprets your intent, decides which polecats to activate, tracks progress, and synthesizes their work before merging. You never talk to polecats directly.',
    },
  },
  {
    emoji: '🐱',
    name: 'Polecats',
    desc: {
      he: 'הסוכנים הפועלים. נוצרים לפי משימה, עובדים ב-branch משלהם ומגישים merge request.',
      en: 'The worker agents. Created per task, work in their own branch, and submit a merge request.',
    },
  },
  {
    emoji: '🏭',
    name: 'The Refinery',
    desc: {
      he: 'מנהל את תור ה-merges. כשכמה polecats מסיימים בו-זמנית, הוא קולט את כל ה-branches ומבצע את ה-merge אחד אחרי השני - בסדר נכון, בלי קונפליקטים, בלי שתצטרכו להתערב.',
      en: 'Manages the merge queue. When multiple polecats finish at the same time, it collects all their branches and merges them one by one - in the right order, without conflicts, without you needing to intervene.',
    },
  },
  {
    emoji: '🦉',
    name: 'The Witness',
    desc: {
      he: 'סוכן פטרול שמנטר את ה-polecats ומסיר חסמים כשהם נתקעים.',
      en: 'A patrol agent that monitors polecats and removes blockers when they get stuck.',
    },
  },
  {
    emoji: '🐺🐕',
    name: 'Deacon + Dogs',
    desc: {
      he: 'תהליכים אוטומטיים שרצים ברקע ללא הפסקה - בודקים תקינות, מזהים polecats תקועים, ומנקים אחרי עצמם. Deacon הוא ה-daemon הראשי; ה-Dogs הם תהליכים עוזרים (למשל Boot, שבודק בריאות כל 5 דקות).',
      en: 'Background processes running continuously - checking health, detecting stuck polecats, and cleaning up. Deacon is the main daemon; Dogs are helper processes (e.g. Boot, which checks health every 5 minutes).',
    },
  },
  {
    emoji: '👷',
    name: 'Crew',
    desc: {
      he: 'סוכנים קבועים לכל ה-rig עם זהות מתמשכת, מנוהלים ישירות על ידי ה-Overseer.',
      en: 'Persistent per-rig agents with ongoing identities, managed directly by the Overseer.',
    },
  },
  {
    emoji: '📦',
    name: 'Rig',
    desc: {
      he: 'לא סוכן - אלא Git repository שנמצא תחת ניהול Gas Town. כל rig הוא פרויקט נפרד עם polecats, crew, ו-branch משלו.',
      en: 'Not an agent - a Git repository managed by Gas Town. Each rig is a separate project with its own polecats, crew, and branches.',
    },
  },
  {
    emoji: '👤',
    name: 'The Overseer',
    desc: {
      he: 'אתם. יש לכם inbox, זהות, וכל הצוות עובד בשבילכם.',
      en: "That's you. You have an inbox, an identity, and the whole team works for you.",
    },
  },
]

const color = '#1E4D8C'

export default function GTCastTable() {
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
        fontFamily,
        fontSize: 13.5,
        direction: isRtl ? 'rtl' : 'ltr',
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            {[
              isRtl ? 'תפקיד' : 'Role',
              isRtl ? 'תיאור' : 'Description',
            ].map((h, i) => (
              <th key={i} style={{
                padding: '8px 14px',
                textAlign: isRtl ? 'right' : 'left',
                fontWeight: 600,
                color,
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cast.map((member, i) => (
            <tr key={i} style={{
              borderBottom: i < cast.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <td style={{ padding: '9px 14px', whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 600, color: 'var(--heading)', fontSize: 14 }}>
                  {member.emoji} {member.name}
                </span>
              </td>
              <td style={{ padding: '9px 14px', color: 'var(--text)', lineHeight: 1.6 }}>
                {member.desc[lang]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
