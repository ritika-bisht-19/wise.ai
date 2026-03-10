import React from 'react';
import { CheckCircle2, AlertTriangle, Trophy } from 'lucide-react';

export default function FeedbackReport({ data }) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-500">Generating feedback...</span>
        </div>
      </div>
    );
  }

  const verdictColor = {
    hire: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'strong hire': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'no hire': 'text-red-400 bg-red-500/10 border-red-500/20',
    'lean hire': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'lean no hire': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  };
  const vClass = verdictColor[(data.hiring_verdict || '').toLowerCase()] || 'text-slate-400 bg-white/5 border-white/10';

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      {/* Score header */}
      <div className="flex items-end justify-between pb-6 border-b border-white/[0.06]">
        <div>
          <h2 className="text-xl font-bold text-white mb-3">Interview Results</h2>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${vClass}`}>
            <Trophy size={13} />
            {data.hiring_verdict}
          </div>
        </div>
        <div className="text-right">
          <div className="text-5xl font-bold text-white leading-none tabular-nums">
            {data.overall_score}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Overall Score</div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(data.detailed_metrics || {}).map(([key, value]) => (
          <div key={key} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] transition-colors">
            <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-2">
              {key.replace(/_/g, ' ')}
            </div>
            <div className="flex items-end gap-1.5">
              <span className="text-xl font-bold text-white tabular-nums">{value}</span>
              <span className="text-xs text-slate-600 mb-0.5">%</span>
            </div>
            <div className="mt-2.5 h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-violet-500 transition-all duration-700" style={{ width: `${Math.min(value, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Strengths & Gaps */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Strengths</h3>
          </div>
          <div className="space-y-2">
            {(data.strengths || []).map((s, i) => (
              <div key={i} className="px-4 py-3 rounded-lg bg-emerald-500/[0.03] border border-emerald-500/10 text-[13px] text-slate-300 leading-relaxed">{s}</div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-amber-500" />
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Areas to Improve</h3>
          </div>
          <div className="space-y-2">
            {(data.areas_for_improvement || []).map((a, i) => (
              <div key={i} className="px-4 py-3 rounded-lg bg-amber-500/[0.03] border border-amber-500/10 text-[13px] text-slate-300 leading-relaxed">{a}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}