# W.I.S.E. -- Webcam Intelligence for Simulated Evaluations

An AI-powered mock interview platform that combines real-time facial behavior analysis, speech intelligence, and adaptive questioning to simulate high-pressure technical interviews used at top-tier companies. Built as a full-stack application with a React frontend, Node.js API layer, and Python speech processing service.

**Live Interview Flow:**

```
Upload Resume (PDF)
      |
      v
AI parses skills, projects, achievements
      |
      v
12-turn technical interview begins
      |
      v
Real-time facial + speech analysis runs in parallel
      |
      v
Behavioral Stability Index computed per frame
      |
      v
Post-interview feedback report generated
```

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Feature Reference](#feature-reference)
  - [1. Interview Simulation Engine](#1-interview-simulation-engine)
  - [2. Resume Intelligence](#2-resume-intelligence)
  - [3. Speech Analysis](#3-speech-analysis)
  - [4. Facial Behavior Analysis](#4-facial-behavior-analysis)
  - [5. Behavioral Stability Index (BSI) -- Stress Detection](#5-behavioral-stability-index-bsi----stress-detection)
  - [6. Adaptive Interview Pressure System](#6-adaptive-interview-pressure-system)
  - [7. Real-Time Analytics Dashboard](#7-real-time-analytics-dashboard)
  - [8. Interview Session Report](#8-interview-session-report)
  - [9. Session Replay](#9-session-replay)
  - [10. Progress Tracking](#10-progress-tracking)
  - [11. Recommendation Engine](#11-recommendation-engine)
  - [12. Advanced Features](#12-advanced-features)
- [Question Bank -- Company Interview Patterns](#question-bank----company-interview-patterns)
- [API Reference](#api-reference)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Implementation Status](#implementation-status)
- [License](#license)

---

## Architecture Overview

```
+------------------+         +------------------+         +------------------+
|                  |  HTTP   |                  |  HTTP   |                  |
|  React Client   |-------->|  Node.js API     |-------->|  Groq LLM        |
|  (Vite + TS)    |<--------|  (Express)       |<--------|  (LLaMA 3.1)     |
|                  |         |                  |         |                  |
+------------------+         +------------------+         +------------------+
        |                            |
        |  WebRTC / MediaPipe        |  Whisper API
        v                            v
+------------------+         +------------------+
|                  |         |                  |
|  Camera/Mic      |         |  Speech API      |
|  (Browser APIs)  |         |  (FastAPI +      |
|                  |         |   Whisper)        |
+------------------+         +------------------+
        |
        v
+------------------+
|                  |
|  MediaPipe       |
|  FaceMesh +      |
|  face-api.js     |
|                  |
+------------------+
```

The system runs three concurrent analysis pipelines during an interview:

1. **Chat pipeline** -- Resume context + conversation history sent to Groq LLaMA 3.1 for question generation
2. **Speech pipeline** -- Audio captured via MediaRecorder, transcribed by Groq Whisper, metrics computed (speech rate, filler density, pauses, quantification)
3. **Vision pipeline** -- Camera frames processed by MediaPipe FaceMesh (468-point landmarks) and face-api.js (expression detection) entirely in the browser

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | UI framework |
| Build Tool | [Vite 8](https://vite.dev/) | Development server and bundler |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS |
| Routing | [React Router 7](https://reactrouter.com/) | Client-side navigation |
| Icons | [Lucide React](https://lucide.dev/) | Icon library |
| API Server | [Express 4](https://expressjs.com/) | REST API layer |
| LLM | [Groq SDK](https://console.groq.com/) + LLaMA 3.1 8B | Interview question generation, feedback, transcription |
| TTS | [ElevenLabs API](https://elevenlabs.io/) | AI voice responses |
| Resume Parsing | [pdf-parse](https://www.npmjs.com/package/pdf-parse) | PDF text extraction |
| Face Tracking | [MediaPipe FaceMesh](https://ai.google.dev/edge/mediapipe/solutions/vision/face_mesh) | 468-point facial landmark detection |
| Expression Detection | [face-api.js](https://github.com/justadudewhohacks/face-api.js) | Facial expression classification |
| Speech Processing | [FastAPI](https://fastapi.tiangolo.com/) + [OpenAI Whisper](https://github.com/openai/whisper) | Local speech-to-text and metrics |

---

## Project Structure

```
W.I.S.E/
|-- api/                          # Node.js Express API server
|   |-- index.js                  # Server entry point, route mounting
|   |-- routes/
|       |-- chat.js               # LLM-powered interview conversation
|       |-- feedback.js           # Post-interview evaluation report
|       |-- resume.js             # PDF upload and text extraction
|       |-- speak.js              # ElevenLabs text-to-speech proxy
|       |-- transcribe.js         # Groq Whisper audio transcription
|
|-- client/                       # React frontend application
|   |-- index.html                # HTML entry point with MediaPipe scripts
|   |-- vite.config.ts            # Vite configuration with API proxy
|   |-- public/
|   |   |-- face-api.min.js       # face-api.js library (loaded globally)
|   |   |-- models/face-api/      # Pre-trained face detection models
|   |-- src/
|       |-- App.tsx               # Root component
|       |-- router/index.tsx      # Route definitions
|       |-- views/
|       |   |-- interview/
|       |   |   |-- CameraPanel.jsx      # Real-time facial analysis component
|       |   |   |-- FeedbackReport.jsx   # Post-interview results display
|       |   |   |-- FileUpload.jsx       # Resume upload with drag-and-drop
|       |   |   |-- InterviewChat.jsx    # Chat interface + audio recording
|       |   |-- layouts/
|       |   |   |-- AppLayout.tsx        # Navbar + Footer wrapper
|       |   |-- pages/
|       |   |   |-- InterviewPage.tsx    # Full-screen interview orchestrator
|       |   |   |-- HomePage.tsx         # Landing page
|       |   |   |-- FeaturesPage.tsx     # Feature showcase
|       |   |   |-- AboutPage.tsx        # About the project
|       |   |   |-- ...                  # Additional marketing pages
|       |   |-- sections/               # Reusable landing page sections
|       |-- controllers/                # Custom React hooks
|       |-- models/                     # Static data and type definitions
|
|-- speech_api/                   # Python FastAPI speech analysis service
|   |-- main.py                   # Whisper transcription + speech metrics
|   |-- requirements.txt          # Python dependencies
|
|-- package.json                  # Root package (API dependencies)
```

---

## Feature Reference

### 1. Interview Simulation Engine

**Status: Implemented**

The core interview loop that manages a 12-turn structured technical interview.

**Interview Session Flow:**

- Resume upload triggers session initialization
- 10-minute countdown timer starts on join
- AI asks questions, candidate responds via microphone
- AI voice reads each question aloud via ElevenLabs TTS
- Session ends after 12 turns or when the timer expires

**Question Engine -- Stage Roadmap:**

The interview follows a structured 5-stage progression:

| Turn | Stage | Goal |
|------|-------|------|
| 0 | Introduction | Welcome, ask for candidate intro and core tech stack |
| 1--3 | Experience | Deep-dive into specific resume projects, implementation details, trade-offs |
| 4--6 | Technical Skills | Internal workings of listed technologies (React, Node, SQL, etc.) |
| 7--9 | Achievements | Specific ranks, awards, hackathon wins, hardest technical hurdles |
| 10--11 | General / System Design | Behavioral questions or system design related to background |

**Resume-Based Question Generation:**

Questions are not generic. The LLM receives the full extracted resume text as context and is instructed to reference specific company names, project names, and skill names found in the resume. The system prompt enforces:

- No repeated topics across turns
- Specific nouns from the resume must be mentioned
- Questions kept under 2 sentences
- No meta-talk ("Moving to the next stage...")

**Source:** [api/routes/chat.js](api/routes/chat.js) | [client/src/views/interview/InterviewChat.jsx](client/src/views/interview/InterviewChat.jsx)

---

### 2. Resume Intelligence

**Status: Implemented (PDF parsing + LLM context injection)**

The resume module extracts raw text from uploaded PDF files and passes it as context to the LLM for question generation and feedback evaluation.

**Implemented Features:**

- PDF upload with drag-and-drop support
- Text extraction via pdf-parse
- Full resume text injected into every LLM prompt as context
- Resume context used in both question generation and post-interview feedback

**Extracted Information Used by the LLM:**

The LLM is prompted to identify and reference:

```
Skills:           React, Node.js, Python, SQL, etc.
Technologies:     MongoDB, Docker, AWS, Kubernetes, etc.
Projects:         Named projects with implementation details
Achievements:     Ranks, awards, hackathon wins, quantified claims
Roles:            Job titles, companies, durations
```

**Planned Enhancements (Not Yet Implemented):**

- Structured skill extraction using spaCy NLP
- Technology stack detection and categorization
- Project scope and impact scoring
- Weak signal detection (gaps, vague claims, missing quantification)
- DOCX format support

**Source:** [api/routes/resume.js](api/routes/resume.js) | [client/src/views/interview/FileUpload.jsx](client/src/views/interview/FileUpload.jsx)

---

### 3. Speech Analysis

**Status: Partially Implemented**

Two speech processing paths exist. The Node.js API uses Groq's hosted Whisper for transcription during interviews. The Python FastAPI service provides deeper speech metrics.

**Implemented -- Groq Whisper Transcription (used in live interviews):**

- Audio captured via MediaRecorder API in the browser
- Sent to `/api/transcribe` as WAV
- Transcribed by Groq Whisper Large V3
- Transcript text sent to chat endpoint for AI response

**Implemented -- Python Speech Metrics (standalone analysis service):**

| Metric | Description | How It Works |
|--------|-------------|--------------|
| Speech Rate | Words per minute | `total_words / (duration / 60)` |
| Pause Detection | Gaps between speech segments | Segments with > 100ms gap flagged |
| Average Pause | Mean pause duration | Sum of pauses / count |
| Maximum Pause | Longest single pause | Longest gap between segments |
| Filler Word Density | Percentage of filler words | Count of "um", "uh", "like", "you know", "basically", "actually" / total words |
| Quantification Ratio | Fraction of sentences with numbers | Sentences containing digits or keywords like "percent", "metric" / total sentences |

**Planned Enhancements (Not Yet Implemented):**

- Confidence phrase detection ("I implemented", "I built", "I designed")
- Speech clarity scoring
- Answer structure analysis (STAR method detection)
- Real-time speech rate graph during interview
- Voice tone and pitch analysis
- Integration of Python speech metrics into the live interview pipeline

**Source:** [api/routes/transcribe.js](api/routes/transcribe.js) | [speech_api/main.py](speech_api/main.py)

---

### 4. Facial Behavior Analysis

**Status: Implemented**

This is the core differentiator of W.I.S.E. The CameraPanel component runs MediaPipe FaceMesh and face-api.js in the browser to compute behavioral metrics from 468 facial landmarks every frame.

**Eye Behavior:**

| Metric | Method | Implementation |
|--------|--------|----------------|
| Blink Rate | Eye Aspect Ratio (EAR) threshold | Vertical eye distance / horizontal eye distance; blink counted when EAR drops below threshold |
| Eye Contact Score | Pupil vertical ratio | GazeTracking-style pupil centroid detection -- crops eye region, finds darkest pixel cluster, computes vertical position (0 = top, 1 = bottom) |
| Gaze Direction | Pupil position analysis | Ratio of pupil position within eye bounding box |
| Upward Gaze Rate | Pupil ratio < 0.35 events per minute | Tracks frequency of looking away from screen |

**Head Behavior:**

| Metric | Method | Implementation |
|--------|--------|----------------|
| Head Nod Intensity | Nose Y-axis displacement | Frame-to-frame vertical movement of nose landmark, normalized by face height |
| Head Yaw (Turn) | Nose-to-eye-center offset | Port of HeadPoseEstimation solvePnP logic: nose X deviation from eye midpoint, normalized by face width, scaled to approximate degrees |
| Head Turn Rate | Yaw > 15 degree events per minute | Tracks frequency of looking away (gaze avoidance) |

**Facial Expressions:**

| Metric | Method | Implementation |
|--------|--------|----------------|
| Eyebrow Raise | Brow-to-eye distance | Average distance from brow landmarks to eye-top landmarks |
| Lip Tension | Mouth width-to-height ratio | `mouth_width / mouth_height`; high ratio indicates compressed/tense lips |
| Smile Detection | face-api.js expression model | `happy` expression probability from pre-trained neural network |
| Smile Frequency | Smile events over time | Tracked via expression check intervals |
| Facial Symmetry | Left-right facial distance delta | `abs(nose_to_left_cheek - nose_to_right_cheek) / face_width` |

**Landmark Indices Used (MediaPipe FaceMesh 468-point topology):**

```
Left Eye:     top=159, bottom=145, left=33, right=133
Right Eye:    top=386, bottom=374, left=362, right=263
Left Brow:    55, 107, 46
Right Brow:   285, 336, 276
Mouth:        left=61, right=291, top_lip=13, bottom_lip=14
Reference:    nose=1, chin=152, left_cheek=234, right_cheek=454
```

**Source:** [client/src/views/interview/CameraPanel.jsx](client/src/views/interview/CameraPanel.jsx)

---

### 5. Behavioral Stability Index (BSI) -- Stress Detection

**Status: Implemented**

The BSI is a composite score computed from speech and behavioral signals. It is the primary stress indicator in W.I.S.E.

**Formula:**

```
BSI = w1 * eyebrow_tension
    + w2 * lip_tension
    + w3 * head_nod_intensity
    + w4 * asymmetry_delta
    + w5 * blink_rate_deviation
    + w6 * upward_gaze_rate
    + w7 * head_turn_rate
    + w8 * (1 - smile_score)
```

Each component is normalized to a 0--100 scale before weighting.

**Score Interpretation:**

| BSI Range | Level | Color | Meaning |
|-----------|-------|-------|---------|
| 0--30 | Calm | Green | Stable, composed behavior |
| 31--50 | Mild | Amber | Moderate pressure detected |
| 51--100 | High | Red | Significant stress indicators |

The BSI updates in real-time and is displayed as a color-coded badge in the camera panel. The score is also passed to the chat component for potential adaptive behavior.

**Planned Enhancements (Not Yet Implemented):**

- Expanded BSI formula incorporating speech metrics:
  ```
  BSI = 0.20 * pause_deviation
      + 0.20 * filler_density
      + 0.15 * blink_deviation
      + 0.15 * head_movement
      + 0.15 * eye_contact_loss
      + 0.15 * speech_variance
  ```
- BSI history graph showing stress trajectory over interview duration
- Stress gauge meter visualization (react-d3-speedometer)
- Per-question BSI breakdown in the feedback report

**Source:** [client/src/views/interview/CameraPanel.jsx](client/src/views/interview/CameraPanel.jsx)

---

### 6. Adaptive Interview Pressure System

**Status: Partially Implemented**

The interview currently follows a fixed stage progression. The adaptive pressure system adjusts difficulty and tone based on candidate performance.

**Implemented:**

- Stage-based difficulty progression (introduction to system design)
- Interview concludes automatically after 12 turns
- The LLM is prompted to ask follow-up questions based on answer quality

**Planned Enhancements (Not Yet Implemented):**

| Trigger | System Response |
|---------|----------------|
| Vague or short answer | Follow-up: "Can you be more specific about the implementation?" |
| No metrics cited | Follow-up: "Can you quantify the impact of that change?" |
| High BSI (stress > 70) | Slower pacing, supportive prompts, easier questions |
| Low BSI (performing well) | Harder questions, system design problems, edge cases |
| Consistently strong answers | Skip to advanced topics early |

---

### 7. Real-Time Analytics Dashboard

**Status: Partially Implemented**

The CameraPanel displays live behavioral metrics during the interview.

**Currently Displayed:**

- Stress level badge (Calm / Mild / High) with color coding
- Face detected indicator
- Live facial mesh overlay on video
- Individual metric values (eyebrow, lip tension, nod, symmetry, blink rate, gaze, head turn, smile)

**Planned Enhancements (Not Yet Implemented):**

- Speech rate line chart (Recharts)
- Blink rate graph over time
- BSI gauge meter (react-d3-speedometer)
- Radar chart for skill distribution
- Expression timeline
- Side-by-side comparison of metrics across questions

---

### 8. Interview Session Report

**Status: Implemented**

After the interview ends, the full conversation history is sent to the Groq LLM, which acts as a "Google Hiring Committee" to evaluate the candidate.

**Report Contents:**

| Section | Description |
|---------|-------------|
| Overall Score | 0--100 numeric score |
| Hiring Verdict | Strong Hire / Hire / Lean Hire / Lean No Hire / No Hire |
| Technical Depth | 0--100 score for depth of technical knowledge |
| Communication Clarity | 0--100 score for how clearly ideas were expressed |
| Problem Solving | 0--100 score for analytical approach |
| Experience Relevance | 0--100 score for match between resume and answers |
| Section Analysis | Detailed review of Experience, Technical Skills, and Achievements stages |
| Strengths | List of specific strengths observed |
| Areas for Improvement | List of specific weaknesses identified |
| Critical Missing Points | Technical details the candidate failed to explain |
| Summary | 3--4 sentence professional assessment |

The report is displayed with progress bars, color-coded verdict badges, and organized strength/weakness cards.

**Planned Enhancements (Not Yet Implemented):**

- Behavioral metrics (BSI, blink rate, eye contact) included in the report
- Speech metrics (filler density, pause patterns) included in the report
- Downloadable PDF report
- Shareable report link

**Source:** [api/routes/feedback.js](api/routes/feedback.js) | [client/src/views/interview/FeedbackReport.jsx](client/src/views/interview/FeedbackReport.jsx)

---

### 9. Session Replay

**Status: Not Yet Implemented**

Allow candidates to replay their interview with synchronized video, transcript, and behavioral metrics.

**Planned Components:**

- Video recording of the interview session (MediaRecorder API)
- Synchronized transcript with timestamps
- Behavioral metrics timeline overlay
- Clickable timestamps to jump to specific moments
- BSI markers at high-stress moments

**Example:**

```
[00:00]  AI: "Tell me about your experience with React."
[00:05]  Candidate: "I have been working with React for..."
         -- BSI: 28 (Calm) | Blink Rate: 16/min | Eye Contact: 85%
[01:20]  -- Pause detected (2.3s)
         -- BSI spike: 52 (High)
[01:23]  Candidate: "...um, basically the architecture was..."
         -- Filler words detected: "um", "basically"
```

---

### 10. Progress Tracking

**Status: Not Yet Implemented**

Track improvement across multiple interview sessions.

**Planned Features:**

- Session history with date, score, and verdict
- BSI trend across sessions
- Metric comparison charts
- Improvement rate calculation

**Example:**

```
Session 1:  BSI: 62  |  Score: 54  |  Verdict: Lean No Hire
Session 2:  BSI: 48  |  Score: 67  |  Verdict: Lean Hire
Session 3:  BSI: 35  |  Score: 78  |  Verdict: Hire
```

---

### 11. Recommendation Engine

**Status: Not Yet Implemented**

Personalized improvement suggestions based on interview performance patterns.

**Planned Recommendations:**

| Detected Issue | Recommendation |
|---------------|----------------|
| High filler word density (> 5%) | "Practice pausing instead of using filler words. Record yourself answering questions and count fillers." |
| Low quantification ratio (< 0.1) | "Prepare metrics for every project: latency reduction, user growth, cost savings, test coverage." |
| Poor eye contact (< 60%) | "Place your webcam at eye level. Practice looking at the camera lens, not the screen." |
| High BSI under pressure (> 60) | "Practice mock interviews with a timer. Familiarity with the format reduces anxiety." |
| Weak technical depth scores | "Review internal workings of your listed technologies. For React: reconciliation, fiber, hooks rules." |

---

### 12. Advanced Features

**Status: Not Yet Implemented**

Future enhancements beyond the core interview platform:

- **Multi-language interviews** -- Support for interviews in Hindi, Spanish, Mandarin, and other languages
- **Panel interview simulation** -- Multiple AI interviewers with different personalities and focus areas
- **Voice tone analysis** -- Pitch, speaking pace variation, confidence scoring from audio features
- **Industry-specific question banks** -- Specialized questions for healthcare, finance, legal, and other domains
- **Peer feedback mode** -- Allow peers to review recorded interviews and leave comments
- **Company-specific interview modes** -- Simulate interview styles of specific companies (see below)

---

## Question Bank -- Company Interview Patterns

W.I.S.E. generates questions based on real interview patterns from major technology companies. The LLM is prompted with company-specific interview structures and evaluation criteria.

### FAANG / Big Tech Interview Patterns

**Google:**

| Round | Focus | Example Questions |
|-------|-------|-------------------|
| Phone Screen | Data Structures, Algorithms | "Given a binary tree, find the lowest common ancestor of two nodes." |
| Onsite 1 | Coding | "Design an algorithm to find the k-th largest element in a stream." |
| Onsite 2 | System Design | "Design Google Docs collaborative editing." |
| Onsite 3 | Behavioral (Googleyness) | "Tell me about a time you had to make a decision with incomplete information." |

**Amazon (Leadership Principles):**

| Principle | Example Question |
|-----------|-----------------|
| Customer Obsession | "Describe a time you went above and beyond for a customer or end-user." |
| Ownership | "Tell me about a time you took on something outside your area of responsibility." |
| Dive Deep | "Give an example where you had to dig into data to find the root cause of a problem." |
| Bias for Action | "Describe a situation where you had to make a quick decision without all the data." |
| Invent and Simplify | "Tell me about a time you found a simple solution to a complex problem." |

**Meta (Facebook):**

| Round | Focus | Example Questions |
|-------|-------|-------------------|
| Coding 1 | Arrays, Strings, Trees | "Given an array of meeting intervals, find the minimum number of conference rooms required." |
| Coding 2 | Graphs, Dynamic Programming | "Find the shortest path in a weighted graph with at most k stops." |
| System Design | Scale and Product | "Design Facebook News Feed. How would you handle 2 billion users?" |
| Behavioral | Move Fast, Be Bold | "Tell me about the biggest technical risk you took and how it turned out." |

**Apple:**

| Round | Focus | Example Questions |
|-------|-------|-------------------|
| Technical Screen | Language-specific depth | "Explain memory management in Swift/Objective-C. What are retain cycles?" |
| Onsite Coding | Implementation quality | "Implement an LRU cache with O(1) get and put operations." |
| Design | User experience focus | "Design the architecture for a privacy-preserving photo sync system." |
| Team Fit | Craftsmanship | "What is the most polished piece of software you have shipped? Walk me through the details." |

**Microsoft:**

| Round | Focus | Example Questions |
|-------|-------|-------------------|
| Online Assessment | Problem solving | "Design an algorithm to detect cycles in an undirected graph." |
| Phone Screen | CS Fundamentals | "Explain the differences between processes and threads. When would you use each?" |
| Onsite Loop 1 | Coding + Communication | "Implement a trie with insert, search, and startsWith methods." |
| Onsite Loop 2 | System Design | "Design a distributed file storage system like OneDrive." |
| As Appropriate | Hiring Manager | "Where do you see your career in 3 years? What kind of impact do you want to make?" |

### Startup Interview Patterns

| Stage | Focus | Example Questions |
|-------|-------|-------------------|
| Take-home | Practical implementation | "Build a REST API for a task management app with authentication in 48 hours." |
| Technical Deep-dive | Architecture decisions | "Walk me through the architecture of your take-home. Why did you choose this database?" |
| Pair Programming | Collaboration + Thinking | "Let's add a real-time notification feature to this codebase together." |
| Culture Fit | Ownership + Ambiguity | "How do you prioritize when you have three urgent tasks and no clear direction?" |

### Corporate / Enterprise Interview Patterns

| Round | Focus | Example Questions |
|-------|-------|-------------------|
| HR Screen | Background | "Walk me through your resume. What motivates your career transitions?" |
| Technical | Domain knowledge | "How would you design an audit logging system for a financial application?" |
| Manager | Team dynamics | "Describe how you handled a disagreement with a colleague about a technical approach." |
| Panel | Cross-functional | "How would you explain a complex technical constraint to a non-technical stakeholder?" |

### Role-Specific Question Patterns

**Software Development Engineer (SDE):**

- Data structures and algorithm optimization
- System design and scalability
- Code review practices and testing strategies
- CI/CD pipeline design
- Debugging production incidents

**Product Manager:**

- Product metrics and KPIs
- Feature prioritization frameworks (RICE, ICE)
- User research methodologies
- Go-to-market strategy
- Stakeholder communication

**Data Analyst:**

- SQL query optimization
- Statistical analysis methods
- A/B testing design and interpretation
- Data visualization best practices
- ETL pipeline design

**HR / People Operations:**

- Conflict resolution scenarios
- Diversity and inclusion initiatives
- Performance management approaches
- Organizational development
- Employment law awareness

---

## API Reference

### POST /api/upload-resume

Upload a PDF resume for text extraction.

**Request:** `multipart/form-data` with field `resume` (PDF file)

**Response:**
```json
{
  "text": "Extracted plain text from the resume..."
}
```

### POST /api/chat

Send a message in the interview conversation. The AI generates the next question based on resume context, conversation history, and current interview stage.

**Request:**
```json
{
  "history": [
    { "sender": "ai", "text": "Tell me about your experience with React." },
    { "sender": "user", "text": "I have been working with React for 3 years..." }
  ],
  "resumeText": "Full extracted resume text...",
  "message": "User's latest response"
}
```

**Response:**
```json
{
  "reply": "You mentioned working on Project X at Company Y. Can you explain the state management approach you chose and the trade-offs involved?"
}
```

### POST /api/transcribe

Transcribe audio using Groq Whisper Large V3.

**Request:** `multipart/form-data` with field `audio` (WAV file)

**Response:**
```json
{
  "text": "Transcribed speech text..."
}
```

### POST /api/speak

Convert text to speech using ElevenLabs API.

**Request:**
```json
{
  "text": "Question text to convert to speech (max 500 chars)"
}
```

**Response:** `audio/mpeg` binary stream

### POST /api/feedback

Generate a comprehensive interview evaluation report.

**Request:**
```json
{
  "history": [{ "sender": "ai", "text": "..." }, { "sender": "user", "text": "..." }],
  "resumeText": "Full extracted resume text..."
}
```

**Response:**
```json
{
  "overall_score": 72,
  "hiring_verdict": "Lean Hire",
  "detailed_metrics": {
    "technical_depth": 68,
    "communication_clarity": 78,
    "problem_solving": 70,
    "experience_relevance": 75
  },
  "strengths": ["Clear communication", "Strong project experience"],
  "areas_for_improvement": ["Lacks quantified results", "Shallow system design knowledge"],
  "critical_missing_points": "Did not explain database indexing strategy or caching layer.",
  "summary": "The candidate demonstrated solid React experience but needs to deepen system design knowledge."
}
```

### POST /analyze-speech (Python Speech API -- port 8000)

Analyze speech audio for detailed metrics.

**Request:** `multipart/form-data` with field `audio` (WAV file)

**Response:**
```json
{
  "transcript": "Full transcribed text...",
  "speech_rate": 142.5,
  "avg_pause": 0.45,
  "max_pause": 2.10,
  "filler_density": 3.2,
  "answer_duration": 45.3,
  "quantification_ratio": 0.25
}
```

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Python](https://www.python.org/) 3.9 or higher
- [FFmpeg](https://ffmpeg.org/) (required by Whisper for audio processing)

### 1. Clone the Repository

```bash
git clone https://github.com/ritika-bisht-19/wise.ai.git
cd wise.ai
```

### 2. Install API Dependencies

```bash
npm install
```

### 3. Install Client Dependencies

```bash
cd client
npm install
cd ..
```

### 4. Install Python Speech API Dependencies

```bash
cd speech_api
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 5. Configure Environment Variables

Create a `.env` file in the project root:

```
GROQ_API_KEY=your_groq_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
DISCORD_WEBHOOK_URL=your_discord_webhook_url    # Optional
```

See [Environment Variables](#environment-variables) for details on obtaining these keys.

---

## Environment Variables

| Variable | Required | Description | Where to Get It |
|----------|----------|-------------|-----------------|
| `GROQ_API_KEY` | Yes | API key for Groq LLM (LLaMA 3.1) and Whisper transcription | [console.groq.com](https://console.groq.com/) |
| `ELEVENLABS_API_KEY` | Yes | API key for text-to-speech voice generation | [elevenlabs.io](https://elevenlabs.io/) |
| `DISCORD_WEBHOOK_URL` | No | Webhook URL for resume upload notifications | Discord Server Settings > Integrations > Webhooks |

---

## Development

### Start All Services

**Terminal 1 -- Node.js API (port 3000):**

```bash
npm run dev
```

**Terminal 2 -- React Client (port 5173):**

```bash
cd client
npm run dev
```

**Terminal 3 -- Python Speech API (port 8000):**

```bash
cd speech_api
source venv/bin/activate
python main.py
```

The Vite dev server proxies `/api` requests to `localhost:3000` automatically.

### Build for Production

```bash
cd client
npm run build
```

The build output will be in `client/dist/`.

---

## Implementation Status

This table summarizes which features are fully implemented, partially implemented, or planned for future development.

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Interview Simulation Engine | Implemented | 12-turn structured interview with 5 stages, voice I/O, timer |
| 2 | Resume Intelligence (PDF parsing) | Implemented | PDF upload, text extraction, LLM context injection |
| 2a | Resume Intelligence (structured NLP) | Not Implemented | spaCy-based skill/project extraction planned |
| 3 | Speech Transcription (Groq Whisper) | Implemented | Real-time transcription during interview |
| 3a | Speech Metrics (Python service) | Implemented | Speech rate, pauses, fillers, quantification (standalone) |
| 3b | Speech Metrics (live integration) | Not Implemented | Python metrics not yet piped into live interview |
| 4 | Facial Behavior Analysis | Implemented | Eye, head, expression tracking via MediaPipe + face-api.js |
| 5 | Behavioral Stability Index (BSI) | Implemented | Real-time composite stress score from facial metrics |
| 5a | BSI with Speech Metrics | Not Implemented | Speech signals not yet included in BSI formula |
| 6 | Adaptive Pressure System | Partial | Stage progression exists; dynamic difficulty adjustment planned |
| 7 | Real-Time Analytics Dashboard | Partial | Live metric display exists; charts and graphs planned |
| 8 | Interview Session Report | Implemented | LLM-generated evaluation with scores, verdict, strengths, weaknesses |
| 8a | Report with Behavioral Data | Not Implemented | BSI and facial metrics not yet included in report |
| 9 | Session Replay | Not Implemented | Video recording + synchronized timeline planned |
| 10 | Progress Tracking | Not Implemented | Multi-session history and improvement charts planned |
| 11 | Recommendation Engine | Not Implemented | Personalized improvement advice planned |
| 12 | Multi-language Interviews | Not Implemented | Future enhancement |
| 12a | Panel Interview Simulation | Not Implemented | Future enhancement |
| 12b | Voice Tone Analysis | Not Implemented | Future enhancement |
| 12c | Industry-specific Question Banks | Not Implemented | Future enhancement |
| 12d | Peer Feedback Mode | Not Implemented | Future enhancement |

---

## License

This project is developed as an academic/PBL (Project-Based Learning) project.
