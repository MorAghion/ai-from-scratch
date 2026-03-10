import { useEffect, useRef } from 'react'
import { useLang } from '../App'

const W = 680
const H = 380

const cyan = '#06B6D4'
const accent = '#6366F1'
const green = '#10B981'
const amber = '#F59E0B'

const labels = {
  he: {
    title: 'ארכיטקטורת MCP — שלושת השחקנים',
    host: 'Host',
    hostSub: '(מארח)',
    hostDesc: 'Claude Desktop / VS Code',
    client: 'Client',
    clientSub: '(לקוח)',
    clientDesc: 'מודל ה-AI',
    server1: 'MCP Server',
    server1Desc: 'קבצים',
    server2: 'MCP Server',
    server2Desc: 'GitHub',
    server3: 'MCP Server',
    server3Desc: 'Google Drive',
    ask: 'מה כתוב בקובץ?',
    need: 'צריך כלי קבצים',
    read: 'קרא קובץ',
    data: 'תוכן הקובץ',
    answer: 'התשובה',
    protocol: 'פרוטוקול אחיד',
  },
  en: {
    title: 'MCP Architecture — The Three Players',
    host: 'Host',
    hostSub: '(App)',
    hostDesc: 'Claude Desktop / VS Code',
    client: 'Client',
    clientSub: '(AI)',
    clientDesc: 'The AI Model',
    server1: 'MCP Server',
    server1Desc: 'Files',
    server2: 'MCP Server',
    server2Desc: 'GitHub',
    server3: 'MCP Server',
    server3Desc: 'Google Drive',
    ask: '"What\'s in the file?"',
    need: 'Need file tool',
    read: 'Read file',
    data: 'File content',
    answer: 'Answer',
    protocol: 'Unified Protocol',
  },
}

