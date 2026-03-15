import { useLang } from '../App'

const data = {
  he: {
    headers: ['המילה', 'וקטור ה-Embedding', 'הסבר'],
    rows: [
      ['ציאניד', '[0.99, 0.10, 0.85]', 'רעיל מאוד, מוצק בד"כ, קשר חזק לפשע'],
      ['רעל', '[0.95, 0.40, 0.80]', 'רעיל מאוד, נוזל או מוצק, קשר לפשע'],
      ['יין פורט', '[0.05, 0.95, 0.10]', 'לא רעיל, נוזלי מאוד, קשר חלש לפשע'],
    ],
  },
  en: {
    headers: ['Word', 'Embedding Vector', 'Explanation'],
    rows: [
      ['Cyanide', '[0.99, 0.10, 0.85]', 'Very toxic, usually solid, strong crime link'],
      ['Poison', '[0.95, 0.40, 0.80]', 'Very toxic, liquid or solid, crime link'],
      ['Port Wine', '[0.05, 0.95, 0.10]', 'Not toxic, very liquid, weak crime link'],
    ],
  },
}

export default function EmbeddingTable() {
  const { lang } = useLang()
  const t = data[lang] || data.he
  const isRTL = lang === 'he'

  return (
    <div style={{ margin: '16px 0', overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          direction: isRTL ? 'rtl' : 'ltr',
          fontSize: 14,
          fontFamily: 'monospace',
        }}
      >
        <thead>
          <tr>
            {t.headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: '10px 14px',
                  textAlign: isRTL ? 'right' : 'left',
                  borderBottom: '2px solid var(--border)',
                  color: 'var(--text)',
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {t.rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  style={{
                    padding: '9px 14px',
                    textAlign: isRTL ? 'right' : 'left',
                    borderBottom: '1px solid var(--border)',
                    color: ci === 1 ? '#6366F1' : 'var(--text)',
                    fontWeight: ci === 0 ? 600 : 400,
                    fontFamily: ci === 1 ? 'monospace' : 'inherit',
                    fontSize: ci === 1 ? 13 : 14,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
