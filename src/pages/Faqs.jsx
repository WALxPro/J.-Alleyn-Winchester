import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FAQ } from '../data';
import { Page, RM } from '../components/shared.jsx';

const CATS = ['All Questions', 'Reading Order', 'Books', 'Buying', 'Author'];

export default function Faqs() {
  const [cat, setCat] = useState(CATS[0]), [q, setQ] = useState(''), [open, setOpen] = useState(-1);
  const list = FAQ.map((f, i) => ({ f, i })).filter(({ f }) => (cat === CATS[0] || f[0] === cat) && (f[1] + ' ' + f[2]).toLowerCase().includes(q.toLowerCase()));
  return (
    <Page>
      <section className="pg">
        <h1>Questions from the Cosmos</h1><p className="serif">Find your way through the universe of books, sagas, and stories.</p>
        <input type="search" placeholder="Search questions" aria-label="Search questions" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="ch">{CATS.map((c) => <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}</div>
        {list.length ? list.map(({ f, i }) => (
          <div key={i} className={'fq' + (i === open ? ' o' : '')}>
            <button aria-expanded={i === open} aria-controls={`fa${i}`} onClick={() => setOpen(i === open ? -1 : i)}>{f[1]}<span className="pl">+</span></button>
            <AnimatePresence initial={false}>
              {i === open && (
                <motion.div id={`fa${i}`} className="bd2" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: RM ? 0 : 0.3 }}>
                  <p>{f[2]}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )) : <p className="note">No questions match. Try another word or <Link to="/contact">send a message</Link>.</p>}
      </section>
      <section style={{ textAlign: 'center' }}><h2>Still Curious?</h2><Link className="btn p" to="/contact">Send a Message</Link></section>
    </Page>
  );
}
