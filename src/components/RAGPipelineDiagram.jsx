import { useEffect, useRef } from 'react'
import { useLang } from '../App'

const W = 720
const H = 560

const accent = '#6366F1'
const pink = '#EC4899'
const amber = '#F59E0B'
const blue = '#3B82F6'
const green = '#10B981'

const labels = {
  he: {
    title: 'RAG — התהליך המלא',
    // Stage 1
    s1: '① Indexing — סידור הספרייה',
    docs: 'מסמכים',
    docsEx: 'דוחות, עדויות, חוזים',
    chunk: 'Chunking',
    chunkEx: 'פירוק למקטעים',
    embed1: 'Embedding',
    embed1Ex: 'מקטע → וקטור',
    vdb: 'Vector DB',
    vdbEx: 'אחסון + אינדוקס ANN',
    // Stage 2
    s2: '② Retrieval — הספרן שולף',
    query: 'שאלת המשתמש',
    queryEx: '"מי רצח את ג\'ונתן?"',
    embed2: 'Embedding',
    embed2Ex: 'שאלה → וקטור',
    search: 'Similarity\nSearch',
    searchEx: 'Cosine Similarity',
    topk: 'Top-K',
    topkEx: '3–5 מקטעים רלוונטיים',
    // Stage 3
    s3: '③ Generation — הבלש כותב דוח',
    sandwich: 'Prompt Augmentation',
    sandwichEx: '"הסנדוויץ\'"',
    llm: 'LLM',
    llmEx: 'עיבוד + הצלבה',
    answer: 'תשובה',
    answerEx: 'מבוססת עובדות',
    // Sandwich layers
    layer1: 'הוראות: "ענה רק על סמך הראיות"',
    layer2: 'מידע שנשלף: "ציאניד בדם... יין אדום..."',
    layer3: 'שאלה: "מי רצח את ג\'ונתן?"',
  },
  en: {
    title: 'RAG — The Full Pipeline',
    s1: '① Indexing — Organizing the Library',
    docs: 'Documents',
    docsEx: 'Reports, testimony, contracts',
    chunk: 'Chunking',
    chunkEx: 'Split into chunks',
    embed1: 'Embedding',
    embed1Ex: 'Chunk → Vector',
    vdb: 'Vector DB',
    vdbEx: 'Storage + ANN Index',
    s2: '② Retrieval — The Librarian Fetches',
    query: 'User Question',
    queryEx: '"Who killed Jonathan?"',
    embed2: 'Embedding',
    embed2Ex: 'Question → Vector',
    search: 'Similarity\nSearch',
    searchEx: 'Cosine Similarity',
    topk: 'Top-K',
    topkEx: '3–5 relevant chunks',
    s3: '③ Generation — The Detective Writes',
    sandwich: 'Prompt Augmentation',
    sandwichEx: '"The Sandwich"',
    llm: 'LLM',
    llmEx: 'Process + reason',
    answer: 'Answer',
    answerEx: 'Fact-based',
    layer1: 'Instructions: "Answer from evidence only"',
    layer2: 'Retrieved: "Cyanide in blood... red wine..."',
    layer3: 'Question: "Who killed Jonathan?"',
  },
}

