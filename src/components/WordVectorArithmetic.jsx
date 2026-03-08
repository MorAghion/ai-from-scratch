import { useEffect, useRef } from 'react'
import { useLang } from '../App'

const W = 520
const H = 400

const labels = {
  he: {
    title: 'E(queen) ≈ E(king) + E(woman) − E(man)',
    king: 'מלך',
    queen: 'מלכה',
    man: 'גבר',
    woman: 'אישה',
    genderArrow: 'מגדר',
    royaltyAxis: 'מלוכה →',
    genderAxis: '← מגדר',
  },
  en: {
    title: 'E(queen) ≈ E(king) + E(woman) − E(man)',
    king: 'King',
    queen: 'Queen',
    man: 'Man',
    woman: 'Woman',
    genderArrow: 'Gender',
    royaltyAxis: 'Royalty →',
    genderAxis: '← Gender',
  },
}

// Colors
const kingColor = '#60A5FA'   // blue
const queenColor = '#F87171'  // red/coral
const manColor = '#60A5FA'    // blue (same family as king)
const womanColor = '#F87171'  // red/coral (same family as queen)
const genderArrowColor = '#FBBF24' // yellow/gold for the gender offset

export default function WordVectorArithmetic() {
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
    ctx.font = 'bold 16px "Heebo", sans-serif'
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.fillText(t.title, W / 2, 26)

    // Origin point (center-bottom area)
    const ox = W / 2
    const oy = H - 60

    // Word positions as vectors from origin
    // Gender offset must be identical for both pairs
    const genderDx = -70
    const genderDy = 60
    const kingPos =  { x: ox - 60,  y: oy - 220 }
    const queenPos = { x: kingPos.x + genderDx, y: kingPos.y + genderDy }
    const manPos =   { x: ox + 120, y: oy - 190 }
    const womanPos = { x: manPos.x + genderDx, y: manPos.y + genderDy }

    // Light grid
    ctx.strokeStyle = border + '30'
    ctx.lineWidth = 0.5
    for (let i = 0; i < 8; i++) {
      const gx = 40 + (W - 80) / 7 * i
      ctx.beginPath()
      ctx.moveTo(gx, 40)
      ctx.lineTo(gx, H - 40)
      ctx.stroke()
    }
    for (let i = 0; i < 6; i++) {
      const gy = 40 + (H - 80) / 5 * i
      ctx.beginPath()
      ctx.moveTo(40, gy)
      ctx.lineTo(W - 40, gy)
      ctx.stroke()
    }

    // --- Draw main vectors from origin ---

    // King vector (blue)
    drawArrow(ctx, ox, oy, kingPos.x, kingPos.y, kingColor, 2.5)

    // Man vector (blue, lighter)
    drawArrow(ctx, ox, oy, manPos.x, manPos.y, manColor + 'AA', 2.5)

    // Woman vector (coral, lighter)
    drawArrow(ctx, ox, oy, womanPos.x, womanPos.y, womanColor + 'AA', 2.5)

    // Queen vector (coral)
    drawArrow(ctx, ox, oy, queenPos.x, queenPos.y, queenColor, 2.5)

    // --- Draw gender offset arrows (yellow, dashed) ---
    // king → queen (same offset as man → woman)
    drawDashedArrow(ctx, kingPos.x, kingPos.y, queenPos.x, queenPos.y, genderArrowColor, 2)

    // man → woman (same offset)
    drawDashedArrow(ctx, manPos.x, manPos.y, womanPos.x, womanPos.y, genderArrowColor, 2)

    // --- Labels for gender arrows ---
    const gMidX1 = (kingPos.x + queenPos.x) / 2 - 12
    const gMidY1 = (kingPos.y + queenPos.y) / 2
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillStyle = genderArrowColor
    ctx.textAlign = 'center'
    ctx.fillText(t.genderArrow, gMidX1 - 18, gMidY1 - 4)

    const gMidX2 = (manPos.x + womanPos.x) / 2
    const gMidY2 = (manPos.y + womanPos.y) / 2
    ctx.fillText(t.genderArrow, gMidX2 + 22, gMidY2 - 4)

    // --- Word labels with dots ---

    // King
    drawDot(ctx, kingPos.x, kingPos.y, kingColor, 7)
    ctx.font = 'bold 14px "Heebo", sans-serif'
    ctx.fillStyle = kingColor
    ctx.textAlign = 'center'
    ctx.fillText(`E(${t.king})`, kingPos.x, kingPos.y - 14)

    // Queen
    drawDot(ctx, queenPos.x, queenPos.y, queenColor, 7)
    ctx.fillStyle = queenColor
    ctx.fillText(`E(${t.queen})`, queenPos.x, queenPos.y - 14)

    // Man
    drawDot(ctx, manPos.x, manPos.y, manColor, 7)
    ctx.fillStyle = manColor
    ctx.fillText(`E(${t.man})`, manPos.x + 4, manPos.y - 14)

    // Woman
    drawDot(ctx, womanPos.x, womanPos.y, womanColor, 7)
    ctx.fillStyle = womanColor
    ctx.fillText(`E(${t.woman})`, womanPos.x + 4, womanPos.y - 14)

    // Origin dot
    drawDot(ctx, ox, oy, textSoft, 4)

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

function drawArrow(ctx, x1, y1, x2, y2, color, width) {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const headLen = 12

  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  // Arrowhead
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - headLen * Math.cos(angle - 0.35), y2 - headLen * Math.sin(angle - 0.35))
  ctx.lineTo(x2 - headLen * Math.cos(angle + 0.35), y2 - headLen * Math.sin(angle + 0.35))
  ctx.closePath()
  ctx.fill()
}

function drawDashedArrow(ctx, x1, y1, x2, y2, color, width) {
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const headLen = 10

  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.setLineDash([6, 4])
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.setLineDash([])

  // Arrowhead
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
  // Glow
  ctx.beginPath()
  ctx.arc(x, y, r + 5, 0, Math.PI * 2)
  ctx.fillStyle = color + '20'
  ctx.fill()
}
