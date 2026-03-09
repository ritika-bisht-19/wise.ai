import { Link } from 'react-router-dom';
import { team, values } from '@/models/about.data';
import { useScrollReveal } from '@/controllers/useScrollReveal';

export default function AboutPage() {
  const heroRef = useScrollReveal();
  const missionRef = useScrollReveal();
  const valuesRef = useScrollReveal();
  const teamRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  return (
    <div className="flex flex-col gap-20 md:gap-28 pb-20 md:pb-28">
      {/* Hero */}
      <section ref={heroRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px] pt-12 md:pt-20">
        <div className="flex flex-col items-center text-center gap-6">
          <span className="px-4 py-1.5 rounded-full bg-[#EEF2FF] border border-[#C7D2FE] text-[#3730A3] text-sm font-matter font-medium reveal">
            Our Story
          </span>
          <h1 className="text-4xl md:text-[56px] font-season-mix leading-[120%] text-tx max-w-[720px] reveal" style={{ transitionDelay: '100ms' }}>
            Making interviews less terrifying
          </h1>
          <p className="text-lg md:text-xl text-[#666] font-matter max-w-[600px] leading-relaxed reveal" style={{ transitionDelay: '200ms' }}>
            W.I.S.E. was born from a simple observation: talented people fail interviews not because they lack skill, but because stress gets in the way.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section ref={missionRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="reveal-left">
            <h2 className="text-3xl md:text-[36px] font-season-mix leading-[135%] text-tx mb-4">Our Mission</h2>
            <p className="text-base text-[#666] font-matter leading-relaxed mb-4">
              We&apos;re building AI that understands not just what you say, but how you feel when you say it. By combining speech analysis, stress detection, and personalised coaching, we help candidates show their true potential.
            </p>
            <p className="text-base text-[#666] font-matter leading-relaxed">
              Founded in 2024, W.I.S.E. has already helped over 10,000 candidates across 50+ universities prepare for their dream roles — reducing interview anxiety by an average of 87%.
            </p>
          </div>
          <div className="w-full h-[320px] rounded-[28px] bg-gradient-to-br from-[#EEF2FF] to-[#C7D2FE] flex items-center justify-center reveal-scale" style={{ transitionDelay: '200ms' }}>
            <span className="text-6xl font-season-mix text-[#3730A3]/30">W</span>
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
        <h2 className="text-3xl md:text-[36px] font-season-mix leading-[135%] text-tx text-center mb-10 reveal">What We Believe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, idx) => (
            <div key={v.title} className="p-8 rounded-[24px] border border-[#f0f0f0] bg-white hover:border-[#C7D2FE] card-hover reveal" style={{ transitionDelay: `${150 + idx * 100}ms` }}>
              <h3 className="font-matter font-semibold text-lg text-tx mb-2">{v.title}</h3>
              <p className="font-matter text-base text-[#666] leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section ref={teamRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
        <h2 className="text-3xl md:text-[36px] font-season-mix leading-[135%] text-tx text-center mb-10 reveal">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((m, idx) => (
            <div key={m.name} className="flex flex-col items-center text-center p-6 rounded-[24px] border border-[#f0f0f0] bg-white card-hover reveal" style={{ transitionDelay: `${150 + idx * 100}ms` }}>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C7D2FE] to-[#A5BBFC] flex items-center justify-center text-white font-matter font-bold text-2xl mb-4">
                {m.initials}
              </div>
              <h3 className="font-matter font-semibold text-base text-tx">{m.name}</h3>
              <p className="font-matter text-sm text-[#3730A3] mb-2">{m.role}</p>
              <p className="font-matter text-sm text-[#666]">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
        <div className="rounded-[36px] bg-[#131313] px-8 md:px-16 py-12 md:py-16 flex flex-col items-center text-center reveal-scale">
          <h2 className="text-2xl md:text-[36px] font-season-mix text-white mb-3">Join us in our mission</h2>
          <p className="font-matter text-base text-white/60 mb-6 max-w-[400px]">We&apos;re always looking for talented people who care about education.</p>
          <Link to="/contact" className="px-8 py-3 rounded-full bg-white text-[#131313] font-season-mix font-medium text-base hover:bg-[#f5f5f5] btn-glow transition-colors">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
