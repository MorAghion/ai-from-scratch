import { useState, useEffect, useRef, useCallback } from 'react'
import { useLang } from '../App'

const W = 660
const H_BEFORE = 300
const H_AFTER = 510
const STEP_MS = 2400

const accent = '#6366F1'
const green = '#10B981'
const amber = '#F59E0B'
const red = '#EF4444'
const blue = '#3B82F6'
const pink = '#EC4899'
const cyan = '#06B6D4'

const labels = {
  he: {
    title: { before: 'בלי RAG — קרא הכל', after: 'עם RAG — שלוף רק מה שצריך' },
    detective: 'בלש',
    desk: 'Context Window',
    query: '"מי רצח?"',
    files: ['crime_scene.txt', 'autopsy.txt', 'victoria.txt', 'catherine.txt'],
    readAll: 'קורא הכל — 5 tool calls',
    allTokens: 'כל הטוקנים על השולחן',

    // After mode
    step1Label: '① המסמכים נחתכים לחתיכות קטנות',
    step2Label: '② כל חתיכה הופכת לנקודה ב"מרחב המשמעות"',
    step3Label: '③ גם השאלה הופכת לנקודה',
    step4Label: '④ מחפשים נקודות קרובות = משמעות דומה',
    step5Label: '⑤ 3 חתיכות רלוונטיות חוזרות',
    step6Label: '⑥ נבנה פרומפט מוגבר',
    step7Label: '⑦ המודל עונה רק על סמך הראיות',
    doneLabel: '1 שאילתה ← 3 chunks ← תשובה מדויקת',

    // Chunks (short labels for the scatter plot)
    chunks: [
      { label: 'ציאניד בדם', shortLabel: 'ציאניד' },
      { label: 'יין אדום בכוס', shortLabel: 'יין' },
      { label: 'ויקטוריה ב-22:15', shortLabel: 'וויקי 22:15' },
      { label: 'מוות ב-22:10', shortLabel: 'מוות 22:10' },
      { label: 'גופה בחדר העבודה', shortLabel: 'חדר עבודה' },
      { label: 'טביעות על הדלת', shortLabel: 'טביעות' },
      { label: 'קתרין שמעה ויכוח', shortLabel: 'ויכוח' },
      { label: 'הצוואה שונתה', shortLabel: 'צוואה' },
    ],

    meaningSpace: 'מרחב המשמעות',
    sandwich: 'פרומפט מוגבר',
    sandwichLayers: ['הוראות: "ענה רק מהראיות"', '3 chunks שנשלפו', 'שאלה: "מי רצח?"'],
    llm: 'LLM',
    answer: 'תשובה מבוססת עובדות',
    btnBefore: 'בלי RAG',
    btnAfter: 'עם RAG',
  },
  en: {
    title: { before: 'Without RAG — Read Everything', after: 'With RAG — Retrieve Only What\'s Needed' },
    detective: 'Detective',
    desk: 'Context Window',
    query: '"Who killed?"',
    files: ['crime_scene.txt', 'autopsy.txt', 'victoria.txt', 'catherine.txt'],
    readAll: 'Reads everything — 5 tool calls',
    allTokens: 'All tokens on the desk',

    step1Label: '① Documents are split into small chunks',
    step2Label: '② Each chunk becomes a point in "meaning space"',
    step3Label: '③ The question also becomes a point',
    step4Label: '④ Search for nearby points = similar meaning',
    step5Label: '⑤ 3 relevant chunks come back',
    step6Label: '⑥ Build an augmented prompt',
    step7Label: '⑦ The model answers based on evidence only',
    doneLabel: '1 query → 3 chunks → precise answer',

    chunks: [
      { label: 'Cyanide in blood', shortLabel: 'cyanide' },
      { label: 'Red wine in glass', shortLabel: 'wine' },
      { label: 'Victoria at 22:15', shortLabel: 'Vic 22:15' },
      { label: 'Death at 22:10', shortLabel: 'death 22:10' },
      { label: 'Body in study', shortLabel: 'study' },
      { label: 'Prints on door', shortLabel: 'prints' },
      { label: 'Catherine heard fight', shortLabel: 'fight' },
      { label: 'Will was changed', shortLabel: 'will' },
    ],

    meaningSpace: 'Meaning Space',
    sandwich: 'Augmented Prompt',
    sandwichLayers: ['Instructions: "answer from evidence"', '3 retrieved chunks', 'Question: "Who killed?"'],
    llm: 'LLM',
    answer: 'Fact-based answer',
    btnBefore: 'Without RAG',
    btnAfter: 'With RAG',
  },
}

