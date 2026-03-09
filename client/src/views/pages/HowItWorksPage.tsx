import { Link } from 'react-router-dom';
import { steps } from '@/models/howItWorks.data';
import { useScrollReveal } from '@/controllers/useScrollReveal';

export default function HowItWorksPage() {
  const heroRef = useScrollReveal();
  const stepsRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  return (
    <div className="flex flex-col gap-20 md:gap-28 pb-20 md:pb-28">
      {/* Hero */}
      <section ref={heroRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px] pt-12 md:pt-20">
        <div className="flex flex-col items-center text-center gap-6">
          <span className="px-4 py-1.5 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#3730A3] text-sm font-matter font-medium reveal">
            How It Works
          </span>
          <h1 className="text-4xl md:text-[56px] font-season-mix leading-[120%] text-tx max-w-[640px] reveal" style={{ transitionDelay: '100ms' }}>
            Four steps to interview confidence
          </h1>
          <p className="text-lg text-[#666] font-matter max-w-[500px] reveal" style={{ transitionDelay: '200ms' }}>
            From sign-up to offer letter — here&apos;s how W.I.S.E. gets you there.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section ref={stepsRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
        <div className="flex flex-col gap-12">
          {steps.map((step, i) => (
            <div key={step.number} className={`flex flex-col md:flex-row gap-8 md:gap-16 items-start ${i % 2 === 1 ? 'md:flex-row-reverse' : ''} ${i % 2 === 0 ? 'reveal-left' : 'reveal'}`} style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="flex-1">
                <span className="font-matter font-bold text-5xl text-[#EEF2FF]">{step.number}</span>
                <h2 className="text-2xl md:text-[30px] font-season-mix text-tx mt-2 mb-3">{step.title}</h2>
                <p className="font-matter text-base text-[#666] leading-relaxed mb-4">{step.description}</p>
                <ul className="flex flex-col gap-2">
                  {step.details.map((d) => (
                    <li key={d} className="flex items-center gap-2 font-matter text-sm text-[#666]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3730A3" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full md:w-[400px] h-[260px] rounded-[28px] bg-gradient-to-br from-[#f5f5f5] to-[#e6e6e6] flex items-center justify-center shrink-0">
                <span className="text-7xl font-season-mix text-[#ccc]">{step.number}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
        <div className="flex flex-col items-center text-center gap-4 reveal">
          <h2 className="text-2xl md:text-[36px] font-season-mix text-tx">Ready to start?</h2>
          <p className="font-matter text-base text-[#666]">No credit card required. Free plan available.</p>
          <Link to="/pricing" className="px-8 py-3.5 rounded-full bg-[#131313] text-white font-season-mix font-medium text-base hover:bg-[#333] btn-glow transition-colors">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
