# GopherScript Modular Architect

A high-performance modular code generator that builds Go backends and React frontends using Gemini AI.

## Features
- **Modular Generation**: Add features like Auth, CRUD, or custom logic via natural language.
- **Visual Styles**: Choose from multiple modern UI themes.
- **Live Preview**: Instantly see a virtual representation of your generated modules.
- **Workspace Management**: Save and manage multiple projects in your local workspace.
- **ZIP Export**: Download the full source code of your generated application.

## Build Process (Architect App)

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## Generated Application Structure

When you export a project, it follows this structure:

### Backend (Go)
- **Location**: `/backend`
- **Build**: `go build -o server main.go`
- **Configuration**: Requires a `.env` file with `GEMINI_API_KEY`.

### Frontend (React + Vite)
- **Location**: `/frontend` (or root depending on generation)
- **Build**: `npm install && npm run build`
- **Styling**: Tailwind CSS

## Environment Variables
The architect requires `GEMINI_API_KEY` to be set in the environment to function.
The generated applications also expect this key for their own AI-powered features.