// Chunk positions in meaning space (0-1 range, will be mapped to canvas coords)
// Grouped into clusters by topic
const chunkPositions = [
  { x: 0.78, y: 0.25 }, // ציאניד - poison cluster
  { x: 0.85, y: 0.35 }, // יין - poison cluster (close!)
  { x: 0.18, y: 0.72 }, // ויקטוריה timeline
  { x: 0.24, y: 0.62 }, // מוות timeline
  { x: 0.55, y: 0.82 }, // גופה - location
  { x: 0.62, y: 0.72 }, // טביעות - location
  { x: 0.38, y: 0.32 }, // ויכוח - motive
  { x: 0.32, y: 0.22 }, // צוואה - motive
]

// Query position — near the motive/poison area
const queryPos = { x: 0.52, y: 0.30 }

// Which chunks are "close" to query (will light up)
const matchedChunks = [0, 6, 7] // cyanide, fight, will

export default function RAGBeforeAfter() {
  const [mode, setMode] = useState('before')
  const [paused, setPaused] = useState(false)
  const canvasRef = useRef(null)
  const frameRef = useRef(null)
  const startRef = useRef(null)
  const pausedAtRef = useRef(null) // elapsed time when paused
  const pausedRef = useRef(false) // ref mirror of paused state (avoids effect re-run)
  const { lang } = useLang()

  const h = mode === 'before' ? H_BEFORE : H_AFTER

  const togglePause = useCallback(() => {
    setPaused(p => {
      pausedRef.current = !p
      return !p
    })
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    canvas.width = W * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    startRef.current = null

    const t = labels[lang] || labels.he

    function roundRect(x, y, w, ht, r) {
      ctx.beginPath()
      ctx.roundRect(x, y, w, ht, r)
    }

    function drawBox(x, y, w, ht, color, label, sub, active) {
      roundRect(x, y, w, ht, 8)
      ctx.fillStyle = active ? color + '20' : color + '10'
      ctx.fill()
      ctx.strokeStyle = active ? color : color + '50'
      ctx.lineWidth = active ? 2 : 1.5
      ctx.stroke()

      ctx.font = "bold 14px 'Heebo', sans-serif"
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      ctx.fillText(label, x + w / 2, y + ht / 2 + (sub ? -4 : 5))

      if (sub) {
        ctx.font = "bold 12px 'Heebo', sans-serif"
        ctx.fillStyle = color + 'bb'
        ctx.fillText(sub, x + w / 2, y + ht / 2 + 12)
      }
    }

    function drawFileBox(x, y, w, ht, label, active, dimmed) {
      roundRect(x, y, w, ht, 5)
      ctx.fillStyle = active ? amber + '20' : dimmed ? '#88888808' : '#88888810'
      ctx.fill()
      ctx.strokeStyle = active ? amber : dimmed ? '#88888825' : '#88888840'
      ctx.lineWidth = active ? 1.5 : 1
      ctx.stroke()

      ctx.font = `bold 14px 'Heebo', sans-serif`
      ctx.fillStyle = active ? amber : dimmed ? '#88888860' : '#999999'
      ctx.textAlign = 'center'
      ctx.fillText(label, x + w / 2, y + ht / 2 + 4)
    }

    function drawArrow(fromX, fromY, toX, toY, progress, color, lineW) {
      const px = fromX + (toX - fromX) * progress
      const py = fromY + (toY - fromY) * progress

      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(px, py)
      ctx.strokeStyle = color
      ctx.lineWidth = lineW || 1.5
      ctx.stroke()

      if (progress > 0.1 && progress < 0.95) {
        ctx.beginPath()
        ctx.arc(px, py, 3, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      }

      if (progress > 0.92) {
        const angle = Math.atan2(toY - fromY, toX - fromX)
        ctx.beginPath()
        ctx.moveTo(toX, toY)
        ctx.lineTo(toX - 7 * Math.cos(angle - 0.4), toY - 7 * Math.sin(angle - 0.4))
        ctx.lineTo(toX - 7 * Math.cos(angle + 0.4), toY - 7 * Math.sin(angle + 0.4))
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()
      }
    }

    function drawStaticArrow(fromX, fromY, toX, toY, color) {
      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      ctx.stroke()

      const angle = Math.atan2(toY - fromY, toX - fromX)
      ctx.beginPath()
      ctx.moveTo(toX, toY)
      ctx.lineTo(toX - 6 * Math.cos(angle - 0.4), toY - 6 * Math.sin(angle - 0.4))
      ctx.lineTo(toX - 6 * Math.cos(angle + 0.4), toY - 6 * Math.sin(angle + 0.4))
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
    }

    // ─── BEFORE MODE ─────────────────────────
    function drawBefore(globalT) {
      const totalCycle = STEP_MS * 7 + 2000
      const cycleT = globalT % totalCycle
      const stepIdx = Math.min(Math.floor(cycleT / STEP_MS), 7)
      const inStep = Math.min((cycleT - stepIdx * STEP_MS) / STEP_MS, 1)

      ctx.clearRect(0, 0, W, H_BEFORE)

      // Title
      ctx.font = "bold 16px 'Heebo', sans-serif"
      ctx.fillStyle = red
      ctx.textAlign = 'center'
      ctx.fillText(t.title.before, W / 2, 22)

      // Detective box
      const detX = 30, detY = 90, detW = 70, detH = 50
      drawBox(detX, detY, detW, detH, accent, t.detective)

      // Files
      const filesX = 180, filesY = 44, fileW = 120, fileH = 24
      const fileGap = 30

      for (let i = 0; i < 4; i++) {
        const fy = filesY + i * fileGap
        const isActive = stepIdx === i + 1
        const isDone = stepIdx > i + 1
        const isDimmed = stepIdx < i + 1 && stepIdx > 0
        drawFileBox(filesX, fy, fileW, fileH, t.files[i], isActive, isDimmed && !isDone)

        if (isActive) {
          drawArrow(detX + detW, detY + detH / 2, filesX, fy + fileH / 2, inStep, amber)
        }

        if (isDone) {
          ctx.font = "bold 12px 'Heebo', sans-serif"
          ctx.fillStyle = green
          ctx.textAlign = 'center'
          ctx.fillText('✓', filesX + fileW + 14, fy + fileH / 2 + 4)
        }
      }

      if (stepIdx === 0) {
        ctx.font = "bold 14px 'Heebo', sans-serif"
        ctx.fillStyle = accent + 'aa'
        ctx.textAlign = 'center'
        ctx.fillText('list_evidence_files()', W / 2, H_BEFORE - 40)
        drawArrow(detX + detW, detY + detH / 2, filesX, filesY + 2 * fileGap, inStep, accent)
      }

      // Desk fills up
      const deskX = 365, deskY = 44, deskW = 140, deskH = 150
      const filesOnDesk = Math.max(0, Math.min(stepIdx - 1, 4))
      const fillRatio = filesOnDesk / 4

      roundRect(deskX, deskY, deskW, deskH, 8)
      ctx.fillStyle = fillRatio > 0.75 ? red + '10' : amber + '06'
      ctx.fill()
      ctx.strokeStyle = fillRatio > 0.75 ? red + '60' : '#88888840'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.font = "bold 14px 'Heebo', sans-serif"
      ctx.fillStyle = '#999999'
      ctx.textAlign = 'center'
      ctx.fillText(t.desk, deskX + deskW / 2, deskY - 6)

      for (let i = 0; i < filesOnDesk; i++) {
        const barY = deskY + 10 + i * 34
        const barW = deskW - 20
        roundRect(deskX + 10, barY, barW, 26, 4)
        ctx.fillStyle = amber + '12'
        ctx.fill()
        ctx.strokeStyle = amber + '30'
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.font = "bold 12px 'Heebo', sans-serif"
        ctx.fillStyle = amber + 'cc'
        ctx.textAlign = 'center'
        ctx.fillText(t.files[i], deskX + deskW / 2, barY + 16)
      }

      if (filesOnDesk > 0) {
        ctx.font = "bold 14px 'Heebo', sans-serif"
        ctx.fillStyle = fillRatio > 0.75 ? red : amber
        ctx.textAlign = 'center'
        ctx.fillText(`${Math.round(fillRatio * 100)}%`, deskX + deskW / 2, deskY + deskH - 6)
      }

      if (stepIdx >= 1 && stepIdx <= 4) {
        const fy = filesY + (stepIdx - 1) * fileGap + fileH / 2
        if (inStep > 0.5) {
          drawArrow(filesX + fileW, fy, deskX, deskY + deskH / 2,
            (inStep - 0.5) * 2, amber + '80')
        }
      }

      if (stepIdx >= 5) {
        ctx.font = "bold 14px 'Heebo', sans-serif"
        ctx.fillStyle = red
        ctx.textAlign = 'center'
        ctx.fillText(t.readAll, W / 2, H_BEFORE - 22)
        ctx.font = "bold 14px 'Heebo', sans-serif"
        ctx.fillStyle = red + 'aa'
        ctx.fillText(t.allTokens, W / 2, H_BEFORE - 6)
      }
    }

    // ─── AFTER MODE (Full RAG Pipeline) ──────
    // Step 0: Detective asks question
    // Step 1: Documents split into chunks (animate)
    // Step 2: Chunks hold (readable pause)
    // Step 3: Chunks placed as dots in meaning space
    // Step 4: Query enters the space as a point
    // Step 5: Similarity search (expanding circle, nearby dots glow)
    // Step 6: Matched chunks extracted as Top-K
    // Step 7: Sandwich prompt assembled
    // Step 8: LLM → Answer
    // Step 9: Done
    function drawAfter(globalT) {
      const totalCycle = STEP_MS * 10 + 2500
      const cycleT = globalT % totalCycle
      const stepIdx = Math.min(Math.floor(cycleT / STEP_MS), 10)
      const inStep = Math.min((cycleT - stepIdx * STEP_MS) / STEP_MS, 1)

      ctx.clearRect(0, 0, W, H_AFTER)

      // ── Step label at top ──
      ctx.font = "bold 14px 'Heebo', sans-serif"
      ctx.textAlign = 'center'
      const stepLabels = [
        null, // step 0 - detective
        t.step1Label,
        t.step1Label, // step 2 - hold (same label)
        t.step2Label,
        t.step3Label,
        t.step4Label,
        t.step5Label,
        t.step6Label,
        t.step7Label,
        t.doneLabel,
      ]
      const currentLabel = stepIdx > 0 ? (stepLabels[stepIdx] || t.doneLabel) : ''
      ctx.fillStyle = stepIdx >= 9 ? green : accent
      ctx.fillText(currentLabel, W / 2, 18)

      // ── Row 1: Detective + Query + Chunking ──
      const r1y = 32

      // Detective
      const detX = 16, detW = 56, detH = 38
      drawBox(detX, r1y + 6, detW, detH, accent, t.detective, null, stepIdx === 0)

      // Query bubble
      if (stepIdx >= 0) {
        const qx = detX + detW + 8, qy = r1y + 10, qw = 80, qh = 28
        roundRect(qx, qy, qw, qh, 6)
        ctx.fillStyle = stepIdx === 0 ? pink + '18' : pink + '0a'
        ctx.fill()
        ctx.strokeStyle = stepIdx === 0 ? pink : pink + '40'
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.font = "bold 12px 'Heebo', sans-serif"
        ctx.fillStyle = stepIdx <= 1 ? pink : pink + '80'
        ctx.textAlign = 'center'
        ctx.fillText(t.query, qx + qw / 2, qy + qh / 2 + 4)

        if (stepIdx === 0) {
          drawArrow(detX + detW, r1y + 6 + detH / 2, qx, qy + qh / 2, inStep, pink)
        }
      }

      // Chunking visualization (steps 1-2: docs split into chunks, then chunks hold)
      // Step 1 = docs → chunks animate in; Step 2 = chunks stay visible (hold for reading)
      const chunkAreaX = 165, chunkAreaW = 400
      if (stepIdx >= 1) {
        const docW = 70, docH = 22, docGap = 8
        const pillW = 80, pillH = 22, pillGap = 6

        // Chunk pills layout helper
        function drawChunkPills(startX, startY, count, alpha) {
          const alphaSuffix = alpha === 1 ? '' : Math.round(alpha * 255).toString(16).padStart(2, '0')
          for (let i = 0; i < count; i++) {
            const row = Math.floor(i / 4)
            const col = i % 4
            const px = startX + col * (pillW + pillGap)
            const py = startY + row * (pillH + pillGap)
            roundRect(px, py, pillW, pillH, 5)
            ctx.fillStyle = cyan + (alpha === 1 ? '18' : '08')
            ctx.fill()
            ctx.strokeStyle = cyan + (alpha === 1 ? '70' : '30')
            ctx.lineWidth = 1
            ctx.stroke()
            ctx.font = "bold 11px 'Heebo', sans-serif"
            ctx.fillStyle = alpha === 1 ? cyan : cyan + '70'
            ctx.textAlign = 'center'
            ctx.fillText(t.chunks[i]?.shortLabel || '', px + pillW / 2, py + pillH / 2 + 4)
          }
        }

        if (stepIdx === 1) {
          // Animate: docs on left, chunks appear on right
          const docs = [t.files[1], t.files[2], t.files[3]]
          for (let i = 0; i < 3; i++) {
            const dx = chunkAreaX + i * (docW + docGap)
            roundRect(dx, r1y + 4, docW, docH, 4)
            ctx.fillStyle = amber + '15'
            ctx.fill()
            ctx.strokeStyle = amber + '60'
            ctx.lineWidth = 1
            ctx.stroke()
            ctx.font = "bold 10px 'Heebo', sans-serif"
            ctx.fillStyle = amber
            ctx.textAlign = 'center'
            ctx.fillText(docs[i], dx + docW / 2, r1y + 4 + docH / 2 + 3)
          }

          // Arrow showing split
          if (inStep > 0.2) {
            const splitProgress = (inStep - 0.2) / 0.8
            const arrowX = chunkAreaX + 3 * (docW + docGap) + 10
            ctx.font = "bold 16px 'Heebo', sans-serif"
            ctx.fillStyle = amber
            ctx.textAlign = 'center'
            ctx.fillText('→', arrowX, r1y + 18)

            // Show chunk pills appearing one by one
            const chunksToShow = Math.min(Math.floor(splitProgress * 9), 8)
            const pillStartX = arrowX + 16
            drawChunkPills(pillStartX, r1y, chunksToShow, 1)
          }
        } else if (stepIdx === 2) {
          // Step 2: chunks stay fully visible (hold phase for reading)
          const pillStartX = chunkAreaX
          drawChunkPills(pillStartX, r1y, 8, 1)
        } else {
          // After step 2: show chunk pills dimmed
          const pillStartX = chunkAreaX
          drawChunkPills(pillStartX, r1y, 8, 0.5)
        }
      }

      // ── Meaning Space (the star of the show) ──
      const spaceX = 30, spaceY = 84, spaceW = W - 60, spaceH = 190

      if (stepIdx >= 3) {
        // Background
        roundRect(spaceX, spaceY, spaceW, spaceH, 10)
        ctx.fillStyle = '#88888806'
        ctx.fill()
        ctx.strokeStyle = '#88888825'
        ctx.lineWidth = 1
        ctx.stroke()

        // Label
        ctx.font = "bold 14px 'Heebo', sans-serif"
        ctx.fillStyle = '#88888890'
        ctx.textAlign = 'center'
        ctx.fillText(t.meaningSpace, spaceX + spaceW / 2, spaceY + 16)

        // Subtle grid
        ctx.strokeStyle = '#88888810'
        ctx.lineWidth = 0.5
        for (let gx = 0.2; gx < 1; gx += 0.2) {
          ctx.beginPath()
          ctx.moveTo(spaceX + gx * spaceW, spaceY + 20)
          ctx.lineTo(spaceX + gx * spaceW, spaceY + spaceH - 10)
          ctx.stroke()
        }
        for (let gy = 0.2; gy < 1; gy += 0.25) {
          ctx.beginPath()
          ctx.moveTo(spaceX + 10, spaceY + 20 + gy * (spaceH - 30))
          ctx.lineTo(spaceX + spaceW - 10, spaceY + 20 + gy * (spaceH - 30))
          ctx.stroke()
        }

        // Map chunk positions to canvas coords
        function mapX(nx) { return spaceX + 20 + nx * (spaceW - 40) }
        function mapY(ny) { return spaceY + 25 + ny * (spaceH - 40) }

        // Draw chunk dots
        for (let i = 0; i < 8; i++) {
          const cp = chunkPositions[i]
          const cx = mapX(cp.x)
          const cy = mapY(cp.y)

          // Determine state
          const isMatched = matchedChunks.includes(i)
          const showDot = stepIdx >= 3
          const isSearching = stepIdx === 5
          const isFound = (stepIdx === 5 && inStep > 0.4 && isMatched) || (stepIdx >= 6 && isMatched)

          if (showDot) {
            // Appearing animation (step 3)
            let dotAlpha = 1
            if (stepIdx === 3) {
              const appearAt = i / 8
              dotAlpha = Math.max(0, Math.min((inStep - appearAt) * 4, 1))
            }

            if (dotAlpha > 0) {
              // Dot
              const radius = isFound ? 6 : 4
              ctx.beginPath()
              ctx.arc(cx, cy, radius, 0, Math.PI * 2)
              ctx.fillStyle = isFound ? green + Math.round(dotAlpha * 255).toString(16).padStart(2, '0')
                : cyan + Math.round(dotAlpha * 100).toString(16).padStart(2, '0')
              ctx.fill()

              if (isFound) {
                // Glow ring
                ctx.beginPath()
                ctx.arc(cx, cy, 10, 0, Math.PI * 2)
                ctx.strokeStyle = green + '40'
                ctx.lineWidth = 1.5
                ctx.stroke()
              }

              // Label
              ctx.font = isFound ? "bold 12px 'Heebo', sans-serif" : "bold 12px 'Heebo', sans-serif"
              ctx.fillStyle = isFound ? green
                : `rgba(140, 140, 150, ${dotAlpha * 0.8})`
              ctx.textAlign = 'center'
              ctx.fillText(t.chunks[i]?.shortLabel || '', cx, cy - (isFound ? 14 : 10))
            }
          }
        }

        // Query point (step 4+)
        if (stepIdx >= 4) {
          const qcx = mapX(queryPos.x)
          const qcy = mapY(queryPos.y)

          // Appear animation
          let qAlpha = 1
          if (stepIdx === 4) {
            qAlpha = Math.min(inStep * 2, 1)
          }

          if (qAlpha > 0) {
            // Query dot (distinct shape - diamond)
            ctx.save()
            ctx.translate(qcx, qcy)
            ctx.rotate(Math.PI / 4)
            roundRect(-5, -5, 10, 10, 2)
            ctx.fillStyle = pink + Math.round(qAlpha * 200).toString(16).padStart(2, '0')
            ctx.fill()
            ctx.strokeStyle = pink
            ctx.lineWidth = 1.5
            ctx.stroke()
            ctx.restore()

            // Query label
            ctx.font = "bold 12px 'Heebo', sans-serif"
            ctx.fillStyle = pink
            ctx.textAlign = 'center'
            ctx.fillText(t.query, qcx, qcy - 14)
          }

          // Similarity search circle (step 5)
          if (stepIdx === 5) {
            const maxRadius = 120
            const radius = inStep * maxRadius

            ctx.beginPath()
            ctx.arc(qcx, qcy, radius, 0, Math.PI * 2)
            ctx.strokeStyle = green + '30'
            ctx.lineWidth = 2
            ctx.setLineDash([6, 4])
            ctx.stroke()
            ctx.setLineDash([])

            // Fill the search circle very lightly
            ctx.beginPath()
            ctx.arc(qcx, qcy, radius, 0, Math.PI * 2)
            ctx.fillStyle = green + '06'
            ctx.fill()
          }

          // After search: show connection lines to matched chunks
          if (stepIdx >= 6 && stepIdx < 9) {
            for (const mi of matchedChunks) {
              const cp = chunkPositions[mi]
              ctx.beginPath()
              ctx.moveTo(qcx, qcy)
              ctx.lineTo(mapX(cp.x), mapY(cp.y))
              ctx.strokeStyle = green + '25'
              ctx.lineWidth = 1
              ctx.setLineDash([3, 3])
              ctx.stroke()
              ctx.setLineDash([])
            }
          }
        }
      }

      // ── Row 3: Top-K → Sandwich → LLM → Answer ──
      const r3y = spaceY + spaceH + 16

      // Top-K chunks (step 6)
      if (stepIdx >= 6) {
        const tkX = 30, tkW = 130, tkH = 22, tkGap = 4
        ctx.font = "bold 12px 'Heebo', sans-serif"
        ctx.fillStyle = green + 'aa'
        ctx.textAlign = 'left'
        ctx.fillText('Top-K:', tkX, r3y - 4)

        for (let i = 0; i < matchedChunks.length; i++) {
          const ci = matchedChunks[i]
          const cy = r3y + i * (tkH + tkGap)
          const appearing = stepIdx === 6 && inStep < (i + 1) * 0.3

          if (!appearing) {
            roundRect(tkX, cy, tkW, tkH, 4)
            ctx.fillStyle = green + '12'
            ctx.fill()
            ctx.strokeStyle = green + '50'
            ctx.lineWidth = 1
            ctx.stroke()

            ctx.font = "bold 12px 'Heebo', sans-serif"
            ctx.fillStyle = green
            ctx.textAlign = 'center'
            ctx.fillText(t.chunks[ci]?.label || '', tkX + tkW / 2, cy + tkH / 2 + 4)
          }
        }
      }

      // Sandwich (step 7)
      if (stepIdx >= 7) {
        const swX = 190, swW = 210, sliceH = 20
        const swY = r3y

        ctx.font = "bold 12px 'Heebo', sans-serif"
        ctx.fillStyle = amber
        ctx.textAlign = 'left'
        ctx.fillText(t.sandwich, swX, swY - 4)

        const colors = [accent, green, pink]
        for (let i = 0; i < 3; i++) {
          const sy = swY + i * (sliceH + 3)
          roundRect(swX, sy, swW, sliceH, 4)
          ctx.fillStyle = colors[i] + '10'
          ctx.fill()
          ctx.strokeStyle = colors[i] + '50'
          ctx.lineWidth = 1
          ctx.stroke()

          ctx.font = "bold 12px 'Heebo', sans-serif"
          ctx.fillStyle = colors[i]
          ctx.textAlign = 'center'
          ctx.fillText(t.sandwichLayers[i], swX + swW / 2, sy + sliceH / 2 + 3)
        }

        // Arrow: Top-K → Sandwich
        if (stepIdx === 7 && inStep < 0.5) {
          drawArrow(162, r3y + 30, swX - 2, r3y + 30, inStep * 2, green)
        } else if (stepIdx > 7) {
          drawStaticArrow(164, r3y + 30, swX - 2, r3y + 30, green + '30')
        }
      }

      // LLM + Answer (step 8)
      if (stepIdx >= 8) {
        const llmX = 420, llmW = 64, llmH = 44
        const llmY = r3y + 6
        drawBox(llmX, llmY, llmW, llmH, accent, t.llm, null, stepIdx === 8)

        // Arrow: sandwich → LLM
        if (stepIdx === 8) {
          drawArrow(402, r3y + 32, llmX - 2, llmY + llmH / 2, Math.min(inStep * 2, 1), accent)
        } else {
          drawStaticArrow(404, r3y + 32, llmX - 2, llmY + llmH / 2, accent + '30')
        }

        // Thinking
        if (stepIdx === 8 && inStep > 0.3 && inStep < 0.7) {
          const pulse = Math.sin(inStep * Math.PI * 6) * 0.3 + 0.5
          ctx.font = "bold 12px 'Heebo', sans-serif"
          ctx.fillStyle = `rgba(99, 102, 241, ${pulse})`
          ctx.textAlign = 'center'
          ctx.fillText('thinking...', llmX + llmW / 2, llmY + llmH + 12)
        }

        // Answer
        if (stepIdx >= 8 && inStep > 0.6) {
          const ansX = llmX + llmW + 20, ansW = 150, ansH = 44
          const ansY = r3y + 10
          roundRect(ansX, ansY, ansW, ansH, 8)
          ctx.fillStyle = green + '15'
          ctx.fill()
          ctx.strokeStyle = green
          ctx.lineWidth = 2
          ctx.stroke()

          ctx.font = "bold 12px 'Heebo', sans-serif"
          ctx.fillStyle = green
          ctx.textAlign = 'center'
          ctx.fillText('✓ ' + t.answer, ansX + ansW / 2, ansY + ansH / 2 + 4)

          drawStaticArrow(llmX + llmW + 2, llmY + llmH / 2, ansX - 2, ansY + ansH / 2, green)
        }
      }

      // Done status
      if (stepIdx >= 9) {
        ctx.font = "bold 14px 'Heebo', sans-serif"
        ctx.fillStyle = green
        ctx.textAlign = 'center'
        ctx.fillText(t.doneLabel, W / 2, H_AFTER - 8)
      }
    }

    function draw(timestamp) {
      if (!startRef.current) startRef.current = timestamp

      let elapsed
      if (pausedRef.current) {
        // When paused, freeze at the paused time
        if (pausedAtRef.current === null) {
          pausedAtRef.current = timestamp - startRef.current
        }
        elapsed = pausedAtRef.current
      } else {
        // When resuming, adjust start time so animation continues from where it paused
        if (pausedAtRef.current !== null) {
          startRef.current = timestamp - pausedAtRef.current
          pausedAtRef.current = null
        }
        elapsed = timestamp - startRef.current
      }

      if (mode === 'before') {
        drawBefore(elapsed)
      } else {
        drawAfter(elapsed)
      }

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [mode, lang])

  const t = labels[lang] || labels.he

  return (
    <div style={{
      margin: '20px 0',
      borderRadius: 10,
      border: '1px solid var(--border)',
      background: 'var(--surface)',
      overflow: 'hidden',
    }}>
      {/* Toggle buttons */}
      <div style={{
        display: 'flex',
        gap: 0,
        borderBottom: '1px solid var(--border)',
      }}>
        {['before', 'after'].map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); startRef.current = null; pausedAtRef.current = null; pausedRef.current = false; setPaused(false) }}
            style={{
              flex: 1,
              padding: '10px 16px',
              border: 'none',
              borderBottom: mode === m ? `2px solid ${m === 'before' ? red : green}` : '2px solid transparent',
              background: mode === m ? (m === 'before' ? red + '08' : green + '08') : 'transparent',
              cursor: 'pointer',
              fontFamily: lang === 'he' ? 'var(--font-hebrew)' : 'var(--font-body)',
              fontSize: 13,
              fontWeight: mode === m ? 600 : 400,
              color: mode === m ? (m === 'before' ? red : green) : 'var(--text-soft)',
              transition: 'all 0.2s ease',
            }}
          >
            {m === 'before' ? t.btnBefore : t.btnAfter}
          </button>
        ))}
      </div>

      {/* Canvas + pause button */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 0',
        position: 'relative',
      }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', maxWidth: W, height: 'auto', aspectRatio: `${W} / ${h}` }}
        />
        <button
          onClick={togglePause}
          style={{
            marginTop: 8,
            padding: '6px 18px',
            border: `1px solid ${paused ? green : 'var(--border)'}`,
            borderRadius: 6,
            background: paused ? green + '10' : 'var(--surface)',
            cursor: 'pointer',
            fontFamily: "'Heebo', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: paused ? green : 'var(--text-soft)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {paused ? '▶ Play' : '⏸ Pause'}
        </button>
      </div>
    </div>
  )
}
