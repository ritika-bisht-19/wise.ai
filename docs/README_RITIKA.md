# Ritika — Frontend / UI Engine

---

## _Poori Team Ka Kaam — Sirf Samajhne Ke Liye (Ye Apka Part Nahi Hai)_

> **Ye section sirf isliye hai taaki aapko samajh aaye ki poora project kaise kaam karta hai aur baaki log kya kar rahe hain. _Apka actual kaam niche "RITIKA'S WORK" section me hai._**

**W.I.S.E. ek AI-powered mock interview platform hai jo candidate ka stress aur behavior analyze karta hai.** User apna resume aur photo upload karta hai (Ritika) → camera/mic calibrate karta hai (Ritika) → AI voice ke saath real-time interview deta hai (Ayush + Shalini) → browser me face mesh aur expressions track hote hain taaki cheating aur stress catch ho (Anika) → end me ek detailed hiring committee-style report generate hoti hai jisme BSI score milta hai (Shalini).

```
 Upload Resume/Photo ──→ Calibration ──→ Live Interview (Voice+Video) ──→ Feedback Report
      (Ritika)             (Ritika)         (Ayush + Shalini)                 (Shalini)
                                                    │
                                            Facial Analysis & Anti-Cheat
                                                 (Anika)
```

---

## _RITIKA KI TECH STACK — Sirf Wahi Technologies Jo Ritika Ne Use Ki Hain_

| Technology | Kya hai | Kaha use hua |
|-----------|---------|-------------|
| **React 19** | Modern UI library | Har `.tsx`/`.jsx` file me — pura Single Page Application (SPA) banane ke liye |
| **Vite 8** | Dev server & bundler | Fast hot-reloading aur proxy setup ke liye (`vite.config.ts`) |
| **TypeScript** | JavaScript with types | Frontend components ko type-safe banane ke liye |
| **Tailwind CSS v4** | Utility-first CSS | Poore UI layout, dark mode, aur components ko style karne ke liye |
| **MediaDevices API** | Browser's webcam/mic API | User ki camera aur microphone permissions lene aur stream handle karne ke liye |

---

## _Reference Acknowledgment — Base Kaha Se Aaya_

> **Ye ek custom-built application hai React aur Node.js pe. Components aur styling humne Tailwind se scratch se banaye hain. Backend LLM models ke liye hum Groq aur ElevenLabs ki APIs use karte hain. _Frontend architecture, state management, webcam integration aur routing — ye sab 100% humara original kaam hai._**

---

## _Core Concepts — Ritika Ke Kaam Me Kaha Use Hui_

> **Computer Science / Software Engineering ke frontend concepts jo Ritika ne implement kiye hain:**

| Concept | Kaha use hua | File |
|-----------|-------------|------|
| **Component Driven Architecture** | UI ko modular reusable parts me break karna | `src/components/`, `src/features/` folders |
| **Reverse Proxy / CORS Handling** | Vite dev server se backend API ko proxy karna taaki CORS errror na aaye | `vite.config.ts` |
| **State Management** | Interview ka progress (upload → calibrating → live → feedback) track karna | `InterviewPage.tsx` |
| **Stream Processing** | Browser ke MediaStream ko capture karke video elements me feed karna | `CameraPanel.jsx`, `InterviewChat.jsx` |

---

## _RITIKA'S WORK — Frontend Architecture & UI Engine_

**_"Ritika ne user-facing interface, camera/mic permissions, aur interview flow UI banaya hai. Agar app me kuch dikhta hai ya click hota hai, wo Ritika ne code kiya hai."_**

---

### Files Ritika Owns

| File | What it does |
|------|-------------|
| `frontend/src/pages/InterviewPage.tsx` | Main orchestrator — controls flow from Upload → Interview → Feedback |
| `frontend/src/features/interview/FileUpload.jsx` | UI for uploading resume PDF and Face Photo |
| `frontend/src/features/interview/InterviewChat.jsx` | Chat UI, Mic button logic, and Voice selection dropdown |
| `frontend/vite.config.ts` | Configures the `/api` proxy to route to Node.js backend |
| `frontend/src/index.css` | Global Tailwind directives and base styles |

---

### What Each Feature Does — Detailed

---

#### **1. Interview Flow Orchestration**

`InterviewPage.tsx` is the brain of the frontend. It maintains the state of the interview: `mode` (upload vs interview vs feedback). It takes data from the first step (resume text) and passes it as props to the next step.

**"Ye file event manager jaisi hai. Pehle user ko FileUpload dikhata hai. Waha se data milne ke baad screen switch karke InterviewChat render karta hai. Ye sab bina page reload kiye React states se manage hota hai."**

#### **2. File Upload & Face Registration UI**

`FileUpload.jsx` handles collecting the user's Resume (PDF) and a Reference Photo. It shows a preview of the selected image and sends the file to the backend `/api/upload-resume`.

**"Is component me HTML file inputs hain. Jab user resume upload karta hai, main FormData object banati hu aur backend ko bheji hu parse karne ke liye. Photo bhi yahin upload hoti hai initial registration ke liye."**

#### **3. Live Interview UI & Hardware Access**

`InterviewChat.jsx` renders the chat history and the Push-to-Talk microphone button. It relies on the browser's `navigator.mediaDevices.getUserMedia()` to strictly enforce that the user has a working mic before proceeding.

**"Ye platform jab tak mic ka access nahi milta, interview start nahi karne deta. Maine interface me SiriWave visualizer bhi dikhaya hai jab AI bolta hai, taaki user ko lage wo actual human/system se baat kar raha hai."**

#### **4. Vite Proxy Setup**

`vite.config.ts` solves a huge headache in web dev: CORS errors. By configuring `target: 'http://localhost:3000'` for `/api`, the frontend tricks the browser into thinking the backend is on the same port.

**"Frontend 5173 pe chal raha hai aur backend 3000 pe. Direct request bhejne pe CORS error aayega. Vite proxy lagane se React request `/api/...` ko locally karta hai aur Vite use aage route paas kar deta hai."**

---

### How to Test

| What to test | How | Expected |
|-------------|-----|----------|
| **CORS / API Routing** | Check the Network tab on Upload | Request goes to `/api/upload-resume` and succeeds with 200 OK |
| **Mic Permission** | Click Start Interview | Browser specifically prompts "Allow Microphone access?" |
| **UI State Switching** | Upload an arbitrary PDF and submit | Screen instantaneously changes from Upload layout to Interview layout without reloading |

---

### _When the Mentor Asks: "Ritika, tumne kya kiya?"_

> "Sir/Ma'am, maine W.I.S.E. ka **poora Frontend Architecture aur UI Engine** develop kiya hai. Ye ek modern Single Page Application hai jo **React 19, Vite aur Tailwind CSS v4** pe bani hai.
>
> Mera main task tha browser me heavy media handle karna aur user interface ko intuitive rakhna. Maine **`navigator.mediaDevices` API** integrate ki taaki hum user ki webcam aur microphone stream seamlessly capture karein backend ke bina server pe load dale.
> 
> Maine **`InterviewPage.tsx`** me ek state-machine jaisi architecture likhi hai jo user ko dynamically Resume Upload stage se, Hardware Calibration me, aur aakhiri me Live Interview Chat me le jaati hai bina page reload kiye. Iske alawa, frontend aur backend ke beech CORS errors avoid karne ke liye maine **Vite proxy** setup config ki hai taaki saari API calls securely route ho jayein."
