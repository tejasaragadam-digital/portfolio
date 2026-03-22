import { motion, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';

export const VelocityImage = ({ src, alt, className = "" }) => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  // Track scroll speed aggressively but smooth the physics to avoid jarring skew lines
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  // Skew up to 15 degrees tracking explicit scroll momentum loops perfectly mapping
  const skew = useTransform(smoothVelocity, [-1000, 1000], [15, -15]);

  return (
    <motion.div style={{ skew }} className={`overflow-hidden rounded-2xl ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover origin-center scale-[1.05]" />
    </motion.div>
  );
};

export default VelocityImage;
