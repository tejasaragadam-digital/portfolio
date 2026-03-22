import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GlitchAvatar = ({ src }) => {
  const [phase, setPhase] = useState('themes'); // 'themes' -> 'reveal' -> 'clean'
  
  useEffect(() => {
    if (phase === 'themes') {
      const timer = setTimeout(() => setPhase('reveal'), 3500); // Display Theme Grid for 3.5s allowing entry animations
      return () => clearTimeout(timer);
    } else if (phase === 'reveal') {
      const timer = setTimeout(() => setPhase('clean'), 1000); // Block reveal flyaway takes 1s
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Generate 9 distinct styling filters for the segments
  const filters = [
    'sepia(1) hue-rotate(250deg) saturate(3)',  // Neon Violet (Top Left)
    'grayscale(1) contrast(1.5)',               // High-Contrast B&W (Top Mid)
    'invert(1) hue-rotate(180deg)',             // Neon Acid (Top Right)
    'sepia(1) hue-rotate(-20deg) saturate(3)',  // Neon Orange (Mid Left)
    'brightness(1.5) contrast(1.2)',            // Overexposed Natural (Center Face)
    'invert(0.8) contrast(1.5)',                // Washed Invert (Mid Right)
    'hue-rotate(90deg) saturate(3)',            // Deep Green (Bot Left)
    'sepia(1) hue-rotate(120deg)',              // Cyberpunk Yellow (Bot Mid)
    'grayscale(1) brightness(0.7)'              // Noir Dark (Bot Right)
  ];

  // Distinct entry animations for each block, staggered exactly 150ms apart
  const entryAnimations = [
    { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.8, ease: "backOut" } },
    { initial: { rotateZ: -90, opacity: 0 }, animate: { rotateZ: 0, opacity: 1 }, transition: { duration: 0.7 } },
    { initial: { y: -100, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.6 } },
    { initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 0.6 } },
    { initial: { scale: 2, filter: "blur(20px)", opacity: 0 }, animate: { scale: 1, filter: "blur(0px)", opacity: 1 }, transition: { duration: 0.5 } },
    { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 0.6 } },
    { initial: { y: 100, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.6 } },
    { initial: { rotateX: 90, opacity: 0 }, animate: { rotateX: 0, opacity: 1 }, transition: { duration: 0.7 } },
    { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1.2 } }
  ].map((anim, index) => ({
    ...anim,
    transition: { ...anim.transition, delay: index * 0.15 } // 150 milliseconds stagger
  }));

  // Map out a 3x3 grid of `inset(top right bottom left)` clip-paths
  const slices = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const top = r * 33.33;
      const bot = 100 - ((r + 1) * 33.33);
      const left = c * 33.33;
      const right = 100 - ((c + 1) * 33.33);
      
      slices.push({
        clipPath: `inset(${top}% ${right}% ${bot}% ${left}%)`,
        filter: filters[r * 3 + c]
      });
    }
  }

  // Generate blocks for the puzzle reveal
  const gridSize = 6;
  const blocks = Array.from({ length: gridSize * gridSize });

  return (
    <div className="relative w-full h-full rounded-full border border-white/10 bg-brand-black flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.15)] group overflow-hidden">
      
      <div className="relative w-full h-full">
        {/* The Clean Image layer (Always sits at the very bottom z-0) */}
        <img 
          src={src} 
          alt="Teja Profile"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 z-0"
        />

        {/* Puzzle Blocks overlaying the clean image */}
        <AnimatePresence>
          {(phase === 'themes' || phase === 'reveal') && (
             <div className="absolute inset-0 grid z-10" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gridTemplateRows: `repeat(${gridSize}, 1fr)` }}>
               {blocks.map((_, i) => (
                 <motion.div
                   key={i}
                   className="bg-brand-black w-full h-full"
                   initial={{ opacity: 1, scale: 1 }}
                   animate={phase === 'reveal' ? { opacity: 0, scale: 0, rotate: 90 } : { opacity: 1, scale: 1 }}
                   transition={{ 
                     delay: phase === 'reveal' ? Math.random() * 0.5 : 0, 
                     duration: 0.5,
                     ease: "easeIn"
                   }}
                 />
               ))}
             </div>
          )}
        </AnimatePresence>

        {/* Themed Fragmentation Overlay Phase */}
        <AnimatePresence>
          {phase === 'themes' && (
            <motion.div 
              className="absolute inset-0 z-20"
              exit={{ opacity: 0 }}
              transition={{ duration: 0 }} // Disappear instantly so the black blocks can smoothly burst
            >
              {slices.map((slice, i) => (
                <motion.img 
                  key={i}
                  src={src} 
                  className="absolute inset-0 w-full h-full object-cover" 
                  style={{ 
                    clipPath: slice.clipPath, 
                    WebkitClipPath: slice.clipPath, 
                    filter: slice.filter 
                  }}
                  initial={entryAnimations[i].initial}
                  animate={entryAnimations[i].animate}
                  transition={entryAnimations[i].transition}
                  alt="Fragment"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default GlitchAvatar;
