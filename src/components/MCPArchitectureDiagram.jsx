import { useEffect, useRef } from 'react'
import { useLang } from '../App'

const W = 720
const H = 360

const cyan = '#06B6D4'
const accent = '#6366F1'
const green = '#10B981'
const amber = '#F59E0B'

const labels = {
  he: {
    title: 'ארכיטקטורת MCP',
    host: 'Host',
    hostSub: '(מארח)',
    hostDesc: ['Claude Desktop', '/ VS Code'],
    aiModel: 'מודל AI',
    client: 'Client',
    server1: 'MCP Server',
    server1Desc: 'קבצים',
    server2: 'MCP Server',
    server2Desc: 'GitHub',
    server3: 'MCP Server',
    server3Desc: 'Google Drive',
    ask: 'מה כתוב בקובץ?',
    read: 'בקשה',
    data: 'תשובה',
    protocol: 'פרוטוקול אחיד',
  },
  en: {
    title: 'MCP Architecture',
    host: 'Host',
    hostSub: '(App)',
    hostDesc: ['Claude Desktop', '/ VS Code'],
    aiModel: 'AI Model',
    client: 'Client',
    server1: 'MCP Server',
    server1Desc: 'Files',
    server2: 'MCP Server',
    server2Desc: 'GitHub',
    server3: 'MCP Server',
    server3Desc: 'Google Drive',
    ask: '"What\'s in the file?"',
    read: 'Request',
    data: 'Response',
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

    ctx.clearRect(0, 0, W, H)

    // Title
    ctx.font = 'bold 16px "Heebo", sans-serif'
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.fillText(t.title, W / 2, 22)

    // === User (left side) ===
    const userX = 55
    const userY = 155
    ctx.font = 'bold 12px "Heebo", sans-serif'
    ctx.fillStyle = textSoft
    ctx.textAlign = 'center'
    ctx.fillText(t.ask, userX, userY - 30)

    // User icon
    ctx.fillStyle = textSoft
    ctx.beginPath()
    ctx.arc(userX, userY, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(userX, userY + 22, 14, 8, 0, 0, Math.PI)
    ctx.fill()

    // Arrow from user to Host
    drawArrow(ctx, userX + 20, userY, 120, userY, textSoft, false)

    // === Host box (large container) ===
    const hostX = 125
    const hostY = 45
    const hostW = 250
    const hostH = 270

    // Host background
    ctx.fillStyle = cyan + '08'
    ctx.strokeStyle = cyan + '35'
    ctx.lineWidth = 2
    roundRect(ctx, hostX, hostY, hostW, hostH, 12)

    // Host label at top
    ctx.font = 'bold 15px "Heebo", sans-serif'
    ctx.fillStyle = textColor
    ctx.textAlign = 'center'
    ctx.fillText(t.host + ' ' + t.hostSub, hostX + hostW / 2, hostY + 20)
    ctx.font = 'bold 11px "Heebo", sans-serif'
    ctx.fillStyle = textSoft
    if (Array.isArray(t.hostDesc)) {
      t.hostDesc.forEach((line, i) => ctx.fillText(line, hostX + hostW / 2, hostY + 34 + i * 13))
    }

    // === AI Model inside Host ===
    const aiX = hostX + 20
    const aiY = hostY + 58
    const aiW = hostW - 40
    const aiH = 60

    ctx.fillStyle = accent + '10'
    ctx.strokeStyle = accent + '40'
    ctx.lineWidth = 1.5
    roundRect(ctx, aiX, aiY, aiW, aiH, 8)

    // Brain icon
    const brainCx = aiX + 30
    const brainCy = aiY + aiH / 2
    ctx.fillStyle = accent + '20'
    ctx.strokeStyle = accent + '50'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(brainCx, brainCy, 14, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    // Brain lines
    ctx.strokeStyle = accent + '70'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(brainCx - 6, brainCy - 4)
    ctx.quadraticCurveTo(brainCx, brainCy + 2, brainCx + 6, brainCy - 4)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(brainCx - 8, brainCy + 3)
    ctx.quadraticCurveTo(brainCx, brainCy - 3, brainCx + 8, brainCy + 3)
    ctx.stroke()

    // AI label
    ctx.font = 'bold 13px "Heebo", sans-serif'
    ctx.fillStyle = accent
    ctx.textAlign = 'center'
    ctx.fillText(t.aiModel, aiX + aiW / 2 + 15, aiY + aiH / 2 + 5)

    // === Client connectors inside Host ===
    const servers = [
      { desc: t.server1Desc, color: green },
      { desc: t.server2Desc, color: '#9B4F96' },
      { desc: t.server3Desc, color: amber },
    ]

    const clientStartY = aiY + aiH + 18
    const clientGap = 46
    const clientW = 70
    const clientH = 28
    const clientX = hostX + hostW / 2 - clientW / 2

    const aiBottomY = aiY + aiH
    const aiCenterX = aiX + aiW / 2

    servers.forEach((srv, i) => {
      const cy = clientStartY + i * clientGap
      const clientCenterX = clientX + clientW / 2

      // Line from AI model to Client connector
      ctx.strokeStyle = srv.color + '70'
      ctx.lineWidth = 1.5
      ctx.setLineDash([4, 3])
      ctx.beginPath()
      ctx.moveTo(aiCenterX, aiBottomY)
      ctx.lineTo(clientCenterX, cy)
      ctx.stroke()
      ctx.setLineDash([])

      // Client connector box — color matches its server
      ctx.fillStyle = srv.color + '12'
      ctx.strokeStyle = srv.color + '50'
      ctx.lineWidth = 1
      roundRect(ctx, clientX, cy, clientW, clientH, 6)

      ctx.font = 'bold 11px "Heebo", sans-serif'
      ctx.fillStyle = srv.color
      ctx.textAlign = 'center'
      ctx.fillText(t.client, clientX + clientW / 2, cy + clientH / 2 + 4)
    })

    // === MCP Servers (right side) ===
    const srvX = 470
    const srvW = 140
    const srvH = 55
    const srvStartY = 60
    const srvGap = 25

    servers.forEach((srv, i) => {
      const sy = srvStartY + i * (srvH + srvGap)

      ctx.fillStyle = srv.color + '10'
      ctx.strokeStyle = srv.color + '40'
      ctx.lineWidth = 1.5
      roundRect(ctx, srvX, sy, srvW, srvH, 8)

      ctx.font = 'bold 13px "Heebo", sans-serif'
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      ctx.fillText(t.server1, srvX + srvW / 2, sy + 22)
      ctx.font = 'bold 12px "Heebo", sans-serif'
      ctx.fillStyle = srv.color
      ctx.fillText(srv.desc, srvX + srvW / 2, sy + 40)
    })

    // === Connection lines: Client connectors → Servers ===
    servers.forEach((srv, i) => {
      const cy = clientStartY + i * clientGap + clientH / 2
      const sy = srvStartY + i * (srvH + srvGap) + srvH / 2
      const fromX = hostX + hostW
      const toX = srvX

      // Dashed line from host edge to server
      ctx.strokeStyle = border
      ctx.lineWidth = 1.5
      ctx.setLineDash([4, 3])
      ctx.beginPath()
      ctx.moveTo(fromX, cy)
      ctx.lineTo(fromX + 20, cy)
      ctx.quadraticCurveTo(fromX + 30, cy, fromX + 30, (cy + sy) / 2)
      ctx.quadraticCurveTo(fromX + 30, sy, fromX + 40, sy)
      ctx.lineTo(toX - 5, sy)
      ctx.stroke()
      ctx.setLineDash([])

      // Arrowhead
      ctx.fillStyle = border
      ctx.beginPath()
      ctx.moveTo(toX - 5, sy)
      ctx.lineTo(toX - 12, sy - 4)
      ctx.lineTo(toX - 12, sy + 4)
      ctx.closePath()
      ctx.fill()
    })

    // Protocol label on middle connection
    const plX = hostX + hostW + 5
    const plY = clientStartY + clientGap + clientH / 2 - 11
    const plW = lang === 'he' ? 90 : 82
    ctx.fillStyle = cyan + '10'
    ctx.strokeStyle = cyan + '30'
    ctx.lineWidth = 1
    roundRect(ctx, plX, plY, plW, 22, 4)
    ctx.font = 'bold 11px "Heebo", sans-serif'
    ctx.fillStyle = cyan
    ctx.textAlign = 'center'
    ctx.fillText(t.protocol, plX + plW / 2, plY + 15)

    // Flow labels on first connection
    const s1cy = clientStartY + clientH / 2
    const s1sy = srvStartY + srvH / 2
    const midConnX = (hostX + hostW + srvX) / 2 + 15
    ctx.font = 'bold 11px "Heebo", sans-serif'
    ctx.fillStyle = green
    ctx.textAlign = 'center'
    ctx.fillText(t.read, midConnX, Math.min(s1cy, s1sy) - 6)
    ctx.fillStyle = textSoft
    ctx.fillText(t.data, midConnX, Math.max(s1cy, s1sy) + 16)

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

  const angle = Math.atan2(y2 - y1, x2 - x1)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - 8 * Math.cos(angle - 0.4), y2 - 8 * Math.sin(angle - 0.4))
  ctx.lineTo(x2 - 8 * Math.cos(angle + 0.4), y2 - 8 * Math.sin(angle + 0.4))
  ctx.closePath()
  ctx.fill()
}
