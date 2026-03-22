import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { playHoverSound } from '../lib/audio';

const MagneticButton = ({ children, className }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate the stretch distance (30% pull factor)
    setPosition({ x: (clientX - centerX) * 0.3, y: (clientY - centerY) * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => playHoverSound()}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative inline-block ${className || ''}`}
    >
      {children}
    </motion.div>
  );
};

export default MagneticButton;
