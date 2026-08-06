# Browser APIs for AI Automation (OpenClaw / Agent Projects)

Ye list un browser APIs ki hai jo **AI automation agents** (OpenClaw, Clawdbot) ke projects banane ke liye kaam aati hain — scraping, form automation, live data, scheduling waghera.

---

## 1. AI Automation Agent ke liye (Core)

| API | Use case |
|-----|----------|
| **`fetch()` / XMLHttpRequest** | Forms submit, data scrape, API testing |
| **DOM API** (`querySelector`, `getComputedStyle`) | Elements find/read karna, scraping |
| **WebSocket** | Real-time data streams, live markets, trading |
| **`PerformanceObserver`** | Site performance / metrics scraping |
| **`MutationObserver`** | DOM change pe bot react (live updates) |
| **`Element.scrollIntoView` / DOM rects** | Scrolling/clicking visibility utils |

---

## 2. Browser Automation Projects ke liye

> OpenClaw / Playwright / Puppeteer style automation mein ye SDK/CDP extensions kaam karte hain — yaad rakho, **browser APIs sirf browser window mein chalti hain**, agents mostly **Playwright/Puppeteer (CDP)** use karte hain.

| API | Use case |
|-----|----------|
| **Chrome DevTools Protocol (CDP)** | Click, type, fill forms, page state control |
| **`navigator` / `userAgent`** | Device/browser environment detect |
| **WebSocket** | Live updates, auto-refresh detection |
| **Web Storage (`localStorage`)** | Login session/token autonomously store |
| **File API** | Auto-download / read files from page |
| **Notification + Audio** | Alert triggers to continue pipeline |

---

## 3. Scraping / Data Extraction

| API | Real example |
|-----|----------|
| **`fetch()`** | GET/POST data, JSON extraction |
| **DOM Traversal** | Tables, product prices, job posts |
| **`querySelector` / XPath** | Precise selectors for data |
| **Regex** | Clean captured text |
| **ARIA attributes** | Accessibility selectors (buttons, forms) |

---

## 4. Scheduling / Polling

| API | Use case |
|-----|----------|
| **`setInterval` / `setTimeout`** | Retry / task scheduling |
| **Web Worker** | Background polling refresh |
| **`setTimeout(fetch)`** | Re-fetch on timer (auto bot) |
| **`AbortController`** | Cancel long requests |

---

## 5. File / Forms / Cloud

| API | Use case |
|-----|----------|
| **`FormData`** | File upload simulation |
| **`input.dispatchEvent(event)`** | Trigger change/click |
| **`navigator.clipboard`** | Copy-paste flow |
| **`Blob` / `URL.createObjectURL`** | Download handling via automation |
| **`btoa` / `atob`** | Token/base64 encode for login |

---

## 💡 Important Note (Clawdbot / OpenClaw)

- **Browser APIs directly server-side OpenClaw mein nahi chalti** — agent browser access ke liye **Playwright/Puppeteer (CDP)** use hota hai.
- Heavy tasks (email, GitHub, Google Sheets) ke liye **MCP servers** use karo.
- Browser core API se scraping/DOM control hota hai, lekin file/cloud access ke liye standalone APIs (Node/Python) chahiye hoti hain.

---

## 🚀 Project Ideas (OpenClaw + Browser Automation)

- 🤖 Auto job applicator
- 💰 Price tracker bot
- 📝 Auto form filler
- 📈 Crypto/stock live notifier
- 🗂️ Data scraper → Google Sheet exporter
