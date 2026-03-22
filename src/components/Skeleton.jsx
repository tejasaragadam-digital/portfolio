import { motion } from 'framer-motion';

export const CardSkeleton = () => (
  <motion.div 
    animate={{ opacity: [0.3, 0.7, 0.3] }}
    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    className="glass p-8 rounded-3xl h-full flex flex-col pointer-events-none border border-white/5 bg-white/5 min-h-[350px]"
  >
    {/* Structural Category Tag */}
    <div className="w-1/4 h-4 bg-brand-violet/20 rounded-full mb-6"></div>
    {/* Title block */}
    <div className="w-3/4 h-8 bg-white/10 rounded-xl mb-4"></div>
    <div className="w-1/2 h-8 bg-white/10 rounded-xl mb-8"></div>
    {/* Paragraph block */}
    <div className="w-full h-4 bg-white/5 rounded-full mb-3"></div>
    <div className="w-[90%] h-4 bg-white/5 rounded-full mb-auto"></div>
    {/* Fake Button Anchor */}
    <div className="mt-8 pt-6 border-t border-white/10 w-full">
       <div className="w-1/2 h-8 bg-brand-orange/20 rounded-full mt-2"></div>
    </div>
  </motion.div>
);
