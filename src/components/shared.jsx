import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CONFIG, D } from '../data';

export const RM = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion:reduce)').matches;

export function Page({ children }) {
  return (
    <motion.main initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: RM ? 0 : 0.3 }}>
      {children}
    </motion.main>
  );
}
export const Cover = ({ b }) => (
  <div className="cvr" style={{ '--c': b.c }}>
    {b.cover && <img src={b.cover} alt={`Cover of ${b.title}`} />}
    <span>{b.title}</span>
    <small>{b.cover ? b.saga : 'Cover coming soon'}</small>
  </div>
);
export const BookCard = ({ b }) => (
  <article className="bc">
    <Cover b={b} />
    <span className="tag">{b.status}</span>
    <h4>{b.title}</h4>
    <p>{b.saga}. {D}</p>
    <Link className="btn sm" to={`/books/${b.slug}`}>Discover Book</Link>
    {b.buy && <> <a className="btn sm p" href={b.buy} rel="noopener">Buy Book</a></>}
  </article>
);
export const Orb = ({ c, ring }) => <div className={'orb' + (ring ? ' r' : '')} style={{ '--c': c }} role="img" aria-label="Planet illustration" />;
export const Portrait = () => (
  <div className="pf" style={{ '--c': 'var(--teal)' }}>
    {CONFIG.portrait ? <img src={CONFIG.portrait} alt="J. Alleyn Winchester" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : 'JAW'}
    <i style={{ '--d': '0s', '--c': 'var(--teal)' }} /><i style={{ '--d': '-3s', '--c': 'var(--rose)' }} /><i style={{ '--d': '-6s', '--c': 'var(--amb)' }} />
  </div>
);
export const Socials = () =>
  Object.entries(CONFIG.social).filter(([, u]) => u).map(([k, u]) => <a key={k} href={u} rel="noopener">{k}</a>);
export const hasSocials = () => Object.values(CONFIG.social).some(Boolean);
