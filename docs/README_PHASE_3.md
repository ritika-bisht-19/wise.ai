# W.I.S.E. — Phase 3: Future Roadmap & Feature Enhancements

Welcome to the **Phase 3 Development Roadmap** for the Work Interview Stress Evaluator (W.I.S.E.). Having completed the core architecture, real-time multimodal evaluation, and the 5-stage conversational state machine, Phase 3 aims to transition the platform from a functional prototype into a highly scalable, production-ready enterprise utility.

This roadmap categorizes upcoming feature additions by domain to help the team focus on their respective tech stacks.

---

##  1. Frontend & UI Enhancements (Ritika)

* **Integrated Code Execution Environment:** Add an interactive code editor (like Monaco Editor) embedded into the interview chat UI. This will allow candidates to actually type and execute code when the AI asks Data Structures & Algorithms (DSA) or System Design questions.
* **Progressive Web App (PWA) Support:** Convert the React SPA into an installable PWA for offline capabilities, allowing local caching of the Whisper STT and facial models.
* **Advanced Analytics Dashboard:** Replace the simple end-of-test feedback view with a comprehensive user profile dashboard using Recharts or Chart.js to graph stress trends over an entire semester of mock interviews.
* **Screen Sharing Enforcement:** Add browser API hooks to require screen sharing during the interview to ensure candidates are not Googling answers.

##  2. Multimodal Behavioral Analysis (Anika)

* **Gaze Tracking & Micro-Expression Detection:** Upgrade the MediaPipe integration to utilize strict Iris tracking to detect exact coordinate lookaways (e.g., reading from a hidden second monitor).
* **Posture & Body Language Tracking:** Introduce MediaPipe Pose (Body tracking) alongside FaceMesh to monitor slouching, nervous fidgeting, or rigid body language.
* **Persistent Identity Database:** Migrate the Python FastAPI Face Registration from simple in-memory storage to a scalable PostgreSQL + pgvector database, allowing users' face-encodings to persist permanently across multiple interview sessions.

##  3. Backend Architecture & AI Logic (Ayush)

* **Authentication & User Management:** Implement **Clerk** or **NextAuth/JWT** integration so candidates have secure accounts to track their progress over time.
* **Database Migration:** Replace stateless variables with a fully integrated MongoDB or PostgreSQL database (via Prisma) to save `history[]`, PDFs, and BSI scores securely.
* **Dynamic AI Persona Customization:** Allow the user to select the *tone/strictness* of the AI interviewer (e.g., "Aggressive Wall Street Recruiter" vs "Friendly Startup Engineer") which will programmatically alter the Groq LLaMA prompt parameters (Temperature and System Rules).
* **Automated Email Reporting:** Integrate Nodemailer/SendGrid so the moment an interview finishes, a rich HTML version of the Feedback Report is emailed to the candidate and their placement officer.

##  4. Voice Intelligence & BSI Engine (Shalini)

* **Multi-Language Support (Indic Languages):** Upgrade the Voice Engine prompt and speech models to conduct interviews seamlessly in Hindi, Hinglish, or regional languages alongside English to aid Tier-2 and Tier-3 college students.
* **Speech Emotion Recognition (SER):** Analyze the raw acoustic variables (pitch variance, jitter, shimmer) of the candidate's audio blob *before* transcription to calculate stress in the voice itself, feeding it directly into the Behavioral Stability Index (BSI).
* **Live Transcribe UI:** Stream the candidate's real-time transcript on the screen as subtitles while they are speaking, simulating closed-caption limits for better accessibility.

---

##  5. DevOps & Infrastructure (Team Effort)

* **Docker Orchestration:** Currently, W.I.S.E. requires running 3 separate terminals (React, Node, Python). In Phase 3, we will write a `docker-compose.yml` that seamlessly boots the Frontend, Backend, Database, and Python API container in a single `docker compose up` command.
* **Cloud Deployment (AWS / GCP):** Deploy the containerized services to a managed cloud provider. React frontend via Vercel, Node API on Render/Heroku, and the Python FastAPI on an AWS EC2 instance.
* **CI/CD Pipeline:** Implement GitHub Actions to automatically run unit tests (`Jest` & `PyTest`) whenever code is pushed to the `main` branch.

---

###  Development Priority Tracker

| Feature Task | Assignee | Priority | Complexity |
|--------------|----------|----------|------------|
| Database & Auth Integration | **Ayush** |  HIGH | Hard |
| Dockerization / docker-compose | **All** |  HIGH | Medium |
| Analytics History Dashboard | **Ritika** |  MED | Medium |
| Gaze & Screen Share Tracking | **Anika / Ritika** |  MED | Hard |
| Multi-language Support (Voice) | **Shalini** |  LOW | Medium |
| Integrated Code Editor | **Ritika** |  LOW | Hard |
