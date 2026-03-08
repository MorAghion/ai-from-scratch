import { useEffect, useRef } from 'react'

// Visualizes the Agent Loop: User → LLM → Tool Call → Execute → Result → LLM → end_turn
// Cycles through a research-agent-like scenario showing the agentic loop pattern.

const W = 560
const H = 280
const STEP_MS = 1800

// Steps the animation cycles through
const steps = [
  { phase: 'user-to-llm', label: 'User sends query' },
  { phase: 'llm-think', label: 'LLM reads System Prompt + Tools' },
  { phase: 'llm-to-tool', label: 'tool_use → search_web', tool: 0 },
  { phase: 'tool-exec', label: 'Executing search_web...', tool: 0 },
  { phase: 'tool-to-llm', label: 'Results → back to LLM', tool: 0 },
  { phase: 'llm-think2', label: 'LLM decides next step' },
  { phase: 'llm-to-tool2', label: 'tool_use → fetch_page', tool: 1 },
  { phase: 'tool-exec2', label: 'Executing fetch_page...', tool: 1 },
  { phase: 'tool-to-llm2', label: 'Content → back to LLM', tool: 1 },
  { phase: 'llm-think3', label: 'LLM decides: done!' },
  { phase: 'llm-to-user', label: 'end_turn → Response to user' },
  { phase: 'done', label: 'Task complete ✓' },
]

const toolNames = ['search_web', 'fetch_page', 'save_report']

