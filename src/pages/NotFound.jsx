import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Typewriter from '../components/Typewriter';
import MagneticButton from '../components/MagneticButton';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen pt-32 px-6 w-full flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Glitch Background Effect */}
      <motion.div 
        animate={{ opacity: [0.1, 0.4, 0.1, 0.6, 0.1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        className="absolute inset-0 z-0 bg-brand-black flex items-center justify-center opacity-30 pointer-events-none"
      >
        <div className="text-[20rem] font-black text-brand-violet/10 select-none tracking-tighter">
          404
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="glass p-12 rounded-[3rem] border border-brand-orange/30 shadow-[0_0_50px_rgba(249,115,22,0.15)] max-w-2xl w-full text-center relative z-10"
      >
        <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <AlertTriangle className="w-10 h-10 text-brand-orange relative z-10" />
          <motion.div 
             animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
             transition={{ repeat: Infinity, duration: 2 }}
             className="absolute inset-0 border-2 border-brand-orange rounded-full"
          />
        </div>

        <motion.h1 
          className="text-5xl md:text-7xl font-bold text-white mb-6"
        >
          <Typewriter text="Signal Lost." speed={0.15} />
        </motion.h1>

        <p className="text-xl text-gray-400 mb-12 max-w-lg mx-auto min-h-[4rem]">
          <Typewriter text="The coordinate vector you requested does not exist in this spatial dimension." delay={2} speed={0.03} />
        </p>

        <MagneticButton>
          <motion.div
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(139,92,246, 0.6)" }}
            transition={{ type: "spring", stiffness: 500, damping: 10 }}
            className="flex items-center justify-center gap-3 px-8 py-5 bg-white text-brand-black text-lg font-bold rounded-2xl cursor-pointer"
          >
            <Home className="w-6 h-6" />
            Recalibrate Trajectory Home
          </motion.div>
        </MagneticButton>

      </motion.div>
    </section>
  );
};

export default NotFound;
