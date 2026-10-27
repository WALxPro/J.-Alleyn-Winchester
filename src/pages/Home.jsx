import { useState } from 'react';
import { Link } from 'react-router-dom';
import { W, C, BOOKS, CONFIG, D, info } from '../data';
import { Page, Cover, Orb, Portrait } from '../components/shared.jsx';
import GalaxyScene from '../components/GalaxyScene.jsx';
import BookCarousel from '../components/BookCarousel.jsx';

const MOODS = [['myth', 'Myth and Prophecy'], ['coming', 'Coming of Age and Elemental Fey'], ['diff', 'Something Different']];
const UNI = [['#6FE3C1', 'Triad Sagas'], ['#8E7CFF', 'Revival Sagas'], ['#F27C9E', 'Comets'], ['#FF9B54', 'Asteroid Belt']];

export default function Home() {
  const [sel, setSel] = useState(null);
  const [nogl, setNogl] = useState(false);
  const [mood, setMood] = useState(null);
  const i = sel && info(sel);
  const names = [...W.map((w) => w.n), ...C.map((c) => c.n), 'belt'];
  const recs = mood ? CONFIG.recommend[mood].map((s) => BOOKS.find((b) => b.slug === s)).filter(Boolean) : [];

  return (
    <Page>
      <section id="hero" className={nogl ? 'nogl' : ''} aria-label="Universe">
        {!nogl && <GalaxyScene selected={sel} onSelect={setSel} onFail={() => setNogl(true)} />}
        <div className="tx">
          <div className="eb">AN UNIVERSE OF STORIES</div>
          <h1>Every World<br />Holds a Story.</h1>
          <p>Step beyond the familiar and discover a universe of sagas, celestial mysteries, and extraordinary adventures.</p>
          <div className="row"><button className="btn p" onClick={() => setSel('Aurora')}>Explore the Universe</button><Link className="btn" to="/books">Discover the Books</Link></div>
        </div>
        <div className="wl" role="group" aria-label="Choose a world">
          {names.map((n) => <button key={n} className={sel === n ? 'on' : ''} onClick={() => setSel(n)}>{n === 'belt' ? 'Asteroid Belt' : n}</button>)}
        </div>
        <aside id="panel" className={i ? 'o' : ''} aria-live="polite">
          {i && (<>
            <h3>{i.t}</h3><p>{i.sub}</p><p style={{ fontSize: '.85rem', color: 'var(--mut)' }}>{D}</p>
            <Link className="btn sm p" to={`/books?filter=${i.filter}`}>Explore this World</Link> <button className="btn sm" onClick={() => setSel(null)}>Close</button>
          </>)}
        </aside>
      </section>

      <section><h2>Stories Written in the Stars</h2><p className="serif">Discover the books that bring these worlds to life.</p><BookCarousel /></section>

      <section className="two">
        <div><Orb c="#8E7CFF" ring /></div>
        <div>
          <h2>Step Into the Universe</h2>
          <p>Every saga opens a new world. From the primordial realms of the Triad Sagas to the medieval worlds of the Revival Sagas, each story contributes to a larger universe of imagination.</p>
          <ul className="ul">{UNI.map(([c, n]) => <li key={n} style={{ '--c': c }}><i />{n}</li>)}</ul>
          <Link className="btn p" to="/books">Explore All Books</Link>
        </div>
      </section>

      <section className="two">
        <div>
          <h2>Meet the Mind Behind the Worlds</h2><h3 className="sh">J. Alleyn Winchester</h3><p className="serif">Mapmaker of Worlds</p>
          <p>{CONFIG.bio}</p><Link className="btn" to="/about">Meet the Author</Link>
        </div>
        <Portrait />
      </section>

      <section>
        <h2>Side Trips Across the Sky</h2>
        <div className="cm">{C.map((c) => <article className="cc" key={c.n} style={{ '--c': c.c }}><h3>{c.n}</h3><p>{c.t}. Teaser to be supplied.</p></article>)}</div>
      </section>

      <section>
        <h2>Find Your First World</h2><p className="serif">Choose a mood. Recommendations only appear once the author sets them.</p>
        <div className="ch">{MOODS.map(([k, l]) => <button key={k} aria-pressed={mood === k} onClick={() => setMood(k)}>{l}</button>)}</div>
        <div className="note" aria-live="polite">
          {!mood ? 'Pick an option above.' : recs.length ? recs.map((b) => <Link key={b.slug} to={`/books/${b.slug}`} style={{ marginRight: 14 }}>{b.title}</Link>) : <>Recommendations for this mood haven’t been set yet. <Link to="/books">Browse all books</Link>.</>}
        </div>
      </section>

      <section style={{ textAlign: 'center' }}>
        <div style={{ width: 'min(240px,60vw)', margin: '0 auto 24px' }}><Cover b={BOOKS[0]} /></div>
        <h2>Your Journey Begins Here.</h2>
        <p className="serif" style={{ margin: '0 auto 20px' }}>Discover the stories. Follow the worlds. Find your next adventure.</p>
        <div className="row" style={{ justifyContent: 'center' }}><Link className="btn p" to="/books">Explore the Books</Link><Link className="btn" to="/about">Meet the Author</Link></div>
      </section>
    </Page>
  );
}
