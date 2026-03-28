# Anika — Multimodal Behavioral Analysis / Team Lead

---

## _Poori Team Ka Kaam — Sirf Samajhne Ke Liye (Ye Apka Part Nahi Hai)_

> **Ye section sirf isliye hai taaki aapko samajh aaye ki poora project kaise kaam karta hai aur baaki log kya kar rahe hain. _Apka actual kaam niche "ANIKA'S WORK" section me hai._**

**W.I.S.E. ek AI-powered mock interview platform hai jo candidate ka stress aur behavior analyze karta hai.** User apna resume aur photo upload karta hai (Ritika) → camera/mic calibrate karta hai (Ritika) → AI voice ke saath real-time interview deta hai (Ayush + Shalini) → backend me face mesh aur expressions track hote hain taaki cheating aur stress catch ho (Anika) → end me ek detailed hiring committee-style report generate hoti hai jisme BSI score milta hai (Shalini).

```
 Upload Resume/Photo ──→ Calibration ──→ Live Interview (Voice+Video) ──→ Feedback Report
      (Ritika)             (Ritika)         (Ayush + Shalini)                 (Shalini)
                                                    │
                                            Facial Analysis & Anti-Cheat
                                                 (Anika)
```

---

## _ANIKA KI TECH STACK — Sirf Wahi Technologies Jo Anika Ne Use Ki Hain_

| Technology | Kya hai | Kaha use hua |
|-----------|---------|-------------|
| **Python / FastAPI** | High performance backend framework | `ai-services/face_api/main.py` me Identity Verification service banane ke liye |
| **MediaPipe FaceMesh** | Google's browser-based ML | `CameraPanel.jsx` me 468 facial landmarks track karne ke liye |
| **face-api.js** | Browser-based expression detection | `CameraPanel.jsx` me user ki smile aur confidence score detect karne ke liye |
| **face_recognition / dlib** | Python facial recognition library | `main.py` me 128-dim face encoding aur mismatch distance test karne ke liye |
| **Computer Vision (Math)** | Trigonometry aur distance algorithms | `CameraPanel.jsx` me blink rate (EAR) aur head alignment calculate karne ke liye |

---

## _Reference Acknowledgment — Base Kaha Se Aaya_

> **Identity Verification Engine Python me custom-built hai FastAPI aur `face_recognition` library use karke. Browser ke andar real-time tracking humne MediaPipe JS CDN aur `face-api.js` se adapt kiya hai. _Un models ki coordinates aur landmarks leke custom tracking metrics (blink rate, stress score) aur anti-cheat mechanism design karna 100% humara custom logic hai._**

---

## _Core Concepts — Anika Ke Kaam Me Kaha Use Hui_

> **Computer Science / ML concepts jo Anika ne implement kiye hain:**

| Concept | Kaha use hua | File |
|-----------|-------------|------|
| **Computer Vision (Landmark Tracking)** | 3D array of (x,y,z) coordinates se face expressions nikalna | `CameraPanel.jsx` |
| **Vector Embeddings (Face Encoding)** | 128-dimensional vector se do faces ko compare karna aur metric distance dhundna | `ai-services/face_api/main.py` |
| **Polling Architecture** | Client se har 2 second pe server ko check bhejna bina video stream stall kiye | `CameraPanel.jsx` (useEffect) |
| **Client-Side Inferencing** | Heavy ML models browser me chalana taaki server load zero ho | `CameraPanel.jsx` / `face-api.js models` |

---

## _ANIKA'S WORK — Behavioral Analysis Engine & Team Lead_

**_"Anika ne platform ki main USP banayi hai — jo candidates ki expressions aur strict identity verify karti hai, is project ko text-chat se uthake ek smart AI camera system me badal deti hai."_**

---

### Files Anika Owns

