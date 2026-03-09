import { useState } from 'react'
import { useLang } from '../App'
import { MagnifyingGlass, DownloadSimple, CaretDown, File, Code, ChatCircleDots } from '@phosphor-icons/react'
import DetectiveFilesystem from './DetectiveFilesystem'
import CollapsibleBubble from './CollapsibleBubble'
import RAGBeforeAfter from './RAGBeforeAfter'

const componentRegistry = {
  DetectiveFilesystem,
  RAGBeforeAfter,
}

// Render inline markdown: **bold**, *italic*, `code`
function renderInline(text, key) {
  const regex = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g
  const parts = []
  let lastIdx = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) parts.push(text.substring(lastIdx, match.index))
    if (match[1]) {
      parts.push(<strong key={`${key}-b-${match.index}`} style={{ color: 'var(--heading)', fontWeight: 600 }}>{match[1]}</strong>)
    } else if (match[2]) {
      parts.push(<em key={`${key}-i-${match.index}`} style={{ color: 'var(--text-soft)' }}>{match[2]}</em>)
    } else if (match[3]) {
      parts.push(
        <code key={`${key}-c-${match.index}`} style={{
          fontFamily: 'var(--font-code)',
          fontSize: '0.9em',
          backgroundColor: 'var(--bg)',
          padding: '2px 6px',
          borderRadius: 4,
          border: '1px solid var(--border)',
        }}>{match[3]}</code>
      )
    }
    lastIdx = match.index + match[0].length
  }
  if (lastIdx < text.length) parts.push(text.substring(lastIdx))
  return parts.length > 1 ? parts : text
}

// Detect if a paragraph is primarily English/LTR content
function isLtrBlock(text) {
  const stripped = text.replace(/\*+/g, '').replace(/`[^`]*`/g, '').trim()
  // Starts with a quote (English prompt)
  if (/^["'""]/.test(stripped)) return true
  // File tree structure
  if (/^[a-zA-Z_\-./├└│──]+$/.test(stripped.split('\n')[0].trim())) return true
  // Count Hebrew vs Latin characters
  const hebrew = (stripped.match(/[\u0590-\u05FF]/g) || []).length
  const latin = (stripped.match(/[a-zA-Z]/g) || []).length
  // If more than 70% Latin, treat as LTR
  if (latin + hebrew > 0 && latin / (latin + hebrew) > 0.7) return true
  return false
}

// Parse detective text into blocks
function parseBlocks(text) {
  const lines = text.split('\n')
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) { i++; continue }

    // Table
    if (line.trim().startsWith('|')) {
      const tableLines = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      blocks.push({ type: 'table', lines: tableLines })
      continue
    }

    // Code block
    if (line.trim().startsWith('```')) {
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++
      blocks.push({ type: 'code', content: codeLines.join('\n') })
      continue
    }

    // Component embed: @@component:Name or @@component:Name:key=value:key2=value2
    if (line.trim().startsWith('@@component:')) {
      const parts = line.trim().split(':').slice(1) // remove @@component prefix
      const name = parts[0].trim()
      const props = {}
      for (let p = 1; p < parts.length; p++) {
        const [k, v] = parts[p].split('=')
        if (k && v) props[k.trim()] = isNaN(v) ? v.trim() : Number(v.trim())
      }
      blocks.push({ type: 'component', name, props })
      i++
      continue
    }

    // Collapsible bubble: @@collapse:type:label / @@endcollapse
    if (line.trim().startsWith('@@collapse:')) {
      const collapseParts = line.trim().split(':')
      const bubbleType = collapseParts[1].trim()
      const bubbleLabel = collapseParts.slice(2).join(':').trim() || ''
      const collapseLines = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('@@endcollapse')) {
        collapseLines.push(lines[i])
        i++
      }
      i++ // skip @@endcollapse
      blocks.push({ type: 'collapse', bubbleType, bubbleLabel, content: collapseLines.join('\n').trim() })
      continue
    }

    // Track selector: @@track:A:label / @@track:B:label / @@endtracks
    if (line.trim().startsWith('@@track:')) {
      const tracks = {}
      let currentTrack = null
      // Parse first track header
      const firstParts = line.trim().split(':')
      const firstKey = firstParts[1].trim()
      const firstLabel = firstParts.slice(2).join(':').trim() || firstKey
      tracks[firstKey] = { label: firstLabel, lines: [] }
      currentTrack = firstKey
      i++
      while (i < lines.length && !lines[i].trim().startsWith('@@endtracks')) {
        if (lines[i].trim().startsWith('@@track:')) {
          const trackParts = lines[i].trim().split(':')
          const key = trackParts[1].trim()
          const label = trackParts.slice(2).join(':').trim() || key
          tracks[key] = { label, lines: [] }
          currentTrack = key
        } else if (currentTrack) {
          tracks[currentTrack].lines.push(lines[i])
        }
        i++
      }
      i++ // skip @@endtracks
      // Convert track lines to raw text for nested parsing
      const trackData = {}
      for (const [key, val] of Object.entries(tracks)) {
        trackData[key] = { label: val.label, content: val.lines.join('\n').trim() }
      }
      blocks.push({ type: 'tracks', tracks: trackData })
      continue
    }

    // Separator
    if (line.trim() === '---') {
      blocks.push({ type: 'separator' })
      i++
      continue
    }

    // Paragraph (group consecutive non-empty, non-special lines)
    const paraLines = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].trim().startsWith('```') &&
      lines[i].trim() !== '---'
    ) {
      paraLines.push(lines[i])
      i++
    }
    blocks.push({ type: 'paragraph', content: paraLines.join('\n') })
  }

  return blocks
}

