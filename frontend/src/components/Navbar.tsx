import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavbar } from '@/hooks/useNavbar';

export default function Navbar() {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const {
    mobileOpen,
    setMobileOpen,
    scrolled,
  } = useNavbar();

  return (
    <header className="top-0 right-0 left-0 z-10000 fixed w-full">
      {/* Ticker banner */}
      <div className="relative flex justify-center items-center h-8 bg-[#131313]">
        <div className="relative z-10 flex items-center gap-2.5">
          <span
            className="bg-white/20 px-2 py-0.5 border border-white/20 rounded-full font-matter font-semibold text-white text-[10px] leading-none animate-pulse-soft"
            style={{ animation: 'pulse-soft 2s ease-in-out infinite' }}
          >
            NEW
          </span>

          <Link
            to="/"
            className="flex items-center gap-1.5 font-matter font-medium text-white/90 hover:text-white text-[14px] tracking-wide transition-colors group"
          >
            W.I.S.E. Beta is now live! Try your first mock interview free

            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <div
        className="transition-all duration-500"
        style={{
          backgroundColor: scrolled
            ? 'rgba(255,255,255,0.95)'
            : 'rgba(255,255,255,0.85)',
          backdropFilter: scrolled
            ? 'blur(20px) saturate(1.2)'
            : 'blur(12px)',
          borderBottom: '1px solid #f0f0f0',
          boxShadow: scrolled
            ? '0 4px 20px rgba(0,0,0,0.06)'
            : 'none',
        }}
      >
        {/* Desktop Nav */}
        <nav className="hidden lg:flex justify-between items-center py-3 pr-4 pl-6 w-full">
          <div className="flex flex-1 justify-between items-center mx-auto max-w-[1280px]">

            {/* Logo */}
            <Link
              to="/"
              className="flex flex-1 items-center gap-2.5 hover:opacity-80 transition-opacity duration-300"
            >
              <img
                src="/assets/images/3d-icon.png"
                alt=""
                role="presentation"
                className="w-16 h-16 object-contain"
              />

              <img
                src="/assets/images/wise-text.png"
                alt="W.I.S.E."
                className="-mt-0.5 w-auto h-10 object-contain"
              />
            </Link>

            {/* Center Nav Links */}
            <div className="hidden lg:flex flex-2 justify-center items-center gap-4">

              <Link
                to="/features"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-black/5"
              >
                <span className="font-medium text-xs uppercase tracking-[1px] font-matter text-black">
                  FEATURES
                </span>
              </Link>

              <Link
                to="/how-it-works"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-black/5"
              >
                <span className="font-medium text-xs uppercase tracking-[1px] font-matter text-black">
                  HOW IT WORKS
                </span>
              </Link>

              <Link
                to="/pricing"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-black/5"
              >
                <span className="font-medium text-xs uppercase tracking-[1px] font-matter text-black">
                  PRICING
                </span>
              </Link>

              <Link
                to="/contact"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-black/5"
              >
                <span className="font-medium text-xs uppercase tracking-[1px] font-matter text-black">
                  CONTACT
                </span>
              </Link>

            </div>

            {/* Right Buttons */}
            <div className="hidden md:flex flex-1 justify-end items-center gap-3">

            
              {isAuthenticated ? (
                <div className="flex items-center gap-3">

                  <span className="text-sm font-matter text-black">
                    {user?.name}
                  </span>

                  <button
                    onClick={() =>
                      logout({
                        logoutParams: {
                          returnTo: window.location.origin,
                        },
                      })
                    }
                    className="relative inline-flex items-center justify-center cursor-pointer font-season-mix font-medium transition-all duration-500 overflow-hidden rounded-full hover:duration-700 active:scale-95 active:duration-200 touch-manipulation px-5 py-3 text-base bg-red-500 text-white"
                  >
                    Logout
                  </button>

                </div>
              ) : (
                <button
                  onClick={() => loginWithRedirect()}
                  className="relative inline-flex items-center justify-center cursor-pointer font-season-mix font-medium transition-all duration-500 overflow-hidden rounded-full hover:duration-700 active:scale-95 active:duration-200 touch-manipulation px-5 py-3 text-base bg-[#0A2156] text-white"
                >
                  Login
                </button>
              )}

            </div>
          </div>
        </nav>

        {/* Mobile Nav */}
        <div className="lg:hidden flex flex-col max-h-[calc(100vh-2rem)] overflow-hidden">

          <div className="flex justify-between items-center px-4.5 py-2.5">

            <Link to="/" className="relative flex items-center gap-2.5">
              <img
                src="/assets/images/3d-icon.png"
                alt=""
                role="presentation"
                className="w-[60px] h-[60px] object-contain"
              />

              <img
                src="/assets/images/wise-text.png"
                alt="W.I.S.E."
                className="-mt-0.5 w-auto h-7 object-contain"
              />
            </Link>

            <button
              className="flex flex-col justify-center items-center space-y-1 focus:outline-none w-8 h-8"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span
                className={`w-6 h-0.5 bg-black transition-transform duration-300 ${
                  mobileOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />

              <span
                className={`w-6 h-0.5 bg-black transition-opacity duration-300 ${
                  mobileOpen ? 'opacity-0' : ''
                }`}
              />

              <span
                className={`w-6 h-0.5 bg-black transition-transform duration-300 ${
                  mobileOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </button>

          </div>

          {mobileOpen && (
            <div className="px-4 pb-6 flex flex-col gap-2 animate-slide-down overflow-hidden">

              <Link
                to="/features"
                className="py-2 text-sm font-matter text-[#666] hover:text-black transition-all duration-200"
                onClick={() => setMobileOpen(false)}
              >
                Features
              </Link>

              <Link
                to="/how-it-works"
                className="py-2 text-sm font-matter text-[#666] hover:text-black transition-all duration-200"
                onClick={() => setMobileOpen(false)}
              >
                How It Works
              </Link>

              <Link
                to="/pricing"
                className="py-2 text-sm font-matter text-[#666] hover:text-black transition-all duration-200"
                onClick={() => setMobileOpen(false)}
              >
                Pricing
              </Link>

              <Link
                to="/contact"
                className="py-2 text-sm font-matter text-[#666] hover:text-black transition-all duration-200"
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </Link>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
