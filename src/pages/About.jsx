import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../data';
import { Page, Portrait, Socials, hasSocials } from '../components/shared.jsx';

const BODIES = [['Triad Sagas', '#6FE3C1', 'Primordial Realms: Eclipse, Nature Calls, Dodekatheon.', 'triad'], ['Revival Sagas', '#8E7CFF', 'Medieval Realms: Thicker than Blood, Legacy of the Solar Order, To Cross the Divine.', 'revival'], ['Comets', '#F27C9E', 'Shomer, Tops-terve, Vallorond, Paráskiá.', 'comet'], ['Asteroid Belt', '#FF9B54', 'Works in progress and flash fiction.', 'belt']];

export default function About() {
  const [b, setB] = useState(null);
  return (
    <Page>
      <section className="pg two">
        <div><h1 className="sh">J. Alleyn Winchester</h1><p className="serif">Mapmaker of Worlds</p><h2>The Author</h2><p>{CONFIG.bio}</p></div>
        <Portrait />
      </section>
      <section>
        <h2>The Universe He Built</h2>
        <div className="ch">{BODIES.map((x) => <button key={x[0]} style={{ borderColor: x[1] }} aria-pressed={b === x} onClick={() => setB(x)}>{x[0]}</button>)}</div>
        <p className="note" aria-live="polite">{b ? <>{b[2]} <Link to={`/books?filter=${b[3]}`}>See on Books page</Link></> : 'Select a body to learn more.'}</p>
        <Link className="btn" to="/books">Explore the Books</Link>
      </section>
      <section><h2>Creative Process</h2><p className="note">Gallery placeholder: add sketches, planet art and cover artwork here. No claims are made about how the art was made until the author confirms them.</p></section>
      <section>
        <h2>Timeline</h2>
        {CONFIG.timeline.length ? <div className="tl">{CONFIG.timeline.map((t, i) => <div key={i}><b>{t.date}</b><br />{t.text}</div>)}</div> : <p className="note">No milestones supplied yet. Add them to CONFIG.timeline in data.js.</p>}
        {hasSocials() && <><h3>Follow</h3><div className="row"><Socials /></div></>}
      </section>
      <section style={{ textAlign: 'center' }}><h2>Discover the Worlds Behind the Words.</h2><Link className="btn p" to="/books">Explore the Books</Link></section>
    </Page>
  );
}
