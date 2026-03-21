// InterviewPage.tsx
// Full interview engine embedded in the W.I.S.E. marketing site.

import { useState } from 'react';
import { ArrowLeft, Radio } from 'lucide-react';

// @ts-ignore
import Navbar from '../components/Navbar';
// @ts-ignore
// @ts-ignore
import FileUpload from '../features/interview/FileUpload';
// @ts-ignore
import InterviewChat from '../features/interview/InterviewChat';
// @ts-ignore
import FeedbackReport from '../features/interview/FeedbackReport';

type Stage = 'upload' | 'interview' | 'feedback';
type ProgressPhase = 'resume' | 'role' | 'calibration' | 'interview';

const PHASE_ORDER: ProgressPhase[] = ['resume', 'role', 'calibration', 'interview'];
const PHASE_LABELS: Record<ProgressPhase, string> = {
    resume: 'Resume Upload',
    role: 'Role & Verification',
    calibration: 'Calibration',
    interview: 'Interview',
};

export default function InterviewPage() {
    const [stage, setStage] = useState<Stage>('upload');
    const [resumeText, setResumeText] = useState('');
    const [feedbackData, setFeedbackData] = useState<object | null>(null);
    const [progressPhase, setProgressPhase] = useState<ProgressPhase>('resume');

    const handleUploadSuccess = (payload: any) => {
        const resolvedResumeText = typeof payload === 'string'
            ? payload
            : (payload?.resumeText || '');

        setResumeText(resolvedResumeText);
        setStage('interview');
        setProgressPhase('calibration');
    };

    const handleInterviewEnd = async (history: object[], analytics?: { voiceAnalytics?: object; behavioralAnalytics?: object }) => {
        setStage('feedback');
        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history,
                    resumeText,
                    voiceAnalytics: analytics?.voiceAnalytics,
                    behavioralAnalytics: analytics?.behavioralAnalytics,
                }),
            });
            const data = await res.json();
            setFeedbackData(data);
        } catch (e) {
            console.error('Feedback error:', e);
        }
    };

    const handleRestart = () => {
        setStage('upload');
        setFeedbackData(null);
        setResumeText('');
        setProgressPhase('resume');
    };

    const currentPhaseIndex = PHASE_ORDER.indexOf(progressPhase);
    const progressPct = ((currentPhaseIndex + 1) / PHASE_ORDER.length) * 100;

    return (
        <div className="h-screen bg-[#0a0a0f] text-slate-300 overflow-hidden antialiased flex flex-col selection:bg-violet-500/30">
            {/* Top bar */}
            <header className="h-14 flex items-center justify-between px-5 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl z-50 shrink-0">
                <a
                    href="/"
                    className="group flex items-center gap-2.5 text-xs font-semibold text-slate-500 hover:text-white transition-colors"
                >
                    <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span className="hidden sm:inline">Exit</span>
                </a>

                <div className="flex items-center gap-2.5">
                    <div className="relative flex items-center justify-center w-2 h-2">
                        <div className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" />
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                        W.I.S.E. <span className="text-emerald-500">Live</span>
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Radio size={14} className="text-slate-600" />
                    <span className="text-xs font-medium text-slate-600">v1.0</span>
                </div>
            </header>

            {stage !== 'interview' && (
                <div className="shrink-0 border-b border-white/[0.05] bg-[#090d18]/80 backdrop-blur-xl px-4 md:px-6 py-3">
                    <div className="mx-auto max-w-[1200px]">
                        <div className="grid grid-cols-4 gap-2 md:gap-4 mb-2.5">
                            {PHASE_ORDER.map((item, index) => {
                                const isDone = index < currentPhaseIndex;
                                const isActive = item === progressPhase;
                                return (
                                    <div key={item} className="flex items-center justify-center md:justify-start gap-2 min-w-0">
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors ${
                                                isDone
                                                    ? 'bg-emerald-500 text-[#03120a]'
                                                    : isActive
                                                        ? 'bg-[#4f63d8] text-white'
                                                        : 'bg-slate-700/70 text-slate-300'
                                            }`}
                                        >
                                            {isDone ? '✓' : index + 1}
                                        </div>
                                        <span
                                            className={`text-[10px] sm:text-[11px] md:text-xs font-medium truncate ${
                                                isDone ? 'text-emerald-300' : isActive ? 'text-white' : 'text-slate-400'
                                            }`}
                                            title={PHASE_LABELS[item]}
                                        >
                                            {PHASE_LABELS[item]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[#7e92ff] via-[#60a5fa] to-[#34d399] transition-all duration-500"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Main content */}
            <main className="flex-1 overflow-hidden">
                {stage === 'upload' && <FileUpload onUpload={handleUploadSuccess} onProgressChange={setProgressPhase} />}
                {stage === 'interview' && (
                    <InterviewChat resumeText={resumeText} onEnd={handleInterviewEnd} onProgressChange={setProgressPhase} />
                )}
                {stage === 'feedback' && (
                    <div className="h-full overflow-y-auto">
                        <FeedbackReport data={feedbackData} />
                        <div className="flex justify-center py-8">
                            <button
                                onClick={handleRestart}
                                className="px-6 py-2.5 bg-white text-[#0a0a0f] font-semibold rounded-lg text-sm hover:bg-slate-200 transition-colors"
                            >
                                Start New Session
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
