# J. Alleyn Winchester — React site
Vite + React 18 + React Router 6 + Framer Motion + Three.js.

    npm install
    npm run dev       # http://localhost:5173
    npm run build     # output in dist/

Edit ALL content in `src/data.js` (books, covers, bio, email, socials, FAQ, buy links).
Contact form: set `VITE_FORM_ENDPOINT` in a `.env` file (e.g. a Formspree URL). Until then it honestly shows "Not sent".
Put cover images in `public/covers/` and set `cover: '/covers/spring.jpg'` in `BOOKS`.
Routes: / /books /books/:slug /about /contact /faqs. For static hosting add an SPA fallback (all paths -> index.html).
