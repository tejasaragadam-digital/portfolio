import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lock scrolling on viewport
    document.body.style.overflow = 'hidden';

    // Release preloader mask smoothly after 2.6 seconds giving 3D Canvas time to cache compiling
    const timer = setTimeout(() => {
      setLoading(false);
      document.body.style.overflow = 'auto'; // Release infinite scroll boundaries
    }, 2600);
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
           exit={{ y: "-100%" }}
           transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }} 
           className="fixed inset-0 z-[9999] bg-brand-black flex flex-col items-center justify-center pointer-events-auto"
        >
          {/* Animated Loader Graphic */}
          <div className="relative flex items-center justify-center w-32 h-32 mb-8">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
               className="absolute inset-0 border-t-4 border-r-4 border-brand-violet rounded-full opacity-70"
            />
            <motion.div 
               animate={{ rotate: -360 }}
               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
               className="absolute inset-4 border-b-4 border-l-4 border-brand-orange rounded-full opacity-70"
            />
            
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-4 h-4 rounded-full bg-white shadow-[0_0_20px_white]"
            />
          </div>

          {/* Typewriter Boot Sequence */}
          <div className="h-6 overflow-hidden">
            <motion.div
              initial={{ y: 24 }}
              animate={{ y: [24, 0, 0, -24] }}
              transition={{ times: [0, 0.1, 0.9, 1], duration: 1.8, delay: 0.2 }}
              className="font-mono text-brand-orange text-sm tracking-widest text-center"
            >
              HOLD TIGHT...
            </motion.div>
          </div>
          
          <div className="mt-8 flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2, repeatType: 'reverse' }}
                className="w-1.5 h-1.5 bg-brand-violet rounded-full"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
