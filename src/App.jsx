import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Books from './pages/Books.jsx';
import BookDetail from './pages/BookDetail.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Faqs from './pages/Faqs.jsx';

export default function App() {
  const loc = useLocation();
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={loc} key={loc.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:slug" element={<BookDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}
