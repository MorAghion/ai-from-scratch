import { useEffect, useRef } from 'react'
import { useLang } from '../App'

const W = 620
const H = 460

const accent = '#6366F1'
const red = '#EF4444'
const amber = '#F59E0B'
const blue = '#3B82F6'
const pink = '#EC4899'

const labels = {
  he: {
    title: 'ANN — חיפוש ב-50,000 תיקים',
    query: '"רעל בכוס יין"',
    step1: '① הספרן בודק: איזו "שכונה" הכי קרובה לשאלה?',
    step2: '② מחפש רק בתוכה → מחזיר Top-3 תוצאות',
    cluster1: 'תיקי הרעלה',
    cluster2: 'תיקי פריצה',
    cluster3: 'תיקי הונאה',
    // Labels for individual case files
    files1: ['ציאניד בקפה', 'ארסן במרק', 'רעל עכברים', 'סם שינה ביין', 'כדורים מרוסקים', 'ניקוטין במיץ'],
    files2: ['פריצה לכספת', 'שוד חנות', 'גניבת רכב', 'חדירה לבית', 'שוד בנק'],
    files3: ['זיוף מסמכים', 'עוקץ טלפוני', 'גניבת זהות', 'הלבנת הון', 'מרמה בביטוח'],
  },
  en: {
    title: 'ANN — Searching 50,000 Case Files',
    query: '"Poison in wine glass"',
    step1: '① Librarian checks: which "neighborhood" is closest?',
    step2: '② Searches only within it → returns Top-3 results',
    cluster1: 'Poisoning Cases',
    cluster2: 'Burglary Cases',
    cluster3: 'Fraud Cases',
    files1: ['Cyanide in coffee', 'Arsenic in soup', 'Rat poison', 'Sedative in wine', 'Crushed pills', 'Nicotine in juice'],
    files2: ['Safe break-in', 'Store robbery', 'Car theft', 'Home invasion', 'Bank heist'],
    files3: ['Forged docs', 'Phone scam', 'Identity theft', 'Laundering', 'Insurance fraud'],
  },
}

// Cluster definitions with labeled points — spread out to avoid label overlaps
const clusters = [
  {
    key: 'cluster1',
    cx: 0.24,
    cy: 0.35,
    color: red,
    r: 95,
    points: [
      { x: 0.12, y: 0.22, fileIdx: 0 },
      { x: 0.24, y: 0.16, fileIdx: 1 },
      { x: 0.35, y: 0.24, fileIdx: 2 },
      { x: 0.14, y: 0.42, fileIdx: 3 },
      { x: 0.28, y: 0.44, fileIdx: 4 },
      { x: 0.34, y: 0.50, fileIdx: 5 },
    ],
  },
  {
    key: 'cluster2',
    cx: 0.76,
    cy: 0.26,
    color: amber,
    r: 80,
    points: [
      { x: 0.66, y: 0.16 },
      { x: 0.78, y: 0.12 },
      { x: 0.86, y: 0.22 },
      { x: 0.70, y: 0.34 },
      { x: 0.84, y: 0.36 },
    ],
  },
  {
    key: 'cluster3',
    cx: 0.64,
    cy: 0.72,
    color: blue,
    r: 80,
    points: [
      { x: 0.52, y: 0.63 },
      { x: 0.64, y: 0.60 },
      { x: 0.74, y: 0.68 },
      { x: 0.56, y: 0.80 },
      { x: 0.70, y: 0.82 },
    ],
  },
]

const queryPos = { x: 0.06, y: 0.58 }

