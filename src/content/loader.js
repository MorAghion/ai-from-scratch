// Load all .txt content files at build time via Vite's import.meta.glob
const allFiles = import.meta.glob('/src/content/**/*.txt', { eager: true, query: '?raw', import: 'default' })

// Map from folder name (e.g. '01-prologue') to chapter id (e.g. 'prologue')
// Folder format: /src/content/XX-chapterId/filename.lang.txt
function folderToId(folderName) {
  return folderName.replace(/^\d+-/, '')
}

// Helper: push text, image, and component sections
// Recognizes ![alt](src) for images and @@component:Name for React components
function pushTextAndImages(sections, text) {
  const specialRegex = /^(?:!\[([^\]]*)\]\(([^)]+)\)|@@component:(\w+))$/gm
  let lastIdx = 0
  let match
  while ((match = specialRegex.exec(text)) !== null) {
    const before = text.substring(lastIdx, match.index).trim()
    if (before) sections.push({ type: 'text', content: before })
    if (match[3]) {
      sections.push({ type: 'component', name: match[3] })
    } else {
      sections.push({ type: 'image', alt: match[1], src: match[2] })
    }
    lastIdx = match.index + match[0].length
  }
  const after = text.substring(lastIdx).trim()
  if (after) sections.push({ type: 'text', content: after })
}

// Parse content.he.txt into [{ type: 'heading'|'text'|'image', content }] array
// Splits on ## headers, preserving the heading/text structure
function parseContent(raw) {
  if (!raw || raw.startsWith('<!--')) return []

  const sections = []
  const parts = raw.split(/^## /m)

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim()
    if (!part) continue

    if (i === 0) {
      // Text before the first ## header — may contain images
      pushTextAndImages(sections, part)
    } else {
      // First line is the heading, rest is text
      const newlineIdx = part.indexOf('\n')
      if (newlineIdx === -1) {
        sections.push({ type: 'heading', content: part })
      } else {
        const heading = part.substring(0, newlineIdx).trim()
        const text = part.substring(newlineIdx + 1).trim()
        sections.push({ type: 'heading', content: heading })
        if (text) {
          pushTextAndImages(sections, text)
        }
      }
    }
  }

  return sections
}

// Parse terms.he.txt into [{ term, full, definition }] array
function parseTerms(raw) {
  if (!raw || raw.startsWith('<!--')) return []

  const terms = []
  const blocks = raw.split('---').filter(b => b.trim())

  for (const block of blocks) {
    const term = {}
    const lines = block.trim().split('\n')
    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.+)$/)
      if (match) {
        term[match[1]] = match[2].trim()
      }
    }
    if (term.term) {
      terms.push({
        term: term.term,
        full: term.full || '',
        definition: term.definition || '',
      })
    }
  }

  return terms
}

// Build a lookup: chapterId -> { story, content, terms, detective }
const chapterContent = {}

for (const [path, raw] of Object.entries(allFiles)) {
  // path: /src/content/building-blocks/01-prologue/story.he.txt
  // or:   /src/content/vibe-coding/13-vibe-coding-intro/story.he.txt
  const parts = path.split('/')
  const filename = parts[parts.length - 1] // e.g. 'story.he.txt'
  const folder = parts[parts.length - 2] // e.g. '01-prologue'
  const id = folderToId(folder)
  const fileType = filename.split('.')[0] // story, content, terms, detective

  if (!chapterContent[id]) {
    chapterContent[id] = {
      story: { he: '', en: '' },
      content: { he: [], en: [] },
      brief: { he: [], en: [] },
      terms: { he: [], en: [] },
      detective: { he: '', en: '' },
    }
  }

  const lang = filename.split('.')[1] // he or en

  if (fileType === 'story') {
    // Parse story into sections (supports images and components)
    const trimmed = raw.trim()
    const sections = []
    pushTextAndImages(sections, trimmed)
    chapterContent[id].story[lang] = sections
  } else if (fileType === 'content') {
    chapterContent[id].content[lang] = parseContent(raw)
  } else if (fileType === 'brief') {
    chapterContent[id].brief[lang] = parseContent(raw)
  } else if (fileType === 'terms') {
    chapterContent[id].terms[lang] = parseTerms(raw)
  } else if (fileType === 'detective') {
    const trimmed = raw.trim()
    chapterContent[id].detective[lang] = trimmed.startsWith('<!--') ? '' : trimmed
  }
}

export function loadChapterContent(chapterId) {
  return chapterContent[chapterId] || {
    story: { he: '', en: '' },
    content: { he: [], en: [] },
    brief: { he: [], en: [] },
    terms: { he: [], en: [] },
    detective: { he: '', en: '' },
  }
}

// Export all terms for glossary
export function getAllTerms() {
  const allTerms = []
  for (const [chapterId, data] of Object.entries(chapterContent)) {
    for (const lang of ['he', 'en']) {
      if (data.terms[lang]) {
        for (const term of data.terms[lang]) {
          allTerms.push({ ...term, chapterId, lang })
        }
      }
    }
  }
  return allTerms
}
