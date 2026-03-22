import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValue, useVelocity, useAnimationFrame } from "framer-motion";

/**
 * A highly optimized, GPU accelerated infinite marquee tracking native scroll velocity.
 * Formula relies on standard Framer-Motion wrapper constraints avoiding massive layout repaints.
 */
export const Marquee = ({ children, baseVelocity = 2, direction = "left" }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  // Calculate wrap around logically clamping natively without importing heavy @motionone hooks
  const wrap = (min, max, v) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
  };

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(direction === "left" ? 1 : -1);
  
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Apply scroll-driven acceleration coefficient smoothly
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap m-0 flex flex-nowrap border-y border-white/5 py-6 bg-brand-black/20 w-[100vw] relative left-1/2 -translate-x-1/2 shadow-inner pointer-events-none backdrop-blur-sm z-10 my-8 md:my-20">
      <motion.div 
        className="flex font-black text-6xl md:text-8xl tracking-tighter uppercase text-transparent items-center" 
        style={{ x, WebkitTextStroke: '1px rgba(255,255,255,0.15)' }}
      >
        <span className="block mx-8">{children}</span>
        <span className="block mx-8">{children}</span>
        <span className="block mx-8">{children}</span>
        <span className="block mx-8">{children}</span>
        <span className="block mx-8">{children}</span>
        <span className="block mx-8">{children}</span>
      </motion.div>
    </div>
  );
};

export default Marquee;
