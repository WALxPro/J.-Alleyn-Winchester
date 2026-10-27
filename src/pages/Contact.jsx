import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../data';
import { Page, Orb, Socials } from '../components/shared.jsx';

const SUBJECTS = ['General Inquiry', 'Book Question', 'Events and Interviews', 'Press and Media', 'Other'];

export default function Contact() {
  const [v, setV] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' });
  const [err, setErr] = useState({}), [busy, setBusy] = useState(false), [msg, setMsg] = useState('');
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!v.name.trim()) er.name = 'This field is required.';
    if (!v.email.trim()) er.email = 'This field is required.'; else if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) er.email = 'Enter a valid email address.';
    if (!v.message.trim()) er.message = 'This field is required.';
    setErr(er); if (Object.keys(er).length) return;
    if (!CONFIG.formEndpoint) { setMsg('Not sent: no form endpoint is configured yet. Set VITE_FORM_ENDPOINT (for example a Formspree URL) to receive messages.'); return; }
    setBusy(true);
    try {
      const r = await fetch(CONFIG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(v) });
      if (!r.ok) throw new Error();
      setMsg('Message sent. Thank you — the author will reply soon.'); setV({ name: '', email: '', subject: SUBJECTS[0], message: '' });
    } catch { setMsg('The message could not be sent. Please try again later.'); }
    setBusy(false);
  };

  return (
    <Page>
      <section className="pg two" style={{ alignItems: 'start' }}>
        <div>
          <h1>Send a Signal Across the Stars</h1>
          <p>Have a question about a book, an event, or the worlds behind the stories? Get in touch.</p>
          <form onSubmit={submit} noValidate>
            <label>Full name<input value={v.name} onChange={set('name')} autoComplete="name" aria-invalid={!!err.name} /><span className="er">{err.name}</span></label>
            <label>Email address<input type="email" value={v.email} onChange={set('email')} autoComplete="email" aria-invalid={!!err.email} /><span className="er">{err.email}</span></label>
            <label>Subject<select value={v.subject} onChange={set('subject')}>{SUBJECTS.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label>Message<textarea rows={5} value={v.message} onChange={set('message')} aria-invalid={!!err.message} /><span className="er">{err.message}</span></label>
            <button className="btn p" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</button>
            <div id="msg" className={msg ? 'o' : ''} role="status">{msg}</div>
          </form>
        </div>
        <aside>
          <div style={{ width: 160 }}><Orb c="#8E7CFF" /></div>
          <h3 style={{ marginTop: 28 }}>Contact</h3>
          {CONFIG.email ? <a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a> : <p className="note">Author email not yet configured.</p>}
          <div className="row"><Socials /></div>
          <p style={{ marginTop: 30 }}>Looking for an answer? <Link to="/faqs">Explore the FAQs.</Link></p>
        </aside>
      </section>
    </Page>
  );
}
