import { ArrowUp, Briefcase, Calendar, Code2, Flame, MessageSquare, Mic, Sparkles, User, Video } from 'lucide-react';
import { useScrollReveal } from '@/controllers/useScrollReveal';

export default function InterviewSupportSection() {
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} className="mx-auto w-[96%] max-w-[2048px]">
      <div className="reveal" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-5 md:gap-6">
          <div className="flex min-h-[420px] flex-col overflow-hidden rounded-[34px] border border-[#E7E8EB] bg-[#F3F4F6] px-5 pt-5 pb-4 md:col-span-3 md:min-h-[460px] md:px-9 md:pt-8 md:pb-6">
            <h3 className="mb-2 font-[Inter] text-[20px] leading-[26px] font-semibold text-[#1C1D20] sm:text-[24px] sm:leading-[30px]">
              Answer Clearly Under Pressure
            </h3>
            <p className="mb-4 font-[Inter] text-[14px] leading-[20px] font-medium text-[#6B7280]">
              When a question catches you off guard Interview Copilot listens understands context and delivers a structured answer within seconds.
            </p>

            <div className="mt-auto flex flex-col items-center gap-9">
              <div className="flex max-w-[360px] items-center gap-3 rounded-2xl bg-white px-3 py-2.5" style={{ boxShadow: '0 19.778px 52.741px 0 rgba(255, 72, 0, 0.20)' }}>
                <div className="flex size-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-[#e5e7eb] bg-[linear-gradient(135deg,#94a3b8,#e2e8f0)]">
                  <User size={14} color="#ffffff" strokeWidth={2.4} />
                </div>
                <div className="flex flex-1 items-center gap-[3px]">
                  {Array.from({ length: 22 }).map((_, i) => (
                    <div key={`dot-${i}`} className="h-[3px] w-[3px] rounded-full" style={{ backgroundColor: i < 6 ? 'rgb(209, 213, 219)' : 'rgb(255, 72, 0)' }} />
                  ))}
                  {[8, 12, 14, 16, 18, 14, 20, 16, 20, 12].map((h, i) => (
                    <div
                      key={`bar-${i}`}
                      className="w-[3px] rounded-full bg-[#FF4800]"
                      style={{ height: `${h}px`, animation: `idleBarBounce 2.5s ease-in-out ${i * 0.2}s infinite` }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex w-full items-center justify-center gap-3 lg:gap-4">
                <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-[#D1D5DB] bg-[#BFC1C5] px-3 py-2 lg:px-5 lg:py-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F7CAC0]">
                    <MessageSquare size={13} color="#FFFFFF" strokeWidth={2.2} />
                  </span>
                  <span className="font-[Inter] text-[14px] font-semibold text-[#ECECEC]">CoPilot Answer 1</span>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-[#5a5a5a] bg-[#161B26] px-5 py-3 shadow-[0_8px_18px_rgba(0,0,0,0.22)]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#FF4800]">
                    <MessageSquare size={14} color="#FFFFFF" strokeWidth={2.2} />
                  </span>
                  <span className="font-[Inter] text-[16px] font-bold text-white">Best Answer</span>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-[#D1D5DB] bg-[#BFC1C5] px-3 py-2 lg:px-5 lg:py-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#F7CAC0]">
                    <MessageSquare size={13} color="#FFFFFF" strokeWidth={2.2} />
                  </span>
                  <span className="font-[Inter] text-[14px] font-semibold text-[#ECECEC]">CoPilot Answer 3</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[420px] flex-col overflow-hidden rounded-[34px] border border-[#E7E8EB] bg-[#F3F4F6] p-5 md:col-span-2 md:min-h-[460px] md:p-8">
            <h3 className="mb-2 font-[Inter] text-[20px] leading-[26px] font-semibold text-[#1C1D20] sm:text-[24px] sm:leading-[30px]">
              Get Better After Every Interview
            </h3>
            <p className="mb-4 font-[Inter] text-[14px] leading-[20px] font-medium text-[#6B7280]">
              After each interview you see exactly what was asked how you responded and what to improve before the next round.
            </p>

            <div className="relative mt-auto max-w-[420px]">
              <div className="absolute right-0 bottom-[20%] z-10 flex flex-col items-start gap-2 md:right-[-7%]">
                {[
                  ['#FF9D80', 'AI improvements'],
                  ['#7C3AED', 'Speech patterns'],
                  ['#2563EB', 'Speech Clarity'],
                  ['#16A34A', 'Engagement'],
                ].map(([color, label]) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold text-white shadow-md"
                    style={{
                      backgroundColor: color,
                    }}
                  >
                    <span className="flex h-4 w-4 items-center justify-center">
                      {label === 'AI improvements' && <Sparkles size={14} color="#FFFFFF" strokeWidth={2.4} />}
                      {label === 'Speech patterns' && <MessageSquare size={14} color="#FFFFFF" strokeWidth={2.4} />}
                      {label === 'Speech Clarity' && <Mic size={14} color="#FFFFFF" strokeWidth={2.4} />}
                      {label === 'Engagement' && <Flame size={14} color="#FFFFFF" strokeWidth={2.4} />}
                    </span>
                    {label}
                  </span>
                ))}
              </div>

              <div className="absolute bottom-0 left-0 w-[62%] max-w-[320px] rounded-3xl bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                <div className="space-y-3">
                  <div className="h-4 w-20 rounded bg-[#eceef1]" />
                  <div className="h-4 w-16 rounded bg-[#eceef1]" />
                  <div className="h-4 w-24 rounded bg-[#eceef1]" />
                </div>
                <div className="mt-2 text-center">
                  <p className="font-[Inter] text-[68px] font-semibold leading-none text-[#FF4800]">98</p>
                  <p className="font-[Inter] text-[18px] font-semibold text-[#374151]">Total score</p>
                </div>
                <div className="mt-3 space-y-3">
                  <div className="h-4 w-full rounded bg-[#eceef1]" />
                  <div className="h-4 w-full rounded bg-[#eceef1]" />
                  <div className="h-4 w-full rounded bg-[#eceef1]" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[300px] flex-col overflow-hidden rounded-[34px] border border-[#E7E8EB] bg-[#F3F4F6] p-5 md:col-span-2 md:min-h-[300px] md:p-8">
            <h3 className="mb-2 font-[Inter] text-[20px] leading-[26px] font-semibold text-[#1C1D20] sm:text-[24px] sm:leading-[30px]">
              Works on Any Platform
            </h3>
            <p className="mb-4 font-[Inter] text-[14px] leading-[20px] font-medium text-[#6B7280]">
              No matter where your interview takes place Interview Copilot works in real time across all major interview platforms.
            </p>

            <div className="mt-auto flex items-center justify-center pb-1">
              <div className="relative h-[150px] w-[150px] rounded-full border-2 border-dashed border-[#d9dce2]">
                <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FF4800] text-white shadow-md">
                  <Sparkles size={24} color="#FFFFFF" strokeWidth={2.2} />
                </div>
                <div className="absolute left-[12%] top-[20%] flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"><Briefcase size={16} color="#6b7280" /></div>
                <div className="absolute right-[10%] top-[16%] flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"><Video size={16} color="#3b82f6" /></div>
                <div className="absolute right-[10%] bottom-[22%] flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"><Code2 size={16} color="#ef4444" /></div>
                <div className="absolute left-[16%] bottom-[16%] flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"><Calendar size={16} color="#8b5cf6" /></div>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[300px] flex-col overflow-hidden rounded-[34px] border border-[#E7E8EB] bg-[#F3F4F6] p-5 md:col-span-3 md:min-h-[300px] md:p-8">
            <h3 className="mb-2 font-[Inter] text-[20px] leading-[26px] font-semibold text-[#1C1D20] sm:text-[24px] sm:leading-[30px]">
              Answers That Sound Like You
            </h3>
            <p className="mb-4 font-[Inter] text-[14px] leading-[20px] font-medium text-[#6B7280]">
              Responses are generated from your resume and job details so you sound specific credible and senior rather than generic.
            </p>

            <div className="mt-auto flex items-center justify-center pb-1 md:justify-end md:pr-8">
              <div className="relative w-[170px] rounded-2xl bg-white p-3 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
                <div className="mb-2 flex items-center justify-between text-[10px] font-semibold text-[#4b5563]">
                  <div className="flex items-center gap-1">
                    <div className="h-4 w-4 rounded-full bg-[#94a3b8]" />
                    <span>Your Resume</span>
                  </div>
                  <ArrowUp size={13} color="#16A34A" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded bg-[#eceef1]" />
                  <div className="h-2 w-[86%] rounded bg-[#f6d4c9]" />
                  <div className="h-2 w-[74%] rounded bg-[#eceef1]" />
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-full bg-[#111827] px-3 py-2 text-white">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-[#FF4800]">
                    <MessageSquare size={11} color="#fff" />
                  </span>
                  <span className="text-[11px] font-semibold">CoPilot</span>
                  <div className="ml-auto flex items-center gap-[2px]">
                    {[6, 10, 14, 10, 14, 9].map((h, i) => (
                      <div key={i} className="w-[2.5px] rounded-full bg-[#FF4800]" style={{ height: h }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
