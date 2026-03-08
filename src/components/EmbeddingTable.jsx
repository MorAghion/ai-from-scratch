import { useLang } from '../App'

const data = {
  he: {
    headers: ['המילה', 'וקטור ה-Embedding', 'הסבר'],
    rows: [
      ['ציאניד', '[0.98, 0.10]', 'רעיל מאוד (0.98), מוצק בד"כ (0.10)'],
      ['רעל', '[0.95, 0.40]', 'רעיל מאוד, יכול להיות נוזל או מוצק'],
      ['יין פורט', '[0.05, 0.95]', 'לא רעיל (0.05), נוזלי מאוד (0.95)'],
    ],
  },
  en: {
    headers: ['Word', 'Embedding Vector', 'Explanation'],
    rows: [
      ['Cyanide', '[0.98, 0.10]', 'Very toxic (0.98), usually solid (0.10)'],
      ['Poison', '[0.95, 0.40]', 'Very toxic, can be liquid or solid'],
      ['Port Wine', '[0.05, 0.95]', 'Not toxic (0.05), very liquid (0.95)'],
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
