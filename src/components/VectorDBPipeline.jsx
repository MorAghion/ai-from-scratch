import { useEffect, useRef } from 'react'
import { useLang } from '../App'

const W = 720
const H = 440

const accent = '#6366F1'
const pink = '#EC4899'
const amber = '#F59E0B'
const blue = '#3B82F6'
const green = '#10B981'

const labels = {
  he: {
    title: 'Vector DB — תהליך החיפוש המלא',
    query: 'שאילתת המשתמש',
    queryEx: '"רעל בכוס יין?"',
    embed: 'Embedding\nModel',
    queryVector: 'Query Vector',
    indexTitle: 'Vector Database Index',
    ram: '(RAM)',
    annLabel: 'ANN Neighborhood',
    annSub: '(וקטורים דומים)',
    storageTitle: 'Storage',
    ssd: '(SSD)',
    results: 'Top-3 תוצאות',
    result1: 'דוח נתיחה',
    result2: 'ניתוח היין',
    result3: 'תיק הרעלה',
  },
  en: {
    title: 'Vector DB — Full Search Pipeline',
    query: 'User Query',
    queryEx: '"Poison in wine?"',
    embed: 'Embedding\nModel',
    queryVector: 'Query Vector',
    indexTitle: 'Vector Database Index',
    ram: '(RAM)',
    annLabel: 'ANN Neighborhood',
    annSub: '(Similar Vectors)',
    storageTitle: 'Storage',
    ssd: '(SSD)',
    results: 'Top-3 Results',
    result1: 'Autopsy Report',
    result2: 'Wine Analysis',
    result3: 'Poisoning Case',
  },
}

