import { CONTACT, WHATSAPP_URL } from '../site.js';

export default function Footer() {
  return (
    <footer id="contact" className="site-footer" aria-labelledby="contact-title">
      <div className="section__inner footer">
        <div className="footer__lead">
          <h2 id="contact-title" className="section__title">Book a viewing</h2>
          <p>Message us on WhatsApp or call the office, and we'll arrange a time that suits you.</p>
          <a className="btn btn--solid" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            Schedule a call
          </a>
        </div>

        <address className="footer__details">
          <div>
            <h3>Office</h3>
            {CONTACT.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          <div>
            <h3>Phone</h3>
            <a href={CONTACT.office.href}>{CONTACT.office.label}</a>
            <a href={CONTACT.mobile.href}>{CONTACT.mobile.label}</a>
          </div>
          <div>
            <h3>Email</h3>
            <a href={CONTACT.email.href}>{CONTACT.email.label}</a>
          </div>
        </address>
      </div>
      <div className="section__inner footer__base">
        <span className="wordmark">HMJ EQUITY</span>
        <span>© {new Date().getFullYear()} HMJ Equity. Dubai's premium British brokerage.</span>
      </div>
    </footer>
  );
}
