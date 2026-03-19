import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/controllers/useScrollReveal';

export default function InterviewSupportSection() {
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} className="relative w-full overflow-x-clip py-8 md:py-10">
      <div
        className="right-0 left-0 top-1/2 absolute -translate-y-1/2 blur-[86px] h-3/5 overflow-hidden pointer-events-none opacity-72"
        style={{ transform: 'scaleX(2.4) scaleY(1.3)', background: 'linear-gradient(180deg, #f8ceb0 0%, #f6bc95 30%, #f2aa78 62%, #ea965b 100%)' }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-14"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27 viewBox=%270 0 200 200%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27200%27 height=%27200%27 filter=%27url(%23n)%27 opacity=%270.9%27/%3E%3C/svg%3E")',
          backgroundSize: '220px 220px',
          mixBlendMode: 'soft-light',
        }}
      />
      {/* Soft abstract blur blob - left side */}
      <div
        className="absolute inset-0 pointer-events-none opacity-12"
        style={{
          background:
            'radial-gradient(ellipse 800px 600px at -15% 35%, rgba(248, 206, 176, 0.4) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />
      {/* Soft abstract blur blob - right side */}
      <div
        className="absolute inset-0 pointer-events-none opacity-14"
        style={{
          background:
            'radial-gradient(ellipse 700px 550px at 110% 45%, rgba(232, 150, 91, 0.3) 0%, transparent 68%)',
          filter: 'blur(140px)',
        }}
      />
      {/* Ambient lighting glow - center-left */}
      <div
        className="absolute inset-0 pointer-events-none opacity-8"
        style={{
          background:
            'radial-gradient(circle 900px at 5% 50%, rgba(107, 91, 255, 0.08) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Ambient lighting glow - center-right */}
      <div
        className="absolute inset-0 pointer-events-none opacity-7"
        style={{
          background:
            'radial-gradient(circle 850px at 95% 40%, rgba(99, 130, 255, 0.06) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      {/* Soft warm glow - bottom center */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background:
            'radial-gradient(ellipse 600px 400px at 50% 95%, rgba(246, 188, 149, 0.15) 0%, transparent 60%)',
          filter: 'blur(90px)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-14"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27 viewBox=%270 0 200 200%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27200%27 height=%27200%27 filter=%27url(%23n)%27 opacity=%270.9%27/%3E%3C/svg%3E")',
          backgroundSize: '220px 220px',
          mixBlendMode: 'soft-light',
        }}
      />
      <div className="reveal relative mx-auto w-[92%] max-w-[1520px] p-5 md:p-8">
        {/* Section Heading */}
        <h2 className="font-season-mix font-bold w-full px-3 md:px-0 text-3xl md:text-[36px] text-[#1F2331] leading-[135%] text-center mb-12 md:mb-16">
          Three Steps to Interview Mastery
        </h2>

        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[1.08fr_1fr] lg:items-start">
          <div className="relative flex flex-col gap-5">
            <article className="support-step-card support-step-card--green">
              <div>
                <h4 className="font-system text-[24px] md:text-[28px] leading-[1.2] font-bold text-[#1F2331] tracking-tight">Upload your resume or CV</h4>
                <p className="mt-1.5 flex items-center gap-2 font-system text-[15px] md:text-[16px] font-medium text-[#75809A] leading-[1.5]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#7DA2FF]" />
                  We tailor questions to your real experience
                </p>
              </div>
            </article>

            <article className="support-step-card support-step-card--blue relative">
              <div>
                <h4 className="font-system text-[24px] md:text-[28px] leading-[1.2] font-bold text-[#1F2331] tracking-tight">Start your AI mock interview session</h4>
                <p className="mt-1.5 flex items-center gap-2 font-system text-[15px] md:text-[16px] font-medium text-[#75809A] leading-[1.5]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#8C7EFF]" />
                  Practice role-specific, realistic interview rounds
                </p>
              </div>

            </article>

            <article className="support-step-card support-step-card--neutral">
              <div>
                <h4 className="font-system text-[24px] md:text-[28px] leading-[1.2] font-bold text-[#1F2331] tracking-tight">Get detailed analysis and proper tips</h4>
                <p className="mt-1.5 flex items-center gap-2 font-system text-[15px] md:text-[16px] font-medium text-[#7E889F] leading-[1.5]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#9EA8BE]" />
                  Receive 3 strengths + 3 improvement tips after each round
                </p>
              </div>
            </article>
          </div>

          <div className="px-1 md:px-4 lg:px-8 lg:pt-2">
            <div className="inline-flex rounded-full border border-[#2A2F42]/28 bg-white/62 px-5 py-2.5 font-system text-[13px] md:text-[15px] font-semibold text-[#313B52] shadow-[0_4px_14px_rgba(36,50,88,0.08)] tracking-tight">
              Personalised to you and your job
            </div>

            <p className="mt-5 max-w-[680px] font-system text-[18px] md:text-[21px] leading-[1.6] font-regular text-[#455572]">
              Upload your resume or CV, start your AI mock interview session, and get a detailed report with practical guidance. Every session gives you clear, structured coaching you can apply in your next interview.
            </p>

            <div className="mt-9 flex flex-col items-start gap-5 font-system text-[16px] md:text-[18px] font-semibold text-[#263454]">
              <span className="inline-flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-[0_6px_14px_rgba(63,84,166,0.16)] flex-shrink-0"><Check size={17} color="#2D6AEF" strokeWidth={2.6} /></span>
                <span className="font-system text-[15px] md:text-[16px] font-medium">3 strengths after each round</span>
              </span>
              <span className="inline-flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-[0_6px_14px_rgba(63,84,166,0.16)] flex-shrink-0"><Check size={17} color="#2D6AEF" strokeWidth={2.6} /></span>
                <span className="font-system text-[15px] md:text-[16px] font-medium">3 proper improvement tips</span>
              </span>
              <span className="inline-flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-[0_6px_14px_rgba(63,84,166,0.16)] flex-shrink-0"><Check size={17} color="#2D6AEF" strokeWidth={2.6} /></span>
                <span className="font-system text-[15px] md:text-[16px] font-medium">Action plan for your next interview</span>
              </span>
            </div>

            <Link
              to="/interview"
              className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-[#1F2331] px-7 py-3 font-system text-[16px] md:text-[18px] font-semibold text-white shadow-[0_12px_28px_rgba(17,24,39,0.22)] transition-transform duration-300 hover:scale-[1.03]"
            >
              Start interview today
              <Sparkles size={18} color="#FFC857" strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
