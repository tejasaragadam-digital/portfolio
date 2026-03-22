import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const TextReveal = ({ children, className = "" }) => {
  const containerRef = useRef(null);
  
  // Track scroll depth strictly within the container bounds
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "end 25%"]
  });

  const words = children.split(" ");

  return (
    <p ref={containerRef} className={`flex flex-wrap gap-x-[0.3em] gap-y-[0.1em] ${className}`}>
      {words.map((word, i) => {
        // Sequentially distribute opacity scaling mapping dynamically across indices natively
        const start = i / words.length;
        const end = start + (1 / words.length);
        const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);
        
        return (
          <motion.span 
             key={i} 
             style={{ opacity }} 
             className="inline-block"
          >
            {word}
          </motion.span>
        );
      })}
    </p>
  );
};

export default TextReveal;
