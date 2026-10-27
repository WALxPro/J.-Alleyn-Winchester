import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV, CONFIG } from '../data';
import { RM, Socials } from './shared.jsx';

export default function Layout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const [far, setFar] = useState(false);
  const [prog, setProg] = useState(0);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const on = () => {
      setScrolled(scrollY > 40); setFar(scrollY > 600);
      const d = document.documentElement;
      setProg((scrollY / (d.scrollHeight - innerHeight || 1)) * 100);
    };
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  useEffect(() => { setOpen(false); scrollTo(0, 0); }, [pathname]);
  useEffect(() => {
    document.body.classList.toggle('lock', open);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', esc);
    return () => { removeEventListener('keydown', esc); document.body.classList.remove('lock'); };
  }, [open]);

  return (
    <>
      <div id="stars" /><div id="stars2" />
      <div id="prog" style={{ width: prog + '%' }} />
      <header id="hd" className={scrolled ? 's' : ''}>
        <Link className="logo" to="/"><i />J. Alleyn Winchester</Link>
        <nav className="d" aria-label="Main">
          {NAV.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => 'l' + (isActive ? ' on' : '')}>{l}</NavLink>)}
          <Link className="btn sm p" to="/books">Explore the Universe</Link>
        </nav>
        <button id="mb" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>☰</button>
      </header>
      <div id="mm" className={open ? 'o' : ''} role="dialog" aria-modal="true" aria-label="Menu">
        {NAV.map(([to, l]) => <Link key={to} to={to}>{l}</Link>)}
        <button className="btn sm" onClick={() => setOpen(false)}>Close</button>
      </div>
      {children}
      <footer>
        <div className="w">WINCHESTER</div>
        <div className="g">
          <div><div className="logo"><i />J. Alleyn Winchester</div><p className="note" style={{ marginTop: 14 }}>Short author description — edit in data.js.</p></div>
          <div><b>Pages</b>{NAV.map(([to, l]) => <Link key={to} to={to}>{l}</Link>)}</div>
          <div><b>Universe</b>
            <Link to="/books?filter=triad">Triad Sagas</Link><Link to="/books?filter=revival">Revival Sagas</Link>
            <Link to="/books?filter=comet">Comets</Link><Link to="/books?filter=belt">Asteroid Belt</Link>
            {CONFIG.email && <a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a>}<Socials />
          </div>
        </div>
        <p style={{ textAlign: 'center', margin: '36px auto 0', color: 'var(--mut)', fontSize: '.85rem' }}>© {CONFIG.year && CONFIG.year + ' '}J. Alleyn Winchester. All rights reserved.</p>
      </footer>
      <button id="top" className={far ? 'v' : ''} aria-label="Back to top" onClick={() => scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' })}>↑</button>
    </>
  );
}
