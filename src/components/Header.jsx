import { useEffect, useState } from 'react';
import { NAV_LINKS, WHATSAPP_URL } from '../site.js';

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`site-header${solid || open ? ' is-solid' : ''}`}>
      <div className="site-header__inner">
        <a href="#top" className="wordmark" aria-label="HMJ Equity, home">
          HMJ EQUITY
        </a>

        <nav id="site-nav" className={`site-nav${open ? ' is-open' : ''}`} aria-label="Main">
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn--solid btn--small" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            Schedule a call
          </a>
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
    </header>
  );
}
