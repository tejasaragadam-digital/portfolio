import { useState, useEffect } from 'react';
import { fetchCollection } from '../lib/appwrite';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Typewriter from './Typewriter';

const Reviews = () => {
  const [reviews, setReviews] = useState([
      {
        id: 1,
        name: "Alex R.",
        role: "SaaS Rocket",
        content: "Teja completely transformed our online presence. Not only is the web app incredibly fast and 3D-enabled, but the organic traffic shot up by 200%. True double threat."
      },
      {
        id: 2,
        name: "Samantha L.",
        role: "E-Commerce Plus",
        content: "Finding a developer who actually understands conversion rates is rare. Teja built our storefront and scaled our paid ads seamlessly. Highly recommend!"
      },
      {
        id: 3,
        name: "Michael J.",
        role: "Future Tech Inc.",
        content: "The 3D configurator built for our main product line increased engagement time by 4x. Brilliant engineering and flawless execution."
      }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchCollection(import.meta.env.VITE_APPWRITE_REVIEWS_COLLECTION_ID || 'PENDING_REVIEWS_ID');
        if (data && data.length > 0) setReviews(data);
      } catch (err) {
         console.warn("Using fallback reviews array");
      }
    };
    loadReviews();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (reviews.length || 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <section className="py-24 px-6 relative w-full z-10 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <Typewriter text="Client Experiences" speed={0.05} />
          </h2>
          <p className="text-gray-400">Hear from people who have scaled their businesses with me.</p>
        </div>

        <motion.div 
          animate={{ y: [-15, 15, -15] }} 
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        >
          <div className="relative glass rounded-3xl p-8 md:p-12 border-t border-brand-violet/30">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-white/5" />
            
            <div className="min-h-[200px] flex items-center justify-center text-center px-4 md:px-12 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-xl md:text-3xl text-gray-200 mb-8 leading-relaxed italic font-light">
                    "{reviews[currentIndex]?.content || reviews[currentIndex]?.text || 'Loading testimonial...'}"
                  </p>
                  <div>
                    <h4 className="text-brand-orange font-bold text-lg">{reviews[currentIndex]?.name}</h4>
                    <span className="text-gray-400 text-sm tracking-widest uppercase">{reviews[currentIndex]?.role || reviews[currentIndex]?.company}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-center mt-8 space-x-2">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentIndex ? 'bg-gradient-to-r from-brand-violet to-brand-orange w-8' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
