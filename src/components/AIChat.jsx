import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

// Static comprehensive Vector Database simulation linking directly to portfolio logic flawlessly natively
const knowledgeBase = [
  { keywords: ["tech", "nexus", "role", "full-stack", "developer"], response: "At TechNexus Inc., I architected modern WebGL interfaces with React Three Fiber, scaling performance by over 40% for 2M+ active users globally." },
  { keywords: ["marketing", "growth", "lead", "seo", "sales"], response: "As Digital Marketing Lead at Growth Labs, I executed massive SaaS GTM strategies encompassing SEO, paid social funnels, and optimized CRO matrices—scaling MRR by 300%." },
  { keywords: ["skill", "stack", "react", "framer", "node"], response: "My technical stack is heavily focused on React, Node.js, and advanced DOM physics via framer-motion and WebGL." },
  { keywords: ["hire", "contact", "email", "job"], response: "I am actively open to high-impact roles. You can open the hacker terminal (Ctrl+~) or scroll to the bottom Let's Talk footer to get in touch securely!" },
  { keywords: ["hi", "hello", "hey", "who", "what"], response: "Hello! I am Teja's embedded AI model. I've analyzed his complete portfolio array securely. What details would you like to know?" }
];

export const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "System Online. Initializing Knowledge Base. Ask me anything about Teja's engineering mechanics.", sender: "ai" }
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setInput('');
    
    // Asynchronous simulated LLM inference delay explicitly natively
    setTimeout(() => {
      let matchedResponse = "I don't have an exact fuzzy hit for that strictly, but you can definitely verify the Experience timeline visually or Contact Teja directly for absolute logs.";
      
      const lowerInput = userMsg.toLowerCase();
      // Lightning fast local iteration matrix bypassing server latency functionally
      for (const entry of knowledgeBase) {
        if (entry.keywords.some(kw => lowerInput.includes(kw))) {
          matchedResponse = entry.response;
          break;
        }
      }
      
      setMessages(prev => [...prev, { text: matchedResponse, sender: 'ai' }]);
    }, 900);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 25px rgba(139,92,246,0.8)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[200] w-14 h-14 bg-brand-violet rounded-full flex items-center justify-center shadow-lg border border-white/20 hover:scale-105 transition-all outline-none"
      >
        <MessageSquare className="w-6 h-6 text-white translate-y-[1px]" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-24 right-6 md:right-10 z-[250] w-[calc(100vw-3rem)] md:w-96 h-[500px] max-h-[70vh] glass rounded-3xl border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden bg-brand-black/90 backdrop-blur-3xl"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-violet/20 flex items-center justify-center border border-brand-violet/50">
                   <Bot className="w-4 h-4 text-brand-violet" />
                </div>
                <div>
                   <span className="font-bold text-white text-sm block leading-tight">Teja.AI Model</span>
                   <span className="text-[10px] text-brand-orange uppercase tracking-wider font-mono">v2 Limitless</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-0">
              {messages.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-4 max-w-[85%] text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-gradient-to-r from-brand-orange to-[#ff904f] text-white rounded-[20px] rounded-br-[4px] shadow-lg' : 'glass border border-white/10 border-l-2 border-l-brand-violet text-gray-200 rounded-[20px] rounded-bl-[4px] shadow-lg'}`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="p-4 border-t border-white/10 relative z-10 bg-brand-black/50">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask the model natively..."
                  className="w-full bg-black/60 border border-white/10 rounded-full py-3 pl-5 pr-14 text-sm text-white focus:outline-none focus:border-brand-violet/60 focus:bg-white/5 transition-all shadow-inner"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-brand-violet rounded-full hover:scale-105 transition-transform"
                >
                  <Send className="w-4 h-4 text-white translate-x-[-1px] translate-y-[1px]" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;
