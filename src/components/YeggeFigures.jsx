import CollapsibleBubble from './CollapsibleBubble'
import { useLang } from '../App'

const figures = {
  he: [
    { num: 1, title: 'אפס או כמעט אפס AI', desc: 'אולי השלמות קוד, לפעמים שואלים שאלות בצ\'אט.' },
    { num: 2, title: 'סוכן קוד ב-IDE, עם הרשאות', desc: 'סוכן צר בסרגל צד שמבקש אישור לפני כל פעולה.' },
    { num: 3, title: 'סוכן ב-IDE, מצב YOLO', desc: 'האמון עולה. מכבים הרשאות, הסוכן מקבל יותר חופש.' },
    { num: 4, title: 'סוכן רחב ב-IDE', desc: 'הסוכן גדל עד שהוא ממלא את המסך. קוד הוא רק diffs.' },
    { num: 5, title: 'CLI, סוכן בודד, YOLO', desc: 'Diffs רצים על המסך. אולי מסתכלים עליהם, אולי לא.' },
    { num: 6, title: 'CLI, מולטי-סוכן, YOLO', desc: 'עובדים עם 3-5 סוכנים במקביל באופן קבוע. מהירות גבוהה.' },
    { num: 7, title: '10+ סוכנים, ניהול ידני', desc: 'מתחילים לדחוף את הגבולות של ניהול ידני.' },
    { num: 8, title: 'בונים אורקסטרטור משלכם', desc: 'אתם בחזית — מאטמטים את תהליך העבודה שלכם.' },
  ],
  en: [
    { num: 1, title: 'Zero or Near-Zero AI', desc: 'Maybe code completions, sometimes ask Chat questions.' },
    { num: 2, title: 'Coding agent in IDE, permissions on', desc: 'A narrow coding agent in a sidebar asks permission to run tools.' },
    { num: 3, title: 'Agent in IDE, YOLO mode', desc: 'Trust goes up. You turn off permissions, agent gets wider.' },
    { num: 4, title: 'Wide agent in IDE', desc: 'Your agent gradually grows to fill the screen. Code is just for diffs.' },
    { num: 5, title: 'CLI, single agent, YOLO', desc: 'Diffs scroll by. You may or may not look at them.' },
    { num: 6, title: 'CLI, multi-agent, YOLO', desc: 'You regularly use 3-5 parallel instances. You are very fast.' },
    { num: 7, title: '10+ agents, hand-managed', desc: 'You are starting to push the limits of hand-management.' },
    { num: 8, title: 'Building your own orchestrator', desc: 'You are on the frontier, automating your workflow.' },
  ],
}

const titles = {
  he: '8 הרמות של ייגי — מאיפה לאיפה',
  en: "Yegge's 8 Figures — From Where to Where",
}

export function YeggeFiguresEpilogue() {
  return <YeggeFigures variant="epilogue" />
}

export default function YeggeFigures({ variant } = {}) {
  const { lang } = useLang()
  const t = figures[lang] || figures.he
  const title = titles[lang] || titles.he
  const fontFamily = lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)'
  const isRtl = lang === 'he'

  return (
    <div id="section-yegge-diagram">
    <CollapsibleBubble type="detail" label={title}>
      <div style={{ fontFamily, fontSize: 14, lineHeight: 1.75, color: 'var(--text)', direction: isRtl ? 'rtl' : 'ltr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {t.map(f => (
            <div key={f.num} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '6px 10px',
              borderRadius: 6,
            }}>
              <span style={{
                minWidth: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'monospace',
                color: 'var(--text-soft)',
                background: 'var(--border)',
                flexShrink: 0,
              }}>
                {f.num}
              </span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                <span>
                  <span style={{ fontWeight: 600, color: 'var(--heading)' }}>{f.title}</span>
                  <span style={{ color: 'var(--text-soft)', marginInlineStart: 6, fontSize: 13 }}>— {f.desc}</span>
                </span>
                {f.num === 1 && variant !== 'epilogue' && (
                  <span style={{
                    background: '#EF4444',
                    color: '#fff',
                    fontFamily: 'var(--font-code)',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    whiteSpace: 'nowrap',
                  }}>
                    {isRtl ? '← התחלתי כאן' : 'I started here →'}
                  </span>
                )}
                {f.num === 3 && variant === 'epilogue' && (
                  <span style={{
                    background: '#EF4444',
                    color: '#fff',
                    fontFamily: 'var(--font-code)',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    whiteSpace: 'nowrap',
                  }}>
                    {isRtl ? '← אני כאן' : 'I am here →'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CollapsibleBubble>
    </div>
  )
}