export default function RAGPipelineDiagram() {
  const canvasRef = useRef(null)
  const { lang } = useLang()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const t = labels[lang] || labels.he
    const cs = getComputedStyle(document.documentElement)
    const textColor = cs.getPropertyValue('--text').trim() || '#1a1a1a'
    const textSoft = cs.getPropertyValue('--text-soft').trim() || '#888'
    const border = cs.getPropertyValue('--border').trim() || '#e5e5e5'

    ctx.clearRect(0, 0, W, H)

    // Title
    ctx.font = "bold 16px 'Heebo', sans-serif"
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.fillText(t.title, W / 2, 22)

    const boxH = 62
    const boxW = 120
    const pad = 16
    const lx = 30
    const rx = W - 30

    // ════════════════════════════════════════
    // STAGE 1: INDEXING
    // ════════════════════════════════════════
    const s1y = 48
    const s1h = boxH + pad * 2 + 20

    // Stage label
    ctx.font = "bold 14px 'Heebo', sans-serif"
    ctx.fillStyle = amber
    ctx.textAlign = 'center'
    ctx.fillText(t.s1, W / 2, s1y + 14)

    // Container
    ctx.strokeStyle = amber + '30'
    ctx.lineWidth = 1.5
    ctx.setLineDash([6, 4])
    roundRectStroke(ctx, lx, s1y, rx - lx, s1h, 12)
    ctx.setLineDash([])

    // Boxes
    const s1boxes = [
      { label: t.docs, sub: t.docsEx, color: textSoft, cx: 110, icon: 'docs' },
      { label: t.chunk, sub: t.chunkEx, color: amber, cx: 265, icon: 'chunks' },
      { label: t.embed1, sub: t.embed1Ex, color: accent, cx: 420, icon: 'vectors' },
      { label: t.vdb, sub: t.vdbEx, color: blue, cx: 570, icon: 'db' },
    ]
    const s1by = s1y + 28
    s1boxes.forEach(b => {
      drawRichBox(ctx, b.cx - boxW / 2, s1by, boxW, boxH, b.color, textColor, textSoft, b.label, b.sub, b.icon, border)
    })
    // Arrows
    for (let i = 0; i < s1boxes.length - 1; i++) {
      drawHArrow(ctx, s1boxes[i].cx + boxW / 2 + 2, s1by + boxH / 2, s1boxes[i + 1].cx - boxW / 2 - 2, s1by + boxH / 2, textSoft)
    }

    // ════════════════════════════════════════
    // STAGE 2: RETRIEVAL
    // ════════════════════════════════════════
    const s2y = s1y + s1h + 30
    const s2h = boxH + pad * 2 + 20

    ctx.font = "bold 14px 'Heebo', sans-serif"
    ctx.fillStyle = green
    ctx.textAlign = 'center'
    ctx.fillText(t.s2, W / 2, s2y + 14)

    ctx.strokeStyle = green + '30'
    ctx.lineWidth = 1.5
    ctx.setLineDash([6, 4])
    roundRectStroke(ctx, lx, s2y, rx - lx, s2h, 12)
    ctx.setLineDash([])

    const s2boxes = [
      { label: t.query, sub: t.queryEx, color: pink, cx: 110, icon: 'query' },
      { label: t.embed2, sub: t.embed2Ex, color: accent, cx: 265, icon: 'vectors' },
      { label: t.search, sub: t.searchEx, color: blue, cx: 420, icon: 'search' },
      { label: t.topk, sub: t.topkEx, color: green, cx: 570, icon: 'results' },
    ]
    const s2by = s2y + 28
    s2boxes.forEach(b => {
      drawRichBox(ctx, b.cx - boxW / 2, s2by, boxW, boxH, b.color, textColor, textSoft, b.label, b.sub, b.icon, border)
    })
    for (let i = 0; i < s2boxes.length - 1; i++) {
      drawHArrow(ctx, s2boxes[i].cx + boxW / 2 + 2, s2by + boxH / 2, s2boxes[i + 1].cx - boxW / 2 - 2, s2by + boxH / 2, textSoft)
    }

    // Connection: VDB (stage1) → Search (stage2)
    const vdbCx = s1boxes[3].cx
    const searchCx = s2boxes[2].cx
    ctx.strokeStyle = blue + '55'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 4])
    ctx.beginPath()
    ctx.moveTo(vdbCx, s1by + boxH + 2)
    ctx.bezierCurveTo(vdbCx, s1by + boxH + 25, searchCx, s2by - 22, searchCx, s2by - 2)
    ctx.stroke()
    ctx.setLineDash([])
    // arrowhead
    ctx.fillStyle = blue + '55'
    ctx.beginPath()
    ctx.moveTo(searchCx, s2by - 2)
    ctx.lineTo(searchCx - 5, s2by - 10)
    ctx.lineTo(searchCx + 5, s2by - 10)
    ctx.closePath()
    ctx.fill()

    // ════════════════════════════════════════
    // STAGE 3: GENERATION
    // ════════════════════════════════════════
    const s3y = s2y + s2h + 30
    const s3h = 200

    ctx.font = "bold 14px 'Heebo', sans-serif"
    ctx.fillStyle = accent
    ctx.textAlign = 'center'
    ctx.fillText(t.s3, W / 2, s3y + 14)

    ctx.strokeStyle = accent + '30'
    ctx.lineWidth = 1.5
    ctx.setLineDash([6, 4])
    roundRectStroke(ctx, lx, s3y, rx - lx, s3h, 12)
    ctx.setLineDash([])

    // Left side: The Sandwich (Prompt Augmentation)
    const swX = lx + 100
    const swY = s3y + 32
    const swW = 270
    const sliceH = 30

    ctx.font = "bold 14px 'Heebo', sans-serif"
    ctx.fillStyle = amber
    ctx.textAlign = 'left'
    ctx.fillText(t.sandwich, swX, swY)
    ctx.font = "bold 12px 'Heebo', sans-serif"
    ctx.fillStyle = textSoft
    ctx.textAlign = 'left'
    ctx.fillText(t.sandwichEx, swX, swY + 16)

    // Sandwich slices
    const sl1y = swY + 24
    drawSlice(ctx, swX, sl1y, swW, sliceH, accent + '12', accent + '40', accent, t.layer1)
    const sl2y = sl1y + sliceH + 4
    drawSlice(ctx, swX, sl2y, swW, sliceH, blue + '12', blue + '40', blue, t.layer2)
    const sl3y = sl2y + sliceH + 4
    drawSlice(ctx, swX, sl3y, swW, sliceH, pink + '12', pink + '40', pink, t.layer3)

    // Right side: LLM → Answer
    const rightX = swX + swW + 30
    const llmY = s3y + 50
    const llmW = 100
    const llmH = 60
    drawRichBox(ctx, rightX, llmY, llmW, llmH, accent, textColor, textSoft, t.llm, t.llmEx, 'brain', border)

    const ansY = llmY + llmH + 28
    const ansW = 100
    const ansH = 56
    drawRichBox(ctx, rightX, ansY, ansW, ansH, green, textColor, textSoft, t.answer, t.answerEx, 'check', border)

    // Arrow: Sandwich → LLM
    const sandwichMidY = sl2y + sliceH / 2
    drawHArrow(ctx, swX + swW + 4, sandwichMidY, rightX - 4, llmY + llmH / 2, textSoft)

    // Arrow: LLM → Answer
    drawVArrow(ctx, rightX + llmW / 2, llmY + llmH + 2, rightX + ansW / 2, ansY - 2, textSoft)

    // Connection: Top-K (stage2) → Sandwich (stage3)
    const topkCx = s2boxes[3].cx
    ctx.strokeStyle = green + '55'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 4])
    ctx.beginPath()
    ctx.moveTo(topkCx, s2by + boxH + 2)
    ctx.bezierCurveTo(topkCx, s2by + boxH + 22, swX + swW / 2, sl1y - 18, swX + swW / 2, sl1y - 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = green + '55'
    ctx.beginPath()
    ctx.moveTo(swX + swW / 2, sl1y - 2)
    ctx.lineTo(swX + swW / 2 - 5, sl1y - 10)
    ctx.lineTo(swX + swW / 2 + 5, sl1y - 10)
    ctx.closePath()
    ctx.fill()

  }, [lang])

  return (
    <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', maxWidth: W, height: 'auto', aspectRatio: `${W} / ${H}`, borderRadius: 10, border: '1px solid var(--border)' }}
      />
    </div>
  )
}

