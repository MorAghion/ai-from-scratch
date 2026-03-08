import { useEffect, useRef } from 'react'

// Simple 3-layer neural network animation showing forward pass + backpropagation
// Loops every ~4 seconds. Pure SVG + CSS animations, no dependencies.

const LAYERS = [3, 4, 2] // input, hidden, output
const W = 560
const H = 280
const LAYER_X = [130, 280, 430]
const NODE_R = 10
const DURATION = 4000 // ms per cycle

function getNodeY(layerIdx, nodeIdx) {
  const count = LAYERS[layerIdx]
  const totalH = (count - 1) * 44
  const startY = (H - totalH) / 2
  return startY + nodeIdx * 44
}

export default function NeuralNetworkAnimation() {
  const canvasRef = useRef(null)
  const frameRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    // Build node positions
    const nodes = []
    for (let l = 0; l < LAYERS.length; l++) {
      const layer = []
      for (let n = 0; n < LAYERS[l]; n++) {
        layer.push({ x: LAYER_X[l], y: getNodeY(l, n) })
      }
      nodes.push(layer)
    }

    // Build connections
    const connections = []
    for (let l = 0; l < nodes.length - 1; l++) {
      for (const from of nodes[l]) {
        for (const to of nodes[l + 1]) {
          connections.push({ from, to, layer: l })
        }
      }
    }

    function draw(t) {
      const cycle = (t % DURATION) / DURATION // 0..1
      ctx.clearRect(0, 0, W, H)

      // Phase: 0-0.4 = forward pass, 0.4-0.55 = pause/error, 0.55-0.95 = backprop, 0.95-1 = pause
      const isForward = cycle < 0.4
      const isError = cycle >= 0.4 && cycle < 0.55
      const isBackprop = cycle >= 0.55 && cycle < 0.95

      // Draw connections
      for (const conn of connections) {
        const { from, to, layer } = conn
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.12)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Animated signal along connection
        if (isForward) {
          const progress = cycle / 0.4
          const layerProgress = layer === 0
            ? progress * 2 : (progress - 0.5) * 2
          if (layerProgress > 0 && layerProgress < 1) {
            const px = from.x + (to.x - from.x) * layerProgress
            const py = from.y + (to.y - from.y) * layerProgress
            ctx.beginPath()
            ctx.arc(px, py, 3, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(99, 102, 241, 0.7)'
            ctx.fill()
          }
        }

        if (isBackprop) {
          const progress = (cycle - 0.55) / 0.4
          const layerProgress = layer === 1
            ? progress * 2 : (progress - 0.5) * 2
          if (layerProgress > 0 && layerProgress < 1) {
            const px = to.x + (from.x - to.x) * layerProgress
            const py = to.y + (from.y - to.y) * layerProgress
            ctx.beginPath()
            ctx.arc(px, py, 3, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(239, 68, 68, 0.7)'
            ctx.fill()
          }
        }
      }

      // Draw nodes
      for (let l = 0; l < nodes.length; l++) {
        for (let n = 0; n < nodes[l].length; n++) {
          const { x, y } = nodes[l][n]
          let glow = 0

          if (isForward) {
            const progress = cycle / 0.4
            if (l === 0 && progress < 0.3) glow = 1
            if (l === 1 && progress > 0.3 && progress < 0.7) glow = 1
            if (l === 2 && progress > 0.7) glow = 1
          }
          if (isError && l === 2) glow = -1 // error glow
          if (isBackprop) {
            const progress = (cycle - 0.55) / 0.4
            if (l === 2 && progress < 0.3) glow = -1
            if (l === 1 && progress > 0.3 && progress < 0.7) glow = -1
            if (l === 0 && progress > 0.7) glow = -1
          }

          // Node shadow/glow
          if (glow !== 0) {
            ctx.beginPath()
            ctx.arc(x, y, NODE_R + 4, 0, Math.PI * 2)
            ctx.fillStyle = glow > 0
              ? 'rgba(99, 102, 241, 0.15)'
              : 'rgba(239, 68, 68, 0.15)'
            ctx.fill()
          }

          // Node circle
          ctx.beginPath()
          ctx.arc(x, y, NODE_R, 0, Math.PI * 2)
          ctx.fillStyle = glow > 0
            ? '#6366F1'
            : glow < 0
              ? '#EF4444'
              : 'rgba(99, 102, 241, 0.3)'
          ctx.fill()

          // Node border
          ctx.beginPath()
          ctx.arc(x, y, NODE_R, 0, Math.PI * 2)
          ctx.strokeStyle = glow > 0
            ? '#6366F1'
            : glow < 0
              ? '#EF4444'
              : 'rgba(99, 102, 241, 0.4)'
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }

      // Labels
      ctx.font = "bold 14px 'Heebo', sans-serif"
      ctx.textAlign = 'center'

      if (isForward) {
        ctx.fillStyle = 'rgba(99, 102, 241, 0.9)'
        ctx.fillText('Forward Pass →', W / 2, H - 12)
      } else if (isError) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)'
        ctx.fillText('Error!', W / 2, H - 12)
      } else if (isBackprop) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)'
        ctx.fillText('← Backpropagation', W / 2, H - 12)
      }

      // Layer labels
      ctx.fillStyle = 'rgba(120, 120, 130, 0.85)'
      ctx.font = "bold 12px 'Heebo', sans-serif"
      ctx.fillText('Input', LAYER_X[0], 24)
      ctx.fillText('Hidden', LAYER_X[1], 24)
      ctx.fillText('Output', LAYER_X[2], 24)

      frameRef.current = requestAnimationFrame(animate)
    }

    function animate(timestamp) {
      if (!startRef.current) startRef.current = timestamp
      draw(timestamp - startRef.current)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <div style={{
      margin: '20px 0',
      borderRadius: 10,
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      padding: '12px 0',
    }}>
      <canvas
        ref={canvasRef}
        style={{ width: W, height: H }}
      />
    </div>
  )
}
