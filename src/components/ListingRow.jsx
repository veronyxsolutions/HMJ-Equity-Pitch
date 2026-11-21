// Empty slots until real listings are supplied. No invented projects or prices.
export default function ListingRow({ id, title, intro, slots = 3, tone = 'sand' }) {
  return (
    <section id={id} className={`section section--${tone}`} aria-labelledby={`${id}-title`}>
      <div className="section__inner">
        <div className="section__head">
          <h2 id={`${id}-title`} className="section__title">{title}</h2>
          <p className="section__intro">{intro}</p>
        </div>
        <ul className="listing-row">
          {Array.from({ length: slots }, (_, i) => (
            <li key={i} className="listing">
              <div className="listing__image" aria-hidden="true" />
              <p className="listing__name">Listing to be added</p>
              <p className="listing__meta">Community, price and handover</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
