import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Typewriter from './Typewriter';
import MagneticButton from './MagneticButton';
import { fetchCollection, getFileViewUrl } from '../lib/appwrite';

const Hero = () => {
  const [isTitleComplete, setIsTitleComplete] = useState(false);
  const [profileUrl, setProfileUrl] = useState('/profile.jpg');

  useEffect(() => {
     const fetchProfile = async () => {
       try {
          const profileData = await fetchCollection(import.meta.env.VITE_APPWRITE_PROFILE_COLLECTION_ID);
          if (profileData && profileData.length > 0 && profileData[0].avatar_id) {
             const customAvatar = getFileViewUrl(import.meta.env.VITE_APPWRITE_GENERAL_BUCKET_ID, profileData[0].avatar_id);
             if (customAvatar) setProfileUrl(customAvatar);
          }
       } catch (err) { console.warn("Using default fallback avatar natively."); }
     };
     fetchProfile();
  }, []);

  return (
    <section id="home" className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-12 px-6 z-10">
      <div className="w-full max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12 lg:gap-20">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 w-full text-center md:text-left pt-8"
        >
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          >
            {/* Main Title with Typing Effect & Rainbow Refresh */}
            <motion.h1 
              whileHover={{ scale: 1.05, textShadow: "0px 0px 20px rgba(139,92,246, 0.8)" }}
              transition={{ type: "spring", stiffness: 500, damping: 10 }}
              className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-snug min-h-[4rem] origin-left inline-block ${isTitleComplete ? 'animate-rainbow' : ''}`}
            >
              <Typewriter 
                text="Hello, I'm Teja" 
                delay={0.2} 
                speed={0.1} 
                onComplete={() => setIsTitleComplete(true)} 
              />
            </motion.h1>
            
            <p className="text-gray-300 text-xl md:text-2xl max-w-2xl mx-auto md:mx-0 mb-10 leading-relaxed min-h-[6rem]">
              <Typewriter 
                text="I am a developer and digital marketer. I build digital engines that merge technical flair with strategic growth." 
                delay={1.5} 
                speed={0.03} 
              />
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.8, duration: 0.8 }}
              className="flex flex-wrap justify-center md:justify-start gap-4"
            >
              <MagneticButton>
                <motion.a 
                  href="#contact" 
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(249,115,22, 0.8)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 10 }}
                  className="px-8 py-4 bg-gradient-to-r from-brand-violet to-brand-orange text-white font-semibold rounded-full pointer-events-auto block"
                >
                  Let's Talk
                </motion.a>
              </MagneticButton>
              <MagneticButton>
                <motion.a 
                  href="#about" 
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(139,92,246, 0.8)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 10 }}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm pointer-events-auto block"
                >
                  Explore My Work
                </motion.a>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Repaired Image / Avatar Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="flex-1 w-full flex justify-center md:justify-end shrink-0 relative z-10 pointer-events-none"
        >
          <motion.div 
            className="relative w-72 h-72 md:w-80 md:h-80 lg:w-[450px] lg:h-[450px]"
            animate={{ y: [-20, 20, -20] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            {/* Ambient Background Glow matching canvas seamlessly */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-violet to-brand-orange rounded-full blur-3xl opacity-40 animate-pulse z-0 pointer-events-none"></div>
            
            <div className="relative w-full h-full rounded-full border-4 border-white/5 bg-brand-black flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.15)] overflow-hidden p-2 backdrop-blur-md z-10 pointer-events-auto shadow-xl">
              <img 
                src={profileUrl} 
                alt="Teja Profile"
                fetchpriority="high"
                decoding="async"
                className="w-full h-full object-cover rounded-full mix-blend-normal opacity-90 transition-all duration-700 hover:opacity-100 hover:scale-105"
              />
            </div>
          </motion.div>
        </motion.div>

      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-gray-500 hidden md:flex"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-sm mb-2 uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
