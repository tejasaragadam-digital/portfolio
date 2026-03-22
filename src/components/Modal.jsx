import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ReadingProgress from './ReadingProgress';
import VelocityImage from './VelocityImage';
import { Link } from 'react-router-dom';
import { getFileDownloadUrl } from '../lib/appwrite';

const Modal = ({ isOpen, onClose, data }) => {
  const { themeData } = useTheme();
  const modalRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    // Strict Native Overflow locking isolating explicit UX arrays inherently tracking Modal state securely bypassing completely the global document bleed
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    if (isOpen && data) {
       let targetColor = '#8b5cf6'; 
       let targetAlt = '#f97316'; 

       const str = (data.category || data.tech || data.title || "").toLowerCase();
       if (str.includes('react') || str.includes('web')) { targetColor = '#3b82f6'; targetAlt = '#ec4899'; }
       else if (str.includes('marketing') || str.includes('seo') || str.includes('growth')) { targetColor = '#10b981'; targetAlt = '#f59e0b'; }
       else if (str.includes('3d') || str.includes('design')) { targetColor = '#ec4899'; targetAlt = '#06b6d4'; }
       
       root.style.setProperty('--color-brand-violet', targetColor);
       root.style.setProperty('--color-brand-orange', targetAlt);
    } else if (!isOpen && themeData) {
       root.style.setProperty('--color-brand-violet', themeData.violet);
       root.style.setProperty('--color-brand-orange', themeData.orange);
    }

    // Cleanup overriding unmount hooks explicitly locking state natively securely
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, data, themeData]);

  return (
    <AnimatePresence>
      {isOpen && data && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
          {/* Tracking Component directly hooked mapped securely to DOM layouts securely */}
          <ReadingProgress containerRef={modalRef} />
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          />
          
          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass rounded-3xl border border-white/20 shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-white/20 rounded-full transition-colors text-white backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Section */}
            {data.image && (
              <div className="md:w-1/2 min-h-[300px] md:min-h-[500px] relative">
                <VelocityImage 
                  src={data.image} 
                  alt={data.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-brand-black via-transparent to-transparent opacity-80" />
              </div>
            )}
            
            {/* Text Section / Details Array mapped directly against Appwrite Schema fields */}
            <div className={`p-8 md:p-12 flex flex-col justify-center ${data.image ? 'md:w-1/2' : 'w-full'}`}>
              {/* Marketing Categories/Metrics */}
              {data.metric && (
                <span className="text-green-400 font-bold tracking-widest uppercase mb-3 block">
                  {data.metric}
                </span>
              )}
              {data.category && (
                <span className="text-brand-orange text-sm font-bold tracking-widest uppercase mb-3 block">
                  {data.category}
                </span>
              )}
              {/* Web Project Tech Stacks */}
              {data.tech && (
                <span className="text-brand-violet font-mono text-sm mb-3 block">
                  {data.tech}
                </span>
              )}

              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
                {data.title}
              </h2>
              
              <div className="text-gray-300 text-lg leading-relaxed mb-8">
                {data.desc || data.readTime || "Detailed case study expansion coming soon!"}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {data.link && (
                  <a 
                    href={data.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-white text-black font-bold rounded-full w-max hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all text-center"
                  >
                    Visit Live Asset
                  </a>
                )}

                {data.pdf_id && (
                  <a 
                    href={getFileDownloadUrl(import.meta.env.VITE_APPWRITE_PDF_BUCKET_ID || import.meta.env.VITE_APPWRITE_GENERAL_BUCKET_ID, data.pdf_id)}
                    download
                    className="px-8 py-4 bg-brand-orange text-white font-bold rounded-full w-max hover:shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all text-center"
                  >
                    Download Case Study (.pdf)
                  </a>
                )}

                {/* Direct Link explicitly redirecting specifically into document arrays completely bypassing Modals strictly */}
                {data.readTime && data.$id && (
                  <Link 
                    to={`/blog/${data.$id}`}
                    onClick={onClose}
                    className="px-8 py-4 bg-brand-violet text-white font-bold rounded-full w-max hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] border border-brand-violet/20 hover:border-brand-violet transition-all text-center"
                  >
                    View Full Article
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