// Rich box with small icon sketches
function drawRichBox(ctx, x, y, w, h, color, textColor, textSoft, label, sub, icon, border) {
  // Background
  ctx.fillStyle = color + '10'
  ctx.strokeStyle = color + '40'
  ctx.lineWidth = 1.5
  roundRect(ctx, x, y, w, h, 8)

  // Left accent bar
  ctx.fillStyle = color
  ctx.fillRect(x, y + 8, 4, h - 16)

  // Icon area (top-right corner)
  const iconX = x + w - 22
  const iconY = y + 8
  drawMiniIcon(ctx, iconX, iconY, icon, color, border)

  // Label
  const lines = label.split('\n')
  ctx.font = "bold 14px 'Heebo', sans-serif"
  ctx.fillStyle = textColor
  ctx.textAlign = 'center'
  if (lines.length === 1) {
    ctx.fillText(label, x + w / 2, y + h / 2 - 2)
  } else {
    lines.forEach((line, i) => {
      ctx.fillText(line, x + w / 2, y + h / 2 - 8 + i * 14)
    })
  }

  // Subtitle
  ctx.font = "bold 12px 'Heebo', sans-serif"
  ctx.fillStyle = textSoft
  ctx.fillText(sub, x + w / 2, y + h / 2 + (lines.length > 1 ? 18 : 14))
}

