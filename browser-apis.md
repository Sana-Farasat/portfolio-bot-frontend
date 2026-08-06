# Browser API — List with Use Cases

## 🌌 Portfolio bot project mein use thi / ka aati

| API | Kya karti hai | Use case |
|-----|--------------|----------|
| **Web Speech API** | Speech recognition + synthesis | 🎙️ Voice bot (sunna + bolna) |
| **`fetch()`** | Backend se data bhejna/lena | `POST /api/chat` ko message send karna |
| **`navigator.mediaDevices`** | Mic/Camera access | Microphone permission & audio input |
| **`crypto.randomUUID()`** | Unique ID generate karna | Har message ka `id` banana |
| **Clipboard API** | Copy / paste | "Copy answer" button ke liye |

---

## 🎨 UI / Performance ke liye

| API | Use case |
|-----|----------|
| **Web Animations (WAAPI)** | Chat bubbles ke smooth animations |
| **IntersectionObserver** | Lazy-load images / scroll animations |
| **ResizeObserver** | Responsive layout resize handling |
| **DOM `scrollTo`** | Auto-scroll to latest message |
| **Fullscreen API** | Chat ko fullscreen karna |

---

## 📸 Media APIs

| API | Use case |
|-----|----------|
| **Web Audio API** | Audio processing / waveform |
| **WebRTC** | Video / audio live chat |
| **File System Access / Drag-Drop** | Chat mein file attach karna |

---

## 🔐 Storage / Data

| API | Use case |
|-----|----------|
| **`localStorage` / `sessionStorage`** | Chat history ya theme save karna |
| **IndexedDB** | Bada data offline store karna |
| **`navigator.geolocation`** | User location (local services) |
| **Notification API** | Naya message ka notification |

---

## ⚙️ Background / Real-time

| API | Use case |
|-----|----------|
| **WebSockets** | WebSocket real-time two-way chat |
| **Server-Sent Events (SSE)** | Real-time typing indicator / updates |
| **Web Workers** | Heavy processing ko background thread mein |
| **Service Workers** | PWA offline support + notifications |

---

## 📱 UX Enhancements

| API | Use case |
|-----|----------|
| **Web Share API** | Chat ko mobile pe share karna |
| **Screen Capture API** | Screen share in bot |
| **Vibration API** | Mobile notifications ke liye |
| **Fullscreen API** | Focus mode / fullscreen app |

---

## 💡 Note

- **Web Speech API** — voice input sirf **Chrome/Edge** mein fully kaam karta hai.
- **`localStorage`** — sirf strings store karta hai, bara data ke liye **IndexedDB** use karo.
- **Service Workers** ke liye HTTPS / localhost zaroori hai.