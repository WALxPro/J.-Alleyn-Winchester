import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { W, C, BOOKS, D } from '../data';
import { Page, BookCard, Orb } from '../components/shared.jsx';

const CATS = [['all', 'All'], ['triad', 'Triad Sagas'], ['revival', 'Revival Sagas'], ['comet', 'Comets'], ['belt', 'Asteroid Belt']];
const fx = { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0 }, transition: { duration: 0.35 } };

export default function Books() {
  const [sp, setSp] = useSearchParams();
  const filter = CATS.some(([k]) => k === sp.get('filter')) ? sp.get('filter') : 'all';
  const show = (g) => filter === 'all' || filter === g;
  return (
    <Page>
      <section className="pg">
        <h1>The Books</h1><p className="serif">Every Series Is a World.</p>
        <div className="tb" role="tablist" aria-label="Categories">
          {CATS.map(([k, l]) => <button key={k} role="tab" aria-selected={k === filter} onClick={() => setSp(k === 'all' ? {} : { filter: k })}>{l}</button>)}
        </div>
        <AnimatePresence mode="popLayout">
          {W.filter((w) => show(w.g)).map((w) => {
            const idx = W.indexOf(w), bs = w.books.map((s) => BOOKS.find((b) => b.slug === s));
            return (
              <motion.div key={w.n} {...fx} layout className={'sg' + (idx % 2 ? ' m' : '')} id={w.n.replace(/\W/g, '')}>
                <div className="orbw"><Orb c={w.c} ring={w.ring} /></div>
                <div>
                  <span className="tag">{w.g === 'triad' ? 'Triad Sagas · Primordial Realms' : 'Revival Sagas · Medieval Realms'}</span>
                  <h2>{w.s}</h2><p className="serif">World: {w.n}</p><p>{D}</p>
                  {bs.length ? <div className="bs">{bs.map((b) => <BookCard key={b.slug} b={b} />)}</div> : <p className="note">Titles for this saga have not been supplied yet.</p>}
                </div>
              </motion.div>
            );
          })}
          {show('comet') && (
            <motion.div key="comets" {...fx} layout className="sg" style={{ gridTemplateColumns: '1fr' }}><div>
              <span className="tag">Comets</span><h2>Side Trips Across the Sky</h2>
              <div className="bs">{C.map((c) => (
                <article className="bc" key={c.n}>
                  <div className="cvr" style={{ '--c': c.c }}><span>{c.t}</span><small>Cover coming soon</small></div>
                  <span className="tag">{c.n}</span><h4>{c.t}</h4><p>{D}</p><p className="note">Details coming soon</p>
                </article>))}
              </div>
            </div></motion.div>
          )}
          {show('belt') && (
            <motion.div key="belt" {...fx} layout className="sg" style={{ gridTemplateColumns: '1fr' }}><div>
              <span className="tag">Coming Soon</span><h2>The Asteroid Belt</h2>
              <p>Works in progress, works in development, and flash fiction drift here. Nothing in the belt is available to buy.</p>
              <div className="belt" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <span key={i} style={{ left: `${(i * 37) % 92}%`, top: `${(i * 53) % 80}%`, width: 8 + (i % 4) * 6, height: 6 + (i % 3) * 5, animationDelay: `${-i}s` }} />)}</div>
              <p style={{ marginTop: 20 }}><Link className="btn" to="/books?filter=triad">Explore published books</Link></p>
            </div></motion.div>
          )}
        </AnimatePresence>
      </section>
    </Page>
  );
}
