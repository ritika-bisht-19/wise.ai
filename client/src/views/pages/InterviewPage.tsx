// InterviewPage.tsx
// Full interview engine embedded in the W.I.S.E. marketing site.

import { useState } from 'react';
import { ArrowLeft, Radio } from 'lucide-react';

// @ts-ignore
import FileUpload from '@/views/interview/FileUpload';
// @ts-ignore
import InterviewChat from '@/views/interview/InterviewChat';
// @ts-ignore
import FeedbackReport from '@/views/interview/FeedbackReport';

type Stage = 'upload' | 'interview' | 'feedback';

export default function InterviewPage() {
    const [stage, setStage] = useState<Stage>('upload');
    const [resumeText, setResumeText] = useState('');
    const [feedbackData, setFeedbackData] = useState<object | null>(null);

    const handleUploadSuccess = (text: string) => {
        setResumeText(text);
        setStage('interview');
    };

    const handleInterviewEnd = async (history: object[]) => {
        setStage('feedback');
        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history, resumeText }),
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
    };

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

            {/* Main content */}
            <main className="flex-1 overflow-hidden">
                {stage === 'upload' && <FileUpload onUpload={handleUploadSuccess} />}
                {stage === 'interview' && (
                    <InterviewChat resumeText={resumeText} onEnd={handleInterviewEnd} />
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