export default function VectorDBPipeline() {
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

    // === Layout: horizontal flow ===
    // Row centers
    const midY = 185

    // ── 1. User Query box (left) ──
    const qx = 28, qy = midY - 38, qw = 110, qh = 76
    roundRect(ctx, qx, qy, qw, qh, 8, pink + '10', pink + '40')
    ctx.font = "bold 12px 'Heebo', sans-serif"
    ctx.fillStyle = pink
    ctx.textAlign = 'center'
    ctx.fillText(t.query, qx + qw / 2, qy + 24)
    ctx.font = "bold 12px 'Heebo', sans-serif"
    ctx.fillStyle = textColor
    ctx.fillText(t.queryEx, qx + qw / 2, qy + 42)
    // small search icon
    ctx.font = "18px 'Heebo', sans-serif"
    ctx.fillText('🔍', qx + qw / 2, qy + 64)

    // ── 2. Embedding Model box ──
    const ex = 168, ey = midY - 30, ew = 78, eh = 60
    roundRect(ctx, ex, ey, ew, eh, 8, accent + '15', accent + '50')
    ctx.font = "bold 12px 'Heebo', sans-serif"
    ctx.fillStyle = accent
    ctx.textAlign = 'center'
    const embedLines = t.embed.split('\n')
    embedLines.forEach((line, i) => {
      ctx.fillText(line, ex + ew / 2, ey + 26 + i * 14)
    })

    // Arrow: Query → Embedding
    drawHArrow(ctx, qx + qw + 4, midY, ex - 4, midY, textSoft)

    // "Query Vector" label above arrow from embed to index
    const qvMidX = (ex + ew + 270) / 2 + 10
    ctx.font = "bold 12px 'Heebo', sans-serif"
    ctx.fillStyle = textSoft
    ctx.textAlign = 'center'
    ctx.fillText(t.queryVector, qvMidX, midY - 18)

    // Arrow: Embedding → Index box
    drawHArrow(ctx, ex + ew + 4, midY, 270, midY, textSoft)

    // ── 3. Vector Database Index (large box with dot clusters) ──
    const ix = 274, iy = 50, iw = 200, ih = 210
    roundRect(ctx, ix, iy, iw, ih, 10, border + '08', border + '60')

    // Index title
    ctx.font = "bold 14px 'Heebo', sans-serif"
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.fillText(t.indexTitle, ix + iw / 2, iy + 18)
    ctx.font = "bold 12px 'Heebo', sans-serif"
    ctx.fillStyle = amber
    ctx.fillText(t.ram, ix + iw / 2, iy + 30)

    // Draw dot clusters inside index box
    const clusterDefs = [
      { cx: ix + 50, cy: iy + 70, r: 22, dots: 7 },
      { cx: ix + 140, cy: iy + 65, r: 20, dots: 6 },
      { cx: ix + 95, cy: iy + 120, r: 18, dots: 5 },
      { cx: ix + 155, cy: iy + 135, r: 20, dots: 6 },
      // The highlighted ANN cluster (bottom-left area)
      { cx: ix + 55, cy: iy + 165, r: 26, dots: 8, highlight: true },
    ]

    clusterDefs.forEach((cl) => {
      // Draw dots scattered in cluster
      const seed = cl.cx * 7 + cl.cy * 3
      for (let d = 0; d < cl.dots; d++) {
        const angle = (seed + d * 137.5) % 360 * (Math.PI / 180)
        const dist = (cl.r - 4) * (0.3 + 0.7 * ((seed * d + 17) % 100) / 100)
        const dx = cl.cx + Math.cos(angle) * dist
        const dy = cl.cy + Math.sin(angle) * dist
        ctx.beginPath()
        ctx.arc(dx, dy, 3, 0, Math.PI * 2)
        ctx.fillStyle = cl.highlight ? green + 'CC' : accent + '70'
        ctx.fill()
      }

      // Highlight circle for ANN neighborhood
      if (cl.highlight) {
        ctx.beginPath()
        ctx.arc(cl.cx, cl.cy, cl.r + 6, 0, Math.PI * 2)
        ctx.fillStyle = green + '15'
        ctx.fill()
        ctx.strokeStyle = green + '60'
        ctx.lineWidth = 2
        ctx.setLineDash([4, 3])
        ctx.stroke()
        ctx.setLineDash([])
      }
    })

    // ANN Neighborhood label with arrow pointing to highlighted cluster
    const annCluster = clusterDefs[4]
    ctx.font = "bold 12px 'Heebo', sans-serif"
    ctx.fillStyle = green
    ctx.textAlign = 'center'
    ctx.fillText(t.annLabel, ix + iw / 2, iy + ih - 12)
    ctx.font = "bold 12px 'Heebo', sans-serif"
    ctx.fillStyle = textSoft
    ctx.fillText(t.annSub, ix + iw / 2, iy + ih - 2)

    // Small arrow from query vector entry point to ANN cluster
    const entryX = ix
    const entryY = midY
    ctx.strokeStyle = green + '80'
    ctx.lineWidth = 1.5
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(entryX + 8, entryY)
    ctx.lineTo(annCluster.cx - annCluster.r - 4, annCluster.cy)
    ctx.stroke()
    ctx.setLineDash([])
    // arrowhead
    const aAngle = Math.atan2(annCluster.cy - entryY, annCluster.cx - annCluster.r - 4 - entryX - 8)
    const tipX = annCluster.cx - annCluster.r - 4
    const tipY = annCluster.cy
    ctx.fillStyle = green + '80'
    ctx.beginPath()
    ctx.moveTo(tipX, tipY)
    ctx.lineTo(tipX - 7 * Math.cos(aAngle - 0.4), tipY - 7 * Math.sin(aAngle - 0.4))
    ctx.lineTo(tipX - 7 * Math.cos(aAngle + 0.4), tipY - 7 * Math.sin(aAngle + 0.4))
    ctx.closePath()
    ctx.fill()

    // Arrow from highlighted cluster to Storage
    const fromClX = annCluster.cx + annCluster.r + 10
    drawHArrow(ctx, ix + iw + 4, annCluster.cy, 510, annCluster.cy, textSoft)

    // ── 4. Storage (SSD) box with document icons ──
    const sx = 514, sy = 50, sw = 140, sh = 210
    roundRect(ctx, sx, sy, sw, sh, 10, blue + '08', blue + '40')

    // Storage title
    ctx.font = "bold 14px 'Heebo', sans-serif"
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.fillText(t.storageTitle, sx + sw / 2, sy + 18)
    ctx.font = "bold 12px 'Heebo', sans-serif"
    ctx.fillStyle = blue
    ctx.fillText(t.ssd, sx + sw / 2, sy + 30)

    // Draw document grid (4x4 doc icons)
    const docStartX = sx + 18
    const docStartY = sy + 42
    const docW = 22, docH = 28, docGapX = 8, docGapY = 6
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const dx = docStartX + col * (docW + docGapX)
        const dy = docStartY + row * (docH + docGapY)
        drawDocIcon(ctx, dx, dy, docW, docH, border, textSoft)
      }
    }

    // ── 5. Top-3 Results (bottom right, with feedback arrow back) ──
    const rx = 520, ry = 310, rw = 180, rh = 100
    roundRect(ctx, rx, ry, rw, rh, 8, green + '10', green + '40')
    ctx.font = "bold 12px 'Heebo', sans-serif"
    ctx.fillStyle = green
    ctx.textAlign = 'center'
    ctx.fillText(t.results, rx + rw / 2, ry + 16)

    // 3 small doc icons in results — spaced wider
    const resDocW = 20, resDocH = 24
    const resLabels = [t.result1, t.result2, t.result3]
    const resSpacing = (rw - 24) / 3
    for (let i = 0; i < 3; i++) {
      const rdx = rx + 14 + i * resSpacing
      const rdy = ry + 28
      drawDocIcon(ctx, rdx, rdy, resDocW, resDocH, green + '40', green)
      ctx.font = "bold 10px 'Heebo', sans-serif"
      ctx.fillStyle = textSoft
      ctx.textAlign = 'center'
      ctx.fillText(resLabels[i], rdx + resDocW / 2, rdy + resDocH + 12)
    }

    // Arrow: Storage → Results (downward)
    drawVArrow(ctx, sx + sw / 2 + 30, sy + sh + 4, sx + sw / 2 + 30, ry - 4, textSoft)

    // ── 6. Feedback loop arrow: Results → back to User Query ──
    const loopY = ry + rh + 16
    const loopStartX = rx
    const loopEndX = qx + qw / 2

    // Draw the L-shaped return arrow
    ctx.strokeStyle = accent + '60'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    // go left from results bottom
    ctx.moveTo(rx + rw / 2, ry + rh + 2)
    ctx.lineTo(rx + rw / 2, loopY)
    ctx.lineTo(loopEndX, loopY)
    ctx.lineTo(loopEndX, qy + qh + 4)
    ctx.stroke()
    ctx.setLineDash([])

    // Arrowhead pointing up to query box
    ctx.fillStyle = accent + '60'
    ctx.beginPath()
    ctx.moveTo(loopEndX, qy + qh + 4)
    ctx.lineTo(loopEndX - 5, qy + qh + 12)
    ctx.lineTo(loopEndX + 5, qy + qh + 12)
    ctx.closePath()
    ctx.fill()

  }, [lang])

  return (
    <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
      <canvas
        ref={canvasRef}
        style={{ width: W, height: H, borderRadius: 10, border: '1px solid var(--border)' }}
      />
    </div>
  )
}

