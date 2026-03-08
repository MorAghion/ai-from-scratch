import { useEffect, useRef } from 'react'

// Visualizes the NN learning process: input image → guess → right/wrong → adjust → repeat
// Shows confidence improving over iterations. Loops continuously.

const W = 560
const H = 280
const CYCLE = 2200 // ms per learning round
const ROUNDS = 5   // rounds before reset

// Simplified pixel art for cat and dog (7x7 grid)
const CAT_PIXELS = [
  '..X...X',
  '.XX..XX',
  '.XXXXX.',
  '.X.X.X.',
  '.XXXXX.',
  '..XXX..',
  '...X...',
]
const DOG_PIXELS = [
  'XX.....',
  'XXX....',
  '.XXXXX.',
  '.X.X.X.',
  '.XXXXX.',
  '.XXXXX.',
  '..XXX..',
]

function drawPixelArt(ctx, pixels, x, y, size, color) {
  const cellSize = size / 7
  for (let row = 0; row < pixels.length; row++) {
    for (let col = 0; col < pixels[row].length; col++) {
      if (pixels[row][col] === 'X') {
        ctx.fillStyle = color
        ctx.fillRect(x + col * cellSize, y + row * cellSize, cellSize - 0.5, cellSize - 0.5)
      }
    }
  }
}

// What the network "learns" over rounds
// Each round: { input: 'cat'|'dog', guess: 'cat'|'dog', confidence }
const schedule = [
  { input: 'dog', guess: 'cat', confidence: 0.52 },
  { input: 'cat', guess: 'dog', confidence: 0.48 },
  { input: 'dog', guess: 'dog', confidence: 0.61 },
  { input: 'cat', guess: 'dog', confidence: 0.55 },
  { input: 'cat', guess: 'cat', confidence: 0.93 },
]

