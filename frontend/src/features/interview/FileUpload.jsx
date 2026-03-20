import React, { useState, useRef } from 'react';
import { Upload, Shield, Zap, Loader2, User } from 'lucide-react';

export default function FileUpload({ onUpload }) {
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  
  const [role, setRole] = useState('Software Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [interviewType, setInterviewType] = useState('technical');
  const [resumeText, setResumeText] = useState('');

  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const processFile = async (file) => {
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) return;
    setFileName(file.name);
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await fetch('/api/upload-resume', { method: 'POST', body: formData });
      const data = await res.json();
      setResumeText(data.text);
      setStep(2); // Move to role setup and photo upload
    } catch (err) {
      console.error(err);
      alert("An error occurred extracting the resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Show preview
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
    setPhoto(file);
    
    // Register Face via FastAPI
    const fd = new FormData();
    fd.append('file', file);
    try {
      await fetch('http://localhost:8001/api/register-face', { method: 'POST', body: fd });
    } catch (err) {
      console.error("Face registration failed:", err);
    }
  };

  const handleStartSession = () => {
    if (!photo) {
      alert("Please upload your photo to be verified during the interview.");
      return;
    }
    
    onUpload({
      resumeText,
      role,
      jobDescription,
      interviewType
    });
  };

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

      <div className="relative w-full px-4 md:px-8 py-20">
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left narrative panel */}
          <div className="lg:col-span-5 rounded-[28px] border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.55)] backdrop-blur-[16px] p-6 md:p-8 lg:p-10 flex flex-col justify-between shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C7D2FE]/70 bg-[#EEF2FF]/70 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#3446a8]">
                W.I.S.E. Live Interview
              </div>

              <h2 className="mt-5 text-[30px] md:text-[40px] leading-[1.12] font-season-mix text-slate-900">
                Upload your resume to start a focused mock interview
              </h2>

              <p className="mt-4 text-[14px] md:text-[15px] leading-relaxed text-slate-700 max-w-[48ch]">
                We analyze your experience and generate role-relevant technical questions with real-time behavioral tracking.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  'Role-aware question flow tailored to your profile',
                  'Behavioral Stability analysis during responses',
                  'Comprehensive post-interview feedback report',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-white/50 bg-white/45 px-3.5 py-2.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5b73e8]" />
                    <span className="text-[13px] text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.12] px-3.5 py-3">
                <p className="text-[11px] uppercase tracking-[0.08em] text-emerald-800">Privacy</p>
                <p className="mt-1 text-[12px] text-slate-800">Your file is used only for this session context.</p>
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.12] px-3.5 py-3">
                <p className="text-[11px] uppercase tracking-[0.08em] text-amber-800">Format</p>
                <p className="mt-1 text-[12px] text-slate-800">PDF only, parsed in a few seconds.</p>
              </div>
            </div>
          </div>

          {/* Right upload panel */}
          <div className="lg:col-span-7 rounded-[28px] border border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.55)] backdrop-blur-[16px] p-5 md:p-7 lg:p-8 flex flex-col justify-center shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            {step === 1 ? (
              <div className="mx-auto w-full max-w-2xl">
                <div className="mb-5 md:mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#3f56c5] text-white flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="text-[20px] md:text-[24px] leading-tight font-season-mix text-slate-900">Resume Upload</h3>
                    <p className="mt-1 text-sm text-slate-700">Drop your resume below to begin.</p>
                  </div>
                </div>

                <label
                  className={`group relative flex flex-col items-center justify-center w-full min-h-[260px] md:min-h-[260px] rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
                    dragOver
                    ? 'border-[#6f86ec] bg-[#c8d3ff]/55 shadow-[0_0_0_1px_rgba(111,134,236,0.45),0_16px_40px_rgba(70,95,190,0.20)]'
                    : loading
                      ? 'border-white/55 bg-white/45 cursor-wait'
                      : 'border-white/60 bg-white/40 hover:border-white/80 hover:bg-white/55'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf" disabled={loading} />

                  <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: 'radial-gradient(700px 260px at 50% 100%, rgba(165,187,252,0.22), transparent 70%)' }} />

                  {loading ? (
                    <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
                      <div className="relative w-14 h-14 flex items-center justify-center rounded-2xl border border-[#6f86ec]/40 bg-[#dbe3ff]/65">
                        <Loader2 className="text-[#4d63cf] animate-spin" size={28} />
                      </div>
                      <div>
                        <p className="text-sm md:text-base font-semibold text-slate-900 truncate max-w-[320px]">{fileName}</p>
                        <p className="text-xs md:text-sm text-slate-700 mt-1">Analyzing resume and extracting context...</p>
                      </div>
                      <div className="w-full max-w-[320px] h-1.5 rounded-full bg-slate-300/60 overflow-hidden mt-2">
                        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#A5BBFC] via-[#BED2FF] to-[#FFB36B] animate-pulse" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative z-10 flex flex-col items-center text-center px-6">
                      <div className="w-16 h-16 rounded-2xl border border-white/60 bg-white/55 flex items-center justify-center mb-5 transition-colors group-hover:bg-[#dce4ff] group-hover:border-[#6f86ec]">
                        <Upload size={24} className="text-slate-700 group-hover:text-[#4d63cf] transition-colors" />
                      </div>
                      <p className="text-base md:text-lg font-semibold text-slate-900 mb-1.5">
                        Drop your PDF here or <span className="text-[#3f56c5]">browse files</span>
                      </p>
                      <p className="text-xs md:text-sm text-slate-700">Max file size 10MB • PDF format only</p>
                    </div>
                  )}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 md:mt-5">
                  <div className="flex items-start gap-3 rounded-xl border border-white/55 bg-white/45 px-4 py-3">
                    <Shield size={16} className="text-emerald-700 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[12px] font-semibold text-slate-900">Private Session</p>
                      <p className="text-[11px] text-slate-700 mt-0.5">Processed only for interview personalization</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-white/55 bg-white/45 px-4 py-3">
                    <Zap size={16} className="text-[#3f56c5] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[12px] font-semibold text-slate-900">Rapid Setup</p>
                      <p className="text-[11px] text-slate-700 mt-0.5">Interview starts in seconds after parsing</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-2xl flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#3f56c5] text-white flex items-center justify-center font-bold text-sm">2</div>
                    <div>
                      <h3 className="text-[20px] md:text-[24px] leading-tight font-season-mix text-slate-900">Role & Verification Setup</h3>
                    </div>
                  </div>

                  <div className="bg-white/60 rounded-2xl p-5 border border-white/40">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Target Role *</label>
                    <input 
                      type="text" 
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-white/70 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3f56c5]/50"
                      placeholder="e.g. Frontend Developer"
                    />
                    
                    <div className="mt-4 flex gap-3">
                      <button 
                        onClick={() => setInterviewType('technical')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${interviewType === 'technical' ? 'bg-[#3f56c5] text-white' : 'bg-white/50 text-slate-600 hover:bg-white/80'}`}
                      >
                        Technical
                      </button>
                      <button 
                        onClick={() => setInterviewType('behavioral')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${interviewType === 'behavioral' ? 'bg-[#3f56c5] text-white' : 'bg-white/50 text-slate-600 hover:bg-white/80'}`}
                      >
                        Behavioral
                      </button>
                    </div>

                    <label className="block mt-4 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Job Description (Optional)</label>
                    <textarea 
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full bg-white/70 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#3f56c5]/50"
                      placeholder="Paste jd here..."
                    />
                  </div>

                  <div className="bg-white/60 rounded-2xl p-5 border border-white/40 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Identity Verification</p>
                      <p className="text-xs text-slate-600 mt-1 max-w-[250px]">Upload a photo of your face. We use this to verify it's you during the video interview.</p>
                    </div>
                    
                    <label className={`w-20 h-20 shrink-0 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-colors ${photoPreview ? 'border-emerald-500' : 'border-[#3f56c5]/40 hover:border-[#3f56c5] bg-white'}`}>
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      {photoPreview ? (
                        <img src={photoPreview} alt="User Face" className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-slate-400" />
                      )}
                    </label>
                  </div>

                  <button 
                    onClick={handleStartSession}
                    disabled={!photo || !role}
                    className="w-full py-4 rounded-xl bg-slate-900 text-white font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Start Session
                  </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}