import { Link } from 'react-router-dom';

const marqueeItems = [
  'AI Mock Interviews for Real Job Roles',
  'Real-Time Stress and Confidence Insights',
  'Personalised Feedback to Improve Faster',
  'Our Aim: Help You Crack Interviews with Confidence',
];

function MarqueeBand({
  className,
  listClassName,
}: {
  className: string;
  listClassName: string;
}) {
  const repeatedItems = Array.from({ length: 4 }, () => marqueeItems).flat();

  return (
    <div
      className={className}
      style={{
        maskImage:
          'linear-gradient(to right, rgba(0,0,0,0) 0%, rgb(0,0,0) 10%, rgb(0,0,0) 90%, rgba(0,0,0,0) 100%)',
        WebkitMaskImage:
          'linear-gradient(to right, rgba(0,0,0,0) 0%, rgb(0,0,0) 10%, rgb(0,0,0) 90%, rgba(0,0,0,0) 100%)',
      }}
    >
      <ul className={listClassName}>
        {repeatedItems.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="shrink-0 flex items-center gap-2 md:gap-3"
          >
            <span className="font-matter font-bold text-[11px] md:text-[14px] tracking-[0.24em] uppercase text-white/95 whitespace-nowrap">
              {item}
            </span>

            <span
              aria-hidden="true"
              className="mx-2 md:mx-3 inline-block w-2 h-2 rounded-full bg-[#0D5AE5]"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative flex flex-col pt-28 md:pt-40 min-h-screen overflow-visible">

      <div className="top-0 left-0 z-10 absolute bg-gradient-to-b from-white to-transparent w-full h-28" />

      <div className="flex flex-1 justify-center items-center mx-auto pb-[12vh] w-[85%] md:w-9/12 max-w-[1280px] overflow-visible">

        <div className="relative flex flex-col items-center">

          <img
            src="/assets/images/hero/hero-gradient-bg.svg"
            alt=""
            className="top-[-80%] md:top-[-165%] left-1/2 absolute w-[160%] md:w-[220%] max-w-none h-auto scale-x-200 scale-y-170 -translate-x-1/2 pointer-events-none"
          />

          <div
            className="top-1/2 left-1/2 absolute opacity-20 md:opacity-28 blur-[80px] md:blur-[100px] w-[300px] md:w-[600px] h-[200px] md:h-[400px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse, #A5BBFC 0%, #D5E2FF 40%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          <div
            aria-hidden="true"
            className="absolute left-1/2 top-[3%] md:top-[-3%] z-0 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-matter font-bold uppercase tracking-[0.14em] text-white opacity-[0.12] md:opacity-[0.16] text-[120px] md:text-[260px] leading-none"
          >
            W.I.S.E
          </div>

          <div className="z-10 relative flex flex-col items-center gap-5 md:gap-10">

            <div className="mt-16 md:mt-24 flex flex-col items-center gap-4 md:gap-5">

              <img
                src="/assets/images/hero/hero-motif.svg"
                alt=""
                role="presentation"
                className="w-auto h-10 object-cover animate-float"
              />

              <div className="relative bg-white/50 shadow-[0px_0px_60px_0px_rgba(85,106,220,0.12)] backdrop-blur-lg px-5 py-2.5 border border-sr-indigo-200/60 rounded-full overflow-hidden animate-fade-in-up delay-100">

                <span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite_1.5s] pointer-events-none"
                  aria-hidden="true"
                />

                <p className="relative font-matter font-semibold text-sr-indigo-800 text-sm text-center leading-normal tracking-wide">
                  Your AI Interview Coach
                </p>

              </div>
            </div>

            <div className="flex flex-col items-center gap-2.5 md:gap-3 animate-fade-in-up delay-200">

              <h1 className="max-w-4xl font-season-mix font-bold text-[48px] text-tx md:text-[72px] text-center leading-[1.05] tracking-tight">
                Ace Every Interview with AI
              </h1>

              <p className="max-w-[800px] font-matter text-tx-secondary md:text-[22px] text-lg text-center leading-[1.6]">
                AI-powered mock interviews, real-time stress analysis, and personalised coaching
                <br className="hidden md:block" />
                to help you land your dream job.
              </p>

            </div>

            <div className="animate-fade-in-up delay-400">

              <Link
                to="/interview"
                className="relative inline-flex items-center justify-center cursor-pointer font-season-mix font-medium transition-all duration-500 overflow-hidden rounded-full hover:duration-700 active:scale-95 active:duration-200 touch-manipulation px-6 py-3.5 text-lg bg-[#131313] text-white shadow-[inset_0_0_12px_rgba(255,255,255,1),0px_0px_2px_0_rgba(0,0,0,0.1)] group btn-glow"
              >

                <span
                  className="absolute inset-0 opacity-0 transition-opacity duration-700 bg-[linear-gradient(90deg,#131313_0%,#0A2156_33%,#BED2FF_66%,#FF8717_100%)] group-hover:opacity-100 group-active:opacity-100 rounded-full shadow-[inset_0px_0px_12px_2px_rgba(255,255,255,0.5)]"
                  aria-hidden="true"
                />

                <span className="z-10 relative flex items-center gap-2 transition-all duration-500">
                  Start Mock Interview →
                </span>

              </Link>
            </div>

            <div className="mt-8 left-1/2 relative w-screen max-w-none -translate-x-1/2 animate-fade-in-up delay-500 overflow-hidden">

              <MarqueeBand
                className="absolute left-1/2 top-[60%] z-0 w-[152%] -translate-x-1/2 -translate-y-1/2 rotate-[8.2deg] opacity-55"
                listClassName="flex items-center gap-1 md:gap-2 w-max bg-[#080A0F]/86 py-2 md:py-2.5 px-3 animate-ticker"
              />

              <img
                src="/assets/images/hero/hero-interview-banner.webp"
                alt="Mock interview preview"
                className="relative z-10 w-full h-auto"
                loading="lazy"
              />

              <MarqueeBand
                className="absolute left-1/2 top-[60%] z-20 w-[152%] -translate-x-1/2 -translate-y-1/2 -rotate-[8.2deg]"
                listClassName="flex items-center gap-1 md:gap-2 w-max bg-[linear-gradient(90deg,#083595_0%,#0A1D45_32%,#0A1D45_68%,#083595_100%)] py-2 md:py-2.5 px-3 animate-ticker-reverse"
              />

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
