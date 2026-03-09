import { Link } from 'react-router-dom';
import { footerSections } from '@/models/navigation.data';

export default function Footer() {
  return (
    <footer className="bottom-0 z-10 relative md:sticky bg-white mx-auto p-10 md:px-16 pt-24 md:pt-24 border-[#e6e6e6] border-t w-full h-full md:h-fit overflow-hidden pointer-events-auto">
      <div className="z-100 relative mx-auto pb-40 max-w-[1280px]">
        <div className="flex lg:flex-row flex-col justify-start md:justify-between items-start gap-16 md:gap-24 lg:gap-[200px] w-full">
          {/* Logo and Tagline */}
          <div className="flex flex-col gap-6 md:gap-6">
            <div className="flex flex-col gap-[12px]">
              <Link className="flex items-center" to="/">
                <img src="/wise-logo.svg" alt="W.I.S.E." className="w-[202px] h-[32px]" />
              </Link>
              <p className="font-matter font-medium text-[#666] text-[14px] leading-[12px]">Your interview success starts here</p>
            </div>
            {/* Security Badges */}
            <div className="flex gap-[12px]">
              <div className="flex justify-center items-center bg-[#fafafa] rounded-[16px] w-[64px] h-[64px] overflow-hidden hover:bg-[#EEF2FF] transition-colors duration-300">
                <img src="/assets/images/sec-iso.png" alt="ISO Certified" className="w-[40px] h-[40px] object-contain" />
              </div>
              <div className="flex justify-center items-center bg-[#fafafa] rounded-[16px] w-[64px] h-[64px] overflow-hidden hover:bg-[#EEF2FF] transition-colors duration-300">
                <img src="/assets/images/sec-soc2.png" alt="SOC 2 Type II" className="w-[40px] h-[40px] object-contain" />
              </div>
            </div>
          </div>
          {/* Link Columns */}
          <div className="justify-center gap-12 md:gap-8 lg:gap-16 grid grid-cols-2 md:grid-cols-4 w-full">
            {footerSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-[24px] w-fit">
                <h3 className="w-fit font-matter font-semibold text-[#3d3d3d] text-[12px] uppercase leading-normal">{section.title}</h3>
                <ul className="flex flex-col gap-3 w-fit font-matter">
                  {section.links.map((link) => (
                    <li key={link.label} className="w-fit">
                      {link.external ? (
                        <a href={link.href} className="block w-fit text-tx-tertiary hover:text-sr-indigo-800 text-base leading-normal transition-colors" target="_blank" rel="noopener noreferrer">{link.label}</a>
                      ) : (
                        <Link to={link.href} className="block w-fit text-tx-tertiary hover:text-sr-indigo-800 text-base leading-normal transition-colors">{link.label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* Copyright */}
        <div className="bottom-0 left-1/2 z-10 md:absolute relative flex md:flex-row flex-col justify-between items-center gap-3 mx-auto md:p-16 2xl:px-0 py-4 w-full max-w-[1280px] font-matter text-[#666] text-[12px] text-center leading-[1.5] -translate-x-1/2">
          <span>Copyright W.I.S.E. {new Date().getFullYear()}</span>
          <span>All rights reserved</span>
        </div>
        {/* Radial Gradient SVG Background */}
        <div className="absolute inset-0 flex flex-col justify-end items-center mx-auto w-full max-w-[1280px] h-full pointer-events-none">
          <div className="relative mx-auto -mb-20 w-full max-w-[1200px] scale-x-[200%] md:scale-x-[100%] scale-y-[300%] md:scale-y-[90%]" style={{ transformOrigin: 'bottom center' }}>
            <svg width="2292" height="833" viewBox="0 0 2292 833" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
              <g clipPath="url(#clip0_ft)">
                <g filter="url(#filter0_ft)">
                  <path d="M1113.5 40C502.673 39.9999 40 793 40 793H2252C2252 793 1724.33 40 1113.5 40Z" fill="url(#paint0_ft)" />
                </g>
              </g>
              <defs>
                <filter id="filter0_ft" x="0" y="0" width="2292" height="833" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feGaussianBlur stdDeviation="20" />
                </filter>
                <radialGradient id="paint0_ft" cx="0" cy="0" r="1" gradientTransform="matrix(0 -1256.51 2148.88 -11.8434 1146 1272)" gradientUnits="userSpaceOnUse">
                  <stop offset="0.327754" stopColor="#F9730C" />
                  <stop offset="0.423421" stopColor="#FFA336" />
                  <stop offset="0.536751" stopColor="#F0D5BA" />
                  <stop offset="0.635122" stopColor="#CBDBFF" />
                  <stop offset="1" stopColor="#FAFAFA" stopOpacity="0" />
                </radialGradient>
                <clipPath id="clip0_ft"><rect width="2292" height="833" fill="white" /></clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
