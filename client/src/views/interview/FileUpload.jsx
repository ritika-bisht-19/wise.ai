import React, { useState, useRef } from 'react';
import { Upload, Shield, Zap, Loader2 } from 'lucide-react';

export default function FileUpload({ onUpload }) {
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');

  const processFile = async (file) => {
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) return;
    setFileName(file.name);
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await fetch('/api/upload-resume', { method: 'POST', body: formData });
      const data = await res.json();
      onUpload(data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); processFile(e.dataTransfer.files[0]); };

  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Upload Your Resume</h2>
          <p className="text-sm text-slate-500">We'll generate a personalized technical interview based on your experience.</p>
        </div>

        <label
          className={`group relative flex flex-col items-center justify-center w-full py-14 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
            dragOver ? 'border-violet-500/50 bg-violet-500/[0.04]'
            : loading ? 'border-white/10 bg-white/[0.01] cursor-wait'
            : 'border-white/[0.08] bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02]'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf" disabled={loading} />
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="text-violet-400 animate-spin" size={32} />
              <div className="text-center">
                <p className="text-sm font-medium text-white">{fileName}</p>
                <p className="text-xs text-slate-500 mt-1">Parsing resume...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4 group-hover:bg-violet-500/10 group-hover:border-violet-500/20 transition-all">
                <Upload size={22} className="text-slate-400 group-hover:text-violet-400 transition-colors" />
              </div>
              <p className="text-sm font-medium text-slate-300 mb-1">
                Drop your PDF here or <span className="text-violet-400">browse</span>
              </p>
              <p className="text-xs text-slate-600">PDF format only</p>
            </>
          )}
        </label>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <Shield size={16} className="text-emerald-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-slate-400">Private</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Data deleted after session</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <Zap size={16} className="text-violet-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-slate-400">12 Questions</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Deep technical interview</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}