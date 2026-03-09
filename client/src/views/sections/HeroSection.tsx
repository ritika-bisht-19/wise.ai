import { Link } from 'react-router-dom';
import { partnerLogos } from '@/models/home.data';

export default function HeroSection() {
  return (
    <section className="relative flex flex-col pt-28 md:pt-40 min-h-screen overflow-visible">
      <div className="top-0 left-0 z-10 absolute bg-gradient-to-b from-white to-transparent w-full h-28" />
      <div className="flex flex-1 justify-center items-center mx-auto pb-[12vh] w-[85%] md:w-9/12 max-w-[1280px] overflow-visible">
        <div className="relative flex flex-col items-center">
          <img src="/assets/images/hero-gradient.svg" alt="" className="top-[-80%] md:top-[-165%] left-1/2 absolute w-[160%] md:w-[220%] max-w-none h-auto scale-x-200 scale-y-170 -translate-x-1/2 pointer-events-none" />
          <div className="top-1/2 left-1/2 absolute opacity-30 md:opacity-40 blur-[80px] md:blur-[100px] w-[300px] md:w-[600px] h-[200px] md:h-[400px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ background: 'radial-gradient(ellipse, #A5BBFC 0%, #D5E2FF 40%, transparent 70%)' }} aria-hidden="true" />
          <div className="z-10 relative flex flex-col items-center gap-5 md:gap-10">
            <img src="/assets/images/motif.svg" alt="" role="presentation" className="w-auto h-10 object-cover animate-float" />
            <div className="relative bg-white/50 shadow-[0px_0px_60px_0px_rgba(85,106,220,0.12)] backdrop-blur-lg px-5 py-2.5 border border-sr-indigo-200/60 rounded-full overflow-hidden animate-fade-in-up delay-100">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite_1.5s] pointer-events-none" aria-hidden="true" />
              <p className="relative font-matter font-semibold text-sr-indigo-800 text-sm text-center leading-normal tracking-wide">Your AI Interview Coach</p>
            </div>
            <div className="flex flex-col items-center gap-2.5 md:gap-3 animate-fade-in-up delay-200">
              <h1 className="max-w-4xl font-season-mix text-[48px] text-tx md:text-[72px] text-center leading-[1.05] tracking-tight">Ace Every Interview with AI</h1>
              <p className="max-w-[800px] font-matter text-tx-secondary md:text-[22px] text-lg text-center leading-[1.6]">AI-powered mock interviews, real-time stress analysis, and personalised coaching<br className="hidden md:block" />to help you land your dream job.</p>
            </div>
            <div className="animate-fade-in-up delay-400">
              <Link to="/features" className="relative inline-flex items-center justify-center cursor-pointer font-season-mix font-medium transition-all duration-500 overflow-hidden rounded-full hover:duration-700 active:scale-95 active:duration-200 touch-manipulation px-6 py-3.5 text-lg bg-[#131313] text-white shadow-[inset_0_0_12px_rgba(255,255,255,1),0px_0px_2px_0_rgba(0,0,0,0.1)] group btn-glow">
                <span className="absolute inset-0 opacity-0 transition-opacity duration-700 bg-[linear-gradient(90deg,#131313_0%,#0A2156_33%,#BED2FF_66%,#FF8717_100%)] group-hover:opacity-100 group-active:opacity-100 rounded-full shadow-[inset_0px_0px_12px_2px_rgba(255,255,255,0.5)]" aria-hidden="true" />
                <span className="z-10 relative flex items-center gap-2 transition-all duration-500">Start Mock Interview</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-8 pb-8 md:pb-14 w-full shrink-0 animate-fade-in delay-600">
        <p className="font-matter font-semibold text-tx-tertiary text-xs uppercase tracking-[3px]">TRUSTED BY 10,000+ USERS WORLDWIDE</p>
        <div className="relative mx-auto w-full max-w-[1000px] overflow-hidden" style={{ height: '100px' }}>
          <div className="flex items-center animate-marquee" style={{ width: 'max-content' }}>
            {[...partnerLogos, ...partnerLogos].map((logo, i) => (
              <div key={i} className="shrink-0 flex items-center justify-center" style={{ width: '150px', height: '100px', marginRight: '60px' }}>
                <img src={logo} alt={`Partner logo ${(i % 15) + 1}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'grayscale(100%) brightness(0.8)', opacity: 0.7 }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
