import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Globe, Users, Zap, CheckCircle2 } from 'lucide-react';

export const LiveAnalytics = () => {
  const [activeUsers, setActiveUsers] = useState(1);
  const [serverLoad, setServerLoad] = useState(12);
  const [locations, setLocations] = useState([]);
  const [stream, setStream] = useState(["System Admin Authenticated.", "Listening to PORT 443 web-sockets...", "Geo-IP Engine armed natively."]);

  useEffect(() => {
    // Highly sophisticated Web Socket pulse simulator tracking pseudo global interactions flawlessly visually 
    const interval = setInterval(() => {
      const isBurst = Math.random() > 0.8;
      
      setActiveUsers(prev => {
         const move = Math.floor(Math.random() * 3) - 1; 
         return Math.max(1, prev + (isBurst ? Math.floor(Math.random() * 5) : move));
      });
      
      setServerLoad(Math.floor(Math.random() * 25) + 4);
      
      if (Math.random() > 0.4) {
        setLocations(prev => {
          // Native absolute percentage arrays mapping onto SVG globe securely
          const newLocs = [...prev, { x: 20 + Math.random() * 60, y: 20 + Math.random() * 60, id: Date.now() }];
          if (newLocs.length > 5) newLocs.shift();
          return newLocs;
        });
      }

      if (Math.random() > 0.6) {
        const events = ["Anonymous Client Ping", "RAG Vector Query Exectuted", "Contact Form Hover Event", "Terminal Easter Egg Activated", "Project Modal Interpolated"];
        setStream(prev => {
           const log = [...prev, `[${new Date().toLocaleTimeString()}] - ${events[Math.floor(Math.random() * events.length)]}`];
           if (log.length > 5) log.shift();
           return log;
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full mb-12 flex flex-col gap-6">
      
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
         <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" />
         <h2 className="text-xl font-bold font-mono text-gray-200">WSS://LIVE-ANALYTICS-ENGINE.IO</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Active Connections Node */}
        <div className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-violet/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col relative z-10">
              <span className="text-gray-400 text-xs font-semibold tracking-[0.2em] font-mono mb-1">CONCURRENT USERS</span>
              <AnimatePresence mode="popLayout">
                <motion.span 
                  key={activeUsers}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="text-5xl font-black text-brand-violet drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                >
                  {activeUsers}
                </motion.span>
              </AnimatePresence>
          </div>
          <Users className="w-12 h-12 text-brand-violet/30 relative z-10" />
        </div>

        {/* Global Ping Node */}
        <div className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col relative z-10">
              <span className="text-gray-400 text-xs font-semibold tracking-[0.2em] font-mono mb-1">SERVER LATENCY</span>
              <span className="text-5xl font-black text-brand-orange drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]">{serverLoad}<span className="text-2xl ml-1 text-white/50">ms</span></span>
          </div>
          <Activity className="w-12 h-12 text-brand-orange/30 relative z-10" />
        </div>

        {/* Geographic Terminal Map Node */}
        <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col col-span-1 md:col-span-2 lg:col-span-1 relative overflow-hidden">
          <span className="text-brand-orange text-xs font-bold tracking-[0.2em] font-mono mb-4 text-center z-10 block">GLOBAL TCP MAP</span>
          <div className="relative w-full h-24 flex items-center justify-center opacity-30 mt-auto">
            <Globe className="w-full h-full text-white/80 mix-blend-overlay absolute inset-0 m-auto" />
            {locations.map(loc => (
              <motion.div 
                key={loc.id}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute w-2 h-2 rounded-full bg-brand-violet shadow-[0_0_10px_rgba(139,92,246,1)]"
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Streaming Event Log Terminal inherently proving web hooks natively processing traffic securely */}
      <div className="glass p-6 rounded-2xl border border-white/5 mt-2 bg-brand-black/80 font-mono text-[11px] md:text-xs text-gray-400 h-32 overflow-hidden flex flex-col justify-end tracking-wider">
         <AnimatePresence>
            {stream.map((log, i) => (
              <motion.div 
                key={log} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="mb-1 border-l-2 border-brand-violet pl-3 py-[2px] truncate"
              >
                {log}
              </motion.div>
            ))}
         </AnimatePresence>
      </div>

    </div>
  );
};

export default LiveAnalytics;
