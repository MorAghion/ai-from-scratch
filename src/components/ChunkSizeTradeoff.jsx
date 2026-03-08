import CollapsibleBubble from './CollapsibleBubble'
import { useLang } from '../App'

const content = {
  he: {
    title: 'גודל ה-Chunk — עוד Trade-off',
    small: 'חתיכות קטנות מדי (משפט אחד) — מדויקות אבל חסרות הקשר. "רמות גבוהות של ציאניד" בלי לדעת שזה מדוח נתיחה לא מספיק.',
    big: 'חתיכות גדולות מדי (עמוד שלם) — עשירות בהקשר אבל המשמעות מטשטשת, ותופסות הרבה מקום ב-Context Window.',
    practice: 'הגודל הנפוץ בפרקטיקה: 200–500 טוקנים לחתיכה, עם חפיפה (Overlap) של 50–100 טוקנים בין חתיכות שכנות — כדי שמשפט שנחצה בין שתי חתיכות לא יאבד.',
  },
  en: {
    title: 'Chunk Size — Another Trade-off',
    small: 'Chunks too small (one sentence) — precise but lack context. "High levels of cyanide" without knowing it\'s from an autopsy report isn\'t enough.',
    big: 'Chunks too large (full page) — rich in context but meaning blurs, and they take up a lot of Context Window space.',
    practice: 'Common practice: 200–500 tokens per chunk, with 50–100 token Overlap between adjacent chunks — so a sentence split between two chunks doesn\'t get lost.',
  },
}

export default function ChunkSizeTradeoff() {
  const { lang } = useLang()
  const t = content[lang] || content.he
  const fontFamily = lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)'

  return (
    <CollapsibleBubble type="detail">
      <div style={{ fontFamily, fontSize: 14, lineHeight: 1.75, color: 'var(--text)' }}>
        <p style={{ marginBottom: 10 }}>
          <strong style={{ color: 'var(--heading)' }}>{t.title}</strong>
        </p>
        <p style={{ marginBottom: 8 }}>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>1.</span> {t.small}
        </p>
        <p style={{ marginBottom: 8 }}>
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>2.</span> {t.big}
        </p>
        <p style={{ marginTop: 12, padding: '8px 12px', borderRadius: 6, background: 'var(--accent-soft)', fontSize: 13 }}>
          {t.practice}
        </p>
      </div>
    </CollapsibleBubble>
  )
}
