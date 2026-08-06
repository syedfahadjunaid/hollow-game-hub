# Hollow Game Hub — Frontend

A modern, high-performance web platform built with Next.js (App Router), React 19, and Tailwind CSS v4. Designed as the frontend client for the Hollow Game Hub platform, featuring gaming assistant chat, mini-games, leaderboards, user progression, and community forums.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI & Logic**: React 19, TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Radix UI, Shadcn UI
- **Animations**: GSAP, Tailwind CSS animations
- **State Management & Data Fetching**: TanStack React Query v5
- **Icons**: Lucide React, Tabler Icons
- **Toast Notifications**: Sonner, React Hot Toast
- **Tables & Drag-and-Drop**: TanStack React Table v8, `@dnd-kit`

---

## 📁 Directory Structure

```
hollow-game-hub/
├── app/
│   ├── actions/               # Next.js Server Actions
│   ├── api/                   # Local API route handlers / proxies
│   ├── auth/                  # Authentication pages (Login, Register, SSO callback)
│   └── club/                  # Main authenticated application layout & hub
│       ├── achievements/      # User badges and achievements wall
│       ├── chat/              # AI Gaming Assistant chat interface
│       ├── dashboard/         # Personal player stats, streaks, recent activity
│       ├── forum/             # Community Forum (Categories, Threads, Comments)
│       ├── games/             # Mini-games catalog, game canvas, and leaderboards
│       └── main-menu/         # Navigation & Hub selector
├── components/
│   ├── ui/                    # Reusable Shadcn UI primitives (Buttons, Cards, Dialogs, etc.)
│   ├── Header.tsx             # Main navigation header
│   ├── HeaderProfile.tsx      # User profile summary menu
│   ├── dashboard-header.tsx   # Dashboard banner & stat badges
│   ├── data-table.tsx         # Generic interactive table component
│   └── providers.tsx          # React Query & Theme context providers
├── hooks/                     # Custom React hooks (e.g. use-mobile, theme hooks)
├── lib/                       # Core utilities & API clients
│   ├── api-client.ts          # Authenticated fetch wrapper with automatic JWT token refresh
│   ├── auth/                  # Session and token storage helpers
│   ├── games/                 # Game engine client utilities
│   └── sound.ts               # Web Audio sound effects manager
└── public/                    # Static assets & game media
```

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: `v20+` or **Bun**: `v1.1+`
- **Backend API**: The Express backend server should be running on `http://localhost:8000`.

### Environment Setup

Create a `.env.local` file in the root of `hollow-game-hub`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Installation & Development Server

```bash
# Install dependencies using Bun or npm
bun install
# or
npm install

# Start the dev server (runs on http://localhost:3001)
bun dev
# or
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🎮 Key Features & Page Overview

1. **Player Dashboard (`/club/dashboard`)**:
   - Live display of XP, level progression, current streak, and daily challenges.
2. **Mini-Games Catalog (`/club/games`)**:
   - Interactive games with real-time scoring, turn-based inputs, and global/per-game leaderboards.
3. **AI Gaming Assistant (`/club/chat`)**:
   - Real-time streaming response Q&A assistant powered by Groq LLMs.
4. **Community Forum (`/club/forum`)**:
   - Category-based discussion board with thread creation, markdown content support, nested comment trees, upvoting, and search.
5. **Achievements Wall (`/club/achievements`)**:
   - Visual catalog of locked and unlocked badges and accomplishment trackers.

---

## 🔌 API Integration Pattern

All external requests to the backend server use `apiRequest` located in [`lib/api-client.ts`](file:///home/syed-fahad-junaid/Projects/Personal%20Work/hollowgamehub/hollow-game-hub/lib/api-client.ts).

- **Authentication**: JWT `Authorization: Bearer <token>` attached automatically.
- **Token Rotation**: Transparently retries failed 401 requests by exchanging refresh tokens via `/api/auth/refresh`.

---

## 📜 Scripts

| Command | Description |
| :--- | :--- |
| `bun dev` | Starts dev server on port 3001 with Webpack |
| `bun run build` | Builds production Next.js output |
| `bun start` | Starts production build |
| `bun run lint` | Runs ESLint validation |