export default function LearningAnimation() {
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

    // Network node positions (compact, 3 layers)
    const layers = [3, 4, 2]
    const netX0 = 195
    const netW = 150
    const netH = 120
    const netY0 = 65
    const nodes = []
    for (let l = 0; l < layers.length; l++) {
      const layer = []
      const x = netX0 + (l / (layers.length - 1)) * netW
      for (let n = 0; n < layers[l]; n++) {
        const totalH = (layers[l] - 1) * 28
        const startY = netY0 + (netH - totalH) / 2
        layer.push({ x, y: startY + n * 28 })
      }
      nodes.push(layer)
    }

    function draw(t) {
      const totalCycle = CYCLE * ROUNDS
      const globalT = t % (totalCycle + 1500) // extra pause at end
      const round = Math.min(Math.floor(globalT / CYCLE), ROUNDS - 1)
      const inRound = (globalT - round * CYCLE) / CYCLE // 0..1 within round
      const isReset = globalT > totalCycle

      ctx.clearRect(0, 0, W, H)

      const s = schedule[round]
      const isCorrect = s.input === s.guess
      const pixels = s.input === 'cat' ? CAT_PIXELS : DOG_PIXELS

      // Phase: 0-0.25 show input, 0.25-0.5 signal through net, 0.5-0.75 show result, 0.75-1 adjust
      const phase = isReset ? 'reset' :
        inRound < 0.2 ? 'input' :
        inRound < 0.45 ? 'forward' :
        inRound < 0.7 ? 'result' : 'adjust'

      // --- Draw input image box ---
      const imgX = 30
      const imgY = 70
      const imgSize = 55
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)'
      ctx.lineWidth = 1
      ctx.strokeRect(imgX - 2, imgY - 2, imgSize + 4, imgSize + 4)

      if (!isReset) {
        const inputAlpha = phase === 'input' ? Math.min(inRound / 0.1, 1) : 1
        ctx.globalAlpha = inputAlpha
        drawPixelArt(ctx, pixels, imgX, imgY, imgSize, '#6366F1')
        ctx.globalAlpha = 1

        // Label
        ctx.font = "bold 12px 'Heebo', sans-serif"
        ctx.fillStyle = 'rgba(99, 102, 241, 0.9)'
        ctx.textAlign = 'center'
        ctx.fillText(s.input === 'cat' ? '🐱' : '🐶', imgX + imgSize / 2, imgY + imgSize + 16)
      }

      // --- Draw network ---
      // Connections
      for (let l = 0; l < nodes.length - 1; l++) {
        for (const from of nodes[l]) {
          for (const to of nodes[l + 1]) {
            ctx.beginPath()
            ctx.moveTo(from.x, from.y)
            ctx.lineTo(to.x, to.y)

            // During adjust phase, flash connections
            if (phase === 'adjust' && !isCorrect) {
              const pulse = Math.sin((inRound - 0.75) / 0.25 * Math.PI * 4)
              ctx.strokeStyle = `rgba(239, 68, 68, ${0.08 + pulse * 0.06})`
              ctx.lineWidth = 1.5
            } else {
              ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)'
              ctx.lineWidth = 1
            }
            ctx.stroke()
          }
        }
      }

      // Signal dots flowing through network
      if (phase === 'forward') {
        const progress = (inRound - 0.2) / 0.25
        for (let l = 0; l < nodes.length - 1; l++) {
          const layerP = l === 0 ? progress * 2 : (progress - 0.5) * 2
          if (layerP > 0 && layerP < 1) {
            for (const from of nodes[l]) {
              for (const to of nodes[l + 1]) {
                const px = from.x + (to.x - from.x) * layerP
                const py = from.y + (to.y - from.y) * layerP
                ctx.beginPath()
                ctx.arc(px, py, 2.5, 0, Math.PI * 2)
                ctx.fillStyle = 'rgba(99, 102, 241, 0.6)'
                ctx.fill()
              }
            }
          }
        }
      }

      // Nodes
      for (let l = 0; l < nodes.length; l++) {
        for (const node of nodes[l]) {
          let active = false
          if (phase === 'forward') {
            const progress = (inRound - 0.2) / 0.25
            if (l === 0 && progress < 0.35) active = true
            if (l === 1 && progress > 0.25 && progress < 0.75) active = true
            if (l === 2 && progress > 0.65) active = true
          }
          if (phase === 'result' || phase === 'adjust') {
            if (l === 2) active = true
          }

          const isAdjust = phase === 'adjust' && !isCorrect

          ctx.beginPath()
          ctx.arc(node.x, node.y, 7, 0, Math.PI * 2)
          ctx.fillStyle = active
            ? (isAdjust ? '#EF4444' : '#6366F1')
            : 'rgba(99, 102, 241, 0.2)'
          ctx.fill()
          ctx.strokeStyle = active
            ? (isAdjust ? '#EF4444' : '#6366F1')
            : 'rgba(99, 102, 241, 0.3)'
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // --- Arrow from input to network ---
      if (!isReset && (phase === 'forward' || phase === 'result' || phase === 'adjust')) {
        ctx.beginPath()
        ctx.moveTo(imgX + imgSize + 8, imgY + imgSize / 2)
        ctx.lineTo(netX0 - 12, imgY + imgSize / 2)
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)'
        ctx.lineWidth = 1
        ctx.stroke()
        // Arrowhead
        ctx.beginPath()
        ctx.moveTo(netX0 - 12, imgY + imgSize / 2 - 4)
        ctx.lineTo(netX0 - 5, imgY + imgSize / 2)
        ctx.lineTo(netX0 - 12, imgY + imgSize / 2 + 4)
        ctx.fillStyle = 'rgba(99, 102, 241, 0.3)'
        ctx.fill()
      }

      // --- Result panel ---
      const resX = 390
      const resY = 65
      if (!isReset && (phase === 'result' || phase === 'adjust')) {
        // Arrow from net to result
        ctx.beginPath()
        ctx.moveTo(netX0 + netW + 10, imgY + imgSize / 2)
        ctx.lineTo(resX - 5, imgY + imgSize / 2)
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Guess label
        ctx.font = "bold 14px 'Heebo', sans-serif"
        ctx.textAlign = 'left'
        ctx.fillStyle = isCorrect ? '#10B981' : '#EF4444'
        ctx.fillText(s.guess === 'cat' ? '🐱 Cat' : '🐶 Dog', resX, resY + 10)

        // Confidence bar
        const barW = 80
        const barH = 10
        const barX = resX
        const barY = resY + 22
        ctx.fillStyle = 'rgba(99, 102, 241, 0.1)'
        ctx.fillRect(barX, barY, barW, barH)
        ctx.fillStyle = isCorrect ? '#10B981' : '#EF4444'
        ctx.fillRect(barX, barY, barW * s.confidence, barH)
        ctx.font = "bold 12px 'Heebo', sans-serif"
        ctx.fillStyle = 'var(--text-soft, #888)'
        ctx.fillText(`${Math.round(s.confidence * 100)}%`, barX + barW + 6, barY + 9)

        // Correct/wrong indicator
        ctx.font = "bold 14px 'Heebo', sans-serif"
        ctx.fillStyle = isCorrect ? '#10B981' : '#EF4444'
        ctx.fillText(isCorrect ? '✓ Correct!' : '✗ Wrong', resX, resY + 54)

        // Adjust message
        if (phase === 'adjust' && !isCorrect) {
          ctx.font = "12px 'Heebo', sans-serif"
          ctx.fillStyle = '#EF4444'
          ctx.fillText('Adjusting weights...', resX, resY + 72)
        }
      }

      // --- Iteration counter ---
      if (!isReset) {
        ctx.font = "bold 14px 'Heebo', sans-serif"
        ctx.textAlign = 'center'
        ctx.fillStyle = 'rgba(120, 120, 130, 0.85)'
        ctx.fillText(`Round ${round + 1}/${ROUNDS}`, W / 2, H - 14)
      } else {
        // Reset screen
        ctx.font = "bold 16px 'Heebo', sans-serif"
        ctx.textAlign = 'center'
        ctx.fillStyle = '#10B981'
        ctx.fillText('Network learned! 🎉', W / 2, H / 2 - 5)
        ctx.font = "14px 'Heebo', sans-serif"
        ctx.fillStyle = 'rgba(120, 120, 130, 0.85)'
        ctx.fillText('Restarting...', W / 2, H / 2 + 18)
      }

      // --- Top labels ---
      ctx.font = "bold 12px 'Heebo', sans-serif"
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(120, 120, 130, 0.85)'
      ctx.fillText('Input', imgX + imgSize / 2, 55)
      ctx.fillText('Neural Network', netX0 + netW / 2, 55)
      if (!isReset) ctx.fillText('Prediction', resX + 40, 55)

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
