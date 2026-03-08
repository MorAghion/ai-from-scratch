import { useLang } from '../App'

const stages = [
  {
    chapter: 4,
    label: { he: 'פרק 4 — מבנה הפרויקט + ראיות', en: 'Ch 4 — Project Structure + Evidence' },
    color: '#0EA5E9',
    files: [
      { name: 'crime_scene.txt', indent: 0, isNew: true },
      { name: 'evidence/', indent: 0, isNew: true },
      { name: 'autopsy_report.txt', indent: 1, isNew: true },
      { name: 'witness_statement_1.txt', indent: 1, isNew: true },
      { name: 'witness_statement_2.txt', indent: 1, isNew: true },
    ],
  },
  {
    chapter: 5,
    label: { he: 'פרק 5 — סוכן בלשי', en: 'Ch 5 — Detective Agent' },
    color: '#f9d716',
    files: [
      { name: 'detective.py', indent: 0, isNew: true },
      { name: 'tools.py', indent: 0, isNew: true },
      { name: 'tools_schemas.py', indent: 0, isNew: true },
    ],
  },
  {
    chapter: 11,
    label: { he: 'פרק 11 — קונטיינר', en: 'Ch 11 — Container' },
    color: '#14B8A6',
    files: [
      { name: 'Dockerfile', indent: 0, isNew: true },
    ],
  },
]

// Build the tree up to a given chapter (or all if not specified)
function buildTree(upToChapter) {
  const tree = []
  for (const stage of stages) {
    if (upToChapter && stage.chapter > upToChapter) break
    for (const file of stage.files) {
      tree.push({ ...file, color: stage.color, chapter: stage.chapter })
    }
  }
  return tree
}

function TreeLine({ name, indent, color, isLast, isDir }) {
  const connector = indent === 0
    ? (isLast ? '└── ' : '├── ')
    : (isLast ? '    └── ' : '    ├── ')

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-code)',
      fontSize: 13,
      lineHeight: 2,
    }}>
      <span style={{ color: 'var(--text-soft)', whiteSpace: 'pre' }}>{connector}</span>
      <span style={{
        color: color,
        fontWeight: 500,
      }}>
        {name}
      </span>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: color,
        flexShrink: 0,
        opacity: 0.7,
      }} />
    </div>
  )
}

export default function DetectiveFilesystem({ upToChapter } = {}) {
  const { lang } = useLang()

  const filteredStages = upToChapter
    ? stages.filter(s => s.chapter <= upToChapter)
    : stages

  const tree = buildTree(upToChapter)

  // Separate root-level and nested files
  const rootFiles = tree.filter(f => f.indent === 0 && !f.name.endsWith('/'))
  const dirs = tree.filter(f => f.name.endsWith('/'))
  const nestedFiles = tree.filter(f => f.indent === 1)

  // Build display order: root files first, then dirs with children, preserving chapter order
  const orderedItems = []
  const rootNonDirs = tree.filter(f => f.indent === 0 && !f.name.endsWith('/'))
  const dirEntries = tree.filter(f => f.indent === 0 && f.name.endsWith('/'))

  // Add root files
  for (const f of rootNonDirs) {
    orderedItems.push(f)
  }
  // Add dirs with their children
  for (const dir of dirEntries) {
    orderedItems.push(dir)
    const children = tree.filter(f => f.indent === 1 && f.chapter === dir.chapter)
    for (const child of children) {
      orderedItems.push(child)
    }
  }

  return (
    <div style={{
      backgroundColor: 'var(--bg)',
      border: '1px solid var(--border)',
      borderRadius: 10,
      padding: '20px 24px',
      marginBottom: 16,
    }}>
      {/* Legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: '1px solid var(--border)',
      }}>
        {filteredStages.map(stage => (
          <div key={stage.chapter} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: stage.color,
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
              fontSize: 12,
              color: 'var(--text-soft)',
            }}>
              {stage.label[lang]}
            </span>
          </div>
        ))}
      </div>

      {/* Tree */}
      <div dir="ltr" style={{ textAlign: 'left' }}>
        <div style={{
          fontFamily: 'var(--font-code)',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--heading)',
          marginBottom: 4,
        }}>
          detective-ai/
        </div>
        {orderedItems.map((item, i) => {
          const isLastRoot = item.indent === 0 &&
            !orderedItems.slice(i + 1).some(f => f.indent === 0)
          const isLastNested = item.indent === 1 &&
            (i === orderedItems.length - 1 || orderedItems[i + 1]?.indent === 0)

          return (
            <TreeLine
              key={`${item.name}-${i}`}
              name={item.name}
              indent={item.indent}
              color={item.color}
              isLast={item.indent === 0 ? isLastRoot : isLastNested}
              isDir={item.name.endsWith('/')}
            />
          )
        })}
      </div>
    </div>
  )
}
