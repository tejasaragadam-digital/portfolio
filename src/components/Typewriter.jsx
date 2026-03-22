import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const Typewriter = ({ text = "", delay = 0, speed = 0.05, className = "", onComplete }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });
  const [displayedText, setDisplayedText] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const onCompleteRef = useRef(onComplete);

  // Keep latest onComplete reference without re-triggering effects
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Handle start delay
  useEffect(() => {
    if (isInView && !isStarted) {
      const timer = setTimeout(() => {
        setIsStarted(true);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay, isStarted]);

  // Handle typing
  useEffect(() => {
    if (!isStarted || isFinished) return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, currentIndex + 1));
      currentIndex++;
      
      if (currentIndex >= text.length) {
        clearInterval(interval);
        setIsFinished(true);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, speed * 1000);

    return () => clearInterval(interval);
  }, [isStarted, isFinished, text, speed]);

  return (
    <span ref={ref} className={className}>
      {displayedText}
      {(!isFinished || !isStarted) && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-[0.15em] h-[1em] bg-brand-violet ml-1 align-middle"
        />
      )}
    </span>
  );
};

export default Typewriter;
