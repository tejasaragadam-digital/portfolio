import { motion, useScroll, useSpring } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export const ReadingProgress = ({ containerRef }) => {
  // Binds exact path tracing mathematically directly to explicit DOM array container node structurally
  const { scrollYProgress } = useScroll({ container: containerRef });
  
  // Dense viscous physics constraints mimicking authentic high-end loading UI seamlessly
  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
      className="fixed bottom-6 right-6 z-[150] w-14 h-14 bg-brand-black/90 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(249,115,22,0.4)] pointer-events-none"
    >
      <svg className="w-12 h-12 -rotate-90 transform absolute" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
        <motion.circle 
          cx="50" cy="50" r="44" 
          stroke="var(--color-brand-orange)" 
          strokeWidth="4" 
          fill="none" 
          strokeLinecap="round"
          style={{ pathLength }} 
          className="drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]"
        />
      </svg>
      <BookOpen className="w-4 h-4 text-brand-orange drop-shadow-[0_0_10px_rgba(249,115,22,0.8)] opacity-80" />
    </motion.div>
  );
};

export default ReadingProgress;
