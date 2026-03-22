import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TerminalEasterEgg = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    "TejaOS v1.0.0 initializing...",
    "Authentication complete.",
    "Bypassing security protocols...",
    "Type 'help' for a list of root commands."
  ]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let keyBuffer = '';
    const handleKeyDown = (e) => {
      // Escape or ctrl+tilde manually triggers layout mapping natively
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === '~' && e.ctrlKey) setIsOpen(prev => !prev);
      
      // Ignore sequence tracker if the user is actively focused on any data box input natively
      const isTyping = document.activeElement && 
        (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA');

      // Easter egg "teja" keyboard map tracker sequence explicitly mapping payload hooks
      if (!isOpen && !isTyping && e.key.length === 1) {
        keyBuffer += e.key.toLowerCase();
        if (keyBuffer.length > 4) keyBuffer = keyBuffer.slice(1);
        if (keyBuffer === 'teja') {
          setIsOpen(true);
          keyBuffer = '';
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Keep input tracking active cleanly without stealing scroll boundaries natively
  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      setInput('');
      const newHistory = [...history, `guest@teja-os:~$ ${cmd}`];
      
      switch(cmd) {
        case 'help':
          newHistory.push("Available commands: about, skills, home, projects, clear, whoami, exit");
          break;
        case 'about':
          newHistory.push("Teja: Digital Marketer mapping the gap to High-Performance Web Engineering.");
          break;
        case 'skills':
          newHistory.push("React.js, Node.js, Tailwind, SEO, Growth Hacking, Appwrite Cloud.");
          break;
        case 'home':
          navigate('/');
          newHistory.push("Routing DOM securely to Index...");
          break;
        case 'projects':
          navigate('/web-projects');
          newHistory.push("Routing DOM securely to Framework mappings...");
          break;
        case 'clear':
          setHistory([]);
          return; // Skip appending the actual command inherently
        case 'whoami':
          newHistory.push("You are an unauthorized guest scanning the frontend network...");
          break;
        case 'exit':
          setIsOpen(false);
          break;
        case '':
          break;
        default:
          newHistory.push(`Command not found: ${cmd}`);
      }
      setHistory(newHistory);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed bottom-10 right-10 w-full max-w-[450px] h-[350px] bg-black/90 border border-brand-violet/50 rounded-xl shadow-[0_0_50px_rgba(139,92,246,0.3)] z-[999999] overflow-hidden flex flex-col font-mono text-sm backdrop-blur-3xl pointer-events-auto"
        >
          <div className="bg-brand-violet/20 px-4 py-2 flex items-center justify-between border-b border-brand-violet/30">
            <span className="text-gray-300 font-bold tracking-widest text-xs">Terminal - root@teja-os</span>
            <button onClick={() => setIsOpen(false)} className="text-red-400 hover:text-red-300 transition-colors">✕</button>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-1 text-green-400 cursor-text" onClick={() => inputRef.current?.focus()}>
            {history.map((line, i) => (
              <div key={i} className="break-words">{line}</div>
            ))}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-blue-400 whitespace-nowrap">guest@teja-os:~$</span>
              <input 
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleCommand}
                className="flex-1 bg-transparent outline-none border-none text-brand-orange w-full shadow-none appearance-none"
                spellCheck={false}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TerminalEasterEgg;
