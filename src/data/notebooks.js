// Notebook definitions — each notebook groups chapters into a themed collection

export const notebooks = {
  'building-blocks': {
    id: 'building-blocks',
    title: { he: 'אבני הבניין', en: 'Building Blocks' },
    subtitle: { he: 'הבסיס — מרשתות נוירונים ועד אוטומציה', en: 'Foundations — from neural networks to automation' },
    icon: 'Cube',
    color: '#C2652A',
    chapterIds: [
      'prologue', 'science', 'prompt-engineering', 'first-agent', 'agents-function-calling',
      'memory-tokens', 'vector-db', 'rag', 'integrity',
      'api', 'mcp', 'n8n-docker',
      'detective',
    ],
    arcs: [
      { label: { he: 'הכירו את ה-AI', en: 'Meet AI & Communicate' }, startIndex: 0, endIndex: 4 },
      { label: { he: 'ידע ואמינות', en: 'Knowledge & Trust' }, startIndex: 5, endIndex: 8 },
      { label: { he: 'חיבור לעולם האמיתי', en: 'Connect to the Real World' }, startIndex: 9, endIndex: 11 },
      { label: { he: 'נספח', en: 'Appendix' }, startIndex: 12, endIndex: 12 },
    ],
  },
  'vibe-coding': {
    id: 'vibe-coding',
    title: { he: 'Vibe Coding', en: 'Vibe Coding' },
    subtitle: { he: 'פריימוורקים, סוכנים, ובניית מערכות', en: 'Frameworks, agents, and building systems' },
    icon: 'CodeBlock',
    color: '#8B5CF6',
    comingSoon: true,
    chapterIds: [
      'frameworks', 'multi-agent', 'agent-system',
    ],
    arcs: [
      { label: { he: 'פריימוורקים ותזמור', en: 'Frameworks & Orchestration' }, startIndex: 0, endIndex: 2 },
    ],
  },
}

export const notebookOrder = ['building-blocks', 'vibe-coding']
