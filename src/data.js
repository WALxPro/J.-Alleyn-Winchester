/* ===== Edit all content here. Empty values are hidden or shown as honest placeholders. ===== */
export const CONFIG = {
  email: '',
  year: '',
  social: { Facebook: '', Instagram: '' },
  formEndpoint: import.meta.env.VITE_FORM_ENDPOINT || '',
  portrait: '',
  bio: 'Biography to be supplied by the author. No details have been assumed.',
  timeline: [], // [{date:'', text:''}]
  recommend: { myth: [], coming: [], diff: [] }, // arrays of book slugs
};
export const D = 'Draft description — to be supplied by the author.';

export const BOOKS = [
  { slug: 'nature-calls-spring', title: 'Nature Calls, Spring', saga: 'Nature Calls', c: '#6FE3C1', cover: '', buy: '', status: 'Status to be confirmed' },
  { slug: 'nature-calls-summer', title: 'Nature Calls, Summer', saga: 'Nature Calls', c: '#FF9B54', cover: '', buy: '', status: 'Status to be confirmed' },
  { slug: 'artemis-of-the-dodekatheon', title: 'Artemis of the Dodekatheon', saga: 'Dodekatheon', c: '#F27C9E', cover: '', buy: '', status: 'Status to be confirmed' },
];

// a = orbit radius, tilt = inclination, sp = speed, r = size
export const W = [
  { n: 'Aurora', g: 'triad', s: 'Eclipse', c: '#6FE3C1', a: 3, tilt: 0.2, sp: 0.55, r: 0.36, ring: 1, books: [] },
  { n: 'Three Melodies', g: 'triad', s: 'Nature Calls', c: '#7a7cff', a: 4.3, tilt: -0.15, sp: 0.4, r: 0.4, books: ['nature-calls-spring', 'nature-calls-summer'] },
  { n: 'Neo-Gaea', g: 'triad', s: 'Dodekatheon', c: '#F27C9E', a: 5.5, tilt: 0.3, sp: 0.3, r: 0.38, books: ['artemis-of-the-dodekatheon'] },
  { n: 'Nocturnus', g: 'revival', s: 'Thicker than Blood', c: '#4a3a9a', a: 8, tilt: -0.25, sp: 0.2, r: 0.5, books: [] },
  { n: 'The Arche', g: 'revival', s: 'Legacy of the Solar Order', c: '#8E7CFF', a: 9.6, tilt: 0.18, sp: 0.15, r: 0.55, ring: 1, books: [] },
  { n: 'The Divine Realms', g: 'revival', s: 'To Cross the Divine', c: '#F27C9E', a: 11, tilt: -0.1, sp: 0.11, r: 0.5, top: 1, books: [] },
];
export const C = [
  { n: 'Shomer', t: 'Court of Night', c: '#F27C9E' },
  { n: 'Tops-terve', t: 'Gangstas Gone Soft', c: '#FF9B54' },
  { n: 'Vallorond', t: 'Legends of Vallorond', c: '#8E7CFF' },
  { n: 'Paráskiá', t: 'Me & the Man in Black', c: '#6FE3C1' },
];
export const FAQ = [
  ['Reading Order', 'Where should I start reading?', 'Draft answer: the “Find Your First World” guide on the home page will help once recommendations are set. Author to confirm.'],
  ['Reading Order', 'Do I need to read the books in order?', 'Draft answer: not yet confirmed. Author to complete.'],
  ['Books', 'What are the Triad Sagas and Revival Sagas?', 'The Triad Sagas are the Primordial Realms (Eclipse, Nature Calls, Dodekatheon). The Revival Sagas are the Medieval Realms (Thicker than Blood, Legacy of the Solar Order, To Cross the Divine).'],
  ['Books', 'What are the Comets?', 'Side trips across the sky: Shomer, Tops-terve, Vallorond and Paráskiá. Descriptions to be supplied by the author.'],
  ['Books', 'What is the Asteroid Belt?', 'The home for works in progress, works in development and flash fiction. Nothing there is available yet.'],
  ['Buying', 'Where can I buy the books?', 'Retailer links will appear on each book page once the author supplies them.'],
  ['Books', 'Will there be more books in this universe?', 'Draft answer: to be confirmed by the author.'],
  ['Author', 'How can I contact the author?', 'Use the contact page. Direct email will be shown once configured.'],
];
export const NAV = [['/', 'Home'], ['/books', 'About the Books'], ['/about', 'About Us'], ['/contact', 'Contact Us'], ['/faqs', 'FAQs']];

// Info for any clickable object in the galaxy (planet, comet, belt)
export function info(n) {
  const w = W.find((x) => x.n === n);
  if (w) return { t: w.n, sub: `${w.s} · ${w.g === 'triad' ? 'Triad Sagas' : 'Revival Sagas'}`, filter: w.g };
  const c = C.find((x) => x.n === n);
  if (c) return { t: c.n, sub: 'Comet · ' + c.t, filter: 'comet' };
  if (n === 'belt') return { t: 'Asteroid Belt', sub: 'Works in progress and flash fiction', filter: 'belt' };
  return null;
}