function roundRect(ctx, x, y, w, h, r, fillColor, strokeColor) {
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
  if (fillColor) {
    ctx.fillStyle = fillColor
    ctx.fill()
  }
  if (strokeColor) {
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
}

function drawHArrow(ctx, x1, y1, x2, y2, color) {
  ctx.strokeStyle = color + '90'
  ctx.lineWidth = 2
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  // Arrowhead
  const angle = Math.atan2(y2 - y1, x2 - x1)
  ctx.fillStyle = color + '90'
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - 8 * Math.cos(angle - 0.35), y2 - 8 * Math.sin(angle - 0.35))
  ctx.lineTo(x2 - 8 * Math.cos(angle + 0.35), y2 - 8 * Math.sin(angle + 0.35))
  ctx.closePath()
  ctx.fill()
}

function drawVArrow(ctx, x1, y1, x2, y2, color) {
  ctx.strokeStyle = color + '90'
  ctx.lineWidth = 2
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  ctx.fillStyle = color + '90'
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - 5, y2 - 8)
  ctx.lineTo(x2 + 5, y2 - 8)
  ctx.closePath()
  ctx.fill()
}

function drawDocIcon(ctx, x, y, w, h, borderColor, lineColor) {
  const fold = 6
  // Document shape with folded corner
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + w - fold, y)
  ctx.lineTo(x + w, y + fold)
  ctx.lineTo(x + w, y + h)
  ctx.lineTo(x, y + h)
  ctx.closePath()
  ctx.fillStyle = '#ffffff08'
  ctx.fill()
  ctx.strokeStyle = borderColor
  ctx.lineWidth = 1
  ctx.stroke()

  // Fold triangle
  ctx.beginPath()
  ctx.moveTo(x + w - fold, y)
  ctx.lineTo(x + w - fold, y + fold)
  ctx.lineTo(x + w, y + fold)
  ctx.strokeStyle = borderColor
  ctx.stroke()

  // Content lines
  ctx.strokeStyle = lineColor + '40'
  ctx.lineWidth = 0.8
  for (let i = 0; i < 3; i++) {
    const ly = y + fold + 5 + i * 5
    if (ly < y + h - 4) {
      ctx.beginPath()
      ctx.moveTo(x + 3, ly)
      ctx.lineTo(x + w - 4 - (i === 2 ? 4 : 0), ly)
      ctx.stroke()
    }
  }
}