// Tiny icon sketches for each box
function drawMiniIcon(ctx, x, y, type, color, border) {
  ctx.save()
  const s = 0.7 // scale
  if (type === 'docs') {
    // 3 stacked doc icons
    for (let i = 0; i < 3; i++) {
      const dx = x - i * 3, dy = y + i * 3
      ctx.strokeStyle = color + '60'
      ctx.lineWidth = 0.8
      ctx.strokeRect(dx, dy, 10 * s, 12 * s)
      ctx.strokeStyle = color + '30'
      for (let l = 0; l < 2; l++) {
        ctx.beginPath()
        ctx.moveTo(dx + 2, dy + 4 + l * 3)
        ctx.lineTo(dx + 8 * s, dy + 4 + l * 3)
        ctx.stroke()
      }
    }
  } else if (type === 'chunks') {
    // Fragmented bars
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = color + (i === 1 ? '80' : '35')
      const bw = i === 2 ? 8 : 12
      ctx.fillRect(x, y + i * 5, bw * s, 3)
    }
  } else if (type === 'vectors') {
    // Small arrow/vector
    ctx.strokeStyle = color + '70'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(x, y + 10)
    ctx.lineTo(x + 10, y + 2)
    ctx.stroke()
    ctx.fillStyle = color + '70'
    ctx.beginPath()
    ctx.moveTo(x + 10, y + 2)
    ctx.lineTo(x + 6, y + 3)
    ctx.lineTo(x + 8, y + 6)
    ctx.closePath()
    ctx.fill()
  } else if (type === 'db') {
    // Cylinder shape
    ctx.strokeStyle = color + '60'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.ellipse(x + 6, y + 3, 7, 3, 0, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x - 1, y + 3)
    ctx.lineTo(x - 1, y + 12)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x + 13, y + 3)
    ctx.lineTo(x + 13, y + 12)
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(x + 6, y + 12, 7, 3, 0, 0, Math.PI)
    ctx.stroke()
  } else if (type === 'query') {
    // Question mark
    ctx.font = "bold 16px 'Heebo', sans-serif"
    ctx.fillStyle = color + '50'
    ctx.textAlign = 'center'
    ctx.fillText('?', x + 5, y + 14)
  } else if (type === 'search') {
    // Magnifying glass
    ctx.strokeStyle = color + '60'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.arc(x + 5, y + 5, 5, 0, Math.PI * 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x + 9, y + 9)
    ctx.lineTo(x + 13, y + 13)
    ctx.stroke()
  } else if (type === 'results') {
    // 3 small result docs
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = color + '60'
      ctx.lineWidth = 0.8
      ctx.strokeRect(x + i * 5, y + 2, 6, 10)
    }
  } else if (type === 'brain') {
    // Simple brain/gear
    ctx.strokeStyle = color + '50'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(x + 6, y + 7, 6, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = color + '30'
    ctx.fill()
    // inner squiggle
    ctx.strokeStyle = color + '80'
    ctx.beginPath()
    ctx.moveTo(x + 3, y + 7)
    ctx.bezierCurveTo(x + 5, y + 4, x + 7, y + 10, x + 9, y + 7)
    ctx.stroke()
  } else if (type === 'check') {
    // Checkmark
    ctx.strokeStyle = color + '80'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x + 2, y + 8)
    ctx.lineTo(x + 6, y + 12)
    ctx.lineTo(x + 12, y + 3)
    ctx.stroke()
  }
  ctx.restore()
}

function drawSlice(ctx, x, y, w, h, fill, stroke, textColor, text) {
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1
  roundRect(ctx, x, y, w, h, 6)

  ctx.font = "bold 12px 'Heebo', sans-serif"
  ctx.fillStyle = textColor
  ctx.textAlign = 'center'
  ctx.fillText(text, x + w / 2, y + h / 2 + 3)
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

function roundRectStroke(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.stroke()
}

function drawHArrow(ctx, x1, y1, x2, y2, color) {
  ctx.strokeStyle = color + '80'
  ctx.lineWidth = 1.5
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  const angle = Math.atan2(y2 - y1, x2 - x1)
  ctx.fillStyle = color + '80'
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - 8 * Math.cos(angle - 0.35), y2 - 8 * Math.sin(angle - 0.35))
  ctx.lineTo(x2 - 8 * Math.cos(angle + 0.35), y2 - 8 * Math.sin(angle + 0.35))
  ctx.closePath()
  ctx.fill()
}

function drawVArrow(ctx, x1, y1, x2, y2, color) {
  ctx.strokeStyle = color + '80'
  ctx.lineWidth = 1.5
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  ctx.fillStyle = color + '80'
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - 5, y2 - 8)
  ctx.lineTo(x2 + 5, y2 - 8)
  ctx.closePath()
  ctx.fill()
}
