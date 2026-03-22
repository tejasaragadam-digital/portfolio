import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const Cursor = () => {
  // Raw instantaneous tracking
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);

  // Outer ring trails softly with physics
  const springX = useSpring(cursorX, { stiffness: 300, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 300, damping: 20 });
  
  // Halo trails very slowly mapping to a huge mass
  const haloX = useSpring(cursorX, { stiffness: 100, damping: 30, mass: 1 });
  const haloY = useSpring(cursorY, { stiffness: 100, damping: 30, mass: 1 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const checkHoverState = (e) => {
      const isTargeting = ['A', 'BUTTON'].includes(e.target.tagName) || e.target.closest('a') || e.target.closest('button');
      setIsHovering(isTargeting);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', checkHoverState);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', checkHoverState);
    };
  }, [cursorX, cursorY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999999] overflow-hidden">
      
      {/* Outer Ring Constraint (Trails the mouse) */}
      <motion.div
        className="absolute w-8 h-8 border border-brand-violet rounded-full hidden md:block"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          scale: isHovering ? 1.6 : 1,
          borderColor: isHovering ? '#f97316' : '#8b5cf6',
          backgroundColor: isHovering ? 'rgba(249,115,22, 0.1)' : 'transparent'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      
      {/* Solid Tracking Core (Sticks instantly to mouse) */}
      <motion.div
        className="absolute w-2 h-2 bg-brand-orange rounded-full hidden md:block shadow-[0_0_10px_rgba(249,115,22,0.8)]"
        style={{
          x: cursorX, // Instantly tracks raw mouse coordinate exactly
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{ scale: isHovering ? 0 : 1 }}
      />

      {/* Extreme Glowing Background Halo "Flashlight" (Trails deeply) */}
      <motion.div
        className="absolute w-[400px] h-[400px] bg-brand-violet rounded-full blur-[100px] mix-blend-screen hidden md:block pointer-events-none -z-10"
        style={{
          x: haloX,
          y: haloY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          opacity: isHovering ? 0.3 : 0.15,
          scale: isHovering ? 1.2 : 1,
          backgroundColor: isHovering ? '#f97316' : '#8b5cf6'
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default Cursor;