export default function AgentLoopAnimation() {
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

    // Layout positions
    const userBox = { x: 40, y: 100, w: 72, h: 55 }
    const llmBox = { x: 200, y: 65, w: 120, h: 95 }
    const toolBox = { x: 420, y: 65, w: 100, h: 130 }

    function roundRect(x, y, w, h, r) {
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, r)
    }

    function drawArrow(fromX, fromY, toX, toY, progress, color, lineW) {
      const dx = toX - fromX
      const dy = toY - fromY
      const px = fromX + dx * progress
      const py = fromY + dy * progress

      // Line
      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(px, py)
      ctx.strokeStyle = color
      ctx.lineWidth = lineW || 1.5
      ctx.stroke()

      // Dot at head
      if (progress > 0.05 && progress < 0.98) {
        ctx.beginPath()
        ctx.arc(px, py, 4, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      }

      // Arrowhead at end
      if (progress > 0.95) {
        const angle = Math.atan2(dy, dx)
        ctx.beginPath()
        ctx.moveTo(toX, toY)
        ctx.lineTo(toX - 8 * Math.cos(angle - 0.4), toY - 8 * Math.sin(angle - 0.4))
        ctx.lineTo(toX - 8 * Math.cos(angle + 0.4), toY - 8 * Math.sin(angle + 0.4))
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()
      }
    }

    function draw(t) {
      const totalCycle = STEP_MS * steps.length + 2000 // extra pause
      const globalT = t % totalCycle
      const stepIdx = Math.min(Math.floor(globalT / STEP_MS), steps.length - 1)
      const inStep = (globalT - stepIdx * STEP_MS) / STEP_MS
      const isReset = globalT > STEP_MS * steps.length
      const step = steps[stepIdx]

      ctx.clearRect(0, 0, W, H)

      // --- User Box ---
      const userActive = step.phase === 'user-to-llm' || step.phase === 'llm-to-user' || step.phase === 'done'
      roundRect(userBox.x, userBox.y, userBox.w, userBox.h, 8)
      ctx.fillStyle = userActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.05)'
      ctx.fill()
      ctx.strokeStyle = userActive ? '#6366F1' : 'rgba(99, 102, 241, 0.3)'
      ctx.lineWidth = userActive ? 2 : 1
      ctx.stroke()

      ctx.font = "bold 14px 'Heebo', sans-serif"
      ctx.textAlign = 'center'
      ctx.fillStyle = userActive ? '#6366F1' : 'rgba(99, 102, 241, 0.5)'
      ctx.fillText('User', userBox.x + userBox.w / 2, userBox.y + userBox.h / 2 + 5)

      // --- LLM Box ---
      const llmActive = step.phase.startsWith('llm-think') || step.phase === 'llm-to-tool' ||
        step.phase === 'llm-to-tool2' || step.phase === 'llm-to-user'
      const llmReceiving = step.phase === 'user-to-llm' || step.phase === 'tool-to-llm' || step.phase === 'tool-to-llm2'

      roundRect(llmBox.x, llmBox.y, llmBox.w, llmBox.h, 10)
      ctx.fillStyle = llmActive ? 'rgba(99, 102, 241, 0.18)' :
        llmReceiving ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.04)'
      ctx.fill()
      ctx.strokeStyle = llmActive ? '#6366F1' : 'rgba(99, 102, 241, 0.3)'
      ctx.lineWidth = llmActive ? 2 : 1
      ctx.stroke()

      ctx.font = "bold 16px 'Heebo', sans-serif"
      ctx.textAlign = 'center'
      ctx.fillStyle = llmActive ? '#6366F1' : 'rgba(99, 102, 241, 0.6)'
      ctx.fillText('LLM', llmBox.x + llmBox.w / 2, llmBox.y + llmBox.h / 2 + 2)

      // System Prompt label above LLM
      ctx.font = "bold 12px 'Heebo', sans-serif"
      ctx.fillStyle = 'rgba(99, 102, 241, 0.85)'
      ctx.fillText('System Prompt', llmBox.x + llmBox.w / 2, llmBox.y - 8)

      // Thinking pulse
      if (llmActive && (step.phase.startsWith('llm-think'))) {
        const pulse = Math.sin(inStep * Math.PI * 6) * 0.3 + 0.5
        ctx.font = "12px 'Heebo', sans-serif"
        ctx.fillStyle = `rgba(99, 102, 241, ${Math.max(pulse, 0.85)})`
        ctx.fillText('thinking...', llmBox.x + llmBox.w / 2, llmBox.y + llmBox.h / 2 + 20)
      }

      // --- Tools Box ---
      const activeToolIdx = step.tool !== undefined ? step.tool : -1
      const toolActive = step.phase.startsWith('tool-exec') || step.phase.startsWith('llm-to-tool')

      roundRect(toolBox.x, toolBox.y, toolBox.w, toolBox.h, 10)
      ctx.fillStyle = toolActive ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.03)'
      ctx.fill()
      ctx.strokeStyle = toolActive ? '#6366F1' : 'rgba(99, 102, 241, 0.25)'
      ctx.lineWidth = toolActive ? 1.5 : 1
      ctx.stroke()

      ctx.font = "bold 14px 'Heebo', sans-serif"
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(99, 102, 241, 0.85)'
      ctx.fillText('Tools', toolBox.x + toolBox.w / 2, toolBox.y + 18)

      // Tool list
      for (let i = 0; i < toolNames.length; i++) {
        const ty = toolBox.y + 32 + i * 26
        const isActive = i === activeToolIdx && toolActive
        const isExec = i === activeToolIdx && step.phase.startsWith('tool-exec')

        roundRect(toolBox.x + 8, ty, toolBox.w - 16, 20, 4)
        ctx.fillStyle = isExec ? 'rgba(16, 185, 129, 0.15)' :
          isActive ? 'rgba(99, 102, 241, 0.12)' : 'rgba(99, 102, 241, 0.04)'
        ctx.fill()
        if (isActive) {
          ctx.strokeStyle = isExec ? '#10B981' : '#6366F1'
          ctx.lineWidth = 1
          ctx.stroke()
        }

        ctx.font = `${isActive ? 'bold ' : ''}12px 'Heebo', sans-serif`
        ctx.textAlign = 'center'
        ctx.fillStyle = isExec ? '#10B981' :
          isActive ? '#6366F1' : 'rgba(99, 102, 241, 0.4)'
        ctx.fillText(toolNames[i], toolBox.x + toolBox.w / 2, ty + 14)
      }

      // --- Arrows ---
      const mainColor = '#6366F1'
      const successColor = '#10B981'
      const resultColor = 'rgba(16, 185, 129, 0.7)'

      // User → LLM
      if (step.phase === 'user-to-llm') {
        drawArrow(userBox.x + userBox.w, userBox.y + userBox.h / 2,
          llmBox.x, llmBox.y + llmBox.h / 2, Math.min(inStep * 2, 1), mainColor)
      }
      // Keep arrow visible after sent
      if (stepIdx > 0 && !isReset) {
        ctx.beginPath()
        ctx.moveTo(userBox.x + userBox.w + 2, userBox.y + userBox.h / 2)
        ctx.lineTo(llmBox.x - 2, llmBox.y + llmBox.h / 2)
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.12)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // LLM → Tools (tool_use)
      if (step.phase === 'llm-to-tool' || step.phase === 'llm-to-tool2') {
        const progress = Math.min(inStep * 2, 1)
        drawArrow(llmBox.x + llmBox.w, llmBox.y + llmBox.h / 2,
          toolBox.x, toolBox.y + 32 + (step.tool * 26) + 10, progress, mainColor)

        // JSON label on arrow
        if (progress > 0.3 && progress < 0.95) {
          const mx = (llmBox.x + llmBox.w + toolBox.x) / 2
          const my = (llmBox.y + llmBox.h / 2 + toolBox.y + 32 + (step.tool * 26) + 10) / 2
          ctx.font = "bold 12px 'Heebo', sans-serif"
          ctx.textAlign = 'center'
          ctx.fillStyle = 'rgba(99, 102, 241, 0.85)'
          ctx.fillText('{ JSON }', mx, my - 8)
        }
      }

      // Tool executing (pulse)
      if (step.phase.startsWith('tool-exec')) {
        const pulse = Math.sin(inStep * Math.PI * 4)
        const ti = step.tool
        const ty = toolBox.y + 32 + ti * 26
        ctx.beginPath()
        ctx.arc(toolBox.x + toolBox.w / 2, ty + 10, 2 + pulse, 0, Math.PI * 2)
        ctx.fillStyle = '#10B981'
        ctx.fill()
      }

      // Tools → LLM (result)
      if (step.phase === 'tool-to-llm' || step.phase === 'tool-to-llm2') {
        const progress = Math.min(inStep * 2, 1)
        drawArrow(toolBox.x, toolBox.y + 32 + (step.tool * 26) + 10,
          llmBox.x + llmBox.w, llmBox.y + llmBox.h / 2 + 12, progress, resultColor)
      }

      // Static connection line LLM ↔ Tools (when in loop)
      if (stepIdx >= 2 && stepIdx <= 9 && !isReset &&
        !step.phase.startsWith('llm-to-tool') && !step.phase.startsWith('tool-to-llm')) {
        ctx.beginPath()
        ctx.moveTo(llmBox.x + llmBox.w + 2, llmBox.y + llmBox.h / 2)
        ctx.lineTo(toolBox.x - 2, llmBox.y + llmBox.h / 2)
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.1)'
        ctx.lineWidth = 1
        ctx.setLineDash([4, 4])
        ctx.stroke()
        ctx.setLineDash([])
      }

      // LLM → User (end_turn)
      if (step.phase === 'llm-to-user') {
        const progress = Math.min(inStep * 2, 1)
        drawArrow(llmBox.x, llmBox.y + llmBox.h / 2 + 12,
          userBox.x + userBox.w, userBox.y + userBox.h / 2 + 8, progress, successColor, 2)

        if (progress > 0.3 && progress < 0.95) {
          const mx = (llmBox.x + userBox.x + userBox.w) / 2
          ctx.font = "bold 12px 'Heebo', sans-serif"
          ctx.textAlign = 'center'
          ctx.fillStyle = '#10B981'
          ctx.fillText('end_turn', mx, llmBox.y + llmBox.h / 2 + 2)
        }
      }

      // Done state
      if (step.phase === 'done' || isReset) {
        ctx.font = "bold 14px 'Heebo', sans-serif"
        ctx.textAlign = 'center'
        ctx.fillStyle = '#10B981'
        ctx.fillText('✓', userBox.x + userBox.w / 2, userBox.y + userBox.h + 18)
      }

      // --- Iteration counter (loop count) ---
      if (!isReset) {
        const loopCount = step.phase === 'tool-to-llm' || step.phase.startsWith('llm-think2') ? 1 :
          step.phase === 'tool-to-llm2' || step.phase.startsWith('llm-think3') ||
          step.phase === 'llm-to-user' || step.phase === 'done' ? 2 : 0
        if (loopCount > 0) {
          ctx.font = "bold 12px 'Heebo', sans-serif"
          ctx.textAlign = 'center'
          ctx.fillStyle = 'rgba(99, 102, 241, 0.85)'
          ctx.fillText(`loop ${loopCount}`, (llmBox.x + llmBox.w + toolBox.x) / 2, toolBox.y + toolBox.h + 14)
        }
      }

      // --- Bottom status label ---
      ctx.font = "bold 14px 'Heebo', sans-serif"
      ctx.textAlign = 'center'
      ctx.fillStyle = step.phase === 'done' ? '#10B981' : 'rgba(120, 120, 130, 0.85)'
      ctx.fillText(
        isReset ? 'Restarting...' : step.label,
        W / 2, H - 12
      )

      // --- Top title ---
      ctx.font = "bold 16px 'Heebo', sans-serif"
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(120, 120, 130, 0.85)'
      ctx.fillText('Agentic Loop — הלולאה הסוכנית', W / 2, 20)

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
