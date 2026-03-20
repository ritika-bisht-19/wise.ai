# W.I.S.E. — Work Interview Stress Evaluator

> AI-powered mock interview platform with real-time facial behavioral analysis, voice AI, and identity verification.

---

## what this is

W.I.S.E. runs a full end-to-end mock technical interview in the browser. You upload your resume and a photo of your face, then get asked progressively harder questions by an AI interviewer with a real TTS voice. The webcam watches you the whole time — tracking stress, blink rate, gaze direction, head movement — and at the end you get a detailed hiring committee-style report. If the face on the webcam doesn't match the registered photo, the interview stops.

---

## services at a glance

| service | stack | port | what it does |
|---|---|---|---|
| **frontend** | React 19 + Vite 8 + TypeScript + Tailwind v4 | `5173` | UI — interview, camera, calibration |
| **backend api** | Node.js + Express | `3000` | resume parse, chat, TTS, transcribe, feedback |
| **face api** | Python 3 + FastAPI | `8001` | register face encoding, verify identity |

frontend proxies all `/api/*` requests to `localhost:3000` via Vite config — so the app just calls `/api/...` everywhere.

the face api at `localhost:8001` is called directly from the browser (CORS open).

---

## repo structure

```
wise.ai/
│
├── frontend/                          # React SPA
│   ├── src/
│   │   ├── pages/
│   │   │   ├── InterviewPage.tsx      # orchestrates upload → interview → feedback stages
│   │   │   ├── HomePage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── FeaturesPage.tsx
│   │   │   ├── HowItWorksPage.tsx
│   │   │   ├── PricingPage.tsx
│   │   │   ├── BlogPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── features/interview/
│   │   │   ├── FileUpload.jsx         # step 1: PDF resume + face photo upload
│   │   │   ├── InterviewChat.jsx      # step 2: live interview (mic, TTS, chat, identity check)
│   │   │   ├── CameraPanel.jsx        # webcam + MediaPipe FaceMesh + identity verification
│   │   │   └── FeedbackReport.jsx     # step 3: post-interview score report
│   │   ├── components/                # marketing site components (Navbar, Hero, sections...)
│   │   ├── router/                    # react-router-dom routes
│   │   ├── index.css                  # global styles + Tailwind
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   ├── assets/images/             # hero-gradient.svg, motif.svg, etc.
│   │   ├── models/face-api/           # face-api.js model weights (tinyFaceDetector + expressions)
│   │   ├── right left.webm            # calibration animation
│   │   └── risinghand.webm            # calibration animation
│   ├── vite.config.ts                 # proxy /api → localhost:3000
│   └── package.json
│
├── backend/                           # Node.js API
│   ├── src/
│   │   ├── app.js                     # express entry point, mounts all routes
│   │   └── routes/
│   │       ├── resume.js              # POST /api/upload-resume
│   │       ├── chat.js                # POST /api/chat
│   │       ├── speak.js               # POST /api/speak
│   │       ├── transcribe.js          # POST /api/transcribe
│   │       └── feedback.js            # POST /api/feedback
│   ├── .env                           # API keys (see env vars section below)
│   └── package.json
│
├── ai-services/
│   └── face_api/
│       ├── main.py                    # FastAPI — /api/register-face + /api/verify-face
│       └── requirements.txt
│
└── face_recognition-master/           # vendored ageitgey/face_recognition source (reference only)
```

---

## setup — run locally

### preferred clone location (recommended)

use a simple path with no spaces:

- macOS: `~/dev/wise-ai`
- Windows: `C:\dev\wise-ai`

example clone commands:

```bash
# macOS / Linux
mkdir -p ~/dev
cd ~/dev
git clone https://github.com/ritika-bisht-19/wise.ai.git
cd wise.ai
```

```powershell
# Windows PowerShell
mkdir C:\dev -Force
cd C:\dev
git clone https://github.com/ritika-bisht-19/wise.ai.git
cd .\wise.ai
```

### quick start (one command)

from repo root:

```bash
# macOS
./run-mac.sh
```

```bat
:: Windows (Command Prompt)
run-windows.bat
```

these scripts bootstrap dependencies (if missing) and start all 3 services:
- frontend: http://localhost:5173
- backend: http://localhost:3000
- face api: http://localhost:8001

### manual start (without `.bat` / `.sh`)

run these in 3 separate terminals after cloning.

#### macOS

terminal 1 — frontend

```bash
cd ~/dev/wise-ai/frontend
npm install
npm run dev
```

terminal 2 — backend

```bash
cd ~/dev/wise-ai/backend
npm install
node src/app.js
```

terminal 3 — face api

```bash
cd ~/dev/wise-ai/ai-services/face_api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 main.py
```

#### windows (powershell)

terminal 1 — frontend

```powershell
cd C:\dev\wise-ai\frontend
npm install
npm run dev
```

terminal 2 — backend

```powershell
cd C:\dev\wise-ai\backend
npm install
node src/app.js
```

terminal 3 — face api

```powershell
cd C:\dev\wise-ai\ai-services\face_api
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
py main.py
```

app urls:
- frontend: http://localhost:5173
- backend: http://localhost:3000
- face api: http://localhost:8001

