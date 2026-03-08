import { useEffect, useRef } from 'react'
import { useLang } from '../App'

// Static Context Window compression diagram — shows:
// Top: Full context window near capacity
// Middle: Compression funnel
// Bottom: Updated window with free space

const W = 600
const H = 310

const accent = '#6366F1'
const green = '#10B981'
const red = '#EF4444'
const amber = '#F59E0B'
const blue = '#3B82F6'

const labels = {
  he: {
    title1: 'Context Window — לפני דחיסה',
    systemPrompt: 'System Prompt',
    anchor: '(עוגן)',
    oldHistory: 'היסטוריה ישנה',
    detailedTokens: '(טוקנים מפורטים)',
    newChat: 'הודעות חדשות',
    threshold: 'Capacity Threshold (90%)',
    trigger: '▼  הסף הושג — מפעילים דחיסה  ▼',
    summarizer: 'Context Compression',
    compressed: 'היסטוריה דחוסה',
    compressedSub: '(סיכום)',
    title2: 'Context Window — אחרי דחיסה',
    freeSpace: 'מקום פנוי לטוקנים חדשים',
  },
  en: {
    title1: 'Context Window — Before Compression',
    systemPrompt: 'System Prompt',
    anchor: '(Anchor)',
    oldHistory: 'Old History',
    detailedTokens: '(Detailed Tokens)',
    newChat: 'New Chat',
    threshold: 'Capacity Threshold (90%)',
    trigger: '▼  Threshold reached — triggering compression  ▼',
    summarizer: 'Context Compression',
    compressed: 'Compressed History',
    compressedSub: '(Summary)',
    title2: 'Context Window — After Compression',
    freeSpace: 'Free space for new tokens',
  },
}

