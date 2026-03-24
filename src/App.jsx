import { useEffect, useState, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Background from './components/Background';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import SeoWrapper from './components/SeoWrapper';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';
import ScrollSpine from './components/ScrollSpine';
import AnnouncementBar from './components/AnnouncementBar';

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Linkedin, Instagram, ArrowUp } from 'lucide-react';
import { fetchCollection } from './lib/appwrite';

// Bundle Layout Splitting
import Home from './pages/Home';
import TerminalEasterEgg from './components/TerminalEasterEgg';

const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const WebProjects = lazy(() => import('./pages/WebProjects'));
const MarketingProjects = lazy(() => import('./pages/MarketingProjects'));
const Services = lazy(() => import('./pages/Services'));
const Login = lazy(() => import('./pages/Login'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ScrollToTop = () => {
  const { pathname, state } = useLocation();
  useEffect(() => {
    // Skip auto-scroll-to-top when we're navigating with a scrollTo intent
    if (state?.scrollTo) return;
    window.scrollTo(0, 0);
  }, [pathname, state]);
  return null;
};

function App() {
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const navigate = useNavigate();
  const [socials, setSocials] = useState({ linkedin: '#', instagram: '#' });

  // Handle cross-page scroll to contact
  useEffect(() => {
    if (location.state?.scrollTo === 'contact') {
      const tryScroll = () => {
        const el = document.getElementById('contact');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          // Clear state so back-navigation doesn't re-trigger
          window.history.replaceState({}, '');
        } else {
          setTimeout(tryScroll, 100);
        }
      };
      setTimeout(tryScroll, 300);
    }
  }, [location.state]);

  const handleLetsTalk = () => {
    if (location.pathname === '/') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: 'contact' } });
    }
  };

  useEffect(() => {
    const loadSocialConfigurations = async () => {
      try {
        const data = await fetchCollection(import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID);
        if (data && data.length > 0) {
          setSocials({ 
            linkedin: data[0].linkedin || '#', 
            instagram: data[0].instagram || '#' 
          });
        }
      } catch (err) {
        console.warn("Using default fallback social routes natively.");
      }
    };
    loadSocialConfigurations();
  }, []);

  return (
    <div className="relative bg-brand-black min-h-screen text-white font-sans selection:bg-brand-violet selection:text-white overflow-x-hidden">
      <SeoWrapper />
      <Preloader />
      <ScrollToTop />
      
      {/* Unrestricted z-index Custom Cursor */}
      <Cursor />
      
      {/* Global Background layer */}
      <Background />

      {/* Global Progress Bar Tracking */}
      {!location.pathname.startsWith('/admin') && (
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-violet to-brand-orange origin-left z-[100] blur-[1px] pointer-events-none" 
          style={{ scaleX }}
        />
      )}

      {/* Announcement Bar - above everything except cursor */}
      {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/login') && (
        <AnnouncementBar />
      )}

      {/* Navbar Layer unconditionally rendered mapping to bounds */}
      {!location.pathname.startsWith('/admin') && !location.pathname.startsWith('/login') && <Navbar />}

      {/* Main Content mapped via Suspense Boundaries */}
      <main className="relative z-10 w-full overflow-hidden min-h-screen">
        <ScrollSpine />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            
            <Route path="/blog" element={<Suspense fallback={null}><PageTransition><Blog /></PageTransition></Suspense>} />
            <Route path="/blog/:id" element={<Suspense fallback={null}><PageTransition><BlogPost /></PageTransition></Suspense>} />
            <Route path="/web-projects" element={<Suspense fallback={null}><PageTransition><WebProjects /></PageTransition></Suspense>} />
            <Route path="/marketing-projects" element={<Suspense fallback={null}><PageTransition><MarketingProjects /></PageTransition></Suspense>} />
            <Route path="/services" element={<Suspense fallback={null}><PageTransition><Services /></PageTransition></Suspense>} />
            
            <Route path="/login" element={<Suspense fallback={null}><PageTransition><Login /></PageTransition></Suspense>} />
            <Route path="/reset-password" element={<Suspense fallback={null}><PageTransition><ResetPassword /></PageTransition></Suspense>} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Suspense fallback={null}><PageTransition><AdminDashboard /></PageTransition></Suspense>
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<Suspense fallback={null}><PageTransition><NotFound /></PageTransition></Suspense>} />
          </Routes>
        </AnimatePresence>
      </main>
      <TerminalEasterEgg />
      {!location.pathname.startsWith('/admin') && (
        <footer className="relative z-10 pt-24 pb-8 border-t border-white/10 bg-brand-black overflow-hidden flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            onClick={handleLetsTalk}
            className="text-[12vw] md:text-[14vw] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-violet to-brand-orange text-center leading-none mb-12 select-none cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            LET'S TALK
          </motion.div>
          
          <div className="flex gap-8 mb-10 z-20 pointer-events-auto">
            <motion.a 
              whileHover={{ scale: 1.2, y: -5 }} 
              href={socials.linkedin} 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-500 hover:text-brand-violet transition-colors bg-white/5 p-4 rounded-full border border-white/10 hover:border-brand-violet/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
            >
              <Linkedin className="w-6 h-6" />
            </motion.a>
            
            <motion.a 
              whileHover={{ scale: 1.2, y: -5 }} 
              href={socials.instagram} 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-500 hover:text-brand-orange transition-colors bg-white/5 p-4 rounded-full border border-white/10 hover:border-brand-orange/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
            >
              <Instagram className="w-6 h-6" />
            </motion.a>
          </div>

          <motion.button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mb-8 flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all z-20 pointer-events-auto group text-xs font-bold tracking-widest uppercase"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            Back To Top
          </motion.button>

          <p className="text-gray-500 font-mono text-sm max-w-sm text-center px-4 mb-8">
            © {new Date().getFullYear()} - Building digital engines that merge technical flair with strategic growth.
          </p>
        </footer>
      )}
    </div>
  );
}

export default App;
