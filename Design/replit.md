# Post-Quantum Cryptography Suite

## Overview
A React-based web application demonstrating post-quantum cryptographic techniques. Built with Vite, React 18, Tailwind CSS v4, and various UI libraries (Radix UI, MUI, shadcn-style components).

## Project Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite` plugin
- **UI Components**: Radix UI primitives, MUI, shadcn/ui-style components
- **Animations**: Motion (framer-motion), Three.js via @react-three/fiber
- **Build Tool**: Vite 6

## Project Structure
```
├── index.html              # Entry HTML
├── src/
│   ├── main.tsx            # App entry point
│   ├── app/
│   │   ├── App.tsx         # Root component
│   │   └── components/     # Feature & UI components
│   │       ├── ui/         # Reusable UI primitives
│   │       └── *.tsx       # Feature components (encryption, keys, etc.)
│   └── styles/             # CSS files (Tailwind, fonts, theme)
├── vite.config.ts          # Vite config (port 5000, host 0.0.0.0)
├── postcss.config.mjs      # PostCSS config
└── package.json            # Dependencies and scripts
```

## Running
- `npm run dev` - Development server on port 5000
- `npm run build` - Production build to `dist/`

## Deployment
- Static deployment with `dist/` as public directory
- Build step: `npm run build`
