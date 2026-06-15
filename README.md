# BeeBot Frontend — Chat Interface

React chat interface for BeeBot, the AI conversational assistant for BeeSpace ERP.

## Stack

- React 18
- Vite
- JavaScript (JSX)

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
# 1. Clone and enter the project
git clone https://github.com/Malla-Sonita1/beespace-ai-frontend.git
cd beespace-ai-frontend

# 2. Install dependencies
npm install

# 3. Launch development server
npm run dev
# Opens on http://localhost:5173
```

## Backend Connection

The frontend connects to the BeeBot backend at `http://localhost:8000`. CORS is configured for ports 3000 and 5173.

Make sure the backend is running before using the frontend:
```bash
# In the backend repo (BeeBot-ai-assistant)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Structure

```
src/
├── pages/
│   └── ChatPage.jsx           # Main chat page
├── components/
│   ├── Header.jsx             # App header with MUNISYS logo
│   ├── MessageList.jsx        # Message display + feedback buttons
│   └── SessionSidebar.jsx     # Session list sidebar
└── vite.config.js
```

## Features

- Chat interface with conversation history
- Session management (create, rename, delete)
- Pagination "Voir la suite" for long result lists
- Star rating (1-5) per message
- Entity clarification buttons (interactive choice/confirmation)
- Copy button with clipboard feedback

## Design

- MUNISYS brand colors: steel blue (#2B6CB0), bordeaux (#8B2252)
- Font: Plus Jakarta Sans
- MUNISYS logo in header

## Related

- Backend: [BeeBot-ai-assistant](https://github.com/Malla-Sonita1/BeeBot-ai-assistant) (branch `feature/rag-poc`)
