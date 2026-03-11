import { useEffect, useRef } from 'react'
import { useTheme } from '../App'

const COLORS = ['#3D8B80', '#9B4F96', '#C2652A']

// Neural network layer config: diamond shape (narrow→wide→narrow)
const LAYERS = [3, 4, 5, 6, 5, 4, 3]
// Gradient colors per layer
const LAYER_COLORS = [
  '#3D8B80',   // teal
  '#4D7D8B',   // teal-purple blend
  '#5E6D8E',   // mid blend
  '#9B4F96',   // purple
  '#B65A60',   // purple-terracotta blend
  '#C2652A',   // terracotta
  '#8B5E3C',   // brown
]

// Bunches: each is a small cluster of 2-4 nodes that float together
const BUNCHES = [
  { count: 3, spread: 25 },
  { count: 2, spread: 20 },
  { count: 4, spread: 30 },
  { count: 3, spread: 22 },
  { count: 2, spread: 18 },
]

export default function FloatingNodes({ nnOnly = false }) {
  const canvasRef = useRef(null)
  const { themeId } = useTheme()
  const isDusk = themeId === 'dusk'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let startTime = Date.now()

    const layers = []
    const bunches = [] // array of { cx, cy, vx, vy, nodes: [{offX, offY, r, color}] }
    const circuitTraces = [] // { points: [{x,y}], color }
    const circuitDots = []   // junction dots

    function resize() {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }

    function initNN() {
      layers.length = 0
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      const nnWidth = Math.min(w * 0.25, 190)
      const nnHeight = Math.min(h * 0.6, 260)
      const offsetX = w - nnWidth - w * 0.05
      const offsetY = h * 0.03

      const layerSpacing = nnWidth / (LAYERS.length - 1)
      const nodeRadius = Math.min(nnWidth / 22, 9)

      for (let l = 0; l < LAYERS.length; l++) {
        const count = LAYERS[l]
        const layerNodes = []
        const nodeSpacing = nnHeight / (count + 1)
        const x = offsetX + l * layerSpacing

        for (let n = 0; n < count; n++) {
          const y = offsetY + (n + 1) * nodeSpacing
          layerNodes.push({
            baseX: x, baseY: y, x, y,
            r: nodeRadius,
            color: LAYER_COLORS[l],
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            ampX: 1.5 + Math.random() * 2.5,
            ampY: 1.5 + Math.random() * 2.5,
            speedX: 0.3 + Math.random() * 0.4,
            speedY: 0.2 + Math.random() * 0.3,
          })
        }
        layers.push(layerNodes)
      }
    }

    function initBunches() {
      bunches.length = 0
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      BUNCHES.forEach((cfg, i) => {
        const bunch = {
          cx: w * 0.15 + Math.random() * w * 0.55,
          cy: h * 0.15 + Math.random() * h * 0.6,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          nodes: [],
        }
        const color = COLORS[i % COLORS.length]
        for (let n = 0; n < cfg.count; n++) {
          const angle = (Math.PI * 2 * n) / cfg.count + Math.random() * 0.5
          const dist = cfg.spread * (0.5 + Math.random() * 0.5)
          bunch.nodes.push({
            offX: Math.cos(angle) * dist,
            offY: Math.sin(angle) * dist,
            r: 2.5 + Math.random() * 2.5,
            color,
            opacity: 0.2 + Math.random() * 0.15,
          })
        }
        bunches.push(bunch)
      })
    }

    function initCircuit() {
      circuitTraces.length = 0
      circuitDots.length = 0
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      // PCB-style circuit: strictly H/V lines radiating from bottom-left
      const ox = -5
      const oy = h + 5
      const s = Math.min(w, h) * 0.006 // scale factor — larger

      // Define traces: some turning toward NN (up-right), with horizontal flow lines
      const traceDefs = [
        // Vertical-first traces
        { start: [0, -12], moves: [[0,-35],[45,0],[0,-40],[35,0]], pulse: false },
        { start: [6, -6],  moves: [[0,-50],[40,0],[0,-30],[30,0],[0,-45],[25,0]], pulse: true },
        { start: [14, -20], moves: [[0,-25],[35,0],[0,-55],[25,0]], pulse: false },
        { start: [0, -40], moves: [[30,0],[0,-25],[35,0],[0,-40],[30,0]], pulse: true },
        { start: [20, -8], moves: [[0,-40],[30,0],[0,-30],[25,0],[0,-50],[20,0]], pulse: false },
        // Shorter stubs
        { start: [3, -55], moves: [[40,0],[0,-18],[25,0]], pulse: false },
        { start: [10, -65], moves: [[0,-22],[45,0],[0,-30],[30,0]], pulse: true },
        { start: [18, -30], moves: [[25,0],[0,-45],[30,0]], pulse: false },
        // Horizontal flow lines — run rightward across the bottom
        { start: [0, -3], moves: [[55,0],[0,-8],[40,0],[0,-5],[35,0]], pulse: false },
        { start: [5, -10], moves: [[50,0],[0,-12],[45,0]], pulse: false },
        { start: [0, -75], moves: [[35,0],[0,-18],[30,0],[0,-25],[25,0]], pulse: true },
        { start: [8, -50], moves: [[18,0],[0,-38],[35,0],[0,-35],[20,0]], pulse: false },
        // Extra horizontal runners
        { start: [12, -2], moves: [[60,0],[0,-6],[30,0]], pulse: false },
        { start: [22, -18], moves: [[40,0],[0,-15],[35,0],[0,-10],[25,0]], pulse: false },
      ]

      for (let ti = 0; ti < traceDefs.length; ti++) {
        const def = traceDefs[ti]
        const color = COLORS[ti % COLORS.length]
        const points = []
        let x = ox + def.start[0] * s
        let y = oy + def.start[1] * s
        points.push({ x, y })

        // Cumulative segment lengths for pulse positioning
        const segLengths = [0]
        let totalLen = 0

        for (const [dx, dy] of def.moves) {
          x += dx * s
          y += dy * s
          points.push({ x, y })
          const prev = points[points.length - 2]
          const segLen = Math.sqrt((x - prev.x) ** 2 + (y - prev.y) ** 2)
          totalLen += segLen
          segLengths.push(totalLen)
        }

        circuitTraces.push({ points, color, segLengths, totalLen, pulse: def.pulse })

        // Via dots only at corners
        for (let i = 1; i < points.length - 1; i++) {
          circuitDots.push({ baseX: points[i].x, baseY: points[i].y, r: 1.8, color })
        }
        // Terminal dot
        const last = points[points.length - 1]
        circuitDots.push({ baseX: last.x, baseY: last.y, r: 2.5, color })
      }
    }

    function draw() {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      const elapsed = (Date.now() - startTime) / 1000

      // === BUNCHES OF FLOATING NODES ===
      if (!nnOnly) {
        for (const bunch of bunches) {
          bunch.cx += bunch.vx
          bunch.cy += bunch.vy
          if (bunch.cx < 30) bunch.vx = Math.abs(bunch.vx)
          if (bunch.cx > w - 30) bunch.vx = -Math.abs(bunch.vx)
          if (bunch.cy < 30) bunch.vy = Math.abs(bunch.vy)
          if (bunch.cy > h - 30) bunch.vy = -Math.abs(bunch.vy)

          // Draw connections within the bunch
          for (let i = 0; i < bunch.nodes.length; i++) {
            for (let j = i + 1; j < bunch.nodes.length; j++) {
              const a = bunch.nodes[i]
              const b = bunch.nodes[j]
              const ax = bunch.cx + a.offX
              const ay = bunch.cy + a.offY
              const bx = bunch.cx + b.offX
              const by = bunch.cy + b.offY
              ctx.strokeStyle = isDusk
                ? 'rgba(200, 204, 216, 0.1)'
                : 'rgba(60, 50, 41, 0.08)'
              ctx.lineWidth = 0.8
              ctx.beginPath()
              ctx.moveTo(ax, ay)
              ctx.lineTo(bx, by)
              ctx.stroke()
            }
          }

          // Draw nodes in the bunch
          for (const n of bunch.nodes) {
            ctx.globalAlpha = n.opacity
            ctx.fillStyle = n.color
            ctx.beginPath()
            ctx.arc(bunch.cx + n.offX, bunch.cy + n.offY, n.r, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        ctx.globalAlpha = 1
      }

      // === STRUCTURED NN (top-right) ===
      const globalDx = Math.sin(elapsed * 0.15) * 4
      const globalDy = Math.cos(elapsed * 0.12) * 3

      for (const layer of layers) {
        for (const n of layer) {
          n.x = n.baseX + globalDx + Math.sin(elapsed * n.speedX + n.phaseX) * n.ampX
          n.y = n.baseY + globalDy + Math.cos(elapsed * n.speedY + n.phaseY) * n.ampY
        }
      }

      // Input arrows on first layer
      if (layers[0]) {
        ctx.globalAlpha = isDusk ? 0.2 : 0.15
        ctx.strokeStyle = isDusk ? '#C8CCD8' : '#8B7E74'
        ctx.lineWidth = 1
        for (const n of layers[0]) {
          const arrowLen = 18
          ctx.beginPath()
          ctx.moveTo(n.x - arrowLen - 6, n.y)
          ctx.lineTo(n.x - 6, n.y)
          ctx.stroke()
          // arrowhead
          ctx.beginPath()
          ctx.moveTo(n.x - 6, n.y)
          ctx.lineTo(n.x - 10, n.y - 3)
          ctx.moveTo(n.x - 6, n.y)
          ctx.lineTo(n.x - 10, n.y + 3)
          ctx.stroke()
        }
        ctx.globalAlpha = 1
      }

      // Connections between layers — more visible
      const totalLayers = layers.length - 1
      for (let l = 0; l < totalLayers; l++) {
        const curr = layers[l]
        const next = layers[l + 1]
        for (const a of curr) {
          for (const b of next) {
            ctx.globalAlpha = isDusk ? 0.22 : 0.16
            ctx.strokeStyle = isDusk ? '#C8CCD8' : '#6B5E54'
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1

      // === ELECTRICITY PULSE — coordinated: circuit (0→2s) then NN (2→4.5s) ===
      const pulseCycle = 10
      const circuitPulseDur = 2.0  // circuit fires first
      const nnPulseDelay = 2.0     // NN starts when circuit ends
      const nnPulseDur = 2.5
      const pulseTime = elapsed % pulseCycle
      const nnTime = pulseTime - nnPulseDelay
      if (nnTime >= 0 && nnTime < nnPulseDur && totalLayers > 0) {
        // Progress 0→1 across all layers
        const progress = nnTime / nnPulseDur
        // Which layer gap the pulse is in (fractional)
        const pulsePos = progress * totalLayers
        const activeLayer = Math.floor(pulsePos)
        const layerProgress = pulsePos - activeLayer

        // Light up connections in current layer gap and slightly behind
        for (let l = Math.max(0, activeLayer - 1); l <= Math.min(activeLayer, totalLayers - 1); l++) {
          const curr = layers[l]
          const next = layers[l + 1]
          if (!curr || !next) continue

          // Fade based on distance from pulse front
          const dist = Math.abs(l - (pulsePos - 0.5))
          const intensity = Math.max(0, 1 - dist * 0.8)

          for (const a of curr) {
            for (const b of next) {
              // Electric pulse line — bright white-ish
              ctx.globalAlpha = intensity * (isDusk ? 0.5 : 0.35)
              ctx.strokeStyle = isDusk ? '#FFD54F' : '#F5A623'
              ctx.lineWidth = 1.5
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.stroke()
            }
          }

          // Glowing dot traveling along a random connection
          if (l === activeLayer && curr.length > 0 && next.length > 0) {
            // Pick a few connections to show traveling dots
            for (let d = 0; d < 3; d++) {
              const fromNode = curr[d % curr.length]
              const toNode = next[(d * 2) % next.length]
              const dotX = fromNode.x + (toNode.x - fromNode.x) * layerProgress
              const dotY = fromNode.y + (toNode.y - fromNode.y) * layerProgress
              ctx.globalAlpha = isDusk ? 0.9 : 0.7
              ctx.fillStyle = '#FFFFFF'
              ctx.beginPath()
              ctx.arc(dotX, dotY, 2, 0, Math.PI * 2)
              ctx.fill()
              // Electric glow
              ctx.globalAlpha = isDusk ? 0.35 : 0.25
              ctx.fillStyle = isDusk ? '#FFD54F' : '#F5A623'
              ctx.beginPath()
              ctx.arc(dotX, dotY, 6, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }

        // Pulse glow on nodes in active layers
        for (let l = Math.max(0, activeLayer); l <= Math.min(activeLayer + 1, layers.length - 1); l++) {
          const dist = Math.abs(l - pulsePos)
          const glow = Math.max(0, 1 - dist * 1.2)
          if (glow <= 0) continue
          for (const n of layers[l]) {
            ctx.globalAlpha = glow * 0.25
            ctx.fillStyle = isDusk ? '#FFD54F' : '#F5A623'
            ctx.beginPath()
            ctx.arc(n.x, n.y, n.r + 4, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        ctx.globalAlpha = 1
      }

      // Nodes — solid filled with gradient colors
      for (const layer of layers) {
        for (const n of layer) {
          ctx.globalAlpha = 0.6
          ctx.fillStyle = n.color
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1

      // === CIRCUIT PCB TRACES (bottom-left) — palette colored ===
      if (!nnOnly) {
      const circuitDx = Math.sin(elapsed * 0.1 + 1) * 2
      const circuitDy = Math.cos(elapsed * 0.08 + 2) * 1.5

      for (const trace of circuitTraces) {
        ctx.globalAlpha = isDusk ? 0.25 : 0.18
        ctx.strokeStyle = trace.color
        ctx.lineWidth = 1
        ctx.lineCap = 'square'
        ctx.lineJoin = 'miter'
        ctx.beginPath()
        for (let i = 0; i < trace.points.length; i++) {
          const p = trace.points[i]
          if (i === 0) ctx.moveTo(p.x + circuitDx, p.y + circuitDy)
          else ctx.lineTo(p.x + circuitDx, p.y + circuitDy)
        }
        ctx.stroke()
      }

      // Circuit pulse — fires during first 2 seconds, travels along traces
      if (pulseTime < circuitPulseDur) {
        const cProgress = pulseTime / circuitPulseDur
        const pulseColor = isDusk ? '#FFD54F' : '#F5A623'

        for (const trace of circuitTraces) {
          if (!trace.pulse || trace.totalLen === 0) continue
          const traveled = cProgress * trace.totalLen

          // Draw bright overlay on the portion already traveled
          ctx.globalAlpha = isDusk ? 0.45 : 0.35
          ctx.strokeStyle = pulseColor
          ctx.lineWidth = 1.5
          ctx.lineCap = 'square'
          ctx.lineJoin = 'miter'
          ctx.beginPath()

          let drawn = false
          for (let i = 0; i < trace.points.length - 1; i++) {
            const a = trace.points[i]
            const b = trace.points[i + 1]
            const segStart = trace.segLengths[i]
            const segEnd = trace.segLengths[i + 1]

            if (traveled <= segStart) break

            if (!drawn) {
              ctx.moveTo(a.x + circuitDx, a.y + circuitDy)
              drawn = true
            }

            if (traveled >= segEnd) {
              ctx.lineTo(b.x + circuitDx, b.y + circuitDy)
            } else {
              // Partial segment — interpolate
              const t = (traveled - segStart) / (segEnd - segStart)
              const px = a.x + (b.x - a.x) * t
              const py = a.y + (b.y - a.y) * t
              ctx.lineTo(px + circuitDx, py + circuitDy)

              // Glowing dot at pulse front
              ctx.stroke()
              ctx.globalAlpha = isDusk ? 0.8 : 0.6
              ctx.fillStyle = '#FFFFFF'
              ctx.beginPath()
              ctx.arc(px + circuitDx, py + circuitDy, 2, 0, Math.PI * 2)
              ctx.fill()
              ctx.globalAlpha = isDusk ? 0.3 : 0.2
              ctx.fillStyle = pulseColor
              ctx.beginPath()
              ctx.arc(px + circuitDx, py + circuitDy, 5, 0, Math.PI * 2)
              ctx.fill()
              drawn = false
              break
            }
          }
          if (drawn) ctx.stroke()
        }
        ctx.globalAlpha = 1
      }

      // Via dots at corners
      for (const d of circuitDots) {
        ctx.globalAlpha = isDusk ? 0.2 : 0.15
        ctx.fillStyle = d.color
        ctx.beginPath()
        ctx.arc(d.baseX + circuitDx, d.baseY + circuitDy, d.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      } // end !nnOnly circuit

      animId = requestAnimationFrame(draw)
    }

    resize()
    initNN()
    if (!nnOnly) { initBunches(); initCircuit() }
    draw()

    const onResize = () => {
      resize()
      initNN()
      if (!nnOnly) { initBunches(); initCircuit() }
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [isDusk])

  return (
    <canvas
      ref={canvasRef}
      className="floating-nodes-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    />
  )
}
