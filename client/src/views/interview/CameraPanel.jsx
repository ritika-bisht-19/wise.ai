import { useEffect, useRef, useState } from 'react';

// ── Landmark indices (MediaPipe Face Mesh 468-point topology) ─────────────────
const IDX = {
    L_EYE_TOP: 159, L_EYE_BOT: 145,
    R_EYE_TOP: 386, R_EYE_BOT: 374,
    L_EYE_L: 33, L_EYE_R: 133,
    R_EYE_L: 362, R_EYE_R: 263,
    L_BROW: [55, 107, 46],
    R_BROW: [285, 336, 276],
    L_LIP: 61, R_LIP: 291,
    TOP_LIP: 13, BOT_LIP: 14,
    NOSE: 1, CHIN: 152,
    L_CHEEK: 234, R_CHEEK: 454,
    // iris indices removed — using pupil centroid detection instead
};

const d = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
const avg = (idxs, lm) => {
    const pts = idxs.map(i => lm[i]);
    return { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length };
};

const STRESS_COLORS = {
    calm: { badge: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300', bar: 'bg-emerald-500', dot: '#10b981' },
    mild: { badge: 'bg-amber-500/20 border-amber-500/40 text-amber-300', bar: 'bg-amber-500', dot: '#f59e0b' },
    high: { badge: 'bg-red-500/20 border-red-500/40 text-red-300', bar: 'bg-red-500', dot: '#ef4444' },
};

// ── GazeTracking-style pupil centroid detection (port of eye.py) ──────────────
// Crops the eye from the video frame using landmark bounds,
// finds the darkest pixel cluster (the pupil), returns vertical ratio:
//   0.0 = looking up (pupil at top of eye)
//   0.5 = center
//   1.0 = looking down
function pupilVerticalRatio(video, W, H, lm, offCtx) {
    offCtx.drawImage(video, 0, 0, W, H); // snapshot current video frame

    const eyes = [
        { top: IDX.L_EYE_TOP, bot: IDX.L_EYE_BOT, left: IDX.L_EYE_L, right: IDX.L_EYE_R },
        { top: IDX.R_EYE_TOP, bot: IDX.R_EYE_BOT, left: IDX.R_EYE_L, right: IDX.R_EYE_R },
    ];

    const ratios = eyes.map(({ top, bot, left, right }) => {
        const margin = 8;
        const x1 = Math.max(0, Math.floor(Math.min(lm[left].x, lm[right].x) * W) - margin);
        const x2 = Math.min(W, Math.ceil(Math.max(lm[left].x, lm[right].x) * W) + margin);
        const y1 = Math.max(0, Math.floor(Math.min(lm[top].y, lm[bot].y) * H) - margin);
        const y2 = Math.min(H, Math.ceil(Math.max(lm[top].y, lm[bot].y) * H) + margin);
        const cW = x2 - x1, cH = y2 - y1;
        if (cW < 4 || cH < 4) return 0.5;

        const data = offCtx.getImageData(x1, y1, cW, cH).data;
        const n = cW * cH;

        // Grayscale + find minimum brightness (always the pupil)
        let minBr = 255;
        const gray = new Float32Array(n);
        for (let i = 0; i < n; i++) {
            gray[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
            if (gray[i] < minBr) minBr = gray[i];
        }

        // Threshold = min + 30 (self-adapts per frame, mirrors GazeTracking calibration)
        const thresh = minBr + 30;
        let sumY = 0, count = 0;
        for (let py = 0; py < cH; py++)
            for (let px = 0; px < cW; px++)
                if (gray[py * cW + px] < thresh) { sumY += py; count++; }

        if (count < 5) return 0.5; // no clear pupil found
        return (sumY / count) / cH; // 0 = top, 1 = bottom
    });

    return (ratios[0] + ratios[1]) / 2;
}

// ── HeadPoseEstimation-style Yaw (port of reference_world / solvePnP logic) ────
// Uses the same 6 reference landmarks as the Python implementation:
//   nose tip, chin, left eye corner, right eye corner, left mouth, right mouth
// Yaw ≈ how much the nose deviates from the eye midpoint, normalised by face width.
// Returns approximate degrees: 0 = straight, negative = left, positive = right.
function estimateYawDeg(lm) {
    const lEye = lm[33];    // left outer eye corner   (dlib 36 equiv)
    const rEye = lm[263];   // right outer eye corner  (dlib 45 equiv)
    const nose = lm[1];     // nose tip                (dlib 30 equiv)
    // chin lm[152], lMouth lm[61], rMouth lm[291] available but yaw only needs eye+nose

    const eyeCenterX = (lEye.x + rEye.x) / 2;
    const eyeWidth = Math.abs(rEye.x - lEye.x);
    if (eyeWidth < 0.01) return 0;

    // noseOffset: 0 = straight, ±0.5 ≈ ±45° horizontal rotation
    const noseOffset = (nose.x - eyeCenterX) / eyeWidth;
    return noseOffset * 90; // scale to approximate degrees
}


export default function CameraPanel({ onStressUpdate }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const offscreenRef = useRef(null);
    const prevNoseY = useRef(null);
    const blinkCount = useRef(0);
    const prevBlink = useRef(false);
    const prevLookingUp = useRef(false);
    const gazeEventTimes = useRef([]);
    const prevAvoidance = useRef(false);        // head-turn evasion tracking
    const avoidTimes = useRef([]);           // timestamps of head-avoidance events
    const startTime = useRef(Date.now());
    const history = useRef({ eyebrow: [], lip: [], nod: [], sym: [], smile: [] });
    const lastExpressionCheck = useRef(0);
    const lastSmileScore = useRef(0);

    const [stress, setStress] = useState({ level: 'calm', score: 0, label: 'Initializing...' });
    const [features, setFeatures] = useState({ eyebrow_raise: 0, lip_tension: 0, head_nod_intensity: 0, symmetry_delta: 0, blink_rate: 0, upward_gaze_rate: 0, head_turn_rate: 0, smile_score: 0 });
    const [faceDetected, setFaceDetected] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    const smooth = (key, val, n = 5) => {
        const arr = history.current[key];
        arr.push(val);
        if (arr.length > n) arr.shift();
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    };

    useEffect(() => {
        const loadModels = async () => {
            if (!window.faceapi) return;
            try {
                await window.faceapi.nets.tinyFaceDetector.loadFromUri('/models/face-api');
                await window.faceapi.nets.faceExpressionNet.loadFromUri('/models/face-api');
                setModelsLoaded(true);
                console.log('FaceAPI models loaded');
            } catch (err) {
                console.error('Error loading FaceAPI models:', err);
                setModelsLoaded(true); // Fallback so it doesn't stay stuck
            }
        };
        loadModels();

        let camera;
        // Offscreen canvas for reading raw video pixels (pupil detection)
        const oc = document.createElement('canvas');
        const octx = oc.getContext('2d', { willReadFrequently: true });
        offscreenRef.current = { canvas: oc, ctx: octx };

        const init = () => {
            if (!window.FaceMesh || !window.Camera) { setTimeout(init, 300); return; }

            const faceMesh = new window.FaceMesh({
                locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
            });

            faceMesh.setOptions({
                maxNumFaces: 1,
                refineLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            faceMesh.onResults(({ multiFaceLandmarks }) => {
                try {
                    const canvas = canvasRef.current;
                    const video = videoRef.current;
                    if (!canvas || !video || !offscreenRef.current) return;

                    const W = video.videoWidth || 640;
                    const H = video.videoHeight || 480;
                    canvas.width = W;
                    canvas.height = H;
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, W, H);

                    const lm = multiFaceLandmarks?.[0];
                    setFaceDetected(!!lm);
                    if (!lm) return;

                    // ── Draw face mesh dots ───────────────────────────────────────────
                    ctx.fillStyle = 'rgba(16, 185, 129, 0.65)';
                    lm.forEach(p => {
                        ctx.beginPath();
                        ctx.arc((1 - p.x) * W, p.y * H, 1.3, 0, 2 * Math.PI);
                        ctx.fill();
                    });

                    // ── 1. Eyebrow raise ────────────────────────────────────────────────
                    const lBrow = avg(IDX.L_BROW, lm);
                    const rBrow = avg(IDX.R_BROW, lm);
                    const anchor = { y: (lm[IDX.L_EYE_TOP].y + lm[IDX.R_EYE_TOP].y) / 2 };
                    const eyebrow = smooth('eyebrow', (Math.abs(lBrow.y - anchor.y) + Math.abs(rBrow.y - anchor.y)) / 2);

                    // ── 2. Lip tension ──────────────────────────────────────────────────
                    const mW = d(lm[IDX.L_LIP], lm[IDX.R_LIP]);
                    const mH = d(lm[IDX.TOP_LIP], lm[IDX.BOT_LIP]);
                    const lip = smooth('lip', Math.min(Math.max((mW / Math.max(mH, 1e-5) - 5) / 55, 0), 1));

                    // ── 3. Head nod ─────────────────────────────────────────────────────
                    const noseY = lm[IDX.NOSE].y;
                    const headLen = Math.abs(lm[IDX.CHIN].y - noseY);
                    let nod = 0;
                    if (prevNoseY.current !== null) {
                        const rawDelta = Math.abs(noseY - prevNoseY.current) / Math.max(headLen, 1e-5);
                        nod = smooth('nod', rawDelta, 3);
                    }
                    prevNoseY.current = noseY;

                    // ── 4. Facial symmetry ──────────────────────────────────────────────
                    const lD = d(lm[IDX.L_CHEEK], lm[IDX.NOSE]);
                    const rD = d(lm[IDX.R_CHEEK], lm[IDX.NOSE]);
                    const symmetry = smooth('sym', Math.abs(lD - rD) / Math.max((lD + rD) / 2, 1e-5));

                    // ── 5. Blink rate ───────────────────────────────────────────────────
                    const lEAR = d(lm[IDX.L_EYE_TOP], lm[IDX.L_EYE_BOT]) / Math.max(d(lm[IDX.L_EYE_L], lm[IDX.L_EYE_R]), 1e-5);
                    const rEAR = d(lm[IDX.R_EYE_TOP], lm[IDX.R_EYE_BOT]) / Math.max(d(lm[IDX.R_EYE_L], lm[IDX.R_EYE_R]), 1e-5);
                    const isBlinking = (lEAR + rEAR) / 2 < 0.23;
                    if (isBlinking && !prevBlink.current) blinkCount.current++;
                    prevBlink.current = isBlinking;
                    const mins = Math.max((Date.now() - startTime.current) / 60000, 1 / 60);
                    const blinkRate = blinkCount.current / mins;

                    // ── 6. Upward gaze rate (GazeTracking pupil centroid method) ────────
                    const { canvas: oc, ctx: octx } = offscreenRef.current;
                    oc.width = W; oc.height = H;
                    const vertRatio = pupilVerticalRatio(video, W, H, lm, octx);
                    const isLookingUp = vertRatio < 0.40;

                    if (isLookingUp && !prevLookingUp.current) {
                        const now = Date.now();
                        const arr = gazeEventTimes.current;
                        const lastEvt = arr.length ? arr[arr.length - 1] : 0;
                        if (now - lastEvt > 1500) arr.push(now);
                        while (arr.length && now - arr[0] > 60000) arr.shift();
                    }
                    prevLookingUp.current = isLookingUp;
                    const gazeUpRate = gazeEventTimes.current.length;

                    // ── 7. Head Yaw / Avoidance ────────────────────────────────────────
                    const yawDeg = estimateYawDeg(lm);
                    const isAvoiding = Math.abs(yawDeg) > 25;
                    if (isAvoiding && !prevAvoidance.current) {
                        const now = Date.now();
                        const lastEvt = avoidTimes.current.length ? avoidTimes.current[avoidTimes.current.length - 1] : 0;
                        if (now - lastEvt > 2000) avoidTimes.current.push(now);
                        while (avoidTimes.current.length && now - avoidTimes.current[0] > 60000)
                            avoidTimes.current.shift();
                    }
                    prevAvoidance.current = isAvoiding;
                    const headTurnRate = avoidTimes.current.length;

                    // ── 8. Smile Detection ──────────────────────────────────────────────
                    const nowTS = Date.now();
                    if (nowTS - lastExpressionCheck.current > 200 && window.faceapi && modelsLoaded) {
                        lastExpressionCheck.current = nowTS;
                        window.faceapi.detectSingleFace(video, new window.faceapi.TinyFaceDetectorOptions())
                            .withFaceExpressions()
                            .then(res => { if (res) lastSmileScore.current = res.expressions.happy; });
                    }
                    const smile = smooth('smile', lastSmileScore.current);

                    // ── Score calculation ─────────────────────────────────────────────
                    const score = Math.min(Math.max(
                        0.20 * Math.min(eyebrow / 0.08, 1.5) +
                        0.20 * Math.min(lip / 1.0, 1.5) +
                        0.15 * Math.min(nod / 0.015, 1.5) +
                        0.10 * Math.min(symmetry / 0.05, 1.5) +
                        0.10 * Math.min(blinkRate / 30, 1.5) +
                        0.15 * Math.min(gazeUpRate / 5, 1.5) +
                        0.10 * Math.min(headTurnRate / 4, 1.5) -
                        0.30 * smile
                        , 0), 1.5);

                    const level = score < 0.35 ? 'calm' : score < 0.65 ? 'mild' : 'high';
                    const label = { calm: 'Calm', mild: 'Slight Stress', high: 'High Stress' }[level];
                    const newFeatures = { eyebrow_raise: eyebrow, lip_tension: lip, head_nod_intensity: nod, symmetry_delta: symmetry, blink_rate: blinkRate, upward_gaze_rate: gazeUpRate, head_turn_rate: headTurnRate, smile_score: smile };

                    setStress({ level, score, label });
                    setFeatures(newFeatures);
                    onStressUpdate?.({ level, score, label, features: newFeatures });
                } catch (e) {
                    console.error("CameraPanel Loop Error:", e);
                }
            });

            camera = new window.Camera(videoRef.current, {
                onFrame: async () => { if (videoRef.current) await faceMesh.send({ image: videoRef.current }); },
                width: 640, height: 480,
            });
            camera.start();
        };

        init();
        return () => camera?.stop();
    }, []);

    const sc = STRESS_COLORS[stress.level];

    const metrics = [
        { label: 'Eyebrow', value: features.eyebrow_raise, max: 0.08 },
        { label: 'Lip Tension', value: features.lip_tension, max: 1 },
        { label: 'Head Nod', value: features.head_nod_intensity, max: 0.015 },
        { label: 'Symmetry', value: features.symmetry_delta, max: 0.05 },
        { label: 'Blink/min', value: features.blink_rate, max: 30 },
        { label: 'Gaze Up', value: features.upward_gaze_rate, max: 5 },
        { label: 'Head Turn', value: features.head_turn_rate, max: 4 },
        { label: 'Smile', value: features.smile_score, max: 1 },
    ];

    return (
        <div className="flex flex-col h-full bg-[#111118]">
            {/* Video feed — fills available space */}
            <div className="relative flex-1 min-h-0 m-2 rounded-xl overflow-hidden bg-black">
                <video
                    ref={videoRef}
                    autoPlay playsInline muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                />
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />

                {/* Stress indicator */}
                <div className={`absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-sm text-[11px] font-semibold ${sc.badge}`}>
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: sc.dot }} />
                    {stress.label}
                </div>

                {/* Score */}
                <div className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-[11px] font-mono text-slate-300">
                    {stress.score.toFixed(2)}
                </div>

                {/* No face */}
                {!faceDetected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="px-4 py-2 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-slate-400">
                            Looking for your face...
                        </span>
                    </div>
                )}

                {/* Name */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[11px] font-medium text-white">
                    You
                </div>
            </div>

            {/* Metrics — compact 4-col grid */}
            <div className="shrink-0 px-3 py-3 border-t border-white/[0.06]">
                <div className="grid grid-cols-4 gap-x-3 gap-y-3">
                    {metrics.map(({ label, value, max }) => (
                        <div key={label}>
                            <div className="text-[10px] text-slate-500 mb-1 truncate">{label}</div>
                            <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${sc.bar}`}
                                    style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
                                />
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 mt-0.5">{Number(value).toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
