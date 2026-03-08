import { useEffect, useRef } from 'react'
import { useLang } from '../App'

const W = 600
const H = 380

const red = '#EF4444'
const green = '#10B981'
const amber = '#F59E0B'
const blue = '#3B82F6'

const labels = {
  he: {
    title: 'Cosine Similarity — מדידת זווית בין חצים',
    vecA: '"ציאניד"',
    vecB: '"רעל"',
    vecC: '"יין פורט"',
    small: 'זווית קטנה = דומים!',
    big: 'זווית גדולה = שונים',
    score1: 'Score ≈ 0.97',
    score2: 'Score ≈ 0.15',
  },
  en: {
    title: 'Cosine Similarity — Measuring Angle Between Arrows',
    vecA: '"Cyanide"',
    vecB: '"Poison"',
    vecC: '"Port Wine"',
    small: 'Small angle = Similar!',
    big: 'Large angle = Different',
    score1: 'Score ≈ 0.97',
    score2: 'Score ≈ 0.15',
  },
}

export default function CosineSimilarityDiagram() {
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

    // Origin — centered horizontally
    const ox = W / 2 - 20, oy = H - 70

    // Vector directions (angles from horizontal)
    const angleA = -Math.PI * 0.12  // Cyanide — slightly above horizontal
    const angleB = -Math.PI * 0.22  // Poison — close to cyanide
    const angleC = -Math.PI * 0.78  // Port Wine — far away (steep up)

    const lenA = 200
    const lenB = 180
    const lenC = 180

    const ax = ox + Math.cos(angleA) * lenA
    const ay = oy + Math.sin(angleA) * lenA
    const bx = ox + Math.cos(angleB) * lenB
    const by = oy + Math.sin(angleB) * lenB
    const cx2 = ox + Math.cos(angleC) * lenC
    const cy2 = oy + Math.sin(angleC) * lenC

    // Light grid
    ctx.strokeStyle = border + '30'
    ctx.lineWidth = 0.5
    for (let i = 0; i < 7; i++) {
      const gx = 40 + (W - 80) / 6 * i
      ctx.beginPath()
      ctx.moveTo(gx, 36)
      ctx.lineTo(gx, H - 40)
      ctx.stroke()
    }
    for (let i = 0; i < 5; i++) {
      const gy = 36 + (H - 76) / 4 * i
      ctx.beginPath()
      ctx.moveTo(40, gy)
      ctx.lineTo(W - 40, gy)
      ctx.stroke()
    }

    // Draw angle arc between A and B (small angle — green)
    const arcR = 50
    ctx.strokeStyle = green + '80'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(ox, oy, arcR, angleB, angleA)
    ctx.stroke()

    // Small angle label — positioned below the arc, offset to not overlap vectors
    const midAngleAB = (angleA + angleB) / 2
    ctx.font = "bold 12px 'Heebo', sans-serif"
    ctx.fillStyle = green
    ctx.textAlign = 'center'
    const smallLabelX = ox + Math.cos(midAngleAB) * (arcR + 60)
    const smallLabelY = oy + Math.sin(midAngleAB) * (arcR + 36) + 16
    ctx.fillText(t.small, smallLabelX, smallLabelY)

    // Score for A-B
    ctx.fillText(t.score1, smallLabelX, smallLabelY + 16)

    // Draw angle arc between A and C (big angle — amber)
    const arcR2 = 36
    ctx.strokeStyle = amber + '80'
    ctx.lineWidth = 2
    ctx.beginPath()
    // Draw from C to A (larger angle)
    ctx.arc(ox, oy, arcR2, angleC, angleA)
    ctx.stroke()

    // Big angle label — positioned to the left of the arc
    const midAngleAC = (angleA + angleC) / 2
    ctx.font = "bold 12px 'Heebo', sans-serif"
    ctx.fillStyle = amber
    ctx.textAlign = 'center'
    const bigLabelX = ox + Math.cos(midAngleAC) * (arcR2 + 70)
    const bigLabelY = oy + Math.sin(midAngleAC) * (arcR2 + 50)
    ctx.fillText(t.big, bigLabelX, bigLabelY)
    ctx.fillText(t.score2, bigLabelX, bigLabelY + 16)

    // Draw vectors
    drawArrow(ctx, ox, oy, ax, ay, red, 2.5)
    drawArrow(ctx, ox, oy, bx, by, red + 'AA', 2.5)
    drawArrow(ctx, ox, oy, cx2, cy2, blue, 2.5)

    // Origin dot
    ctx.beginPath()
    ctx.arc(ox, oy, 4, 0, Math.PI * 2)
    ctx.fillStyle = textSoft
    ctx.fill()

    // Vector labels
    ctx.font = "bold 14px 'Heebo', sans-serif"
    ctx.textAlign = 'start'
    ctx.fillStyle = red
    ctx.fillText(t.vecA, ax + 8, ay - 4)

    ctx.fillStyle = red + 'BB'
    ctx.fillText(t.vecB, bx + 8, by + 16)

    ctx.fillStyle = blue
    ctx.textAlign = 'end'
    ctx.fillText(t.vecC, cx2 - 8, cy2 - 6)

    // Dots at tips
    drawDot(ctx, ax, ay, red, 5)
    drawDot(ctx, bx, by, red + 'AA', 5)
    drawDot(ctx, cx2, cy2, blue, 5)

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

function drawArrow(ctx, x1, y1, x2, y2, color, width) {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const headLen = 11

  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - headLen * Math.cos(angle - 0.35), y2 - headLen * Math.sin(angle - 0.35))
  ctx.lineTo(x2 - headLen * Math.cos(angle + 0.35), y2 - headLen * Math.sin(angle + 0.35))
  ctx.closePath()
  ctx.fill()
}

function drawDot(ctx, x, y, color, r) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x, y, r + 4, 0, Math.PI * 2)
  ctx.fillStyle = color + '18'
  ctx.fill()
}
