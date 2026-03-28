# Ayush — Backend API & Resume Intelligence

---

## _Poori Team Ka Kaam — Sirf Samajhne Ke Liye (Ye Apka Part Nahi Hai)_

> **Ye section sirf isliye hai taaki aapko samajh aaye ki poora project kaise kaam karta hai aur baaki log kya kar rahe hain. _Apka actual kaam niche "AYUSH'S WORK" section me hai._**

**W.I.S.E. ek AI-powered mock interview platform hai jo candidate ka stress aur behavior analyze karta hai.** User apna resume aur photo upload karta hai (Ritika) → camera/mic calibrate karta hai (Ritika) → AI voice ke saath real-time interview deta hai (Ayush + Shalini) → backend me face mesh aur expressions track hote hain taaki cheating aur stress catch ho (Anika) → end me ek detailed hiring committee-style report generate hoti hai jisme BSI score milta hai (Shalini).

```
 Upload Resume/Photo ──→ Calibration ──→ Live Interview (Voice+Video) ──→ Feedback Report
      (Ritika)             (Ritika)         (Ayush + Shalini)                 (Shalini)
                                                    │
                                            Facial Analysis & Anti-Cheat
                                                 (Anika)
```

---

## _AYUSH KI TECH STACK — Sirf Wahi Technologies Jo Ayush Ne Use Ki Hain_

| Technology | Kya hai | Kaha use hua |
|-----------|---------|-------------|
| **Node.js / Express** | JavaScript backend server | `backend/src/app.js` aur `routes/` folders ke poore setup me |
| **PDF Parsing Libraries** | Binary PDF reading | `backend/src/routes/resume.js` me pdf buffer extract karke plaintext me convert karne ke liye |
| **Groq API Cloud** | LPU inference engine | High-speed LLM inference access for `llama-3.1-8b` |
| **Prompt Engineering** | AI rules/logic programming | `routes/chat.js` me AI interviewer ka persona setup karne ke liye |
| **State Machine Logic** | Conversational flow control | AI interview turns ko 5 stages (Intro, Exp, Skills, etc.) me strict guide karne ke liye |

---

## _Reference Acknowledgment — Base Kaha Se Aaya_

> **Node.js backend scratch se likha gaya hai. AI Models (LLaMA) open-source hain aur humne inko unki inference API (Groq) ke through consume kiya hai. Pura system architecture, Resume Intelligence Extraction pipeline aur 5-stage conversational sequence 100% humara custom logic hai.**

---

## _Core Concepts — Ayush Ke Kaam Me Kaha Use Hui_

> **Computer Science / APIs / Data structures concepts jo Ayush ne implement kiye hain:**

| Concept | Kaha use hua | File |
|-----------|-------------|------|
| **RESTful API Design** | Express server me `POST /api/chat`, `POST /api/upload-resume` standard endpoints | `backend/src/app.js` |
| **Finite State Machine** | AI Interviewer current stage (Turns 0-12) calculate karke behavior change karta hai | `backend/src/routes/chat.js` |
| **Prompt Context Window** | Resume info ko context inject karke LLaMA inference frame design karna | `backend/src/routes/chat.js` |
| **Multipart Data Processing** | Client browser se PDF files as byte chunks backend receive karke parse karna | `backend/src/routes/resume.js` |

---

## _AYUSH'S WORK — Backend API Architecture & Resume Logic_

**_"Ayush ne Node.js API server banaya hai. Jo bhi intelligence aur questions AI banata hai — kiska resume padhna hai, kya puchna hai, kya logic lagana hai — wo sab Ayush ki API manage karti hai."_**

---

### Files Ayush Owns

| File | What it does |
|------|-------------|
| `backend/src/app.js` | Main Express server entry point, mounts routes, manages CORS |
| `backend/src/routes/resume.js` | Reads uploaded PDF, parses binary into raw string text |
| `backend/src/routes/chat.js` | Connects to Groq LLaMA, passes the parsed resume + prompt context to get next question |
| `backend/package.json` | Dependencies for the Node application |

---

### What Each Feature Does — Detailed

---

#### **1. Node + Express Bootstrapping**

`app.js` initializes the Express application, applies standard middleware to accept JSON bodies. The app sets up a router to handle `/api/*` endpoints ensuring the frontend can communicate seamlessly with the backend.

**"Ye main entrypoint hai. Backend server port 3000 pe sunta hai. Express middleware define kiya gaya hai taaki frontend ki strings aur frontend ke FormData JSON formats reliably backend handle kar sake."**

#### **2. Resume Intelligence Parser**

`routes/resume.js` accepts the `multipart/form-data` from Ritika's UI. It grabs the binary of the Resume PDF and uses a library to strip out all formatting, extracting just the pure text to feed into the AI.

**"Bina iske AI ko nahi pata hota user kaun hai. Hum direct PDF read karte hain, uski raw string banate hain, aur as a `resumeText` variable frontend ko lautate hain taaki usko global state me rakh sakein."**

#### **3. Conversational State Machine (Groq LLaMA-3.1-8b)**

`routes/chat.js` doesn't just ask random questions. It counts the `history.length / 2` to know the "Turn count". Based on the turn count, the prompt is dynamically rewritten:
- Turns 1-2: Introduction
- Turns 3-4: Experience Deep Dive
- Turns 5-7: Skills
- Turns 8+: System Design / Hard Skills

**"Agar aap dhyan se structure dekho, main LLaMA model ko strict System Prompt pass kar raha hu. Main model ko batata hu ki theek kaunsa stage chal raha hai, aur candidates ke pichle answers kya hain. Groq cloud API hume mili-seconds ke andar reply inference karke deta hai."**

#### **4. Dynamic Question Filtering**

The backend is instructed to format responses neatly (without asterisks or markdown bolding) because the text needs to be spoken out loud by the TTS (Shalini's part). Ayush ensures the payloads are clean text strings.

**"Llama hamesha `**bold**` aur `*italic*` markdown deta hai jo speech-to-text voice engines ko confuse kar deta hai. Maine prompt level pe hi markdown hatane ke rules apply kiye taaki TTS cleanly kaam kare."**

---

### How to Test

| What to test | How | Expected |
|-------------|-----|----------|
| **Resume Parser** | Call `POST /api/upload-resume` via Postman with a PDF | Returns `{ "text": "YOUR EXPERIENCES..." }` |
| **State Machine flow** | Pass `history.length = 10` to `POST /api/chat` | AI will switch topics to General/System Design |
| **Groq LLaMA setup** | Call `POST /api/chat` directly | Instantly returns the next logical question based on context |

---

### _When the Mentor Asks: "Ayush, tumne kya kiya?"_

> "Sir/Ma'am, maine W.I.S.E. ka **poora Backend Architecture aur Resume Intelligence Engine** banaya hai Node.js aur Express me.
>
> Hamara system generic questions nahi puchta; ye directly user ke uploaded CV se context uthata hai. Maine `POST /api/upload-resume` ka backend handler banaya jo binary PDF ko backend buffer parsing ke through clean text string me badalta hai. Fir ye text candidate ki live voice chat history ke saath **Groq ke Llama-3.1-8b** model ko pass hota hai.
> 
> Mera sabse bada kaam **Conversational State Machine** likhna tha. Main backend me interview turn count track karta hu: Turn 1 me intro, turn 3 me experience, turn 5 me technical skills. Mera backend prompt dynamic hai, jo phase ke hisaab se LLaMA ka behavior aur strictness change karta rehta hai taaki real human interviewer wali feel aaye."
