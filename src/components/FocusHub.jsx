import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Headphones, Wind, X } from 'lucide-react';
import { createPortal } from 'react-dom';

const FocusHub = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAmbient, setIsAmbient] = useState(false);
  const [isZen, setIsZen] = useState(false);
  const [breathText, setBreathText] = useState('INHALE');
  const [showPrompt, setShowPrompt] = useState(false);
  
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    // 120 Second psychological nudge mapping exactly natively 
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 120000); 

    return () => clearTimeout(timer);
  }, []);

  // Ambient Audio Generation identical to original cinematic loops precisely organically
  const toggleAmbient = (forceState) => {
    const willPlay = forceState !== undefined ? forceState : !isAmbient;
    if (willPlay === isAmbient) return; // Prevent double execution natively

    if (willPlay) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        oscillatorRef.current = audioCtxRef.current.createOscillator();
        oscillatorRef.current.type = 'sine';
        oscillatorRef.current.frequency.setValueAtTime(65.41, audioCtxRef.current.currentTime);
        
        const lfo = audioCtxRef.current.createOscillator();
        lfo.type = 'triangle';
        lfo.frequency.value = 0.05;
        
        const lfoGain = audioCtxRef.current.createGain();
        lfoGain.gain.value = 5; 
        lfo.connect(lfoGain);
        lfoGain.connect(oscillatorRef.current.detune);
        lfo.start();
        
        gainNodeRef.current = audioCtxRef.current.createGain();
        gainNodeRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        gainNodeRef.current.gain.setTargetAtTime(0.08, audioCtxRef.current.currentTime, 2);
        
        oscillatorRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(audioCtxRef.current.destination);
        oscillatorRef.current.start();
      } else {
        if(audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        gainNodeRef.current.gain.setTargetAtTime(0.08, audioCtxRef.current.currentTime, 1);
      }
      setIsAmbient(true);
      setShowPrompt(false); 
    } else {
      if (audioCtxRef.current && gainNodeRef.current) {
         gainNodeRef.current.gain.setTargetAtTime(0.0001, audioCtxRef.current.currentTime, 0.5);
         setTimeout(() => audioCtxRef.current.suspend(), 1000);
      }
      setIsAmbient(false);
    }
  };

  const toggleZen = () => {
    if (!isZen) {
        setIsZen(true);
        toggleAmbient(true); // Always default enable Ambient cleanly
        setIsOpen(false);
        setShowPrompt(false);
    } else {
        setIsZen(false);
        toggleAmbient(false); // Disable ambient when Zen closes explicitly
    }
  };

  useEffect(() => {
    let interval;
    if (isZen) {
        document.body.style.overflow = 'hidden';
        setBreathText('INHALE');
        // Synchronized math mappings for 8-second breathing loop (4 Inhale, 4 Exhale)
        interval = setInterval(() => {
            setBreathText(prev => prev === 'INHALE' ? 'EXHALE' : 'INHALE');
        }, 4000);
    } else {
        document.body.style.overflow = '';
    }
    return () => { 
        document.body.style.overflow = ''; 
        clearInterval(interval);
    };
  }, [isZen]);

  return (
    <>
      <div className="relative pointer-events-auto flex items-center">
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3, type: "spring" }}
          onClick={() => { setIsOpen(!isOpen); setShowPrompt(false); }}
          className={`flex items-center justify-center px-5 py-2 rounded-full backdrop-blur-md relative transition-colors font-black tracking-widest text-sm border shadow-lg ${isOpen || isZen ? 'bg-brand-violet/20 border-brand-violet/50 text-brand-violet' : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:border-white/30'}`}
        >
          RELAX
          
          {/* Prompt Tooltip */}
          <AnimatePresence>
            {showPrompt && !isOpen && !isZen && !isAmbient && (
              <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, scale: 0.8 }}
                 className="absolute top-1/2 right-[120%] -translate-y-1/2 whitespace-nowrap bg-brand-violet border border-brand-violet/50 px-4 py-2 rounded-full text-xs text-white font-bold tracking-wide flex items-center gap-3 shadow-[0_0_20px_rgba(139,92,246,0.6)]"
              >
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                 </span>
                 Need to Refocus?
                 {/* CSS Triangle Pointer */}
                 <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-brand-violet rotate-45 border-r border-t border-brand-violet/50" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
             <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute top-14 right-0 min-w-[220px] glass bg-brand-black/90 rounded-2xl border border-white/10 p-2 flex flex-col gap-1 shadow-2xl z-50 overflow-hidden"
             >
                <div className="px-3 py-2 text-[10px] font-mono tracking-widest text-gray-500 uppercase">Focus Hub</div>
                
                <button 
                  onClick={() => toggleAmbient()}
                  className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 ${isAmbient ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20' : 'hover:bg-white/5 text-gray-300 hover:text-white border border-transparent'}`}
                >
                  <span className="flex items-center gap-3 text-sm font-bold"><Headphones className="w-4 h-4" /> Ambient Audio</span>
                  <div className={`w-2 h-2 rounded-full transition-colors ${isAmbient ? 'bg-brand-orange shadow-[0_0_10px_rgba(249,115,22,1)]' : 'bg-gray-600'}`} />
                </button>
                
                <button 
                  onClick={toggleZen}
                  className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-300 ${isZen ? 'bg-brand-violet/10 text-brand-violet border border-brand-violet/20' : 'hover:bg-white/5 text-gray-300 hover:text-white border border-transparent'}`}
                >
                  <span className="flex items-center gap-3 text-sm font-bold"><Wind className="w-4 h-4" /> Zen Mode</span>
                  <div className={`w-2 h-2 rounded-full transition-colors ${isZen ? 'bg-brand-violet shadow-[0_0_10px_rgba(139,92,246,1)]' : 'bg-gray-600'}`} />
                </button>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen Zen Mode Viewport Overriding DOM cleanly generated securely at Document Body level bypassing Ancestor transforms entirely */}
      {typeof document !== "undefined" && createPortal(
          <AnimatePresence>
             {isZen && (
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 1.5 }}
                   className="fixed inset-0 z-[9999] bg-brand-black/98 flex flex-col items-center justify-center pointer-events-auto overflow-hidden"
                >
                   <button 
                     onClick={toggleZen}
                     className="absolute top-8 right-8 text-gray-400 hover:text-white p-4 rounded-full hover:bg-white/10 transition-colors z-[10010]"
                   >
                      <X className="w-8 h-8 pointer-events-none" />
                   </button>

                   {/* Breathing Physics Engine perfectly synchronized to 8-second box breathing geometries */}
                   <motion.div 
                      animate={{ 
                          scale: [1, 2.8, 1],
                          opacity: [0.3, 0.9, 0.3],
                          rotate: [0, 90, 0]
                      }}
                      transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut"
                      }}
                      className="w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full border-2 border-brand-violet/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_120px_rgba(139,92,246,0.2)] pointer-events-none"
                   />
                   
                   <motion.div 
                      animate={{ 
                          scale: [1, 2.2, 1],
                          opacity: [0.1, 0.5, 0.1],
                          rotate: [0, -90, 0]
                      }}
                      transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.2 // Slight delay for organic ripple mapping 
                      }}
                      className="w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full border-2 border-brand-orange/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                   />

                   {/* Watery Organic Blob Physics Mask Container flawlessly destroying background constraints intrinsically */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[240px] h-[240px] md:w-[350px] md:h-[350px] opacity-70 pointer-events-none">
                     <motion.div 
                        animate={{ 
                            opacity: [0.8, 1, 0.8], 
                            scale: [0.9, 1.15, 0.9],
                            y: ["-10px", "10px", "-10px"],
                            borderRadius: [
                              "40% 60% 70% 30% / 40% 50% 60% 50%",
                              "60% 40% 30% 70% / 60% 30% 70% 40%",
                              "40% 60% 70% 30% / 40% 50% 60% 50%"
                            ]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full h-full flex flex-col items-center justify-center overflow-hidden border-2 border-brand-violet/50 shadow-[inset_0_0_40px_rgba(139,92,246,0.3),0_0_40px_rgba(139,92,246,0.4)] relative bg-brand-violet/5 pointer-events-none"
                     >
                        <motion.div 
                            animate={{ opacity: [0.2, 0.5, 0.2], rotate: 360 }}
                            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-tr from-brand-violet/30 via-transparent to-brand-orange/30 mix-blend-screen z-20 pointer-events-none"
                        />

                        {/* Shrunk Alien Image securely fitting perfectly inside the morphological clipping array */}
                        <img 
                          src="/alien.png" 
                          alt="Meditating Zen Avatar" 
                          className="w-[65%] h-[65%] object-contain filter contrast-[1.3] brightness-110 mix-blend-screen z-10 drop-shadow-[0_0_20px_rgba(139,92,246,0.5)] pointer-events-none"
                        />
                     </motion.div>
                   </div>

                   <AnimatePresence mode="wait">
                     <motion.h2 
                        key={breathText}
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute top-[85%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-brand-violet to-white tracking-[0.4em] drop-shadow-[0_0_30px_rgba(0,0,0,1)] uppercase bg-black/40 px-8 py-4 rounded-3xl pointer-events-none"
                     >
                        {breathText}
                     </motion.h2>
                   </AnimatePresence>
                </motion.div>
             )}
          </AnimatePresence>,
          document.body
      )}
    </>
  );
};

export default FocusHub;
