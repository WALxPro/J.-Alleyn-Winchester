import { Link, useParams } from 'react-router-dom';
import { BOOKS, D } from '../data';
import { Page, Cover } from '../components/shared.jsx';

export default function BookDetail() {
  const { slug } = useParams();
  const b = BOOKS.find((x) => x.slug === slug);
  if (!b) return <Page><section className="pg"><h1>Book not found</h1><Link className="btn" to="/books">Back to books</Link></section></Page>;
  return (
    <Page>
      <section className="pg two">
        <div style={{ maxWidth: 300, margin: 'auto', width: '100%', height: 440 }}><Cover b={b} /></div>
        <div>
          <p><Link to="/">Home</Link> / <Link to="/books">Books</Link> / {b.title}</p>
          <h1>{b.title}</h1><span className="tag">{b.saga}</span> <span className="tag">{b.status}</span>
          <p>{D}</p>
          {b.buy ? <a className="btn p" href={b.buy} rel="noopener">Buy Book</a> : <p className="note">No retailer link supplied yet.</p>}
          {' '}<Link className="btn" to="/books">Back to books</Link>
          <h3 style={{ marginTop: 36 }}>Related books</h3>
          <div className="row">{BOOKS.filter((x) => x !== b).map((r) => <Link key={r.slug} className="btn sm" to={`/books/${r.slug}`}>{r.title}</Link>)}</div>
        </div>
      </section>
    </Page>
  );
}
