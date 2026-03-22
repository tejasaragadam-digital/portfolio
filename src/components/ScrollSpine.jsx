import { motion, useScroll, useSpring } from 'framer-motion';

export const ScrollSpine = () => {
  const { scrollYProgress } = useScroll();
  
  // Dense thick spring mapping the drawing line strictly to viewport depth 
  // preventing layout jumps gracefully masking performance loads natively.
  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });

  return (
    <div className="fixed top-0 left-6 md:left-12 bottom-0 w-[2px] z-0 pointer-events-none hidden md:block opacity-40 mix-blend-screen">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 10 1000" preserveAspectRatio="none">
        {/* Core faint structure path */}
        <line 
          x1="5" y1="0" 
          x2="5" y2="1000" 
          stroke="rgba(255,255,255,0.05)" 
          strokeWidth="1" 
        />
        
        {/* Extreme glowing path mapping dynamically resolving velocity natively */}
        <motion.line 
          x1="5" y1="0" 
          x2="5" y2="1000" 
          stroke="var(--color-brand-violet)" 
          strokeWidth="3" 
          style={{ pathLength }} 
          className="drop-shadow-[0_0_15px_rgba(139,92,246,0.9)]"
        />
      </svg>
    </div>
  );
};

export default ScrollSpine;