function FilePreviewCard({ file, lang }) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    if (!open && !content) {
      setLoading(true)
      try {
        const res = await fetch(file.path)
        const text = await res.text()
        setContent(text)
      } catch {
        setContent(lang === 'he' ? 'שגיאה בטעינת הקובץ' : 'Error loading file')
      }
      setLoading(false)
    }
    setOpen(!open)
  }

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 8,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        backgroundColor: 'var(--bg)',
        flexWrap: 'wrap',
      }}>
        <File size={16} weight="duotone" color="var(--text-soft)" />
        <span style={{
          fontFamily: 'var(--font-code)',
          fontSize: 13,
          color: 'var(--text)',
        }}>
          {file.name}
        </span>
        <span style={{
          fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
          fontSize: 12,
          color: 'var(--text-soft)',
          flex: 1,
        }}>
          {file.label[lang]}
        </span>
        <button
          onClick={handleToggle}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            border: '1px solid var(--border)',
            borderRadius: 6,
            background: 'transparent',
            fontFamily: 'var(--font-code)',
            fontSize: 12,
            color: 'var(--accent)',
            cursor: 'pointer',
          }}
        >
          <CaretDown size={12} weight="bold" style={{
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }} />
          {open
            ? (lang === 'he' ? 'סגור' : 'Close')
            : (lang === 'he' ? 'הצג' : 'Preview')
          }
        </button>
        <a
          href={file.path}
          download={file.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            border: '1px solid var(--border)',
            borderRadius: 6,
            background: 'transparent',
            fontFamily: 'var(--font-code)',
            fontSize: 12,
            color: 'var(--accent)',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <DownloadSimple size={12} weight="bold" />
          {lang === 'he' ? 'הורד' : 'Download'}
        </a>
      </div>
      {open && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '12px 14px',
          backgroundColor: 'var(--bg)',
          maxHeight: 400,
          overflowY: 'auto',
        }}>
          {loading ? (
            <span style={{ fontFamily: 'var(--font-code)', fontSize: 12, color: 'var(--text-soft)' }}>
              {lang === 'he' ? 'טוען...' : 'Loading...'}
            </span>
          ) : (
            <pre dir="ltr" style={{
              fontFamily: 'var(--font-code)',
              fontSize: 12,
              lineHeight: 1.6,
              color: 'var(--text)',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              textAlign: 'left',
            }}>
              {content}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}

function TableRenderer({ lines, lang }) {
  const rows = lines
    .filter(l => !l.trim().match(/^\|[\s-:|]+\|$/))
    .map(l => l.split('|').filter(c => c.trim()).map(c => c.trim()))

  if (rows.length === 0) return null
  const header = rows[0]
  const body = rows.slice(1)

  return (
    <div style={{ overflowX: 'auto', marginBottom: 16 }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
        fontSize: 13,
      }}>
        <thead>
          <tr>
            {header.map((cell, i) => (
              <th key={i} style={{
                padding: '8px 12px',
                borderBottom: '2px solid var(--border)',
                textAlign: lang === 'he' ? 'right' : 'left',
                color: 'var(--heading)',
                fontWeight: 600,
              }}>
                {renderInline(cell, `th-${i}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: '6px 12px',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text)',
                }}>
                  {renderInline(cell, `td-${ri}-${ci}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function renderBlockList(blocks, lang) {
  return blocks.map((block, i) => {
    if (block.type === 'separator') {
      return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />
    }
    if (block.type === 'component') {
      const Comp = componentRegistry[block.name]
      return Comp ? <Comp key={i} {...(block.props || {})} /> : null
    }
    if (block.type === 'table') {
      return <TableRenderer key={i} lines={block.lines} lang={lang} />
    }
    if (block.type === 'tracks') {
      return <TrackSelector key={i} tracks={block.tracks} lang={lang} renderBlocks={(nestedBlocks) => renderBlockList(nestedBlocks, lang)} />
    }
    if (block.type === 'collapse') {
      const nestedBlocks = parseBlocks(block.content)
      return (
        <CollapsibleBubble key={i} type={block.bubbleType} label={block.bubbleLabel || undefined}>
          <div style={{
            fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
            fontSize: 14,
            lineHeight: 1.8,
            color: 'var(--text)',
          }}>
            {renderBlockList(nestedBlocks, lang)}
          </div>
        </CollapsibleBubble>
      )
    }
    if (block.type === 'code') {
      return (
        <pre key={i} dir="ltr" style={{
          fontFamily: 'var(--font-code)',
          fontSize: 13,
          lineHeight: 1.6,
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 12,
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          textAlign: 'left',
        }}>
          {block.content}
        </pre>
      )
    }
    const ltr = lang === 'he' && isLtrBlock(block.content)
    return (
      <p key={i} dir={ltr ? 'ltr' : undefined} style={{
        margin: '0 0 12px 0',
        textAlign: ltr ? 'left' : undefined,
      }}>
        {renderInline(block.content, `p-${i}`)}
      </p>
    )
  })
}

const trackIcons = {
  A: Code,
  B: ChatCircleDots,
}

function TrackSelector({ tracks, lang, renderBlocks }) {
  const [selected, setSelected] = useState(null)
  const keys = Object.keys(tracks)

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Track buttons */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: selected ? 16 : 0,
      }}>
        {keys.map(key => {
          const isActive = selected === key
          const Icon = trackIcons[key] || Code
          return (
            <button
              key={key}
              onClick={() => setSelected(isActive ? null : key)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '14px 16px',
                border: isActive ? '2px solid var(--accent)' : '1.5px solid var(--border)',
                borderRadius: 10,
                backgroundColor: isActive ? 'var(--bg)' : 'transparent',
                cursor: 'pointer',
                fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
                fontSize: 14,
                fontWeight: 600,
                color: isActive ? 'var(--accent)' : 'var(--text)',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={18} weight={isActive ? 'fill' : 'duotone'} />
              {tracks[key].label}
            </button>
          )
        })}
      </div>

      {/* Selected track content */}
      {selected && tracks[selected] && (
        <div style={{
          border: '1.5px solid var(--accent)',
          borderRadius: 10,
          padding: '20px',
          backgroundColor: 'var(--bg)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {renderBlocks(parseBlocks(tracks[selected].content))}
        </div>
      )}
    </div>
  )
}

export default function DetectiveExercise({ content, files }) {
  const { lang } = useLang()

  if (!content) {
    return (
      <div style={{
        padding: '32px 0',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-code)',
          fontSize: 13,
          color: 'var(--text-soft)',
          fontStyle: 'italic',
        }}>
          {lang === 'he'
            ? 'תרגיל הבלש לפרק זה יתווסף בקרוב'
            : 'Detective exercise for this chapter coming soon'
          }
        </p>
      </div>
    )
  }

  const blocks = parseBlocks(content)

  return (
    <div style={{
      backgroundColor: 'var(--surface)',
      border: '1.5px solid var(--border)',
      borderRadius: 12,
      padding: '24px',
      marginTop: 8,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
      }}>
        <MagnifyingGlass size={22} weight="duotone" color="var(--heading)" />
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--heading)',
          margin: 0,
        }}>
          {lang === 'he' ? 'תרגיל הבלש' : 'Detective Exercise'}
        </h3>
      </div>

      <div style={{
        fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
        fontSize: 15,
        lineHeight: 1.85,
        color: 'var(--text)',
      }}>
        {renderBlockList(blocks, lang)}
      </div>

      {/* Downloadable case files */}
      {files && files.length > 0 && (
        <div style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid var(--border)',
        }}>
          <p style={{
            fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--heading)',
            marginBottom: 10,
          }}>
            {lang === 'he'
              ? 'רוצים לעקוב עם התיק שלי? הנה הקבצים:'
              : 'Want to follow along with my case? Here are the files:'
            }
          </p>
          {files.map((file, i) => (
            <FilePreviewCard key={i} file={file} lang={lang} />
          ))}
        </div>
      )}
    </div>
  )
}