### 1. frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

requires node 18+. vite dev server hot-reloads on save.

### 2. backend api

```bash
cd backend
npm install
node src/app.js
# → http://localhost:3000
```

create `backend/.env` with:
```
GROQ_API_KEY=your_groq_key
ELEVENLABS_API_KEY=your_elevenlabs_key
OPENAI_API_KEY=                        # optional, unused right now
DISCORD_WEBHOOK_URL=                   # optional, logs new resumes to discord
```

### 3. face api (python)

```bash
cd ai-services/face_api
pip3 install face_recognition opencv-python fastapi uvicorn python-multipart
python3 main.py
# → http://localhost:8001
```

> `face_recognition` depends on `dlib` which compiles from source — can take a few minutes on first install. needs cmake and a C++ compiler.

> **note**: face encodings are stored in memory only. if the process restarts, the registered face is lost and the user needs to register again.

---

## api reference

### backend (node — port 3000)

all routes proxied from frontend via `/api/...`

#### `POST /api/upload-resume`
- **body**: `multipart/form-data` with `resume` (PDF file)
- **returns**: `{ text: string }` — extracted text from PDF
- optionally posts to Discord webhook if `DISCORD_WEBHOOK_URL` is set

#### `POST /api/chat`
- **body**: `{ history: Message[], resumeText: string, message: string }`
- **returns**: `{ reply: string }` — next AI interviewer message
- uses `llama-3.1-8b-instant` via [Groq](https://console.groq.com)
- interview has 5 stages: INTRODUCTION → EXPERIENCE → SKILLS → ACHIEVEMENTS → GENERAL/SYSTEM DESIGN, keyed by turn count (0–12 turns)

#### `POST /api/speak`
- **body**: `{ text: string, voiceKey: 'adam'|'rachel'|'bella'|'antoni' }`
- **returns**: `audio/mpeg` binary (ElevenLabs TTS)
- uses `eleven_flash_v2_5` model via [ElevenLabs](https://elevenlabs.io)
- text is capped at 500 chars before sending

voice → ElevenLabs voice ID map:
| key | voice | ElevenLabs ID |
|---|---|---|
| adam | Adam | pNInz6obpgDQGcFmaJgB |
| rachel | Rachel | 21m00Tcm4TlvDq8ikWAM |
| bella | Bella | EXAVITQu4vr4xnSDxMaL |
| antoni | Antoni | ErXwobaYiN019PkySvjV |

#### `POST /api/transcribe`
- **body**: `multipart/form-data` with `audio` (WAV blob)
- **returns**: `{ text: string }` — speech-to-text transcript
- uses `whisper-large-v3` via [Groq](https://console.groq.com)

#### `POST /api/feedback`
- **body**: `{ history: Message[], resumeText: string }`
- **returns**: structured JSON report (see below)
- uses `llama-3.1-8b-instant` via Groq with `response_format: json_object`

feedback JSON shape:
```json
{
  "overall_score": 0-100,
  "detailed_metrics": {
    "technical_depth": 0-100,
    "communication_clarity": 0-100,
    "problem_solving": 0-100,
    "experience_relevance": 0-100
  },
  "section_analysis": {
    "experience": "string",
    "technical_skills": "string",
    "achievements": "string"
  },
  "strengths": ["string"],
  "areas_for_improvement": ["string"],
  "critical_missing_points": "string",
  "hiring_verdict": "Strong Hire | Hire | Leaning No | No Hire",
  "summary": "string"
}
```

---

### face api (python fastapi — port 8001)

direct browser → python calls (not proxied through node)

#### `POST /api/register-face`
- **body**: `multipart/form-data` with `file` (image — jpg/png)
- **returns**: `{ status: "success", message: "Face registered." }`
- extracts 128-dim face encoding using `face_recognition` (dlib under the hood)
- stores as `registered_encodings["default"]` in memory
- called once during `FileUpload.jsx` step 2 when user uploads their photo

#### `POST /api/verify-face`
- **body**: `multipart/form-data` with `file` (JPEG frame from webcam)
- **returns**: `{ match: bool, status: "match"|"mismatch"|"no_face_detected", distance: float }`
- compares current frame against registered encoding
- threshold: `distance < 0.5` → match (lower = stricter)
- called every 2 seconds from `CameraPanel.jsx` during live interview

---

## features

### interview flow

```
FileUpload (step 1 + 2)
  → upload PDF resume          [/api/upload-resume]
  → enter target role + type   [technical / behavioral]
  → paste job description      [optional]
  → upload face photo          [/api/register-face → face_api:8001]

InterviewChat — join screen
  → select AI voice            [adam / rachel / bella / antoni]
  → click "Start Interview"

InterviewChat — calibration screen
  → turn head left             [MediaPipe FaceMesh yaw > +12°]
  → turn head right            [yaw < -12°]
  → show palm                  [MediaPipe Hands — 5 finger landmarks]
  → skip button available for debug

InterviewChat — live interview (10 min timer, 12 turns)
  → AI asks question           [/api/chat → Groq LLaMA]
  → AI speaks question         [/api/speak → ElevenLabs → SiriWave iOS9 visualizer]
  → user clicks mic → speaks   [MediaRecorder WAV]
  → audio transcribed          [/api/transcribe → whisper-large-v3]
  → response sent back         [/api/chat]
  → loop

FeedbackReport
  → generated on interview end [/api/feedback → Groq LLaMA JSON]
  → shows score, verdict, strengths, areas to improve
```

### real-time behavioral analysis (CameraPanel.jsx)

runs entirely in the browser via [MediaPipe FaceMesh](https://google.github.io/mediapipe/solutions/face_mesh) (468 landmarks) — no server involved.

| metric | method | what it detects |
|---|---|---|
| **eyebrow raise** | landmark distance brow→eye | surprise / stress |
| **lip tension** | mouth width/height ratio | nervousness |
| **head nod** | nose Y delta frame-to-frame | anxiety / agreement |
| **facial symmetry** | cheek-to-nose distance delta | stress asymmetry |
| **blink rate** | eye aspect ratio (EAR < 0.23) | cognitive load |
| **upward gaze rate** | pupil centroid vertical ratio | reading from notes |
| **head turn rate** | yaw estimation (nose vs eye midpoint) | avoidance behavior |
| **smile score** | face-api.js expression model + landmark fallback | confidence |

combined into a stress score (0–1.5) → classified as `calm / mild / high` with hysteresis to prevent UI flicker. fires `onStressUpdate` callback every 120ms.

also detects **multiple faces** (warns if someone else is visible) and plays subtle haptic audio tones when face tracking is lost.

### identity verification

```
[register]  user photo → face_recognition.face_encodings() → stored in memory

[verify]    every 2s during interview:
              video frame → half-res JPEG → POST /api/verify-face
              face_distance([registered], current) → match if < 0.5
              result → handleIdentityCheck in InterviewChat

[outcome]   match    → green "Verified" badge, clears warning banner
            mismatch → amber banner "Mismatch (N/3 total)", fail counter increments
                       (counter is cumulative — never resets on a match, gaming-proof)
            3 total mismatches → red banner "stopping..." → onEnd() after 2.5s
            no_face_detected → status shown but NOT counted as a failure
```

### calibration

before every interview, 3 checks are run:
1. **head left** — yaw > +12° (confirms face tracking range)
2. **head right** — yaw < -12° (confirms opposite range)
3. **open palm** — MediaPipe Hands detects wrist + 5 finger tips with visibility > 0.5 and fingers pointing up (confirms camera can track gesture blocking)

plays success audio chime (C5 → E5) on each step completion.

---

## key external dependencies

| service | used for | docs |
|---|---|---|
| [Groq](https://console.groq.com/docs/openai) | LLaMA chat + Whisper transcribe | groq.com |
| [ElevenLabs](https://docs.elevenlabs.io/api-reference/text-to-speech) | TTS voice synthesis | elevenlabs.io/docs |
| [MediaPipe FaceMesh](https://google.github.io/mediapipe/solutions/face_mesh) | browser face tracking | CDN loaded at runtime |
| [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands) | palm detection (calibration) | CDN loaded at runtime |
| [face-api.js](https://github.com/justadudewhohacks/face-api.js) | smile/expression detection | models in `/public/models/face-api/` |
| [ageitgey/face_recognition](https://github.com/ageitgey/face_recognition) | face encoding + comparison | python lib |
| [SiriWave](https://github.com/kopiro/siriwave) | TTS audio visualizer | loaded via CDN script tag |
| [framer-motion](https://www.framer.com/motion/) | calibration screen animations | npm |

---

## env vars (backend/.env)

```bash
GROQ_API_KEY=gsk_...          # required — chat + transcribe
ELEVENLABS_API_KEY=sk_...     # required — TTS
OPENAI_API_KEY=               # optional — not used currently
DISCORD_WEBHOOK_URL=          # optional — posts new resumes to a discord channel
```

---

## notes for llm context

- the app has **3 runtime services** that must all be running: frontend (5173), backend (3000), face api (8001)
- frontend talks to backend via `/api/*` (vite proxy). frontend talks to face api directly via `http://localhost:8001`
- `CameraPanel.jsx` is the heaviest file — it manages MediaPipe FaceMesh, MediaPipe Hands (calibration), face-api.js (smile), pupil centroid detection, and the identity verification polling all in one useEffect
- `InterviewChat.jsx` has 3 conditional render branches: join screen / calibration screen / live interview. calibration uses `isCalibrating && !joined`, live uses `joined`
- interview turn count is computed as `Math.floor(history.length / 2)` in the backend — each turn is 1 user + 1 ai message
- the interview ends naturally when turn 12 is hit (backend returns "concludes our interview" text), or when identity fails 3 times, or when the 10-minute timer hits 0
- face encodings are in-memory only in the python service — resetting the server loses the registered face
- `face_recognition-master/` is not used at runtime, it's the vendored source of the pip package for reference
- the `InterviewPage.tsx` passes a plain `resumeText` string to `InterviewChat` but `FileUpload` also collects `role`, `jobDescription`, and `interviewType` — these are not currently forwarded to the backend chat route (potential enhancement)
