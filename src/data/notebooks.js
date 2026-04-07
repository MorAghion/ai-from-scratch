// Notebook definitions - each notebook groups chapters into a themed collection

export const notebooks = {
  'building-blocks': {
    id: 'building-blocks',
    title: { he: 'אבני הבניין', en: 'Building Blocks' },
    subtitle: { he: ' מרשתות נוירונים, דרך סוכנים ועד אוטומציה', en: 'Foundations - from neural networks to automation' },
    icon: 'Cube',
    color: '#3D8B80',
    chapterIds: [
      'prologue', 'science', 'prompt-engineering', 'first-agent', 'agents-function-calling',
      'memory-tokens', 'vector-db', 'rag', 'integrity',
      'api', 'mcp', 'n8n-docker',
      'epilogue',
    ],
    arcs: [
      { label: { he: 'הכירו את ה-AI', en: 'Meet AI & Communicate' }, startIndex: 0, endIndex: 4 },
      { label: { he: 'ידע ואמינות', en: 'Knowledge & Trust' }, startIndex: 5, endIndex: 8 },
      { label: { he: 'חיבור לעולם האמיתי', en: 'Connect to the Real World' }, startIndex: 9, endIndex: 12 },
    ],
  },
  'vibe-coding': {
    id: 'vibe-coding',
    title: { he: 'Vibe Coding', en: 'Vibe Coding' },
    subtitle: { he: 'רעיונות הופכים למציאות · ריבוי סוכנים · אורקסטרציה', en: 'Ideas become reality · Multi-agent · Orchestration' },
    icon: 'CodeBlock',
    color: '#9B4F96',
    // teaserCount: 1, // uncomment to lock chapters
    chapterIds: [
      'vibe-coding-teaser',
      'vibe-coding-intro', 'getting-started',
      'homehub-mvp', 'homehub-leveling-up', 'naive-orchestration',
      'gastown', 'vision',
      'all-things-claude',
    ],
    arcs: [
      { label: { he: '', en: '' }, startIndex: 0, endIndex: 0 },
      { label: { he: 'התחלה', en: 'Getting Ready' }, startIndex: 1, endIndex: 2 },
      { label: { he: 'בונים את HomeHub', en: 'Building HomeHub' }, startIndex: 3, endIndex: 5 },
      { label: { he: 'מערכות תזמור סוכנים', en: 'Orchestration Frameworks' }, startIndex: 6, endIndex: 7 },
      { label: { he: '', en: '' }, startIndex: 8, endIndex: 8 },
    ],
  },
}

export const notebookOrder = ['building-blocks', 'vibe-coding']
