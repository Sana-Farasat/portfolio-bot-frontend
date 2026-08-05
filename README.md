# Sana Farasat Portfolio Bot — Frontend

A modern, attractive chat UI for the **Sana Farasat** portfolio assistant. Built with Next.js, it talks to the FastAPI backend to answer questions about Sana, and includes a **built-in voice bot** (speech recognition + speech synthesis) — no extra setup needed.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Voice:** Web Speech API (`SpeechRecognition` + `speechSynthesis`)

## Features

- 💬 Chatty AI assistant **Sage** for Sana Farasat's portfolio
- 🎙️ **Voice input** — speak instead of typing (Chrome/Edge)
- 🔊 **Voice replies** — bot speaks its answers (toggle on/off)
- 💡 Suggestion chips for quick questions
- ⏳ Typing indicator & auto-scroll
- 🌗 Light/dark mode support
- 📱 Fully responsive layout with header & footer

## Project Structure

```txt
portfolio-bot-frontend/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Chat UI (header, messages, input, footer, voice)
│   ├── globals.css     # Tailwind + global styles
│   └── docs.md         # React hooks & voice notes
├── .env.local          # Backend URL
└── README.md
```

## Prerequisites

- Node.js 18+
- The backend running (see `portfolio-bot-backend`)

## Setup

1. **Clone and enter the directory:**

   ```bash
   cd portfolio-bot-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure the backend URL:** create a `.env.local` file:

   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

   Update the URL if your backend runs elsewhere.

## Run (Development)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Start (Production)

```bash
npm run build
npm start
```

## Lint

```bash
npm run lint
```

## How it works

The page sends the user's message to the backend:

```http
POST http://localhost:8000/api/chat
Content-Type: application/json
```

```json
{ "message": "Who is Sana Farasat?" }
```

The backend replies with a `reply` string that is shown as a message and (if voice is on) read aloud.

### Voice Notes

- **Voice input** uses `SpeechRecognition`, which works best in **Chrome/Edge**.
- **Voice replies** use `speechSynthesis`, configurable via the 🔊 toggle in the header.
