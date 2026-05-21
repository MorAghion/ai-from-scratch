import { useState } from 'react'
import { useLang } from '../App'
import { Lightning } from '@phosphor-icons/react'

const sections = [
  { he: 'Frontmatter', en: 'Frontmatter', desc: { he: 'שם ה-skill ותיאור קצר - Claude משתמש בתיאור להחליט מתי להפעיל אותו אוטומטית', en: "Skill name and short description — Claude uses the description to decide when to auto-trigger" } },
  { he: 'Trigger', en: 'Trigger', desc: { he: 'מתי ה-skill צריך לרוץ', en: 'When the skill should run' } },
  { he: 'Instructions', en: 'Instructions', desc: { he: 'מה לעשות, צעד אחר צעד', en: 'What to do, step by step' } },
  { he: 'Output Format', en: 'Output Format', desc: { he: 'איך הפלט צריך להיראות', en: 'What the output should look like' } },
]

const snippet = `---
name: commit
description: Write a conventional commit message for staged changes
---

# Commit Message Skill

## When to use
- User asks "commit this" / "make a commit" / runs /commit
- After completing a logical chunk of work

## Instructions
1. Run \`git diff --cached\` to see staged changes
2. If nothing is staged, ask which files to stage
3. Identify the change type:
   - feat: new feature
   - fix: bug fix
   - docs: docs only
   - refactor: code restructure, no behavior change
   - test: tests only
   - chore: build/tooling
4. Pick the most affected scope (component/area name)
5. Write a one-line subject in conventional format
6. If the change is non-trivial, add a body explaining WHY

## Output Format
\`\`\`
type(scope): short subject under 72 chars

Optional body explaining the reasoning behind the change.
Wrap at 72 chars.

Co-Authored-By: Claude <noreply@anthropic.com>
\`\`\`

## Examples
- \`feat(landing): add flashing "חדש!" badge on VC card\`
- \`fix(ChapterView): correct RTL ordering for ₪ symbol\`
- \`docs(Ch20): add caveman to community projects table\``

export default function SkillMdExample() {
  const [open, setOpen] = useState(false)
  const { lang } = useLang()
  const isRtl = lang === 'he'
  const fontFamily = isRtl ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <div style={{
      border: '1.5px solid rgba(74, 107, 138, 0.3)',
      borderRadius: 10,
      overflow: 'hidden',
      transition: 'border-color 0.2s ease',
      margin: '8px 0 16px',
    }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '10px 16px',
          border: 'none',
          background: open ? 'var(--surface)' : 'transparent',
          cursor: 'pointer',
          fontFamily,
          fontSize: 13,
          fontWeight: 600,
          color: '#4A6B8A',
          direction: isRtl ? 'rtl' : 'ltr',
          textAlign: isRtl ? 'right' : 'left',
          transition: 'background-color 0.2s ease',
        }}
      >
        <Lightning size={15} weight="duotone" />
        <span style={{ flex: 1 }}>
          {isRtl ? (
            <>
              דוגמה - skill לכתיבת commits{' '}
              <span dir="ltr" style={{ unicodeBidi: 'isolate', fontFamily: 'var(--font-code)', fontSize: 12, opacity: 0.75 }}>
                (.claude/commands/commit.md)
              </span>
            </>
          ) : (
            <>
              Example - commit-writing skill{' '}
              <span dir="ltr" style={{ unicodeBidi: 'isolate', fontFamily: 'var(--font-code)', fontSize: 12, opacity: 0.75 }}>
                (.claude/commands/commit.md)
              </span>
            </>
          )}
        </span>
        <span style={{
          fontSize: 11,
          transition: 'transform 0.2s ease',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          opacity: 0.5,
        }}>▼</span>
      </button>

      {open && (
        <div style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{ padding: '10px 16px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sections.map((section, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, direction: isRtl ? 'rtl' : 'ltr' }}>
                <span style={{ color: 'var(--text-soft)', fontSize: 10, flexShrink: 0 }}>●</span>
                <span style={{ fontFamily, fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--heading)', fontWeight: 600 }}>{section[lang]}</strong>
                  {' '}—{' '}
                  <span style={{ color: 'var(--text-soft)' }}>{section.desc[lang]}</span>
                </span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', padding: '12px 16px 14px' }}>
            <pre dir="ltr" style={{
              fontFamily: 'var(--font-code)',
              fontSize: 12,
              lineHeight: 1.6,
              color: 'var(--text)',
              backgroundColor: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '12px 16px',
              overflowX: 'auto',
              whiteSpace: 'pre',
              margin: 0,
            }}>{snippet}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
