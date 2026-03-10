// Chapter metadata + content loaded from text files
// Icons are Phosphor Duotone component names
import { loadChapterContent } from '../content/loader'

const chapterMeta = [
  // === Arc 1: Meet AI & Learn to Communicate ===
  {
    id: 'prologue',
    icon: 'RocketLaunch',
    iconColor: '#c22c2a',
    title: { he: 'פרולוג: איפה מתחילים?', en: 'Prologue: Where Do You Start?' },
    status: 'done',
    videos: [],
    exercise: null,
  },
  {
    id: 'science',
    icon: 'Atom',
    iconColor: '#6366F1',
    title: { he: 'המדע - איך המוח המלאכותי עובד', en: 'The Science - How the Artificial Brain Works' },
    status: 'done',
    detectiveFiles: [
      { name: 'crime_scene.txt', path: '/detective-files/crime_scene.txt', label: { he: 'זירת הפשע - תיק בלקווד', en: 'Crime Scene - Blackwood Case' } },
    ],
    videos: [
      { url: 'https://www.youtube.com/watch?v=aircAruvnKk', title: 'But what is a neural network? | 3Blue1Brown', note: { he: 'הסרטון שהתחיל את הכל - מה זה רשת נוירונית ואיך היא עובדת.', en: '' } },
      { url: 'https://www.3blue1brown.com/?v=backpropagation', title: 'Backpropagation | 3Blue1Brown', note: { he: 'איך הרשת לומדת מטעויות - הסבר ויזואלי מעולה.', en: '' } },
      { url: 'https://www.3blue1brown.com/?v=mini-llm', title: 'Building a mini LLM | 3Blue1Brown', note: { he: 'בניית מודל שפה מאפס - מה קורה מתחת למכסה.', en: '' } },
      { url: 'https://www.3blue1brown.com/?v=gpt', title: 'How GPT works | 3Blue1Brown', note: { he: 'איך GPT עובד מאחורי הקלעים - Transformer ו-Attention.', en: '' } },
    ],
    exercise: null,
  },
  {
    id: 'prompt-engineering',
    icon: 'PencilLine',
    iconColor: '#F59E0B',
    title: { he: 'הנדסת פרומפטים', en: 'Prompt Engineering' },
    status: 'done',
    videos: [{ url: 'https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/', title: 'ChatGPT Prompt Engineering for Developers - DeepLearning.AI', note: { he: 'קורס קצר וממוקד. שווה.', en: '' } }],
    exercise: null,
  },
  {
    id: 'first-agent',
    icon: 'Robot',
    iconColor: '#0EA5E9',
    title: { he: 'הפגישה הראשונה עם סוכן', en: 'First Meeting with an Agent' },
    status: 'done',
    detectiveFiles: [
      { name: 'autopsy_report.txt', path: '/detective-files/evidence/autopsy_report.txt', label: { he: 'דוח נתיחה', en: 'Autopsy Report' } },
      { name: 'victoria_statement.txt', path: '/detective-files/evidence/victoria_statement.txt', label: { he: 'עדות ויקטוריה', en: 'Victoria\'s Statement' } },
      { name: 'catherine_statement.txt', path: '/detective-files/evidence/catherine_statement.txt', label: { he: 'עדות קתרין', en: 'Catherine\'s Statement' } },
    ],
    videos: [],
    exercise: null,
  },
  {
    id: 'agents-function-calling',
    icon: 'Lightning',
    iconColor: '#f9d716',
    title: { he: 'סוכנים ו-Function Calling', en: 'Agents & Function Calling' },
    status: 'in-progress',
    detectiveFiles: [
      { name: 'detective.py', path: '/detective-files/detective.py', label: { he: 'סקריפט הבלש', en: 'Detective Script' } },
    ],
    videos: [],
    exercise: null,
  },

  // === Arc 2: The Knowledge & Trust Layer ===
  {
    id: 'memory-tokens',
    icon: 'Brain',
    iconColor: '#EC4899',
    title: { he: 'זיכרון וטוקנים', en: 'Memory & Tokens' },
    status: 'done',
    videos: [],
    exercise: null,
  },
  {
    id: 'vector-db',
    icon: 'Graph',
    iconColor: '#9B4F96',
    title: { he: 'Vector DB - חדר הארכיון', en: 'Vector DB - The Archive Room' },
    status: 'done',
    videos: [{ url: 'https://www.youtube.com/watch?v=wjZofJX0v4M&t=747s', title: 'But what is a GPT? Visual intro to Transformers | 3Blue1Brown', note: { he: 'ההסבר הטוב מתחיל ב-12:27 - איך Embeddings הופכים מילים לוקטורים במרחב סמנטי.', en: 'The good explanation starts at 12:27 - how Embeddings turn words into vectors in semantic space.' } }],
    exercise: null,
  },
  {
    id: 'rag',
    icon: 'MagnifyingGlass',
    iconColor: '#10B981',
    title: { he: 'RAG - לתת למודל לקרוא את התיק שלך', en: 'RAG - Giving the Model Your Case File' },
    status: 'done',
    videos: [{ url: 'https://www.freecodecamp.org/news/retrieval-augmented-generation-rag-handbook/', title: 'RAG Handbook - freeCodeCamp', note: { he: 'מדריך מקיף ומעשי.', en: '' } }],
    exercise: null,
  },
  {
    id: 'integrity',
    icon: 'ShieldCheck',
    iconColor: '#EF4444',
    title: { he: 'אמינות - כשה-AI משקר', en: 'Integrity - When AI Lies' },
    status: 'done',
    videos: [],
    exercise: null,
  },

  // === Arc 3: Connect to the Real World ===
  {
    id: 'api',
    icon: 'Plugs',
    iconColor: '#b88114',
    title: { he: 'API - השפה שבה מערכות מדברות', en: 'API - How Systems Talk' },
    status: 'in-progress',
    videos: [],
    exercise: null,
  },
  {
    id: 'mcp',
    icon: 'Usb',
    iconColor: '#5a6b6f',
    title: { he: 'MCP - Model Context Protocol', en: 'MCP - Model Context Protocol' },
    status: 'not-started',
    videos: [
      { url: 'https://modelcontextprotocol.io/introduction', title: 'MCP Introduction', note: { he: 'הדוקומנטציה הרשמית של הפרוטוקול.', en: '' } },
      { url: 'https://www.youtube.com/watch?v=bC3mIQWHZMQ', title: 'MCP Explained', note: { he: 'הסבר וידאו טוב.', en: '' } },
    ],
    exercise: null,
  },
  {
    id: 'n8n-docker',
    icon: 'Package',
    iconColor: '#06B6D4',
    title: { he: 'n8n ו-Docker - אוטומציה מעשית', en: 'n8n & Docker - Practical Automation' },
    status: 'in-progress',
    videos: [{ url: 'https://docs.n8n.io/courses/', title: 'n8n Courses', note: { he: 'הדוקומנטציה הרשמית.', en: '' } }],
    exercise: null,
  },

  // === Epilogue ===
  {
    id: 'epilogue',
    icon: 'Flag',
    iconColor: '#C2652A',
    title: { he: 'אפילוג: מה הלאה?', en: 'Epilogue: What\'s Next?' },
    status: 'done',
    videos: [],
    exercise: null,
  },

  // === Vibe Coding - Arc 1: Getting Ready ===
  {
    id: 'vibe-coding-intro',
    icon: 'Rocket',
    iconColor: '#178d33',
    title: { he: 'מה זה Vibe Coding', en: 'What is Vibe Coding' },
    status: 'not-started',
    videos: [],
    exercise: null,
  },
  {
    id: 'getting-started',
    icon: 'Wrench',
    iconColor: '#e9a00e',
    title: { he: 'ערכת ההתחלה - כלים, מנויים ומפתחות', en: 'The Starter Kit - Tools, Subscriptions & Keys' },
    status: 'not-started',
    videos: [],
    exercise: null,
  },

  // === Vibe Coding - Arc 2: Building HomeHub ===
  {
    id: 'homehub-mvp',
    icon: 'Waves',
    iconColor: '#11b1f0',
    title: { he: 'Just Vibing - מ-0 ל-MVP', en: 'Just Vibing - From Zero to MVP' },
    status: 'not-started',
    videos: [],
    exercise: null,
  },
  {
    id: 'homehub-leveling-up',
    icon: 'TrendUp',
    iconColor: '#cb3c7a',
    title: { he: 'Leveling Up - תכנון, ביצוע, מולטי-אייג׳נט', en: 'Leveling Up - Plan, Execute, Multi-Agent' },
    status: 'not-started',
    videos: [],
    exercise: null,
  },

  // === Vibe Coding - Arc 3: Mini Gas Town ===
  {
    id: 'orchestration',
    icon: 'TreeStructure',
    iconColor: '#9B4F96',
    title: { he: 'תזמור ופריימוורקים', en: 'Orchestration & Frameworks' },
    status: 'not-started',
    videos: [],
    exercise: null,
  },
  {
    id: 'mini-gastown',
    icon: 'Compass',
    iconColor: '#EF4444',
    title: { he: 'ה-Gas Town הקטן שלי', en: 'My Mini Gas Town' },
    status: 'not-started',
    videos: [],
    exercise: null,
  },

  // === Appendix ===
  {
    id: 'detective',
    icon: 'Detective',
    iconColor: '#78716C',
    title: { he: 'נספח: התרגיל הבלשי', en: 'Appendix: The Detective Exercise' },
    status: 'done',
    videos: [],
    exercise: null,
  },
]

// Merge metadata with loaded content from text files
export const chapters = chapterMeta.map(meta => {
  const content = loadChapterContent(meta.id)
  return {
    ...meta,
    hook: content.story,
    content: content.content,
    brief: content.brief,
    terms: content.terms,
    detective: content.detective,
    detectiveFiles: meta.detectiveFiles || [],
  }
})

// Get ordered chapters for a specific notebook
export function getNotebookChapters(notebook) {
  return notebook.chapterIds
    .map(id => chapters.find(ch => ch.id === id))
    .filter(Boolean)
}
