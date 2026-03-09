import { whyWiseFeatures } from '@/models/home.data';
import { useScrollReveal } from '@/controllers/useScrollReveal';

function FeatureIcon() {
  return (
    <svg className="mt-1 shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#fi_why)">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.0035 0C13.927 1.92336 14.7378 4.55104 14.4269 7.06239C15.3696 6.39209 16.5224 5.99794 17.7672 5.99791H17.9981C17.998 7.2792 17.5948 8.4699 16.9085 9.4474C19.3436 9.12122 21.8977 9.89379 23.7691 11.7651L24 11.996C22.0413 13.9546 19.3522 14.7596 16.7993 14.4011C17.5521 15.4058 17.9984 16.6535 17.9983 18.0015C16.6523 18.0015 15.4063 17.5566 14.4024 16.8059C14.7587 19.3568 13.9535 22.0429 11.9964 23.9999C10.0408 22.0444 9.23528 19.3609 9.58954 16.8117C8.58701 17.5588 7.34402 18.0014 6.00159 18.0014V17.7706C6.00162 16.5237 6.39701 15.3691 7.06934 14.4255C4.55586 14.7387 1.92515 13.9283 0 12.0032L0.230859 11.7723C2.10358 9.89968 4.65997 9.12739 7.09662 9.45536C6.407 8.47643 6.00174 7.28284 6.00176 5.99816C7.3476 5.99814 8.5935 6.44286 9.59732 7.19339C9.24126 4.64272 10.0466 1.95683 12.0035 0Z" fill="url(#pg_why)" />
      </g>
      <defs>
        <filter id="fi_why" x="0" y="0" width="24" height="25" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.647059 0 0 0 0 0.733333 0 0 0 0 0.988235 0 0 0 1 0" />
          <feBlend mode="normal" in2="shape" result="effect1" />
        </filter>
        <linearGradient id="pg_why" x1="12" y1="23.9999" x2="12" y2="-3.67886" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E3F1D8" /><stop offset="0.33" stopColor="#C8E4B0" /><stop offset="0.66" stopColor="#83C040" /><stop offset="1" stopColor="#496D21" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function WhyWiseSection() {
  const sectionRef = useScrollReveal();

  return (
    <section ref={sectionRef} className="mx-auto w-[85%] md:w-9/12 max-w-[1280px]">
      <div className="flex flex-col items-center gap-8 md:gap-16">
        <div className="flex flex-col items-center text-center gap-6 w-full reveal">
          <h2 className="font-season-mix md:font-normal font-normal w-full px-3 md:px-0 text-3xl md:text-[36px] text-tx leading-[135%]">Why W.I.S.E.?</h2>
        </div>
        <div className="flex md:flex-row flex-col gap-3 bg-white p-4 md:p-6 rounded-[24px] md:rounded-[48px] w-full overflow-hidden reveal card-hover" style={{ transitionDelay: '150ms' }}>
          <div className="relative rounded-2xl w-full md:w-[50%] h-[250px] md:h-[420px] overflow-hidden shrink-0">
            <img src="/assets/images/home-section-2.webp" alt="W.I.S.E. Platform" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 flex justify-center items-center mix-blend-overlay">
              <img src="/wise-logo.svg" alt="" className="opacity-90 mb-20 md:mb-36 w-20 md:w-24 h-auto" />
            </div>
          </div>
          <div className="flex flex-col flex-1 md:justify-between gap-4 md:gap-0 px-4 md:px-12 py-6 md:py-10">
            {whyWiseFeatures.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <FeatureIcon />
                <div className="flex flex-col gap-1.5 md:gap-3">
                  <h3 className="font-matter font-medium text-tx md:text-[22px] text-xl leading-normal tracking-[-0.22px]">{f.title}</h3>
                  <p className="font-matter text-[#999] text-base leading-normal tracking-[-0.16px]">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
