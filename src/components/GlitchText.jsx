import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// High-density hacker string constants
const chars = "!<>-_\\\\/[]{}—=+*^?#________";

export const GlitchText = ({ text, className = "" }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      setDisplayText(text);
      return;
    }

    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        prev.split("")
          .map((letter, index) => {
            if (index < iterations) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      // Fractional iteration steps forces longer cyberpunk glitch intervals smoothly
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1/4; 
    }, 40);

    return () => clearInterval(interval);
  }, [text, isHovered]);

  return (
    <motion.span 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`inline-block cursor-none text-brand-orange ${className}`}
      whileHover={{ scale: 1.05, textShadow: "0px 0px 25px rgba(249,115,22,0.9)", transformOrigin: "left" }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {displayText}
    </motion.span>
  );
};

export default GlitchText;
