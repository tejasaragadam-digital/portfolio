import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const experiences = [
  {
    role: "Senior Full-Stack Developer",
    company: "TechNexus Inc.",
    date: "2024 - Present",
    desc: "Architected modern WebGL interfaces with React Three Fiber, scaling performance by 40% for 2M+ users.",
    type: "dev"
  },
  {
    role: "Digital Marketing Lead",
    company: "Growth Labs",
    date: "2021 - 2024",
    desc: "Directed SaaS GTM strategies encompassing SEO, paid social funnels, and conversion rate optimization (CRO) scaling MRR by 300%.",
    type: "marketing"
  },
  {
    role: "Web Developer",
    company: "Digital Studio Agency",
    date: "2019 - 2021",
    desc: "Built bespoke responsive websites and e-commerce platforms specializing in clean UI and accessibility.",
    type: "dev"
  }
];

import { useState, useEffect } from 'react';
import { fetchCollection } from '../lib/appwrite';

const Experience = () => {
  const containerRef = useRef(null);
  
  // Track scroll exactly within this component's bounding box
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const [experiences, setExperiences] = useState([
    {
      role: "Senior Full-Stack Developer",
      company: "TechNexus Inc.",
      period: "2024 - Present",
      description: "Architected modern WebGL interfaces with React Three Fiber, scaling performance by 40% for 2M+ users.",
      type: "dev"
    },
    {
      role: "Digital Marketing Lead",
      company: "Growth Labs",
      period: "2021 - 2024",
      description: "Directed SaaS GTM strategies encompassing SEO, paid social funnels, and conversion rate optimization (CRO) scaling MRR by 300%.",
      type: "marketing"
    },
    {
      role: "Web Developer",
      company: "Digital Studio Agency",
      period: "2019 - 2021",
      description: "Built bespoke responsive websites and e-commerce platforms specializing in clean UI and accessibility.",
      type: "dev"
    }
  ]);

  useEffect(() => {
    const loadExp = async () => {
      try {
        const data = await fetchCollection(import.meta.env.VITE_APPWRITE_EXPERIENCE_COLLECTION_ID || 'PENDING_EXPERIENCE_ID');
        if (data && data.length > 0) setExperiences(data);
      } catch (err) {
         console.warn("Using fallback experience array", err);
      }
    };
    loadExp();
  }, []);

  return (
    <section ref={containerRef} className="py-12 md:py-32 px-6 w-full max-w-5xl mx-auto relative z-10">
      
      <div className="mb-12 md:mb-24 md:text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Experience <span className="text-brand-violet">& Timeline</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          A synchronized history tracking explicit growth mapping Developer logic alongside Marketing conversion pipelines natively.
        </p>
      </div>

      <div className="relative">
        {/* The underlying dark line track */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[4px] bg-white/5 -translate-x-1/2 rounded-full" />
        
        {/* The glowing scroll-traced line */}
        <motion.div 
          style={{ scaleY: scrollYProgress, originY: 0 }}
          className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[4px] bg-gradient-to-b from-brand-violet to-brand-orange -translate-x-1/2 shadow-[0_0_20px_rgba(249,115,22,1)] rounded-full" 
        />

        <div className="space-y-32">
          {experiences.map((exp, idx) => {
            const isEven = idx % 2 === 0;
            const isDev = exp.type === 'dev';
            const accentClass = isDev ? "brand-violet" : "brand-orange";
            const borderGlow = isDev ? "shadow-[0_0_40px_rgba(139,92,246,0.5)]" : "shadow-[0_0_40px_rgba(249,115,22,0.5)]";

            return (
              <div key={idx} className="relative flex flex-col md:flex-row items-start md:items-center justify-between w-full group">
                
                {/* Visual Node Target Matrix */}
                <motion.div 
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`absolute left-8 md:left-1/2 w-8 h-8 rounded-full bg-brand-black border-4 border-${accentClass} ${borderGlow} -translate-x-1/2 z-10 flex items-center justify-center`}
                >
                  <div className={`w-3 h-3 rounded-full bg-${accentClass} animate-pulse-slow`} />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: isEven ? -50 : 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`flex-1 min-w-0 ml-16 md:ml-0 md:w-5/12 ${isEven ? 'md:pr-16 md:text-right md:flex-initial' : 'md:pl-16 md:ml-auto md:flex-initial'}`}
                >
                  <div className={`glass p-8 md:p-10 rounded-3xl border-2 border-${accentClass}/40 hover:border-${accentClass} hover:${borderGlow} transition-all duration-300 backdrop-blur-3xl bg-brand-black/60 relative overflow-hidden transform group-hover:-translate-y-2`}>
                     {/* Ambient card glow background interpolation mapping natively */}
                     <div className={`absolute inset-0 bg-gradient-to-br from-${accentClass}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                     
                    <span className={`text-${accentClass} font-mono text-sm mb-4 block font-black tracking-widest uppercase origin-left`}>{exp.period || exp.date}</span>
                    <h3 className="text-3xl font-black text-white mb-2 leading-tight relative Z-10 drop-shadow-md">{exp.role}</h3>
                    <h4 className={`text-white/60 text-sm font-bold mb-5 uppercase tracking-[0.2em] relative Z-10`}>{exp.company}</h4>
                    <p className="text-gray-300 text-lg leading-relaxed relative z-10 font-medium">{exp.description || exp.desc}</p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
