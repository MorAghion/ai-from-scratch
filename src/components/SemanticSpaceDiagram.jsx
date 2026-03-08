import { useEffect, useRef } from 'react'
import { useLang } from '../App'

const W = 560
const H = 420

const accent = '#6366F1'
const green = '#10B981'
const red = '#EF4444'
const amber = '#F59E0B'
const blue = '#3B82F6'

const labels = {
  he: {
    title: 'Semantic Space — מרחב המשמעות',
    axisX: 'נוזליות →',
    axisY: '← רעילות',
    cyanide: 'ציאניד',
    poison: 'רעל',
    portWine: 'יין פורט',
    water: 'מים',
    knife: 'סכין',
    bloodStain: 'כתם דם',
    close: 'קרובים במשמעות!',
    far: 'רחוקים',
  },
  en: {
    title: 'Semantic Space — Meaning Space',
    axisX: 'Liquidity →',
    axisY: '← Toxicity',
    cyanide: 'Cyanide',
    poison: 'Poison',
    portWine: 'Port Wine',
    water: 'Water',
    knife: 'Knife',
    bloodStain: 'Blood Stain',
    close: 'Close in meaning!',
    far: 'Far apart',
  },
}

// Word positions in normalized space (0-1), mapped to plot area
const words = [
  { key: 'cyanide', x: 0.12, y: 0.08, color: red },
  { key: 'poison', x: 0.22, y: 0.15, color: red },
  { key: 'knife', x: 0.08, y: 0.52, color: amber },
  { key: 'bloodStain', x: 0.18, y: 0.58, color: amber },
  { key: 'portWine', x: 0.82, y: 0.85, color: green },
  { key: 'water', x: 0.92, y: 0.78, color: blue },
]

export default function SemanticSpaceDiagram() {
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
    ctx.fillText(t.title, W / 2, 22)

    // Plot area
    const plotX = 60
    const plotY = 40
    const plotW = W - 90
    const plotH = H - 80

    // Background grid
    ctx.strokeStyle = border + '50'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 4; i++) {
      const gx = plotX + (plotW / 4) * i
      const gy = plotY + (plotH / 4) * i
      ctx.beginPath()
      ctx.moveTo(gx, plotY)
      ctx.lineTo(gx, plotY + plotH)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(plotX, gy)
      ctx.lineTo(plotX + plotW, gy)
      ctx.stroke()
    }

    // Axes
    ctx.strokeStyle = textSoft
    ctx.lineWidth = 1.5

    // Y axis (toxicity — top is high)
    ctx.beginPath()
    ctx.moveTo(plotX, plotY + plotH)
    ctx.lineTo(plotX, plotY)
    ctx.stroke()
    // Arrow
    ctx.fillStyle = textSoft
    ctx.beginPath()
    ctx.moveTo(plotX - 5, plotY + 6)
    ctx.lineTo(plotX, plotY - 2)
    ctx.lineTo(plotX + 5, plotY + 6)
    ctx.closePath()
    ctx.fill()

    // X axis (liquidity — right is high)
    ctx.beginPath()
    ctx.moveTo(plotX, plotY + plotH)
    ctx.lineTo(plotX + plotW, plotY + plotH)
    ctx.stroke()
    // Arrow
    ctx.beginPath()
    ctx.moveTo(plotX + plotW - 6, plotY + plotH - 5)
    ctx.lineTo(plotX + plotW + 2, plotY + plotH)
    ctx.lineTo(plotX + plotW - 6, plotY + plotH + 5)
    ctx.closePath()
    ctx.fill()

    // Axis labels
    ctx.font = 'bold 14px "Heebo", sans-serif'
    ctx.fillStyle = textSoft
    ctx.textAlign = 'center'
    ctx.fillText(t.axisX, plotX + plotW / 2, plotY + plotH + 28)

    ctx.save()
    ctx.translate(18, plotY + plotH / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText(t.axisY, 0, 0)
    ctx.restore()

    // Dashed circle around cyanide+poison cluster (Y is flipped: 1-y)
    const cx1 = plotX + 0.17 * plotW
    const cy1 = plotY + (1 - 0.115) * plotH
    ctx.strokeStyle = red + '50'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.ellipse(cx1, cy1, 68, 42, 0.3, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Label for cluster
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillStyle = red + 'BB'
    ctx.textAlign = 'center'
    ctx.fillText(t.close, cx1, cy1 + 52)

    // Dashed circle around knife+bloodStain cluster (Y is flipped: 1-y)
    const cx2 = plotX + 0.13 * plotW
    const cy2 = plotY + (1 - 0.55) * plotH
    ctx.strokeStyle = amber + '50'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.ellipse(cx2, cy2, 62, 38, 0.2, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw words
    words.forEach((w) => {
      const wx = plotX + w.x * plotW
      const wy = plotY + (1 - w.y) * plotH // flip Y so high toxicity is at top

      // Dot
      ctx.beginPath()
      ctx.arc(wx, wy, 6, 0, Math.PI * 2)
      ctx.fillStyle = w.color
      ctx.fill()
      ctx.strokeStyle = w.color + '60'
      ctx.lineWidth = 2
      ctx.stroke()

      // Glow
      ctx.beginPath()
      ctx.arc(wx, wy, 10, 0, Math.PI * 2)
      ctx.fillStyle = w.color + '18'
      ctx.fill()

      // Label
      ctx.font = 'bold 14px "Heebo", sans-serif'
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      ctx.fillText(t[w.key], wx, wy - 14)
    })

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
