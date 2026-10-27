import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BOOKS, D } from '../data';
import { Cover, RM } from './shared.jsx';

export default function BookCarousel() {
  const [i, setI] = useState(0), x0 = useRef(null), nav = useNavigate();
  const go = (d) => setI((v) => (v + d + BOOKS.length) % BOOKS.length);
  const k = BOOKS[i];
  const style = (idx) => {
    const o = idx - i, a = Math.abs(o);
    return { zIndex: 9 - a, opacity: a > 2 ? 0 : 1 - a * 0.3, transform: RM ? `translateX(${o * 270}px) scale(${o ? 0.8 : 1})` : `translateX(${o * 210}px) translateZ(${-a * 120}px) rotateY(${-o * 35}deg) scale(${o ? 0.85 : 1.05})` };
  };
  return (
    <>
      <div className="car" tabIndex={0} aria-label="Book carousel, use arrow keys"
        onKeyDown={(e) => { if (e.key === 'ArrowLeft') go(-1); if (e.key === 'ArrowRight') go(1); }}
        onPointerDown={(e) => (x0.current = e.clientX)}
        onPointerUp={(e) => { if (x0.current !== null && Math.abs(e.clientX - x0.current) > 40) go(e.clientX < x0.current ? 1 : -1); x0.current = null; }}>
        {BOOKS.map((b, idx) => (
          <div key={b.slug} className={'bk' + (idx === i ? ' a' : '')} style={style(idx)} role="button" aria-label={b.title}
            onClick={() => (idx === i ? nav('/books/' + b.slug) : setI(idx))}><Cover b={b} /></div>
        ))}
      </div>
      <div className="ctl"><button aria-label="Previous book" onClick={() => go(-1)}>‹</button><button aria-label="Next book" onClick={() => go(1)}>›</button></div>
      <div className="cap" aria-live="polite">
        <h3>{k.title}</h3><span className="tag">{k.saga}</span><p>{D}</p>
        <Link className="btn p" to={'/books/' + k.slug}>Discover Book</Link>
        {k.buy && <> <a className="btn" href={k.buy} rel="noopener">Buy Book</a></>}
      </div>
    </>
  );
}
