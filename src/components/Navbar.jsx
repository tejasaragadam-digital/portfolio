import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import FocusHub from './FocusHub';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e, targetId) => {
    // Only smooth scroll if we are strictly mapping to active anchor IDs.
    if (location.pathname !== '/') return; 
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 glass border-b-0 shadow-lg' : 'py-6 bg-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" onClick={() => window.scrollTo(0,0)} className="text-xl font-bold tracking-tighter shrink-0 cursor-pointer flex items-center">
            TEJA
            <motion.span 
              className="text-brand-orange ml-1"
              animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >.</motion.span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isAnchor = link.href.startsWith('/#');
              if (isAnchor) {
                return (
                  <a 
                    key={link.name} 
                    href={link.href.replace('/', '')} 
                    onClick={(e) => handleSmoothScroll(e, link.anchorTarget)}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                );
              }
              return (
                <Link 
                  key={link.name} 
                  to={link.href}
                  className={`${location.pathname === link.href ? 'text-white font-semibold' : 'text-gray-300'} hover:text-white transition-colors`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Hub Integration dynamically decoupled natively */}
          <div className="flex items-center gap-4">
            <FocusHub />
            <button 
              className="md:hidden text-gray-300 hover:text-white pointer-events-auto"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-brand-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8">
          {navLinks.map((link) => {
            const isAnchor = link.href.startsWith('/#');
            if (isAnchor) {
              return (
                <a 
                  key={link.name} 
                  href={link.href.replace('/', '')} 
                  onClick={(e) => handleSmoothScroll(e, link.anchorTarget)} 
                  className="text-2xl font-bold text-gray-300 hover:text-white"
                >
                  {link.name}
                </a>
              );
            }
            return (
              <Link 
                key={link.name} 
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-bold text-gray-300 hover:text-white"
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Navbar;
