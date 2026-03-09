import { usePricingToggle } from '@/controllers/usePricingToggle';
import { useScrollReveal } from '@/controllers/useScrollReveal';
import { plans } from '@/models/pricing.data';

export default function PricingSection() {
  const { annual, toggleAnnual } = usePricingToggle();
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
      <div className="flex flex-col items-center gap-4 mb-12 reveal">
        <h2 className="text-3xl md:text-[40px] font-season-mix leading-[130%] text-tx text-center">
          Built to fit every learner&apos;s journey
        </h2>
        <p className="text-base md:text-lg text-[#666] font-matter text-center max-w-[480px]">
          Start free. Upgrade when you&apos;re ready. Cancel anytime.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className={`text-sm font-matter ${!annual ? 'text-tx font-medium' : 'text-[#999]'}`}>Monthly</span>
          <button
            onClick={toggleAnnual}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${annual ? 'bg-[#3730A3]' : 'bg-[#e6e6e6]'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${annual ? 'translate-x-6' : ''}`} />
          </button>
          <span className={`text-sm font-matter ${annual ? 'text-tx font-medium' : 'text-[#999]'}`}>
            Annual <span className="text-[#3730A3] font-medium">(-20%)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <div
            key={plan.name}
            className={`flex flex-col p-8 rounded-[28px] border card-hover reveal ${
              plan.popular
                ? 'bg-[#131313] text-white border-[#333] shadow-2xl scale-[1.02]'
                : 'bg-white border-[#f0f0f0] hover:border-[#C7D2FE]'
            }`}
            style={{ transitionDelay: `${200 + idx * 150}ms` }}
          >
            {plan.popular && (
              <span className="self-start px-3 py-1 rounded-full bg-[#FF8717] text-white text-xs font-matter font-semibold mb-4">
                MOST POPULAR
              </span>
            )}
            <h3 className={`font-matter font-semibold text-lg mb-1 ${plan.popular ? 'text-white' : 'text-tx'}`}>
              {plan.name}
            </h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className={`text-4xl font-season-mix font-medium ${plan.popular ? 'text-white' : 'text-tx'}`}>
                {plan.price === 'Custom' ? 'Custom' : annual && plan.price !== '$0' ? `$${Math.round(parseInt(plan.price.slice(1)) * 0.8)}` : plan.price}
              </span>
              {plan.period && (
                <span className={`text-sm font-matter ${plan.popular ? 'text-[#999]' : 'text-[#999]'}`}>
                  {plan.period}
                </span>
              )}
            </div>
            <p className={`text-sm font-matter mb-6 ${plan.popular ? 'text-[#999]' : 'text-[#666]'}`}>
              {plan.description}
            </p>
            <button
              className={`w-full py-3 rounded-full font-matter font-medium text-sm transition-all duration-300 mb-6 ${plan.ctaStyle}`}
            >
              {plan.cta}
            </button>
            <ul className="flex flex-col gap-3">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 shrink-0"
                    stroke={plan.popular ? '#A5BBFC' : '#3730A3'}
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className={`text-sm font-matter ${plan.popular ? 'text-[#ccc]' : 'text-[#666]'}`}>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