export default function MCPArchitectureDiagram() {
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
    const surface = cs.getPropertyValue('--surface').trim() || '#f5f5f5'

    ctx.clearRect(0, 0, W, H)

    // Title
    ctx.font = 'bold 16px "Heebo", sans-serif'
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.fillText(t.title, W / 2, 22)

    // Layout
    const boxW = 130
    const boxH = 100
    const topY = 50

    // === User question (top) ===
    const userY = topY - 5
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillStyle = textSoft
    ctx.textAlign = 'center'
    ctx.fillText(t.ask, 75, userY)

    // Small user icon
    ctx.fillStyle = textSoft
    ctx.beginPath()
    ctx.arc(75, userY + 18, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(75, userY + 40, 14, 8, 0, 0, Math.PI)
    ctx.fill()

    // Arrow from user to Host
    drawArrow(ctx, 100, userY + 25, 145, userY + 25, textSoft, false)

    // === Host box (center-left) ===
    const hostX = 150
    const hostY = topY
    ctx.fillStyle = cyan + '10'
    ctx.strokeStyle = cyan + '40'
    ctx.lineWidth = 1.5
    roundRect(ctx, hostX, hostY, boxW, boxH, 10)

    // Host icon (shield)
    const hcx = hostX + boxW / 2
    ctx.fillStyle = cyan + '25'
    ctx.strokeStyle = cyan + '60'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(hcx, hostY + 15)
    ctx.lineTo(hcx + 16, hostY + 25)
    ctx.lineTo(hcx + 14, hostY + 42)
    ctx.quadraticCurveTo(hcx, hostY + 50, hcx - 14, hostY + 42)
    ctx.lineTo(hcx - 16, hostY + 25)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.font = 'bold 14px "Heebo", sans-serif'
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.fillText(t.host, hcx, hostY + 65)
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillStyle = textSoft
    ctx.fillText(t.hostSub, hcx, hostY + 78)
    ctx.fillText(t.hostDesc, hcx, hostY + 92)

    // === Client/AI box (left of Host) ===
    const clientX = hostX
    const clientY = hostY + boxH + 60
    ctx.fillStyle = accent + '10'
    ctx.strokeStyle = accent + '40'
    ctx.lineWidth = 1.5
    roundRect(ctx, clientX, clientY, boxW, boxH, 10)

    // AI brain icon
    const ccx = clientX + boxW / 2
    ctx.fillStyle = accent + '25'
    ctx.strokeStyle = accent + '60'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(ccx, clientY + 32, 18, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    // Brain lines
    ctx.strokeStyle = accent + '80'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(ccx - 8, clientY + 25)
    ctx.quadraticCurveTo(ccx, clientY + 32, ccx + 8, clientY + 25)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(ccx - 10, clientY + 34)
    ctx.quadraticCurveTo(ccx, clientY + 28, ccx + 10, clientY + 34)
    ctx.stroke()

    ctx.font = 'bold 14px "Heebo", sans-serif'
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.fillText(t.client, ccx, clientY + 65)
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillStyle = textSoft
    ctx.fillText(t.clientSub, ccx, clientY + 78)
    ctx.fillText(t.clientDesc, ccx, clientY + 92)

    // Arrow Host <-> Client (vertical)
    const midX = hcx
    drawArrow(ctx, midX - 5, hostY + boxH + 5, midX - 5, clientY - 5, accent, false)
    drawArrow(ctx, midX + 5, clientY - 5, midX + 5, hostY + boxH + 5, cyan, true)
    // Labels
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillStyle = accent
    ctx.textAlign = 'right'
    ctx.fillText(t.need, midX - 12, hostY + boxH + 35)
    ctx.fillStyle = cyan
    ctx.textAlign = 'left'
    ctx.fillText(t.answer, midX + 12, hostY + boxH + 35)

    // === MCP Servers (right side, 3 stacked) ===
    const srvX = 430
    const srvW = 140
    const srvH = 60
    const srvGap = 20
    const servers = [
      { desc: t.server1Desc, color: green, icon: '📁' },
      { desc: t.server2Desc, color: '#874B7D', icon: '🔧' },
      { desc: t.server3Desc, color: amber, icon: '☁️' },
    ]

    servers.forEach((srv, i) => {
      const sy = topY + i * (srvH + srvGap)

      ctx.fillStyle = srv.color + '10'
      ctx.strokeStyle = srv.color + '40'
      ctx.lineWidth = 1.5
      roundRect(ctx, srvX, sy, srvW, srvH, 8)

      ctx.font = 'bold 14px "Heebo", sans-serif'
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      ctx.fillText(t.server1, srvX + srvW / 2, sy + 25)
      ctx.font = 'bold 12px "Heebo", sans-serif'
      ctx.fillStyle = srv.color
      ctx.fillText(srv.desc, srvX + srvW / 2, sy + 42)
    })

    // Arrows from Host to servers
    const hostRightX = hostX + boxW
    servers.forEach((srv, i) => {
      const sy = topY + i * (srvH + srvGap) + srvH / 2
      ctx.strokeStyle = border
      ctx.lineWidth = 1.5
      ctx.setLineDash([4, 3])
      ctx.beginPath()
      ctx.moveTo(hostRightX + 5, hostY + boxH / 2)
      ctx.lineTo(hostRightX + 40, hostY + boxH / 2)
      ctx.lineTo(hostRightX + 40, sy)
      ctx.lineTo(srvX - 5, sy)
      ctx.stroke()
      ctx.setLineDash([])

      // Small arrowhead
      ctx.fillStyle = border
      ctx.beginPath()
      ctx.moveTo(srvX - 5, sy)
      ctx.lineTo(srvX - 12, sy - 4)
      ctx.lineTo(srvX - 12, sy + 4)
      ctx.closePath()
      ctx.fill()
    })

    // Protocol label on the connection line
    ctx.fillStyle = surface
    ctx.strokeStyle = border
    ctx.lineWidth = 1
    const plX = hostRightX + 15
    const plY = hostY + boxH / 2 - 10
    roundRect(ctx, plX, plY, 75, 22, 4)
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillStyle = cyan
    ctx.textAlign = 'center'
    ctx.fillText(t.protocol, plX + 37, plY + 16)

    // Flow labels on first server connection
    ctx.font = 'bold 12px "Heebo", sans-serif'
    const s1y = topY + srvH / 2
    ctx.fillStyle = green
    ctx.textAlign = 'center'
    ctx.fillText(t.read, (hostRightX + 40 + srvX) / 2, s1y - 8)
    ctx.fillStyle = textSoft
    ctx.fillText(t.data, (hostRightX + 40 + srvX) / 2, s1y + 16)

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

function drawArrow(ctx, x1, y1, x2, y2, color, dashed) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.setLineDash(dashed ? [5, 3] : [])
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.setLineDash([])

  // Arrowhead
  const angle = Math.atan2(y2 - y1, x2 - x1)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - 8 * Math.cos(angle - 0.4), y2 - 8 * Math.sin(angle - 0.4))
  ctx.lineTo(x2 - 8 * Math.cos(angle + 0.4), y2 - 8 * Math.sin(angle + 0.4))
  ctx.closePath()
  ctx.fill()
}
