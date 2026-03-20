import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, Square, Clock, Video, CheckCircle, Bot, User, ArrowRight, ArrowLeft, Hand, ShieldAlert, ShieldCheck } from 'lucide-react';
import CameraPanel from './CameraPanel';
import { motion, AnimatePresence } from 'framer-motion';

const VOICE_OPTIONS = [
  { key: 'adam', label: 'Adam' },
  { key: 'rachel', label: 'Rachel' },
  { key: 'bella', label: 'Bella' },
  { key: 'antoni', label: 'Antoni' },
];

export default function InterviewChat({ resumeText, onEnd }) {
  const PALM_HOLD_REQUIRED_MS = 5000;
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [processing, setProcessing] = useState(false);
  const [stress, setStress] = useState(null);
  const [voiceKey, setVoiceKey] = useState('adam');

  // Identity verification state
  const [identityStatus, setIdentityStatus] = useState(null); // null | 'match' | 'mismatch' | 'no_face'
  const [identityFailCount, setIdentityFailCount] = useState(0);
  const [identityBannerVisible, setIdentityBannerVisible] = useState(false);
  const identityFailRef = useRef(0); // ref mirror so callback always sees fresh count
  
  // Calibration State
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState(0); // 0 = Turn Left, 1 = Turn Right, 2 = Palm Over Face, 3 = Done
  const [currentYaw, setCurrentYaw] = useState(0);
  const [palmHoldMs, setPalmHoldMs] = useState(0);
  const palmHoldStartRef = useRef(null);
  const palmStepCompletedRef = useRef(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasStarted = useRef(false);
  const waveContainerRef = useRef(null);
  const siriWaveRef = useRef(null);
  const audioCtxRef = useRef(null);
  const ampRafRef = useRef(null);
  const ampSmoothRef = useRef(0.28);

  const stopWaveTracking = () => {
    if (ampRafRef.current) {
      cancelAnimationFrame(ampRafRef.current);
      ampRafRef.current = null;
    }
    ampSmoothRef.current = 0.28;
    if (siriWaveRef.current?.setAmplitude) siriWaveRef.current.setAmplitude(0.08);
  };

  const bindWaveToAudio = (audioEl) => {
    if (!siriWaveRef.current || !audioEl) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();

      const analyser = audioCtxRef.current.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.72;
      const source = audioCtxRef.current.createMediaElementSource(audioEl);
      source.connect(analyser);
      analyser.connect(audioCtxRef.current.destination);
      const data = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(data);
        const n = Math.max(data.length, 1);

        // Multi-feature loudness estimate for better visual response.
        let sum = 0;
        let sumSq = 0;
        let peak = 0;
        for (let i = 0; i < n; i++) {
          const v = data[i];
          sum += v;
          sumSq += v * v;
          if (v > peak) peak = v;
        }

        // Bass/mid bins tend to correlate better with speech energy.
        const lowBins = Math.max(Math.floor(n * 0.18), 1);
        let lowSum = 0;
        for (let i = 0; i < lowBins; i++) lowSum += data[i];

        const avg = sum / n;
        const rms = Math.sqrt(sumSq / n);
        const lowAvg = lowSum / lowBins;

        // Boosted mapping so amplitude does not look tiny.
        const loudness = 0.45 * (avg / 255) + 0.35 * (rms / 255) + 0.20 * (lowAvg / 255);
        const peakNorm = peak / 255;
        const breathing = 0.08 * (Math.sin(performance.now() / 170) + 1);
        let targetAmp = 0.45 + breathing + loudness * 3.6 + peakNorm * 0.95;
        targetAmp = Math.min(Math.max(targetAmp, 0.35), 3.4);

        // Smooth to avoid jitter but keep lively movement.
        ampSmoothRef.current = ampSmoothRef.current * 0.66 + targetAmp * 0.34;
        siriWaveRef.current?.setAmplitude?.(ampSmoothRef.current);
        if (!audioEl.paused && !audioEl.ended) ampRafRef.current = requestAnimationFrame(tick);
      };

      stopWaveTracking();
      ampRafRef.current = requestAnimationFrame(tick);
    } catch {
      // Fallback pulse when analyser binding is unavailable.
      siriWaveRef.current?.setAmplitude?.(0.8);
    }
  };

  useEffect(() => {
    if (!joined || hasStarted.current || isCalibrating) return;
    hasStarted.current = true;
    sendMessage('START', true);
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      }
      stopWaveTracking();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') audioCtxRef.current.close();
    };
  }, [joined]);

  useEffect(() => {
    if (!joined || !waveContainerRef.current || siriWaveRef.current) return;
    let cancelled = false;

    const initWave = () => {
      if (cancelled || !waveContainerRef.current || siriWaveRef.current) return;
      if (!window.SiriWave) {
        setTimeout(initWave, 150);
        return;
      }

      siriWaveRef.current = new window.SiriWave({
        container: waveContainerRef.current,
        width: waveContainerRef.current.clientWidth || 520,
        height: 96,
        style: 'ios9',
        speed: 0.10,
        amplitude: 0.35,
        autostart: true,
      });
    };

    initWave();

    return () => {
      cancelled = true;
      stopWaveTracking();
      siriWaveRef.current?.stop?.();
      siriWaveRef.current = null;
    };
  }, [joined]);

  useEffect(() => {
    if (!joined) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); onEnd(messages); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [joined, messages, onEnd]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, processing]);

  const speakText = async (text) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    stopWaveTracking();
    setIsSpeaking(true);
    try {
      const res = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 500), voiceKey })
      });
      if (!res.ok) throw new Error('TTS failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      bindWaveToAudio(audio);
      audio.onended = () => {
        stopWaveTracking();
        URL.revokeObjectURL(url);
        setIsSpeaking(false);
        audioRef.current = null;
      };
      audio.onerror = () => {
        stopWaveTracking();
        setIsSpeaking(false);
        audioRef.current = null;
      };
      await audio.play();
    } catch (e) {
      console.error('TTS error:', e);
      stopWaveTracking();
      setIsSpeaking(false);
    }
  };

  const toggleListening = async () => {
    if (isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setProcessing(true);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = e => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };
        mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const fd = new FormData();
          fd.append('audio', blob, 'user_voice.wav');
          try {
            const res = await fetch('/api/transcribe', { method: 'POST', body: fd });
            const data = await res.json();
            data.text ? sendMessage(data.text) : setProcessing(false);
          } catch { setProcessing(false); }
        };
        mediaRecorderRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Mic error:', err);
      }
    }
  };

  const sendMessage = async (text, isSystem = false) => {
    if (!text) return;
    const newMsg = { sender: 'user', text };
    if (!isSystem) setMessages(prev => [...prev, newMsg]);
    setProcessing(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: isSystem ? [] : [...messages, newMsg], resumeText, message: text })
      });
      const data = await res.json();
      const aiMsg = { sender: 'ai', text: data.reply };
      setMessages(prev => isSystem ? [aiMsg] : [...prev, aiMsg]);
      speakText(data.reply);
      if (data.reply.toLowerCase().includes('concludes our interview')) {
        setTimeout(() => onEnd([...messages, newMsg, aiMsg]), 4000);
      }
    } catch (e) { console.error('Chat error:', e); }
    finally { setProcessing(false); }
  };

  const formatTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const timeWarning = timeLeft < 120;
  const activeVoiceLabel = VOICE_OPTIONS.find(v => v.key === voiceKey)?.label || 'Adam';

  // ─────────────────────────────────────────────────────
  // IDENTITY CHECK HANDLER
  // ─────────────────────────────────────────────────────
  const handleIdentityCheck = useCallback((result) => {
    const { match, status } = result;

    if (status === 'no_face_detected') {
      setIdentityStatus('no_face');
      return; // transient occlusion — not counted as a failure
    }

    if (match) {
      // Cumulative total never resets — only hide banner visually on a match.
      // This prevents gaming by briefly flashing the registered photo.
      setIdentityStatus('match');
      setIdentityBannerVisible(false);
    } else {
      setIdentityStatus('mismatch');
      // Always increment — counter never goes back down
      const next = identityFailRef.current + 1;
      identityFailRef.current = next;
      setIdentityFailCount(next);
      setIdentityBannerVisible(true);

      if (next >= 3) {
        // 3 total mismatches accumulated → stop interview
        setTimeout(() => onEnd(messages), 2500);
      }
    }
  }, [messages, onEnd]);

  // ═══════════════════════════════════════════════════════
  // JOIN SCREEN
  // ═══════════════════════════════════════════════════════
  if (!joined && !isCalibrating) {
    return (
      <div className="relative h-full overflow-hidden bg-[#0b0f1a]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, #ff7e1d 0%, #e08a5f 30%, #b8bfe3 63%, #aebce8 100%)',
          }}
        />
        <img
          src="/assets/images/hero/hero-gradient-bg.svg"
          alt=""
          className="absolute top-[-48%] left-1/2 w-[170%] md:w-[130%] max-w-none -translate-x-1/2 opacity-75 pointer-events-none"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(1000px 420px at 16% -8%, rgba(255,160,80,0.36), transparent 55%), radial-gradient(950px 420px at 95% 105%, rgba(141,163,242,0.42), transparent 62%), linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(0,0,0,0.14) 100%)',
          }}
        />

        <div className="relative h-full w-full px-5 md:px-8 py-10 md:py-14">
          <div className="mx-auto h-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="relative h-full min-h-[620px] lg:col-span-6 rounded-[28px] border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.55)] backdrop-blur-[16px] p-6 md:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">

              <div className="relative">
                <img
                  src="/assets/images/hero/hero-motif.svg"
                  alt=""
                  className="w-auto h-12 md:h-14 opacity-80 mb-5"
                />

              <h2 className="mt-5 text-[34px] md:text-[46px] leading-[1.08] font-season-mix text-slate-900">
                Step into your
                <span className="block text-[#3f56c5]">real interview simulation</span>
              </h2>
              <p className="mt-4 text-[14px] md:text-[15px] leading-relaxed text-slate-700 max-w-[52ch]">
                Practice with an adaptive AI interviewer while W.I.S.E tracks behavioral stability, speaking patterns, and delivery confidence in real time.
              </p>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Role-specific questioning',
                  'Live behavior analytics',
                  'TTS interviewer voice',
                  'Detailed end report',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 rounded-xl border border-white/50 bg-white/45 px-3.5 py-2.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5b73e8]" />
                    <span className="text-[12px] text-slate-800">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2.5">
                {[
                  { label: 'Duration', value: '10 min' },
                  { label: 'Questions', value: '12' },
                  { label: 'Live', value: 'Enabled' },
                ].map((chip) => (
                  <div key={chip.label} className="rounded-lg border border-white/55 bg-white/50 px-2.5 py-2 text-center">
                    <p className="text-[10px] uppercase tracking-[0.08em] text-slate-600">{chip.label}</p>
                    <p className="text-[12px] font-semibold text-slate-900 mt-0.5">{chip.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/60 bg-white/52 p-4">
                <p className="text-[10px] uppercase tracking-[0.08em] text-slate-600 mb-3">Interview Phases</p>
                <div className="flex items-center justify-between gap-2">
                  {['Warmup', 'Technical', 'Wrap-up'].map((phase, index) => (
                    <div key={phase} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full border border-white/70 bg-white/70 flex items-center justify-center text-[10px] font-semibold text-[#3f56c5]">
                        {index + 1}
                      </span>
                      <span className="text-[11px] font-medium text-slate-700">{phase}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-white/65 overflow-hidden">
                  <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-[#5b73e8] to-[#8ba0ff]" />
                </div>
              </div>
              </div>
            </div>

            <div className="relative h-full min-h-[620px] lg:col-span-6 rounded-[28px] border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.55)] backdrop-blur-[16px] p-6 md:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl border border-white/60 bg-white/55 flex items-center justify-center mb-5">
                  <Video size={24} className="text-[#3f56c5]" />
                </div>

                <h3 className="text-[28px] md:text-[34px] leading-tight font-season-mix text-slate-900 mb-2">Ready to Begin</h3>
                <p className="text-sm text-slate-700 mb-6 leading-relaxed">
                  AI-powered mock interview with real-time stress analysis.
                </p>
              </div>

              <div className="space-y-2.5 mb-7 flex-1">
                {[
                  'Camera and microphone required',
                  'Real-time facial analysis enabled',
                  '12-turn technical interview flow',
                  'AI voice asks each question',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/55 bg-white/48">
                    <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                    <span className="text-[12px] md:text-[13px] text-slate-800">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mb-4 rounded-xl border border-white/55 bg-white/48 p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] uppercase tracking-[0.08em] text-slate-600">Interviewer Voice</span>
                  <select
                    value={voiceKey}
                    onChange={(e) => setVoiceKey(e.target.value)}
                    className="rounded-lg border border-slate-200/80 bg-white/80 px-2.5 py-1.5 text-[12px] text-slate-800 outline-none"
                  >
                    {VOICE_OPTIONS.map((voice) => (
                      <option key={voice.key} value={voice.key}>
                        {voice.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-[11px] text-slate-700">
                  Your selection will be used for the very first AI question.
                </p>
              </div>

              <button
                onClick={() => setIsCalibrating(true)}
                className="w-full py-3.5 rounded-xl text-sm md:text-base font-semibold text-white bg-gradient-to-r from-[#3f56c5] via-[#5c74e8] to-[#7d92f3] hover:from-[#364bb0] hover:via-[#5068dc] hover:to-[#7085e8] shadow-[0_12px_30px_rgba(63,86,197,0.35)] transition-all flex items-center justify-center gap-2"
              >
                <Video size={16} /> Start Interview
              </button>
              <div className="mt-3.5 rounded-lg border border-white/55 bg-white/45 px-3 py-2.5 flex items-center justify-between">
                <span className="text-[11px] text-slate-700">Best experience with headphones</span>
                <span className="text-[11px] font-semibold text-[#3f56c5]">Recommended</span>
              </div>
              <p className="text-[11px] text-slate-700 mt-3 text-center">
                Your browser will request camera and mic access
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // CALIBRATION / PRE-INTERVIEW SCREEN
  // ═══════════════════════════════════════════════════════
  if (isCalibrating && !joined) {
    // Process calibration based on stress updates containing yaw
    const handleCalibrationStress = (update) => {
      setStress(update);
      
      const yaw = update.features?.yaw || 0;
      const palm = update.features?.palm_detected || false;

      // We must use functional state update for calibrationStep to avoid stale closures inside this callback
      setCalibrationStep(prevStep => {
          if (prevStep === 0) {
            if (yaw > 12) {
              // Play success audio
              playSuccessHaptic();
              // Delay before transitioning
              setTimeout(() => {
                setCalibrationStep(1);
              }, 1200);
              return 0.5; // Interim state for success styling
            }
            return prevStep;
          } else if (prevStep === 1) {
             if (yaw < -12) {
               playSuccessHaptic();
               setTimeout(() => {
                 palmHoldStartRef.current = null;
                 palmStepCompletedRef.current = false;
                 setPalmHoldMs(0);
                 setCalibrationStep(2);
               }, 1200);
               return 1.5; // Interim state for success styling
             }
             return prevStep;
          } else if (prevStep === 2) {
             // Must hold a valid all-5-fingers-open palm continuously for 5s.
             if (palm) {
               if (!palmHoldStartRef.current) palmHoldStartRef.current = Date.now();
               const heldMs = Date.now() - palmHoldStartRef.current;
               const clampedMs = Math.min(heldMs, PALM_HOLD_REQUIRED_MS);
               setPalmHoldMs(clampedMs);

               if (heldMs >= PALM_HOLD_REQUIRED_MS && !palmStepCompletedRef.current) {
                 palmStepCompletedRef.current = true;
                 playSuccessHaptic();
                 setTimeout(() => {
                   setCalibrationStep(3);
                 }, 1200);
                 return 2.5; // success state
               }
               return prevStep;
             }

             // Any interruption resets hold progress.
             palmHoldStartRef.current = null;
             palmStepCompletedRef.current = false;
             if (palmHoldMs !== 0) setPalmHoldMs(0);
             return prevStep;
          } else if (prevStep === 3) {
             setTimeout(() => {
                setIsCalibrating(false);
                setJoined(true);
             }, 2000);
             return 4; // Moving to joining state
          }
          return prevStep;
      });
      setCurrentYaw(yaw);
    };

    const playSuccessHaptic = () => {
        // Simple Audio Context beep for success
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.type = 'sine';
            // Play a pleasant double-chime ascending (Success sound)
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
            
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
        } catch (e) {
            console.log("Audio not supported");
        }
    };

    // Calculate the 'display' step (treating .5 interim states as the original state just with a success wrapper)
    const displayStep = Math.floor(calibrationStep);
    const isSuccessState = calibrationStep % 1 !== 0;

    return (
      <div className="flex flex-col h-full bg-[#0a0a0f] text-slate-200">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-2xl bg-[#111118] border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/[0.06] text-center">
               <h3 className="text-2xl font-semibold mb-2">Camera Calibration</h3>
               <p className="text-sm text-slate-400">Let's make sure our face tracking works before we begin.</p>
            </div>
            
            <div className="p-6 flex flex-col items-center w-full">
              {/* Assistive Screens on Top */}
              <div className="w-full max-w-md h-[280px] relative flex flex-col items-center justify-center text-center mb-6">
                 
                 <AnimatePresence mode="wait">
                 {displayStep === 0 && (
                    <motion.div 
                        key="step0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                        <h4 className={`text-2xl font-semibold mb-2 transition-colors duration-300 ${isSuccessState ? 'text-emerald-400' : 'text-indigo-400'}`}>
                            {isSuccessState ? 'Perfect!' : 'Turn Head Left'}
                        </h4>
                        <p className={`text-sm mb-6 transition-colors duration-300 ${isSuccessState ? 'text-emerald-500/80' : 'text-slate-400'}`}>
                            {isSuccessState ? 'Tracking lock acquired.' : 'Slowly turn your head to the left to calibrate tracking.'}
                        </p>
                        
                        <motion.div 
                            animate={isSuccessState ? { scale: [1, 1.1, 1], borderColor: 'rgba(16, 185, 129, 0.6)', backgroundColor: 'rgba(16, 185, 129, 0.2)' } : {}}
                            transition={{ duration: 0.5 }}
                            className={`w-32 h-32 rounded-full border flex items-center justify-center transition-all duration-300 ${isSuccessState ? 'shadow-[0_0_50px_rgba(16,185,129,0.3)] border-emerald-500 bg-emerald-500/20' : 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.2)]'}`}
                        >
                           {isSuccessState ? (
                               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                                   <CheckCircle size={64} className="text-emerald-400" />
                               </motion.div>
                           ) : (
                               <video autoPlay loop muted playsInline className="w-32 h-32 object-cover rounded-full mix-blend-screen opacity-90">
                                  <source src="/right left.webm" type="video/webm" />
                               </video>
                           )}
                        </motion.div>
                    </motion.div>
                 )}

                 {displayStep === 1 && (
                    <motion.div 
                        key="step1"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                        <h4 className={`text-2xl font-semibold mb-2 transition-colors duration-300 ${isSuccessState ? 'text-emerald-400' : 'text-indigo-400'}`}>
                            {isSuccessState ? 'Great!' : 'Turn Head Right'}
                        </h4>
                        <p className={`text-sm mb-6 transition-colors duration-300 ${isSuccessState ? 'text-emerald-500/80' : 'text-slate-400'}`}>
                            {isSuccessState ? 'Opposite side calibrated.' : 'Now slowly turn your head to the right side.'}
                        </p>

                        <motion.div 
                            animate={isSuccessState ? { scale: [1, 1.1, 1], borderColor: 'rgba(16, 185, 129, 0.6)', backgroundColor: 'rgba(16, 185, 129, 0.2)' } : {}}
                            transition={{ duration: 0.5 }}
                            className={`w-32 h-32 rounded-full border flex items-center justify-center transition-all duration-300 ${isSuccessState ? 'shadow-[0_0_50px_rgba(16,185,129,0.3)] border-emerald-500 bg-emerald-500/20' : 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.2)]'}`}
                        >
                           {isSuccessState ? (
                               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                                   <CheckCircle size={64} className="text-emerald-400" />
                               </motion.div>
                           ) : (
                               <video autoPlay loop muted playsInline className="w-32 h-32 object-cover rounded-full mix-blend-screen opacity-90" style={{ transform: 'scaleX(-1)' }}>
                                  <source src="/right left.webm" type="video/webm" />
                               </video>
                           )}
                        </motion.div>
                    </motion.div>
                 )}

                 {displayStep === 2 && (
                    <motion.div 
                        key="step2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                        <h4 className={`text-2xl font-semibold mb-2 transition-colors duration-300 ${isSuccessState ? 'text-emerald-400' : 'text-emerald-400'}`}>
                            {isSuccessState ? 'Got it!' : 'Show Palm'}
                        </h4>
                        <p className={`text-sm mb-6 transition-colors duration-300 ${isSuccessState ? 'text-emerald-500/80' : 'text-slate-400'}`}>
                            {isSuccessState ? 'Hand detection confirmed.' : 'Keep all 5 fingers visible for 5 seconds.'}
                        </p>

                        {!isSuccessState && (
                          <div className="w-full max-w-[260px] mb-4">
                            <div className="flex items-center justify-between mb-1.5 text-[11px] text-slate-300">
                              <span>Hold Progress</span>
                              <span>{(palmHoldMs / 1000).toFixed(1)}s / 5.0s</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/15 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-150"
                                style={{ width: `${Math.min((palmHoldMs / PALM_HOLD_REQUIRED_MS) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <motion.div 
                            animate={isSuccessState ? { scale: [1, 1.1, 1], borderColor: 'rgba(16, 185, 129, 0.6)', backgroundColor: 'rgba(16, 185, 129, 0.3)' } : {}}
                            transition={{ duration: 0.5 }}
                            className={`w-32 h-32 rounded-full border flex items-center justify-center transition-all duration-300 ${isSuccessState ? 'shadow-[0_0_50px_rgba(16,185,129,0.4)] border-emerald-500 bg-emerald-500/30' : 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]'}`}
                        >
                           {isSuccessState ? (
                               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                                   <CheckCircle size={64} className="text-emerald-400" />
                               </motion.div>
                           ) : (
                               <video autoPlay loop muted playsInline className="w-32 h-32 object-cover rounded-full mix-blend-screen opacity-90">
                                  <source src="/risinghand.webm" type="video/webm" />
                               </video>
                           )}
                        </motion.div>
                    </motion.div>
                 )}

                 {displayStep >= 3 && (
                    <motion.div 
                        key="step3"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                        <h4 className="text-2xl font-semibold text-emerald-400 mb-2">Calibration Complete</h4>
                        <p className="text-slate-400 text-sm mb-6">Starting your interview now...</p>
                        <motion.div 
                            animate={{ scale: [1, 1.05, 1], boxShadow: ['0 0 50px rgba(16,185,129,0.3)', '0 0 80px rgba(16,185,129,0.6)', '0 0 50px rgba(16,185,129,0.3)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-32 h-32 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"
                        >
                           <CheckCircle size={64} className="text-emerald-400" />
                        </motion.div>
                    </motion.div>
                 )}
                 </AnimatePresence>
              </div>

              {/* Camera Panel on Bottom */}
              <div className="w-full max-w-sm aspect-video bg-black rounded-xl overflow-hidden border border-white/10 mb-6 relative">
                  <CameraPanel onStressUpdate={handleCalibrationStress} isCalibration={true} />
                  
                  {/* Current Yaw overlay inside camera for real-time feedback */}
                  {displayStep < 2 && !isSuccessState && (
                     <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-mono bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-indigo-300 border border-white/10 shadow-lg">
                        Yaw: {currentYaw > 0 ? '+' : ''}{currentYaw.toFixed(1)}°
                     </div>
                  )}
              </div>

              {/* Progress Indicator */}
              <div className="flex gap-2">
                 {[0,1,2].map((step) => (
                    <div key={step} className={`w-2 h-2 rounded-full transition-all duration-500 ${displayStep > step ? 'bg-emerald-500' : displayStep === step && isSuccessState ? 'bg-emerald-400 scale-125' : displayStep === step ? 'bg-indigo-500 scale-125' : 'bg-white/10'}`} />
                 ))}
              </div>
            </div>
            
            {/* Fallback skip button for debugging */}
            <div className="p-4 border-t border-white/[0.06] flex justify-center">
                <button onClick={() => { setIsCalibrating(false); setJoined(true); }} className="text-xs text-slate-500 hover:text-white transition-colors underline-offset-4 hover:underline">
                  Skip Calibration (Debug)
                </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════
  // LIVE INTERVIEW
  // ═══════════════════════════════════════════════════════
  const stressColor = !stress ? 'text-slate-500' :
    stress.level === 'calm' ? 'text-emerald-400' :
    stress.level === 'mild' ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="flex h-full">
      {/* LEFT: Camera */}
      <div className="w-[340px] shrink-0 border-r border-white/[0.06] bg-[#111118]">
        <CameraPanel onStressUpdate={setStress} onIdentityCheck={handleIdentityCheck} />
      </div>

      {/* RIGHT: Chat */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0f]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-14 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-200">Technical Interview</span>
          </div>

          {/* Identity badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-300 ${
            identityStatus === 'match' ? 'bg-emerald-500/10 text-emerald-400' :
            identityStatus === 'mismatch' ? 'bg-red-500/10 text-red-400' :
            'bg-white/[0.03] text-slate-500'
          }`}>
            {identityStatus === 'match' ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
            {identityStatus === 'match' ? 'Verified' :
             identityStatus === 'mismatch' ? `Mismatch (${identityFailCount}/3)` :
             'Identity'}
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${timeWarning ? 'bg-red-500/10' : 'bg-white/[0.03]'}`}>
            <Clock size={14} className={timeWarning ? 'text-red-400' : 'text-slate-500'} />
            <span className={`text-sm font-mono ${timeWarning ? 'text-red-400' : 'text-slate-400'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 interview-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.sender === 'user'
                  ? 'bg-violet-500/15'
                  : 'bg-emerald-500/15'
              }`}>
                {msg.sender === 'user'
                  ? <User size={14} className="text-violet-400" />
                  : <Bot size={14} className="text-emerald-400" />
                }
              </div>
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-violet-500/[0.08] border border-violet-500/15 text-slate-200'
                  : 'bg-white/[0.03] border border-white/[0.06] text-slate-300'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {(processing || isSpeaking) && (
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-500/15">
                <Bot size={14} className="text-emerald-400" />
              </div>
              <div className="flex items-center gap-2.5 px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500">
                  {processing ? 'Thinking...' : 'Speaking...'}
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Mic controls */}
        <div className="px-5 py-4 border-t border-white/[0.06] shrink-0">

          {/* Identity mismatch warning banner */}
          {identityBannerVisible && (
            <div className={`mb-3 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-300 ${
              identityFailCount >= 3
                ? 'border-red-500/40 bg-red-500/10 text-red-300'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-300'
            }`}>
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                {identityFailCount >= 3 ? (
                  <p className="font-semibold">Identity verification failed — interview is stopping.</p>
                ) : (
                  <>
                    <p className="font-semibold">Identity mismatch detected ({identityFailCount}/3 total)</p>
                    <p className="text-[11px] opacity-75 mt-0.5">The registered face does not match the webcam. Interview stops after 3 total failures.</p>
                  </>
                )}
              </div>
              {identityFailCount < 3 && (
                <button
                  onClick={() => setIdentityBannerVisible(false)}
                  className="shrink-0 text-[11px] opacity-60 hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              )}
            </div>
          )}

          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-[10px] uppercase tracking-[0.08em] text-slate-400">Interviewer Voice</span>
            <select
              value={voiceKey}
              onChange={(e) => setVoiceKey(e.target.value)}
              disabled={processing || isSpeaking}
              className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-[11px] text-slate-200 outline-none disabled:opacity-50"
            >
              {VOICE_OPTIONS.map((voice) => (
                <option key={voice.key} value={voice.key}>
                  {voice.label}
                </option>
              ))}
            </select>
          </div>

          <div
            className={`transition-all duration-300 overflow-hidden ${isSpeaking ? 'max-h-20 opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'}`}
            aria-hidden={!isSpeaking}
          >
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase tracking-[0.08em] text-slate-400">AI Voice</span>
                <span className="text-[10px] text-slate-500">{activeVoiceLabel} • SiriWave iOS9</span>
              </div>
                <div ref={waveContainerRef} className="w-full h-20" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            {isListening && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-medium text-red-400">Recording</span>
                <div className="flex gap-0.5 h-3 items-center ml-1">
                  {[3, 6, 4, 8, 5, 3, 7].map((h, i) => (
                    <div key={i} className="w-0.5 bg-red-400 rounded-full animate-pulse"
                      style={{ height: `${h * 1.5}px`, animationDelay: `${i * 0.08}s` }} />
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={toggleListening}
              disabled={processing || isSpeaking}
              className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                  : 'bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] hover:border-white/20'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {isListening
                ? <Square size={18} className="text-white" />
                : <Mic size={18} className="text-white" />
              }
            </button>

            {!isListening && (
              <span className="text-[11px] text-slate-500">
                {processing ? 'Processing...' : isSpeaking ? 'AI is speaking...' : 'Click mic to speak'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}