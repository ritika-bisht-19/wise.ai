import { Link } from 'react-router-dom';
import { useNavbar } from '@/controllers/useNavbar';
import { navLinks } from '@/models/navigation.data';

export default function Navbar() {
  const { mobileOpen, setMobileOpen, openDropdown, setOpenDropdown, scrolled } = useNavbar();

  return (
    <header className="top-0 right-0 left-0 z-10000 fixed w-full">
      {/* Ticker banner */}
      <div className="relative flex justify-center items-center h-8 bg-[#131313]">
        <div className="relative z-10 flex items-center gap-2.5">
          <span className="bg-white/20 px-2 py-0.5 border border-white/20 rounded-full font-matter font-semibold text-white text-[10px] leading-none animate-pulse-soft" style={{ animation: 'pulse-soft 2s ease-in-out infinite' }}>
            NEW
          </span>
          <Link
            to="/"
            className="flex items-center gap-1.5 font-matter font-medium text-white/90 hover:text-white text-[14px] tracking-wide transition-colors group"
          >
            W.I.S.E. Beta is now live! Try your first mock interview free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 transition-transform duration-300 group-hover:translate-x-1">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <div
        className="transition-all duration-500"
        style={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.85)',
          backdropFilter: scrolled ? 'blur(20px) saturate(1.2)' : 'blur(12px)',
          borderBottom: '1px solid #f0f0f0',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <nav className="hidden lg:flex justify-between items-center py-3 pr-4 pl-6 w-full">
          <div className="flex flex-1 justify-between items-center mx-auto max-w-[1280px]">
            <Link to="/" className="flex flex-1 items-center gap-2 hover:opacity-80 transition-opacity duration-300">
              <img src="/wise-logo.svg" alt="W.I.S.E." className="w-auto h-4 md:h-4.5" width="202" height="32" />
            </Link>
            <div className="hidden lg:flex flex-2 justify-center items-center gap-4">
              {navLinks.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-black/5">
                    <span className="font-medium text-xs uppercase tracking-[1px] font-matter text-black">
                      {item.label}
                    </span>
                    <svg width="6" height="10" viewBox="0 0 6 10" className={`ml-1.5 transition-transform duration-300 ${openDropdown === item.label ? 'rotate-90' : 'rotate-0'}`}>
                      <path d="M1 1L5 5L1 9" stroke="#666" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 bg-white/95 backdrop-blur-lg rounded-xl shadow-lg border border-[#f0f0f0] py-2 min-w-[200px] z-50 animate-dropdown-in">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-4 py-2.5 text-sm font-matter text-[#3d3d3d] hover:bg-[#f5f5f5] hover:pl-5 transition-all duration-200"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="hidden md:flex flex-1 justify-end items-center gap-3">
              <Link
                to="/features"
                className="relative inline-flex items-center justify-center cursor-pointer font-season-mix font-medium transition-all duration-500 overflow-hidden rounded-full hover:duration-700 active:scale-95 active:duration-200 touch-manipulation px-5 py-3 text-base bg-[#131313] text-white shadow-[inset_0_0_12px_rgba(255,255,255,1),0px_0px_2px_0_rgba(0,0,0,0.1)] group w-fit text-nowrap"
              >
                <span className="absolute inset-0 opacity-0 transition-opacity duration-700 bg-[linear-gradient(90deg,#131313_0%,#0A2156_33%,#BED2FF_66%,#FF8717_100%)] group-hover:opacity-100 group-active:opacity-100 rounded-full shadow-[inset_0px_0px_12px_2px_rgba(255,255,255,0.5)]" aria-hidden="true" />
                <span className="z-10 relative flex items-center gap-2 transition-all duration-500">Start Mock Interview</span>
              </Link>
              <Link
                to="/contact"
                className="relative inline-flex items-center justify-center cursor-pointer font-season-mix font-medium transition-all duration-500 overflow-hidden rounded-full hover:duration-700 active:scale-95 active:duration-200 touch-manipulation px-5 py-3 text-base bg-sf text-black shadow-[inset_0_0_12px_rgba(0,0,0,0.09),0px_0px_1px_rgba(0,0,0,0.2)] group w-fit text-nowrap"
              >
                <span className="absolute inset-0 opacity-0 rounded-full transition-opacity duration-700 bg-gradient-to-r from-[#A5BBFC] via-[#D5E2FF] to-[#FFA133] group-hover:opacity-100 group-active:opacity-100 shadow-[inset_0_0_12px_2px_rgba(255,255,255,1)]" aria-hidden="true" />
                <span className="z-10 relative flex items-center gap-2 transition-all duration-500">Contact Us</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile nav */}
        <div className="lg:hidden flex flex-col max-h-[calc(100vh-2rem)] overflow-hidden">
          <div className="flex justify-between items-center px-4.5 py-2.5">
            <Link to="/" className="relative flex items-center gap-2">
              <img src="/wise-logo.svg" alt="W.I.S.E." className="w-auto h-4" />
            </Link>
            <button
              className="flex flex-col justify-center items-center space-y-1 focus:outline-none w-8 h-8"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span className={`w-6 h-0.5 bg-black transition-transform duration-300 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`w-6 h-0.5 bg-black transition-opacity duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-black transition-transform duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
          {mobileOpen && (
            <div className="px-4 pb-6 flex flex-col gap-2 animate-slide-down overflow-hidden">
              {navLinks.map((item, idx) => (
                <div key={item.label} className="flex flex-col" style={{ animationDelay: `${idx * 50}ms` }}>
                  <span className="font-medium text-xs uppercase tracking-[1px] font-matter text-black py-2">{item.label}</span>
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.href}
                      className="pl-4 py-2 text-sm font-matter text-[#666] hover:text-black hover:pl-5 transition-all duration-200"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              <Link
                to="/features"
                className="mt-4 text-center px-5 py-3 text-base bg-[#131313] text-white rounded-full font-season-mix font-medium hover:bg-[#333] active:scale-95 transition-all duration-300"
                onClick={() => setMobileOpen(false)}
              >
                Start Mock Interview
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
