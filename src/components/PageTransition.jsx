import { motion } from 'framer-motion';

export const PageTransition = ({ children }) => {
  // Extreme Awwwards 5-column sweeping wiping layout strictly decoupling frame repaints natively
  const columns = 5;
  
  return (
    <div className="relative">
      {/* Background shadow blocker to prevent bleeding natively */}
      <motion.div 
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, transition: { duration: 0.5, delay: 0.4 } }}
        exit={{ opacity: 1, transition: { duration: 0.5 } }}
        className="fixed inset-0 pointer-events-none z-[9990] bg-brand-black" 
      />
      
      {/* Cinematic sweeping curtain array */}
      <div className="fixed inset-0 pointer-events-none z-[9999] flex w-[100vw] h-[100vh]">
        {[...Array(columns)].map((_, i) => {
          return (
            <motion.div 
              key={i}
              variants={{
                 initial: { top: 0 },
                 // Sweep downwards staggered left-to-right safely decoupling memory arrays
                 enter: { top: "100vh", transition: { duration: 0.6, delay: 0.05 * i, ease: [0.76, 0, 0.24, 1] } },
                 // Sweep upwards staggered right-to-left
                 exit:  { top: 0, transition: { duration: 0.6, delay: 0.05 * (columns - 1 - i), ease: [0.76, 0, 0.24, 1] } }
              }}
              initial="initial"
              animate="enter"
              exit="exit"
              className="h-full w-full bg-brand-violet/90 backdrop-blur-3xl shadow-[0_0_40px_rgba(139,92,246,0.6)] relative border-x border-white/5"
            />
          )
        })}
      </div>
      
      {/* Native Render Component bounds wrapped underneath the z-index hierarchy */}
      {children}
    </div>
  );
};

export default PageTransition;