export default function ANNClusterDiagram() {
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
    const isRTL = lang === 'he'
    const cs = getComputedStyle(document.documentElement)
    const textColor = cs.getPropertyValue('--text').trim() || '#1a1a1a'
    const textSoft = cs.getPropertyValue('--text-soft').trim() || '#888'
    const border = cs.getPropertyValue('--border').trim() || '#e5e5e5'

    ctx.clearRect(0, 0, W, H)

    const plotX = 30
    const plotY = 44
    const plotW = W - 60
    const plotH = H - 100

    // Title
    ctx.font = "bold 16px 'Heebo', sans-serif"
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.fillText(t.title, W / 2, 24)

    // Subtitle showing total files
    ctx.font = "bold 12px 'Heebo', sans-serif"
    ctx.fillStyle = textSoft
    ctx.fillText(isRTL ? '(כל תיק = וקטור במרחב)' : '(Each file = a vector in space)', W / 2, 38)

    // Draw cluster backgrounds, labels, and points
    const fileKeys = ['files1', 'files2', 'files3']
    clusters.forEach((cl, ci) => {
      const ccx = plotX + cl.cx * plotW
      const ccy = plotY + cl.cy * plotH
      const fileNames = t[fileKeys[ci]]

      // Cluster circle background
      ctx.beginPath()
      ctx.arc(ccx, ccy, cl.r, 0, Math.PI * 2)
      ctx.fillStyle = cl.color + '10'
      ctx.fill()
      ctx.strokeStyle = cl.color + '35'
      ctx.lineWidth = 1.5
      ctx.setLineDash([5, 4])
      ctx.stroke()
      ctx.setLineDash([])

      // Cluster label
      ctx.font = "bold 14px 'Heebo', sans-serif"
      ctx.fillStyle = cl.color
      ctx.textAlign = 'center'
      ctx.fillText(t[cl.key], ccx, ccy - cl.r - 8)

      // Points with file name labels — alternate above/below to reduce overlap
      cl.points.forEach((p, pi) => {
        const px = plotX + p.x * plotW
        const py = plotY + p.y * plotH

        // Dot
        ctx.beginPath()
        ctx.arc(px, py, 4, 0, Math.PI * 2)
        ctx.fillStyle = cl.color + 'BB'
        ctx.fill()

        // File name label (small, alternating above/below dot)
        if (fileNames[pi]) {
          ctx.font = "bold 10px 'Heebo', sans-serif"
          ctx.fillStyle = cl.color + '99'
          ctx.textAlign = isRTL ? 'right' : 'left'
          const labelY = pi % 2 === 0 ? py - 10 : py + 14
          ctx.fillText(fileNames[pi], px + (isRTL ? -8 : 8), labelY)
        }
      })
    })

    // Query point
    const qx = plotX + queryPos.x * plotW
    const qy = plotY + queryPos.y * plotH

    // Dashed arrow from query to poisoning cluster
    const targetCluster = clusters[0]
    const tcx = plotX + targetCluster.cx * plotW
    const tcy = plotY + targetCluster.cy * plotH

    ctx.strokeStyle = accent + 'AA'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.moveTo(qx, qy)
    ctx.lineTo(tcx, tcy)
    ctx.stroke()
    ctx.setLineDash([])

    // Arrow head
    const angle = Math.atan2(tcy - qy, tcx - qx)
    const arrowLen = 10
    ctx.fillStyle = accent
    ctx.beginPath()
    ctx.moveTo(tcx, tcy)
    ctx.lineTo(tcx - arrowLen * Math.cos(angle - 0.35), tcy - arrowLen * Math.sin(angle - 0.35))
    ctx.lineTo(tcx - arrowLen * Math.cos(angle + 0.35), tcy - arrowLen * Math.sin(angle + 0.35))
    ctx.closePath()
    ctx.fill()

    // Query dot
    ctx.beginPath()
    ctx.arc(qx, qy, 8, 0, Math.PI * 2)
    ctx.fillStyle = pink
    ctx.fill()
    ctx.strokeStyle = pink + '60'
    ctx.lineWidth = 3
    ctx.stroke()

    // Glow
    ctx.beginPath()
    ctx.arc(qx, qy, 14, 0, Math.PI * 2)
    ctx.fillStyle = pink + '20'
    ctx.fill()

    // Query label
    ctx.font = "bold 14px 'Heebo', sans-serif"
    ctx.fillStyle = pink
    ctx.textAlign = 'center'
    ctx.fillText(t.query, qx + 4, qy + 28)

    // Highlight top-3 results in poisoning cluster (closest to query)
    const poisonPoints = targetCluster.points.map((p, i) => ({
      ...p,
      idx: i,
      px: plotX + p.x * plotW,
      py: plotY + p.y * plotH,
      dist: Math.hypot(p.x - queryPos.x, p.y - queryPos.y),
    }))
    poisonPoints.sort((a, b) => a.dist - b.dist)
    const topK = poisonPoints.slice(0, 3)

    topK.forEach((p) => {
      // Highlight ring
      ctx.beginPath()
      ctx.arc(p.px, p.py, 9, 0, Math.PI * 2)
      ctx.strokeStyle = accent
      ctx.lineWidth = 2.5
      ctx.stroke()

      // Glow
      ctx.beginPath()
      ctx.arc(p.px, p.py, 14, 0, Math.PI * 2)
      ctx.fillStyle = accent + '18'
      ctx.fill()
    })

    // Top-K label
    const tkx = topK.reduce((s, p) => s + p.px, 0) / 3
    const tky = Math.max(...topK.map((p) => p.py)) + 24
    ctx.font = "bold 12px 'Heebo', sans-serif"
    ctx.fillStyle = accent
    ctx.textAlign = 'center'
    ctx.fillText('← Top-3', tkx + 30, tky)

    // Step labels at bottom
    ctx.font = "bold 14px 'Heebo', sans-serif"
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.fillText(t.step1, W / 2, H - 28)
    ctx.fillText(t.step2, W / 2, H - 12)

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