export default function ContextWindowDiagram() {
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

    const barX = 30
    const barW = W - 60
    const barH = 48
    const cornerR = 8

    const sysProportion = 0.18
    const oldProportion = 0.55
    const newProportion = 0.27
    const thresholdX = barX + barW * 0.9

    // ========== TOP BAR: Before compression ==========
    const topY = 34

    ctx.font = 'bold 16px "Heebo", sans-serif'
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.fillText(t.title1, W / 2, topY - 10)

    // Background bar
    ctx.fillStyle = border + '40'
    roundRect(ctx, barX, topY, barW, barH, cornerR)
    ctx.fill()

    // System Prompt (blue)
    const sysW = barW * sysProportion
    ctx.fillStyle = blue + 'CC'
    roundRectLeft(ctx, barX, topY, sysW, barH, cornerR)
    ctx.fill()

    // Old History (green)
    const oldX = barX + sysW
    const oldW = barW * oldProportion
    ctx.fillStyle = green + '55'
    ctx.fillRect(oldX, topY, oldW, barH)

    // New Chat (amber)
    const newX = oldX + oldW
    const newW = barW * newProportion
    ctx.fillStyle = amber + 'AA'
    roundRectRight(ctx, newX, topY, newW, barH, cornerR)
    ctx.fill()

    // Bar outline
    ctx.strokeStyle = border
    ctx.lineWidth = 1
    roundRect(ctx, barX, topY, barW, barH, cornerR)
    ctx.stroke()

    // Labels inside top bar
    ctx.font = 'bold 14px "Heebo", sans-serif'
    ctx.textAlign = 'center'

    ctx.fillStyle = '#fff'
    ctx.fillText(t.systemPrompt, barX + sysW / 2, topY + 20)
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillText(t.anchor, barX + sysW / 2, topY + 34)

    ctx.fillStyle = textColor
    ctx.font = 'bold 14px "Heebo", sans-serif'
    ctx.fillText(t.oldHistory, oldX + oldW / 2, topY + 20)
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillStyle = textSoft
    ctx.fillText(t.detailedTokens, oldX + oldW / 2, topY + 34)

    ctx.fillStyle = textColor
    ctx.font = 'bold 14px "Heebo", sans-serif'
    ctx.fillText(t.newChat, newX + newW / 2, topY + 20)
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillStyle = textSoft
    ctx.fillText(t.detailedTokens, newX + newW / 2, topY + 34)

    // Threshold line (dashed red)
    ctx.strokeStyle = red + 'CC'
    ctx.lineWidth = 2
    ctx.setLineDash([4, 3])
    ctx.beginPath()
    ctx.moveTo(thresholdX, topY - 4)
    ctx.lineTo(thresholdX, topY + barH + 4)
    ctx.stroke()
    ctx.setLineDash([])

    // Threshold label
    ctx.font = 'bold 14px "Heebo", sans-serif'
    ctx.fillStyle = red
    ctx.textAlign = 'center'
    ctx.fillText(t.threshold, thresholdX - 20, topY + barH + 20)

    // ========== MIDDLE: Trigger + Compression ==========
    const midY = topY + barH + 38

    // Trigger text
    ctx.font = 'bold 14px "Heebo", sans-serif'
    ctx.fillStyle = red
    ctx.textAlign = 'center'
    ctx.fillText(t.trigger, W / 2, midY + 6)

    // Compression section
    const compY = midY + 26

    // Summarizer label
    ctx.font = 'bold 14px "Heebo", sans-serif'
    ctx.fillStyle = accent
    ctx.textAlign = 'center'
    ctx.fillText(t.summarizer, W / 2, compY + 4)

    // Funnel: old history → compressed
    const funnelY = compY + 16
    const inputW = 170
    const inputX = W / 2 - inputW - 35
    const inputH = 38

    // Funnel shape (big left → small right)
    ctx.fillStyle = green + '35'
    ctx.beginPath()
    ctx.moveTo(inputX, funnelY)
    ctx.lineTo(inputX + inputW, funnelY + 5)
    ctx.lineTo(inputX + inputW, funnelY + inputH - 5)
    ctx.lineTo(inputX, funnelY + inputH)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = green + '70'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.font = 'bold 14px "Heebo", sans-serif'
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.fillText(t.oldHistory, inputX + inputW / 2 - 10, funnelY + inputH / 2 + 4)

    // Arrow
    const arrowX = inputX + inputW + 10
    ctx.fillStyle = accent
    ctx.beginPath()
    ctx.moveTo(arrowX, funnelY + inputH / 2 - 7)
    ctx.lineTo(arrowX + 18, funnelY + inputH / 2)
    ctx.lineTo(arrowX, funnelY + inputH / 2 + 7)
    ctx.closePath()
    ctx.fill()

    // Compressed output block (small amber)
    const outX = arrowX + 26
    const outW = 90
    ctx.fillStyle = amber + 'CC'
    roundRect(ctx, outX, funnelY + 4, outW, inputH - 8, 5)
    ctx.fill()
    ctx.strokeStyle = amber
    ctx.lineWidth = 1
    roundRect(ctx, outX, funnelY + 4, outW, inputH - 8, 5)
    ctx.stroke()

    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.fillText(t.compressed, outX + outW / 2, funnelY + inputH / 2 - 1)
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillStyle = textSoft
    ctx.fillText(t.compressedSub, outX + outW / 2, funnelY + inputH / 2 + 11)

    // ========== BOTTOM BAR: After compression ==========
    const bottomY = funnelY + inputH + 42

    ctx.font = 'bold 16px "Heebo", sans-serif'
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.fillText(t.title2, W / 2, bottomY - 10)

    // Background bar
    ctx.fillStyle = border + '40'
    roundRect(ctx, barX, bottomY, barW, barH, cornerR)
    ctx.fill()

    // System Prompt (same)
    ctx.fillStyle = blue + 'CC'
    roundRectLeft(ctx, barX, bottomY, sysW, barH, cornerR)
    ctx.fill()

    // Compressed history (small amber)
    const compBlockW = barW * 0.12
    const compBlockX = barX + sysW
    ctx.fillStyle = amber + 'CC'
    ctx.fillRect(compBlockX, bottomY, compBlockW, barH)

    // New Chat (same)
    const newBlockX = compBlockX + compBlockW
    const newBlockW = barW * newProportion
    ctx.fillStyle = amber + '55'
    ctx.fillRect(newBlockX, bottomY, newBlockW, barH)

    // Free space (green)
    const freeX = newBlockX + newBlockW
    const freeW = barX + barW - freeX
    ctx.fillStyle = green + '25'
    roundRectRight(ctx, freeX, bottomY, freeW, barH, cornerR)
    ctx.fill()

    // Bar outline
    ctx.strokeStyle = border
    ctx.lineWidth = 1
    roundRect(ctx, barX, bottomY, barW, barH, cornerR)
    ctx.stroke()

    // Dashed border around free space
    ctx.strokeStyle = green + '60'
    ctx.lineWidth = 1.5
    ctx.setLineDash([3, 3])
    roundRectRight(ctx, freeX, bottomY, freeW, barH, cornerR)
    ctx.stroke()
    ctx.setLineDash([])

    // Labels inside bottom bar
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.textAlign = 'center'

    ctx.fillStyle = '#fff'
    ctx.fillText(t.systemPrompt, barX + sysW / 2, bottomY + 20)
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillText(t.anchor, barX + sysW / 2, bottomY + 34)

    ctx.fillStyle = textColor
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillText(t.compressed, compBlockX + compBlockW / 2, bottomY + 20)
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillStyle = textSoft
    ctx.fillText(t.compressedSub, compBlockX + compBlockW / 2, bottomY + 34)

    ctx.fillStyle = textColor
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillText(t.newChat, newBlockX + newBlockW / 2, bottomY + 20)

    ctx.fillStyle = green
    ctx.font = 'bold 14px "Heebo", sans-serif'
    ctx.fillText(t.freeSpace, freeX + freeW / 2, bottomY + barH / 2 + 4)

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

// --- Rounded rect helpers ---

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
}

function roundRectLeft(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w, y)
  ctx.lineTo(x + w, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function roundRectRight(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x, y + h)
  ctx.closePath()
}
