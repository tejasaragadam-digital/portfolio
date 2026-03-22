import { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

const MagneticLetter = ({ char }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Extremely tight liquid metal physics mapping flawlessly tracking rapid cursor sweeps
  const springX = useSpring(position.x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(position.y, { stiffness: 150, damping: 15, mass: 0.1 });

  const mouseMove = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Applying structural pull mechanics decoupling from the core DOM cleanly natively
    setPosition({ x: middleX * 0.4, y: middleY * 0.4 });
  };

  const mouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={mouseMove}
      onMouseLeave={mouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block relative z-10 hover:text-white transition-colors cursor-crosshair min-w-[0.25em]"
    >
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
};

export const MagneticText = ({ text }) => {
  return (
    <span className="inline-flex flex-wrap pointer-events-auto">
      {text.split('').map((char, i) => (
        <MagneticLetter key={i} char={char} />
      ))}
    </span>
  );
};

export default MagneticText;