| File | What it does |
|------|-------------|
| `frontend/src/features/interview/CameraPanel.jsx` | Real-time face mesh processing, expression logic, polling verification |
| `ai-services/face_api/main.py` | FastAPI server with `/api/register-face` and `/api/verify-face` routes |
| `frontend/public/models/face-api/` | Binary ML models (tinyFaceDetector, faceExpressionNet) |
| `frontend/src/pages/InterviewPage.tsx` | Assisting Ritika in orchestrating the flow using extracted camera states |

---

### What Each Feature Does — Detailed

---

#### **1. MediaPipe FaceMesh Engine**

`CameraPanel.jsx` injects a script tag dynamically to load Mediapipe. Every frame processed extracts 468 landmark points representing the candidate's exact facial structure.

**"Server ka load bachane ke liye maine poori face tracking browser (React) pe hi run kar di. Ye 468 coordinates return karta hai jisse main candidate ke eyebrow movement, lip tension, aur head yaw/pitch measure karti hu."**

#### **2. Blink Rate & Stress Signals**

By measuring specific points around the eyes (e.g., Eye Aspect Ratio - EAR), the code detects blinks. If EAR drops unexpectedly, it flags a stress signal. The same math applies to Lip Aspect Ratio to detect lip biting.

**"Computer vision me facial stress measure karne ke liye hum x aur y distance ratios nikalte hain. Agar candidate baar-baar nazrein idhar-udhar ghumata hai, toh head yaw (Z-axis rotation) usko catch karke 'gaze avoidance' trigger kar deta hai."**

#### **3. Python Identity Verification API**

`main.py` is an independent FastAPI server running on port `8001`. Upon registration, it extracts a 128-dimensional encoding of the candidate. Every 2 seconds during the interview, `CameraPanel.jsx` sends the real-time webcam frame to `/api/verify-face`.

**"Resume upload hone par main user ke photo ka ek unique biometric vector (128-dim array) apne python middleware me save karti hu. Interview ke time browser canvas snapshot bhejta hai aur main `distance < 0.5` threshold se verify karti hu ki wahi candidate paper de raha hai ya nahi. Agar doosra person aa jaye toh 3 limits ke baad test ruk jaata hai."**

#### **4. Haptic Feedback & Face Dropout**

If the face completely disappears, the API tracks `no_face_detected` and plays an alert sound directly embedded in the React component to warn the user.

**"Agar camera se face chala jaye, toh main error display karke audio chime play karti hu taaki candidate wapas frame me aa jaye, isse strictly exam ka mahol bana rehta hai."**

---

### How to Test

| What to test | How | Expected |
|-------------|-----|----------|
| **Face Registration** | Open Photo File in step 1 | Call to `localhost:8001/api/register-face` succeeds |
| **Real-time Tracking** | Wait inside InterviewChat | Open Chrome console to see Face Mesh loaded successfully |
| **Anti-Cheating Check** | Point the webcam at someone else | Top right badge turns orange/red, logs 'Mismatch (1/3)' |

---

### _When the Mentor Asks: "Anika, tumne kya kiya?"_

> "Sir/Ma'am, maine W.I.S.E. ko lead kiya hai aur hamara us USP—**Multimodal Behavioral Analysis aur Identity Verification Engine**—design kiya hai.
>
> Baaki platform sirf sawal puchte hain; hamara platform check karta hai ki candidate answer dete waqt kaisa behave kar raha hai. Maine **MediaPipe FaceMesh** ko directly browser me integrate kiya taaki server load na badhe. Ye har video frame me 468 facial coordinates (landmarks) track karke candidate ka stress, lip tension aur blink rate (Eye Aspect Ratio) measure karta hai.
> 
> Uske alawa, anti-cheat ensure karne ke liye, maine ek separate **Python FastAPI aur dlib/face_recognition** ka microservice banaya. Jab user photo upload karta hai, main 128-dimensional face encoding save kar leti hu. Fir poore interview ke doran, har 2 second me webcam ussi encoding se face distance (threshold 0.5) match karta hai. Agar koi aur frame me aa jaye ya candidate screen chhode, toh platform automatically 3 warnings ke baad session terminate kar deta hai."
