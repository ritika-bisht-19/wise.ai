import { useState, useEffect, useRef } from 'react';
import { Mic, Square, Clock, Video, CheckCircle, Bot, User } from 'lucide-react';
import CameraPanel from './CameraPanel';

export default function InterviewChat({ resumeText, onEnd }) {
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [processing, setProcessing] = useState(false);
  const [stress, setStress] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const messagesEndRef = useRef(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!joined || hasStarted.current) return;
    hasStarted.current = true;
    sendMessage('START', true);
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      }
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
    setIsSpeaking(true);
    try {
      const res = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 500) })
      });
      if (!res.ok) throw new Error('TTS failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(url); setIsSpeaking(false); audioRef.current = null; };
      audio.onerror = () => { setIsSpeaking(false); audioRef.current = null; };
      await audio.play();
    } catch (e) {
      console.error('TTS error:', e);
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

  // ═══════════════════════════════════════════════════════
  // JOIN SCREEN
  // ═══════════════════════════════════════════════════════
  if (!joined) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-white/[0.05] flex items-center justify-center mb-6">
            <Video size={24} className="text-slate-300" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Ready to Begin</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            AI-powered mock interview with real-time stress analysis.
          </p>

          <div className="space-y-2 mb-8 text-left">
            {[
              'Camera & microphone required',
              'Real-time facial analysis',
              '12-turn technical interview',
              'AI voice responses',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                <span className="text-xs text-slate-400">{item}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setJoined(true)}
            className="w-full py-3.5 bg-white text-[#0a0a0f] font-semibold rounded-xl hover:bg-slate-100 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Video size={16} /> Start Interview
          </button>
          <p className="text-[10px] text-slate-600 mt-3">
            Your browser will request camera & mic access
          </p>
        </div>
      </div>
    );
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
        <CameraPanel onStressUpdate={setStress} />
      </div>

      {/* RIGHT: Chat */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0f]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-14 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-200">Technical Interview</span>
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