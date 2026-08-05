# React Hooks — Aik Practical Guide

## Pehle samjho: "Hook" kya hai?

React ka kaam hai UI ko screen pe show karna. Lekin jab data badalta hai, React ko batana padta hai — *"change ho gaya, dobara draw karo!"* Hooks woh tools hain jo React ko yeh batane ka kaam karte hain.

**Problem:** Component already ban chuka hai, uski memory (variable) React dobara render pe bhul jata hai. Isliye hooks chahiye jo memory (state) aur side-effects handle karein.

---

## 1. `useState` — "Data ki memory yaad rakhne ke liye"

```tsx
const [input, setInput] = useState("");
```

**Kya hai:** Ek variable jo screen mein dikhta hai, aur jab change ho to React ko batata hai.

- `input` = current value (yeh read karo)
- `setInput(...)` = value change karo → automatic re-render hoga

### Common mistake (jo beginners karte hain):

```tsx
let count = 0;
count = 1; // ❌ React ko pata hi nahi chalega, screen update nahi hogi
```

`useState` isliye zaroori hai kyunki React tabhi update hota hai jab state change hote dekh le.

**Mere chat code mein:** `messages`, `input`, `typing`, `listening`, `voiceOn` sab UI state hain — kyunki jab yeh change hote hain, screen pe turant effect dikhta hai (jo bheja gaya message, voice button red hona, etc.).

---

## 2. `useRef` — "memory jo screen ko re-render nahi karti"

```tsx
const synthRef = useRef(null);
```

Reference `current` property mein store hota hai, aur ref change hone pe screen re-render nahi hoti.

### Kahan kaam hi aata hai:

1. **DOM element tak direct access** — `scrollRef.current.scrollTo(...)` ko screen scroll karne ke liye.
2. **Value store jo re-render pe reset na ho** — `sendMessageRef` aur `synthRef` jo browser ka speech object rakhta hai.

**useState vs useRef ka farq:** `useState` value change pe re-render karta hai. Magar agar hum speech object ko `useState` mein rakhenge to har kaam — needless re-render hoga. `useRef` se yeh problem nahi.

**Mere code mein:**

```tsx
useEffect(() => {
  sendMessageRef.current = sendMessage;   // ref mein latest function
});
```

Iska kaat — speech recognition (voice input) ko hamesha latest function milta hai.

---

## 3. `useEffect` — "side effects / kaam jo render ke baad hota hai"

```tsx
useEffect(() => {
  scrollRef.current?.scrollTo({ ... });
}, [messages, typing]);
```

**Use:** Render ho gaya, uske baad zayada kaam karo — jo render ke tak boom mein nahi.

**Example auto-scroll:** jaise isEmpty — jaisehi `messages` update hoti hain, chat khud scroll ho jata hai niche. Yehi [`useEffect` ka kam hai — JSX return ke baad.

### Syntax:

```tsx
useEffect(() => { ... }, [dependencies]);
```

- `[]` (khali) = sirf ek baar mount pe hota hai
- `[messages, typing]` = jab yeh dependencies change hotiya to w usage chalita hai to use karni

---

## Ek line ka summary (Memory Trick):

| Hook          | Kya karta hai                  | Kb use?                       |
| ------------- | ----------------------------- | ----------------------------- |
| `useState`   | Value + auto re-render         | UI pe. value kuch sing line ko dikha rahe ho   |
| `useRef`     | Value yaad rakhna, NO re-render | browser objects, scroll      |
| `useEffect`  | render hoga                        | multiple, scroll, fetch API, speech |

---

## Tumhari chat app mein teeno ka combination 👇

1. `useState` se messages, input, voice store karte hain → UI update hoti hai
2. `useRef` se speech/bookmark object store → bina re-render ke browser Access
3. `useEffect` se chat end mein scroll + speech set-up

> Koi aur hook ke baare mein janna chahe to (jaise `useMemo` ya `useCallback`), to batao. 😊

---

# Voice Implementation — Kaise ki?

Maine voice ka do hisso mein use kiya hai — **sunna** (speech recognition) aur **bolna** (speech synthesis). Dono browser ke built-in API hain, koi backend nahi chahiye.

## 1. "Bolna" (Bot ki awaz) — `speechSynthesis`

```tsx
function speak(text: string) {
  if (!voiceOn || !synthRef.current) return;
  synthRef.current.cancel();                       // purani awaz rok do
  const u = new SpeechSynthesisUtterance(text);   // naya bolne wala (jis speech chahiye)
  u.rate = 1.05;
  synthRef.current.speak(u);                      // bolna shuru
}
```

**Flow:** Backend se reply aata hai → `setMessages(...)` → `speak(reply)` → browser bot ki jawab bolta hai.

## 2. Sunna (User ka awaaz → text) — `SpeechRecognition`

Pehle browser ko forward karte hain ke speech API available hai:

```tsx
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const r = new SR();          // recognition object banao
r.lang = "en-US";
```

Jab user mic dabata hai:

```tsx
function startListening() {
  setListening(true);       // button red ho jaye
  recogRef.current.start(); // sunna shuru
}
```

Jab awaaz milta hai 👇

```tsx
r.onresult = (e) => {
  const text = e.results?.[0]?.[0]?.transcript ?? "";  // awaaz ko text banaya
  setInput(text);              // text box mein dikhao
  sendMessageRef.current(text); // aur message bhej do
};
```

## 3. Do cheezein kyun `useRef` mein rakhi:

```tsx
const recogRef = useRef(null);   // speech recognition object
const synthRef = useRef(null);   // speech synthesis object
```

Kyunki yeh browser ke objects hain, inhe `useState` mein nahi rakhna — nahi toh har re-render pe naya object aur re-render hoga. `useRef` se ek hi instance, bina UI update ke.

## Voice button ka kaam

Header mein 🔊 **Voice On/Off** — `useState` se `voiceOn` handle karte hain, taake agar user mute kare to `speak()` return ho jaye:

```tsx
if (!voiceOn || !synthRef.current) return;
```

Mic button 🎙️ — push karne pe `startListening()` call hota hai, aur `r.onresult` pe parsing shuru hoti hai.

> **Note:** `SpeechRecognition` sirf Chrome/Edge mein fully kaam karta hai, aur internet nahi chahiye bot side pe — bas mic permission aur availability chahiye.