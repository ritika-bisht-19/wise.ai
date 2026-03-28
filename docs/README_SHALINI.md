# Shalini — Voice Intelligence & BSI Engine

---

## _Poori Team Ka Kaam — Sirf Samajhne Ke Liye (Ye Apka Part Nahi Hai)_

> **Ye section sirf isliye hai taaki aapko samajh aaye ki poora project kaise kaam karta hai aur baaki log kya kar rahe hain. _Apka actual kaam niche "SHALINI'S WORK" section me hai._**

**W.I.S.E. ek AI-powered mock interview platform hai jo candidate ka stress aur behavior analyze karta hai.** User apna resume aur photo upload karta hai (Ritika) → camera/mic calibrate karta hai (Ritika) → AI voice ke saath real-time interview deta hai (Ayush + Shalini) → backend me face mesh aur expressions track hote hain taaki cheating aur stress catch ho (Anika) → end me ek detailed hiring committee-style report generate hoti hai jisme BSI score milta hai (Shalini).

```
 Upload Resume/Photo ──→ Calibration ──→ Live Interview (Voice+Video) ──→ Feedback Report
      (Ritika)             (Ritika)         (Ayush + Shalini)                 (Shalini)
                                                    │
                                            Facial Analysis & Anti-Cheat
                                                 (Anika)
```

---

## _SHALINI KI TECH STACK — Sirf Wahi Technologies Jo Shalini Ne Use Ki Hain_

| Technology | Kya hai | Kaha use hua |
|-----------|---------|-------------|
| **Whisper-large-v3 API** | OpenAI/Groq speech-to-text (STT) model | `routes/transcribe.js` me user ke mic audio (WAV blob) ko English text me convert karne ke liye |
| **ElevenLabs API** | High end Text-to-Speech (TTS) | `routes/speak.js` me AI chat strings ko emotional human voice/audio-stream me convert karne ke liye |
| **BSI Logic / Algorithms** | Behavioral Stability Index | `FeedbackReport.jsx` aur backend analytics components me stress variables aggregate karne ke liye |
| **JSON Structured Data Generation** | Forcing LLM to output pure JSON | `routes/feedback.js` me final hiring-committee report generate karne ke liye |

---

## _Reference Acknowledgment — Base Kaha Se Aaya_

> **Audio Streams handle karna browser se leke Node.js tak entirely custom logic hai. Voice processing ke liye hum Whisper STT and ElevenLabs TTS pre-trained engines use karte hain APIs ke madhyam se. LLaMA model ka use feedback format limit karne (`response_format: json_object`) backend me 100% humara code hai.**

---

## _Core Concepts — Shalini Ke Kaam Me Kaha Use Hui_

> **Computer Science / Systems concepts jo Shalini ne implement kiye hain:**

| Concept | Kaha use hua | File |
|-----------|-------------|------|
| **Binary/Blob Audio Streaming** | Browser mic API se base64/Blob convert karke server tak payload as stream route karna | `routes/transcribe.js` |
| **Data Aggregation & Metrics** | Real-time stress arrays (from Anika) ko statistical logic me filter karke ek single confident BSI Score dena | `FeedbackReport.jsx` |
| **JSON Data Parsing (Strictness)** | Unstructured LLM responses ko strongly-typed JSON format me bandhna (Structured Outputs) | `routes/feedback.js` |

---

## _SHALINI'S WORK — Voice Intelligence & Final Feedback Generation_

**_"Shalini ne AI ki 'Awaaz' (Voice) banayi hai aur final hiring committee waala 'Dimag' (BSI stress analytics & Feedback logic) develop kiya hai."_**

---

### Files Shalini Owns

| File | What it does |
|------|-------------|
| `backend/src/routes/speak.js` | Connects backend to ElevenLabs API to get `audio/mpeg` binary buffers |
| `backend/src/routes/transcribe.js` | Receives User `multipart/form-data` audio and extracts raw Text using Whisper |
| `backend/src/routes/feedback.js` | Injects the whole 12-turn history into the LLaMA JSON-structured reporting tool |
| `frontend/src/features/interview/FeedbackReport.jsx` | UI mapping variables and computing the final BSI Analytics output beautifully |

