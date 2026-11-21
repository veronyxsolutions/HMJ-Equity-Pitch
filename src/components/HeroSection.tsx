import { useEffect, useRef, useState } from 'react';
import { Home } from 'lucide-react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const CONTACT_URL = 'https://hmjequity.com/contact/';

const NAV_ITEMS = [
  { label: 'Off-Plan', href: 'https://hmjequity.com/status/off-plan/' },
  { label: 'Ready Properties', href: 'https://hmjequity.com/status/ready/' },
  { label: 'About', href: 'https://hmjequity.com/about-us/' },
  { label: 'Partnership', href: 'https://hmjequity.com/why-partner-with-us/' },
  { label: 'Contact', href: CONTACT_URL },
];

const CONTACT_ROWS = [
  { label: 'Office', value: 'Office 203, Building 3, Bay Square, Business Bay' },
  { label: 'Private line', value: '+971 4 880 4009', href: 'tel:+97148804009' },
  {
    label: 'WhatsApp',
    value: '+971 56 435 2235',
    href: 'https://api.whatsapp.com/send/?phone=971564352235&text&type=phone_number&app_absent=0',
    external: true,
  },
  { label: 'Email', value: 'info@hmjequity.com', href: 'mailto:info@hmjequity.com' },
];

interface HeroSectionProps {
  /** True once the splash has unmounted; the hero video only loads after this. */
  ready: boolean;
}

function Brand() {
  const [logoFailed, setLogoFailed] = useState(false);
  if (logoFailed) {
    return (
      <span className="font-playfair text-white text-lg sm:text-xl md:text-2xl tracking-[0.2em] uppercase">
        HMJ Equity
      </span>
    );
  }
  return (
    <img
      src="/logo.png"
      alt="HMJ Equity"
      className="h-8 sm:h-10 md:h-12 w-auto"
      onError={() => setLogoFailed(true)}
    />
  );
}

export default function HeroSection({ ready }: HeroSectionProps) {
  const reduced = usePrefersReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<number>();

  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setIsClosing(false);
    setMenuOpen(true);
  };

  const closeMenu = () => {
    if (!menuOpen || isClosing) return;
    setIsClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setMenuOpen(false);
      setIsClosing(false);
    }, 300);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeMenu();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // Bar shows the collapsed X state while the menu is open (and not closing).
  const collapsed = menuOpen && !isClosing;

  return (
    <section className="fixed inset-0 h-screen w-full overflow-hidden z-0 bg-black">
      {/* 2A. Background */}
      {ready && !reduced ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/media/hero.mp4"
          poster="/media/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <img
          src="/media/hero-poster.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 h-full flex flex-col">
        {/* 2B. Top navbar */}
        <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 md:px-12 pt-4 sm:pt-6 md:pt-8">
          <div className="w-8 sm:w-32 md:w-40" />
          <Brand />
          <div className="w-8 sm:w-32 md:w-40 flex justify-end">
            <a
              href={CONTACT_URL}
              className="hidden sm:block bg-white text-black px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-geist font-medium tracking-wide hover:bg-white/90 transition-colors duration-200 whitespace-nowrap"
            >
              GET IN TOUCH
            </a>
          </div>
        </header>

        {/* 2C. Heading */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6">
          <h1 className="font-playfair text-white text-center text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-wide uppercase max-w-5xl">
            Visions to Assets
            <br />
            Off-Plan and Ready Homes in Dubai
          </h1>
          <p className="mt-4 sm:mt-6 font-geist font-light text-white/80 text-center text-xs sm:text-sm md:text-base tracking-[0.18em] uppercase">
            Dubai real estate, guided by insight, not guesswork
          </p>
        </div>

        {/* 2E. Menu popup */}
        {menuOpen && (
          <>
            <div
              className={`fixed inset-0 z-20 bg-black/50 ${isClosing ? 'menu-overlay-close' : 'menu-overlay-open'}`}
              onClick={closeMenu}
            />
            <div
              id="hmj-menu"
              role="dialog"
              aria-label="Site menu"
              className={`fixed left-1/2 z-30 w-[90vw] max-w-[420px] bg-[#0b0b0b] rounded-2xl px-8 py-8 bottom-[110px] sm:bottom-[130px] ${
                isClosing ? 'menu-close' : 'menu-open'
              }`}
              // With reduced motion the keyframes (which carry the centring
              // translate) are disabled, so supply the translate directly.
              style={reduced ? { transform: 'translateX(-50%)', opacity: isClosing ? 0 : 1 } : undefined}
            >
              <nav>
                <ul>
                  {NAV_ITEMS.map((item, i) => (
                    <li
                      key={item.label}
                      className="menu-item-enter"
                      style={{ animationDelay: `${i * 60 + 100}ms`, opacity: reduced ? 1 : 0 }}
                    >
                      <a
                        href={item.href}
                        className="font-geist text-white text-xl tracking-wide hover:text-[#2E8748] transition-colors duration-200 block py-1"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-8 pt-6 border-t border-neutral-700/50 space-y-3">
                {CONTACT_ROWS.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4">
                    <span className="font-geist text-neutral-400 text-sm shrink-0">{row.label}</span>
                    {row.href ? (
                      <a
                        href={row.href}
                        {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="font-geist text-white text-sm text-right hover:text-[#2E8748] transition-colors duration-200"
                      >
                        {row.value}
                      </a>
                    ) : (
                      <span className="font-geist text-white text-sm text-right">{row.value}</span>
                    )}
                  </div>
                ))}
              </div>

              <a
                href={CONTACT_URL}
                className="block text-center w-full mt-6 bg-white text-black py-3 font-geist text-sm font-medium tracking-wide hover:bg-neutral-100 transition-colors duration-200"
              >
                GET IN TOUCH
              </a>
            </div>
          </>
        )}

        {/* 2D. Bottom morphing navbar */}
        <div className="relative z-40 flex justify-center pb-4 sm:pb-6 md:pb-10">
          <div
            className={`relative h-14 bg-black/90 backdrop-blur-sm border-t border-[#8F6544]/40 shadow-[0_10px_30px_rgba(0,0,0,0.35)] overflow-hidden flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              collapsed ? 'w-14 max-w-[85vw] px-0 justify-center' : 'w-[280px] max-w-[85vw] px-5 justify-between'
            }`}
          >
            {/* Expanded content */}
            <div
              className={`flex items-center justify-between w-full transition-opacity duration-300 ${
                collapsed ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'
              }`}
            >
              <Home className="w-5 h-5 text-[#2E8748]" aria-hidden="true" />
              <span className="font-geist text-white text-sm tracking-[0.15em] uppercase font-medium">Home</span>
              <button
                type="button"
                onClick={openMenu}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="hmj-menu"
                className="relative w-6 h-6"
                tabIndex={collapsed ? -1 : 0}
              >
                <span className="absolute left-0 top-[8px] w-6 h-[1.5px] bg-white" />
                <span className="absolute left-0 top-[15px] w-6 h-[1.5px] bg-white" />
              </button>
            </div>

            {/* Collapsed X */}
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              tabIndex={collapsed ? 0 : -1}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                collapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <span className="absolute w-5 h-[1.5px] bg-white rotate-45" />
              <span className="absolute w-5 h-[1.5px] bg-white -rotate-45" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
