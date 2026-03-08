# AI From Scratch 🧠

A personal journey into AI fundamentals — told as a story, built as a website.

## About

This is a bilingual (Hebrew/English) interactive learning site documenting one developer's journey into understanding AI from the ground up. It's not a course — it's a personal blog with technical depth.

## Features

- 📖 **Storytelling-first** — Each chapter opens with a personal narrative
- 🌐 **Bilingual** — Full Hebrew and English content with RTL/LTR support
- 🎨 **Two themes** — Warm Editorial (default) and Dusk Studio (dark)
- 📺 **Video resources** — Curated YouTube links with personal reviews
- 🥊 **Hands-on exercises** — "Try it yourself" inspired by the author's own experiments
- 🔬 **Progressive disclosure** — Technical deep-dives for those who want more
- 📚 **Glossary** — All terms across all chapters

## Tech Stack

- React 18 + Vite
- CSS Variables for theming
- Google Fonts (Fraunces, Heebo, Atkinson Hyperlegible, etc.)
- No external UI framework — custom components

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── App.jsx              # Main app with theme/lang context
├── main.jsx             # Entry point
├── components/
│   ├── Header.jsx       # Nav bar with theme/lang toggles
│   ├── Sidebar.jsx      # Chapter navigation
│   ├── ChapterView.jsx  # Main chapter display
│   └── CollapsibleBubble.jsx  # Reusable bubble for videos/exercises/deep-dives
├── data/
│   ├── chapters.js      # All chapter content and hooks
│   └── themes.js        # Theme definitions (colors, fonts)
└── styles/
    └── global.css       # CSS reset, variables, base styles
```

## Status

🚧 Work in progress — content being migrated from personal notebook.