---

### What Each Feature Does — Detailed

---

#### **1. Whisper Speech-to-Text Pipeline**

`routes/transcribe.js` takes the `.wav` buffer data saved by the browser when the user holds down the mic button. It uploads this via the Groq SDK to the `whisper-large-v3` model.

**"User jab 'Push to Talk' chhodta hai, blob file banti hai. Main backend pe ye FormData as file read karke Whisper ko pass karti hu jo hindi/english/accented voice ko magically clean English text me badal deta hai."**

#### **2. ElevenLabs Text-to-Speech Engine**

`routes/speak.js` takes plain text (the AI Interviewer's generated chat) and forwards it to ElevenLabs. It selects from multiple predefined voice keys (Adam, Rachel, Bella, Antoni) based on user selection. It streams an `audio/mpeg` byte buffer directly back to the `InterviewChat` so it plays inherently as an invisible `<audio>` tag.

**"Sirf text answer dena kafi nahi tha, system ki awaaz real lagni zaroori thi. Maine Eleven Labs `eleven_flash_v2_5` model intergrate kiya jisme maine voice ID map banayi (like Adam, Rachel). Jo bhi string LLaMA dega, wo directly audio byte buffer banke frontend me bhej di jayegi."**

#### **3. Feedback Report Data Architecture**

`routes/feedback.js` triggers exactly when the interview concludes (Turn 12 or manual abort). Shalini aggregates `history[]` and `resumeText` and passes it with a `response_format: json_object` mandate to LLaMA.

**"Hume unstructured string nahi, specific parameters chahiye the frontend scorecards ke liye. Maine backend AI prompt me JSON format explicitly force kiya (like `overall_score`, `hiring_verdict`, `strengths` array). Iski wajah se mera frontend components mapping asani se bina errors chal jaata hai."**

#### **4. Behavioral Stability Index (BSI) Engine**

This is the key differentiating metric on the final report computed between Anika's stress output and Shalini's logic framework. It standardizes stress variances.

**"Maine ek algorithm banayi hai jo BSI Score nikaalne me Anika ki tracking data use krti hai. Agar achanak se multiple rapid peaks (stress signals) mili aur audio fluency toot gayi (speech rate drop hua), toh mera BSI score drop hoke 'Low Confidence' ya 'High Stress' dikhayega end report me."**

---

### How to Test

| What to test | How | Expected |
|-------------|-----|----------|
| **Text-to-Speech** | Call `POST /api/speak` with `{"text": "Hello", "voiceKey": "adam"}` | Response returns file of type `audio/mpeg` |
| **Speech-to-Text** | Mic recording during interview | Transcribed perfectly regardless of noise |
| **JSON Feedback** | Finish an interview entirely | Generates `{ "hiring_verdict": "Strong Hire" }` perfectly formatted JSON UI |

---

### _When the Mentor Asks: "Shalini, tumne kya kiya?"_

> "Sir/Ma'am, mera core contribution W.I.S.E. me **Voice Intelligence Pipeline aur Behavioral Stability Index (BSI)** banana tha.
>
> Text chatbot banalena aasan hai, par usko voice communication banana challenge tha. Jab candidate mic pe bolta hai, maine **Groq ke Whisper-large-v3** ko integrate kiya us audio blob ko text me fast transcribe karne ke liye. Jab AI apna sawal puchta hai, usko real human jaisi awaaz dene ke liye maine **ElevenLabs `eleven_flash_v2_5`** ka integration banaya taaki `audio/mpeg` buffer sidha frontend me stream hoke bole.
> 
> Mera sabse important module tha **Post-Interview Analytics**. Jab test end hota hai, main Llama ko ek strict JSON array scheme pass phook ke `response_format: json_object` se ek full report parse karwati hu. Iske saath maine camera dwara nikale hue stress metrics combined karke apna proprietary **Behavioral Stability Index (BSI) Score** program kiya, jo batata hai ki candidate technically aata tha, par usne under-pressure perform kaisa kara."
