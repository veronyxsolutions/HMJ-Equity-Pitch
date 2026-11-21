import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ListingRow from './components/ListingRow.jsx';
import About from './components/About.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <ListingRow
          id="off-plan"
          title="Off-Plan"
          intro="New launches and projects under construction, with payment plans from the developer."
        />
        <ListingRow
          id="ready"
          title="Ready"
          tone="white"
          intro="Completed homes to buy or rent, available to move into now."
        />
        <About />
      </main>
      <Footer />
    </>
  );
}
