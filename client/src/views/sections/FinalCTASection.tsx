import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/controllers/useScrollReveal';

export default function FinalCTASection() {
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} className="relative mx-auto mb-10 md:mb-0 w-[90%] md:w-10/12 max-w-[1400px]">
      <div className="bg-white rounded-[48px] md:rounded-[72px] border border-st p-3 md:p-5 reveal-scale">
        <div className="relative flex flex-col justify-center items-center shadow-[0px_0px_0px_1px_rgba(0,0,0,0.05)] rounded-[36px] md:rounded-[60px] min-h-[580px] md:min-h-[740px] overflow-hidden py-24 md:py-36 gap-12 md:gap-14" style={{ background: 'linear-gradient(135deg, #2b2a4a 0%, #3d3a6e 35%, #35335c 65%, #6860a8 100%)' }}>
          {/* White Noise Overlay */}
          <div className="absolute inset-0 opacity-60 rotate-180 pointer-events-none mix-blend-soft-light" style={{ backgroundImage: 'url(/assets/images/white-noise.webp)', backgroundSize: '512px 512px', backgroundPosition: 'top left' }} />
          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle, rgba(120,100,200,0.35) 0%, transparent 70%)' }} />
          {/* Title */}
          <div className="z-10 px-4 w-10/12 max-w-[900px] font-season-mix text-white text-5xl md:text-[68px] text-center not-italic leading-[1.15]">
            <p className="md:hidden">Transform Your Interview Game with W.I.S.E.</p>
            <p className="hidden md:block mb-0">Transform Your Interview Game</p>
            <p className="hidden md:block">with W.I.S.E.</p>
          </div>
          {/* Subtitle */}
          <p className="z-10 font-matter text-white/50 text-xl md:text-2xl text-center max-w-[560px] px-6 leading-relaxed">
            Everything you need to ace your next interview.
          </p>
          {/* CTA Button */}
          <div className="z-10">
            <Link to="/features" className="relative backdrop-blur-[6px] px-10 md:px-12 py-4 md:py-5 rounded-full overflow-hidden font-season-mix font-medium text-white text-xl md:text-2xl hover:scale-105 active:scale-95 transition-transform" style={{ background: 'linear-gradient(135deg, rgba(100,90,180,0.5) 0%, rgba(80,80,150,0.35) 50%, rgba(120,100,170,0.4) 100%)' }}>
              Get Started Now
              <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: 'inset 0px 0px 6px 0px rgba(255,255,255,0.4)' }} />
            </Link>
          </div>
          {/* Inner inset shadow */}
          <div className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{ boxShadow: 'inset 0px -40px 80px 0px rgba(100,90,180,0.2)' }} />
        </div>
      </div>
    </section>
  );
}
