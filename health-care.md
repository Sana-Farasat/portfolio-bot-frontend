# 🩺 AI Health Care — Vision Diagnosis Bot

> **"AI Doctor" — Image upload karo, AI doctor jaisi disease diagnosis + treatment batayega, text aur audio dono mein."**

---

## 1. Overview

User apni skin/symptoms ki photo upload karega (jaise haath ka zakhmi/laal chitta). AI Gemini us image ko dekh kar — **jaise doctor patient ko dekhta hai** — disease ki pehchan karega aur batayega:

- ✅ Possible disease/condition
- ✅ Symptoms
- ✅ Treatment (gharelu nuskhe + precautions)
- ✅ **Text + Audio (voice)** dono mein reply

---

## 2. Tech Stack (Sab FREE)

| Layer | Technology | Kahan se |
|-------|-----------|----------|
| **Frontend** | Next.js (React + Tailwind) | Existing structure |
| **Backend** | FastAPI (Python) | Existing structure |
| **AI Vision** | Google **Gemini** (flash-lite) — OpenAI-compatible endpoint | `GEMINI_API_KEY` (already hai) |
| **Voice Input** | Web Speech API (`SpeechRecognition`) | Browser built-in |
| **Voice Output** | Web Speech API (`speechSynthesis`) | Browser built-in |

> **Koi naya paid key nahi.** Gemini API ka free tier image analysis support karta hai. Dono (Gemini vision + Browser Speech API) sath use karne ka plan hai.

---

## 3. Page Structure

```
/health  → dedicated AI Doctor page
├── Header        → Logo, "AI Doctor" branding, online status, voice toggle
├── Upload Area   → Drag & drop / click to upload image
│                  (preview + camera capture optional)
├── Analysis      → "Analyze" button → backend call
├── Loading       → Typing/progress indicator "Doctor dekhta hai..."
├── Result Card   → Disease name, symptoms, treatment, precautions
├── Voice Reply   → Bot ka answer audio mein sunna
├── Text-to-Speech toggle (🔊 on/off)
└── Footer        → Disclaimer + project info
```

---

## 4. Flow Diagram

```
User → Upload image (JPG/PNG)
   ↓
Frontend → base64 encode → POST /api/health/analyze
   ↓
Backend → Gemini (vision model) → image + prompt
   ↓
AI → structured diagnosis (disease, symptoms, treatment, precautions)
   ↓
Backend → return JSON
   ↓
Frontend → show result card + 🔊 speak via speechSynthesis
```

---

## 5. Backend API Design (FastAPI)

### Endpoint: `POST /api/health/analyze`

**Request body:**

```json
{
  "image_base64": "data:image/jpeg;base64,/9j/...",
  "language": "en"
}
```

**Response:**

```json
{
  "disease": "Eczema (Jilaad sozish)",
  "confidence": "medium",
  "symptoms": ["redness", "itching", "dry patches"],
  "treatment": "Moisturizer, hydrocortisone cream, avoid scratching",
  "precautions": ["keep area clean", "avoid harsh soap", "see doctor if it spreads"],
  "summary": "Complete explanation in one paragraph",
  "audio": "text to be spoken (same as summary)"
}
```

### Backend Logic (concept)

```python
@app.post("/api/health/analyze")
async def analyze(req: HealthRequest):
    # 1. base64 decode image
    # 2. Gemini vision call: image + medical prompt
    # 3. Parse response into structured JSON
    # 4. Return result
```

**Gemini vision call (OpenAI-compatible):**

```python
response = client.chat.completions.create(
    model="gemini-3.1-flash-lite",
    messages=[{
        "role": "user",
        "content": [
            {"type": "image_url", "image_url": {"url": req.image_base64}},
            {"type": "text", "text": "Analyze this skin image as a doctor..."}
        ]
    }]
)
```

---

## 6. Frontend Features (Next.js)

| Feature | Implementation |
|---------|---------------|
| Image upload | `<input type="file">` + drag & drop + preview |
| Camera capture | `navigator.mediaDevices.getUserMedia` (optional) |
| Image preview | `<img>` with object-cover + remove button |
| Analyze button | Disabled until image selected |
| Result rendering | Disease, symptoms (chips), treatment, precautions cards |
| **Voice reply** | `speechSynthesis.speak(summary)` after result |
| **Voice input** | `SpeechRecognition` — patient bolkar bhi puch sake |
| Loading state | "Doctor examining... 🔬" spinner |
| Language toggle | English / Urdu/Hindi (future) |

---

## 7. Medical Prompt (Gemini ke liye)

```
Act as an experienced dermatologist. Look at this skin image and:
1. Identify possible condition(s)
2. List visible symptoms
3. Give home care + OTC treatment suggestions
4. Give precautions
5. IMPORTANT: mention "This is not a medical diagnosis" disclaimer
Return in simple language a 10-year-old can understand.
```

---

## 8. Security & Safety (IMPORTANT)

| Rule | Kya karna hai |
|------|--------------|
| ⚠️ **Disclaimer** | Har reply pe "AI advice, doctor se consult karo" |
| 🔒 **Data privacy** | Images ko storage mein save NAHI karna (process + discard) |
| 🧠 **Limit scope** | AI sirf "possible causes" batao, definite diagnosis nahi |
| 🚨 **Red flag words** | "emergency", "bleeding", "severe pain" → "turant doctor ke paas jao" |
| 🗑️ **Image deletion** | Analyze ke baad frontend/backend dono se clear |

---

## 9. Milestone Plan

- [ ] **M1:** Backend `POST /api/health/analyze` — Gemini vision + structured response
- [ ] **M2:** Frontend `/health` page — upload, preview, analyze button
- [ ] **M3:** Result card UI (disease, symptoms, treatment, precautions)
- [ ] **M4:** Voice reply (speechSynthesis) + voice input (SpeechRecognition)
- [ ] **M5:** Disclaimer + red-flag handling + image cleanup
- [ ] **M6:** Testing (backend curl + frontend build/lint)

---

## 10. Free Usage Limits (Gemini)

| Plan | Free limit |
|------|-----------|
| Gemini flash-lite | ~1000+ requests/day (generous free tier) |
| Image input size | Max ~5MB per image (upload se pehle compress karo) |
| Voice | Speech APIs bilkul free (browser) |

---

## 11. Extra Ideas (Future)

- 🗣️ Patient bole → bot samjhe (voice input)
- 🌐 English + Urdu/Hindi response support
- 📸 Camera se direct photo (mobile)
- 📄 Download diagnosis report as PDF
- 🩻 Skin-type selector (oily/dry/sensitive)

---

## 12. File Structure (Suggested)

```
portfolio-bot-frontend/
├── app/
│   ├── health/
│   │   └── page.tsx          # AI Doctor page
│   └── page.tsx              # Existing chat
└── lib/
    └── healthApi.ts          # analyze() helper

portfolio-bot-backend/
├── health.py                  # health analyze endpoint
└── main.py                    # include health router
```

---

> **Final Note:** Ye app sirf informational/educational hai. Real doctor ki jagah nahi leta — disclaimer hamesha dikhao. 😊
