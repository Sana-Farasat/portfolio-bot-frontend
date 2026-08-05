"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

type Msg = {
  id: string;
  role: "user" | "bot";
  text: string;
};

type RecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: RecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

interface SpeechWindow extends Window {
  SpeechRecognition?: new () => RecognitionLike;
  webkitSpeechRecognition?: new () => RecognitionLike;
}

interface RecognitionEvent {
  results?: { [index: number]: { transcript?: string }[] };
}

const SUGGESTIONS = [
  "Who is Sana Farasat?",
  "What services do you provide?",
  "Tell me about your expertise",
  "Show me your projects",
];

function WelcomeMessage() {
  return (
    <div className="space-y-1 text-center">
      <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
        Hiya! I&apos;m Sage — Sana&apos;s AI assistant 🤖
      </p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Ask me anything about Sana, her work, skills &amp; projects.
      </p>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recogRef = useRef<RecognitionLike | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const sendMessageRef = useRef<(text?: string) => void>(() => {});

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      try {
        const SR =
          (window as unknown as SpeechWindow).SpeechRecognition ||
          (window as unknown as SpeechWindow).webkitSpeechRecognition;
        if (SR) {
          const r = new SR();
          r.continuous = false;
          r.interimResults = false;
          r.lang = "en-US";
          r.onresult = (e: RecognitionEvent) => {
            const text = e.results?.[0]?.[0]?.transcript ?? "";
            setInput(text);
            sendMessageRef.current(text);
          };
          r.onend = () => setListening(false);
          r.onerror = () => setListening(false);
          recogRef.current = r;
        }
      } catch {
        /* speech not supported */
      }
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  function speak(text: string) {
    if (!voiceOn || !synthRef.current) return;
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.05;
    u.pitch = 1;
    synthRef.current.speak(u);
  }

  function stopChat() {
    synthRef.current?.cancel();
    recogRef.current?.stop?.();
    setListening(false);
    setTyping(false);
    setMessages([]);
    setInput("");
  }

  async function sendMessage(raw?: string) {
    const text = (raw ?? input).trim();
    if (!text || typing) return;

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const reply = data.reply ?? "⚠️ Something went wrong. Try again.";

      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "bot", text: reply },
      ]);
      speak(reply);
    } catch {
      const msg = `⚠️ Could not reach the backend (${BACKEND_URL}). Is the server running?`;
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "bot", text: msg },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage();
  }

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  });

  function startListening() {
    if (!recogRef.current) {
      alert("Voice input is not supported in this browser. Try Chrome/Edge.");
      return;
    }
    setListening(true);
    recogRef.current.start();
  }

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-indigo-100 via-white to-fuchsia-100 font-sans dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-white/40 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-500 to-fuchsia-500 text-lg font-bold text-white shadow-lg shadow-indigo-500/30">
              SF
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-zinc-900 dark:text-white">
                Sana Farasat
              </p>
              <p className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Sage is online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setVoiceOn((v) => !v);
                if (voiceOn) synthRef.current?.cancel();
              }}
              title={voiceOn ? "Voice on" : "Voice off"}
              className="flex h-9 items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 text-xs font-semibold text-zinc-700 transition hover:bg-white dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <span className={voiceOn ? "text-fuchsia-500" : "text-zinc-400"}>
                {voiceOn ? "🔊" : "🔇"}
              </span>
              {voiceOn ? "Voice On" : "Voice Off"}
            </button>
            <button
              onClick={stopChat}
              title="Clear chat / stop"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white/80 text-zinc-600 transition hover:rotate-90 hover:bg-white dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300"
            >
              ↻
            </button>
          </div>
        </div>
      </header>

      {/* CHAT BODY */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.length === 0 && <WelcomeMessage />}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "rounded-br-md bg-linear-to-tr from-indigo-500 to-fuchsia-500 text-white"
                    : "rounded-bl-md bg-white text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm dark:bg-zinc-800">
                <span className="h-2 w-2 animate-bounce rounded-full bg-fuchsia-400" />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-indigo-400"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-fuchsia-400"
                  style={{ animationDelay: "0.3s" }}
                />
              </div>
            </div>
          )}

          {messages.length === 0 && (
            <div className="flex flex-wrap justify-center gap-2 pt-2 sm:justify-start">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-full border border-indigo-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-indigo-600 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:border-indigo-500/30 dark:bg-zinc-800/70 dark:text-indigo-300"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* INPUT BAR */}
      <div className="border-t border-white/40 bg-white/40 px-4 py-4 backdrop-blur-lg sm:px-6 dark:border-white/10 dark:bg-zinc-900/40">
        <form
          onSubmit={onSubmit}
          className="mx-auto flex max-w-3xl items-center gap-2 rounded-3xl border border-zinc-200 bg-white/80 p-1.5 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-800/80"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Sana... e.g. her projects, skills"
            disabled={listening}
            className="flex-1 bg-transparent px-3 text-sm text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
          />
          <button
            type="button"
            onClick={startListening}
            title={listening ? "Listening..." : "Voice input"}
            className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl transition ${
              listening
                ? "bg-red-500 text-white shadow-lg shadow-red-500/40"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-200"
            }`}
          >
            {listening ? "⏹" : "🎙️"}
          </button>
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="flex h-11 items-center gap-2 rounded-2xl bg-linear-to-tr from-indigo-500 to-fuchsia-500 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:opacity-90 disabled:opacity-40"
          >
            Send →
          </button>
        </form>
      </div>

      {/* FOOTER */}
      <footer className="py-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
        <p>
          Powered by{" "}
          <span className="font-semibold text-zinc-600 dark:text-zinc-400">
            Sana Farasat Agent
          </span>{" "}
          · Voice bot enabled 🔊
        </p>
      </footer>
    </div>
  );
}