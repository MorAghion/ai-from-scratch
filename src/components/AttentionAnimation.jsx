import { useEffect, useRef } from 'react'

// Visualizes the Attention mechanism: words in a sentence with weighted connections
// Shows which word "attends to" which other words, cycling through focus words.

const W = 560
const H = 280
const CYCLE = 2500 // ms per focused word

const words = ['הכלב', 'שישב', 'על', 'השטיח', 'קם', 'והלך', 'לדלת']

// Attention weights: for each focus word, how much it attends to each other word (0..1)
// These approximate real attention patterns for this sentence
const attentionMap = {
  0: [1, 0.2, 0.05, 0.1, 0.3, 0.2, 0.15],   // הכלב — looks at itself, and "קם"/"והלך"
  4: [0.7, 0.15, 0.02, 0.05, 1, 0.3, 0.2],   // קם — strongly attends to "הכלב"
  5: [0.5, 0.05, 0.02, 0.05, 0.4, 1, 0.6],   // והלך — attends to "הכלב", "קם", "לדלת"
  6: [0.15, 0.05, 0.02, 0.05, 0.1, 0.5, 1],  // לדלת — attends to "והלך"
}
const focusOrder = [4, 0, 5, 6] // cycle through these focus words

export default function AttentionAnimation() {
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

    // Compute word positions (evenly spaced, RTL order for Hebrew)
    const wordPositions = words.map((_, i) => {
      const totalW = W - 60
      const x = 30 + (i / (words.length - 1)) * totalW
      return { x, y: 150 }
    })

    function draw(t) {
      const totalCycle = CYCLE * focusOrder.length
      const globalT = t % totalCycle
      const focusIdx = Math.floor(globalT / CYCLE)
      const inCycle = (globalT % CYCLE) / CYCLE
      const focusWord = focusOrder[focusIdx]
      const weights = attentionMap[focusWord]

      ctx.clearRect(0, 0, W, H)

      // Phase: 0-0.15 highlight focus word, 0.15-0.8 show connections, 0.8-1 fade
      const fadeIn = Math.min(inCycle / 0.15, 1)
      const connAlpha = inCycle < 0.15 ? 0 :
        inCycle < 0.8 ? Math.min((inCycle - 0.15) / 0.15, 1) :
        1 - (inCycle - 0.8) / 0.2

      // Draw attention connections (arcs above words)
      if (connAlpha > 0) {
        for (let i = 0; i < words.length; i++) {
          if (i === focusWord) continue
          const w = weights[i]
          if (w < 0.1) continue

          const from = wordPositions[focusWord]
          const to = wordPositions[i]
          const midX = (from.x + to.x) / 2
          const dist = Math.abs(from.x - to.x)
          const arcH = Math.min(dist * 0.4, 50) + w * 15

          ctx.beginPath()
          ctx.moveTo(from.x, from.y - 12)
          ctx.quadraticCurveTo(midX, from.y - 12 - arcH, to.x, to.y - 12)
          ctx.strokeStyle = `rgba(99, 102, 241, ${w * 0.7 * connAlpha})`
          ctx.lineWidth = w * 4
          ctx.stroke()

          // Dot at the end of the arc
          ctx.beginPath()
          ctx.arc(to.x, to.y - 12, w * 4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(99, 102, 241, ${w * 0.5 * connAlpha})`
          ctx.fill()
        }
      }

      // Draw words
      ctx.textAlign = 'center'
      for (let i = 0; i < words.length; i++) {
        const pos = wordPositions[i]
        const isFocus = i === focusWord
        const w = weights[i]

        // Word background pill
        const pillW = 52
        const pillH = 28
        if (isFocus) {
          ctx.fillStyle = `rgba(99, 102, 241, ${0.15 * fadeIn})`
          ctx.beginPath()
          ctx.roundRect(pos.x - pillW / 2, pos.y - pillH / 2, pillW, pillH, 6)
          ctx.fill()
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.5 * fadeIn})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        } else if (connAlpha > 0 && w > 0.3) {
          ctx.fillStyle = `rgba(99, 102, 241, ${0.06 * w * connAlpha})`
          ctx.beginPath()
          ctx.roundRect(pos.x - pillW / 2, pos.y - pillH / 2, pillW, pillH, 6)
          ctx.fill()
        }

        // Word text
        ctx.font = isFocus ? "bold 16px 'Heebo', sans-serif" : "bold 14px 'Heebo', sans-serif"
        ctx.fillStyle = isFocus
          ? `rgba(99, 102, 241, ${fadeIn})`
          : connAlpha > 0 && w > 0.3
            ? `rgba(99, 102, 241, ${0.4 + w * 0.5 * connAlpha})`
            : 'rgba(120, 120, 130, 0.5)'
        ctx.fillText(words[i], pos.x, pos.y + 5)

        // Weight percentage under attended words
        if (!isFocus && connAlpha > 0 && w > 0.15) {
          ctx.font = "bold 12px 'Heebo', sans-serif"
          ctx.fillStyle = `rgba(99, 102, 241, ${0.85 * connAlpha})`
          ctx.fillText(`${Math.round(w * 100)}%`, pos.x, pos.y + 22)
        }
      }

      // Label at top
      ctx.font = "bold 16px 'Heebo', sans-serif"
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(120, 120, 130, 0.85)'
      ctx.fillText('Attention — מי מקשיב למי?', W / 2, 28)

      // Current focus label
      if (fadeIn > 0.5) {
        ctx.font = "bold 14px 'Heebo', sans-serif"
        ctx.fillStyle = `rgba(99, 102, 241, ${0.85 * fadeIn})`
        ctx.fillText(`"${words[focusWord]}" מקשיבה ל:`, W / 2, H - 14)
      }

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
        style={{ width: '100%', maxWidth: W, height: 'auto', aspectRatio: `${W} / ${H}` }}
      />
    </div>
  )
}
