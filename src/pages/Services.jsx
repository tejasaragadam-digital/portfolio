import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchCollection } from '../lib/appwrite';
import TiltCard from '../components/TiltCard';
import MagneticText from '../components/MagneticText';
import { CardSkeleton } from '../components/Skeleton';
import { Check, ArrowRight } from 'lucide-react';
import MagneticButton from '../components/MagneticButton';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCollection(import.meta.env.VITE_APPWRITE_SERVICES_COLLECTION_ID || 'PENDING_SERVICES_ID');
        if (data && data.length > 0) {
          setServices(data);
        } else {
          // Dynamic Fallback Matrix
          setServices([
            { 
              $id: "s1", 
              title: "Technical SEO Audit", 
              price: "$1,500",
              desc: "A comprehensive deep-dive into your application's Core Web Vitals, semantic structuring, and indexation bottlenecks.", 
              features: ["Lighthouse Performance Audit", "Semantic DOM Optimization", "Indexation & Crawl Budget Review", "Actionable Engineering Roadmap"],
              type: "marketing"
            },
            { 
              $id: "s2", 
              title: "Full-Stack MVP Build", 
              price: "Custom",
              desc: "From zero to production. I will architect, design, and deploy a blazing fast React/Node.js MVP designed to scale.", 
              features: ["Database Architecture (Appwrite/Postgres)", "React / Tailwind / Framer Motion UX", "Secure API Endpoints", "Vercel / Edge Deployment"],
              type: "dev"
            },
            { 
              $id: "s3", 
              title: "Fractional CMO / CTO", 
              price: "$4,000/mo",
              desc: "Continuous elite-level technical and strategic guidance for growing startups requiring bleeding-edge expertise without massive headcount.", 
              features: ["Weekly Strategic Sprints", "Direct Developer Mentorship", "Conversion Rate Optimization (CRO)", "A/B Testing & Funnel Engineering"],
              type: "hybrid"
            }
          ]);
        }
      } catch (err) {
        setServices([]);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    loadData();
  }, []);

  return (
    <section className="min-h-screen pt-32 px-6 w-full max-w-7xl mx-auto z-10 relative pb-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <motion.h1 
          whileHover={{ scale: 1.05, textShadow: "0px 0px 20px rgba(255,255,255,0.4)" }}
          transition={{ type: "spring", stiffness: 500, damping: 10 }}
          className="text-3xl sm:text-4xl md:text-7xl font-black mb-6 inline-block origin-center tracking-tight"
        >
          <MagneticText text="Engagements & Services" />
        </motion.h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Transforming bleeding-edge engineering and data-driven marketing into exponential growth vehicles for elite teams.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
                <motion.div key={idx} initial={{opacity:0}} animate={{opacity:1}} transition={{delay: idx*0.1}}>
                  <div className="h-[500px] w-full bg-white/5 animate-pulse rounded-3xl" />
                </motion.div>
            ))
        ) : (
            services.map((service, idx) => {
              const accentColor = service.type === 'marketing' ? 'brand-orange' : (service.type === 'dev' ? 'brand-violet' : 'yellow-400');
              const shadowHex = service.type === 'marketing' ? 'rgba(249,115,22,0.4)' : (service.type === 'dev' ? 'rgba(139,92,246,0.4)' : 'rgba(250,204,21,0.4)');

              return (
              <motion.div 
                  key={service.$id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2, type: "spring", stiffness: 100, damping: 20 }}
                  className="flex"
              >
                  <TiltCard>
                    <div className={`glass p-8 rounded-[2.5rem] border border-white/10 hover:border-${accentColor}/50 transition-all duration-500 h-full flex flex-col relative overflow-hidden group hover:shadow-[0_0_40px_${shadowHex}]`}>
                        
                        <div className={`absolute inset-0 bg-gradient-to-b from-${accentColor}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                        <div className="relative z-10 flex-1 flex flex-col">
                            <h3 className="text-2xl font-black text-white mb-2 leading-tight">{service.title}</h3>
                            <div className={`text-4xl font-black text-[var(--color-${accentColor})] mb-6 tracking-tighter`}>
                               {service.price}
                            </div>
                            
                            <p className="text-gray-400 leading-relaxed mb-8 flex-1">
                                {service.desc}
                            </p>

                            <ul className="space-y-4 mb-10">
                                {service.features?.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-3 text-sm text-gray-300">
                                        <div className={`mt-0.5 rounded-full p-1 bg-${accentColor}/20 text-${accentColor}`}>
                                            <Check className="w-3 h-3 font-bold" />
                                        </div>
                                        <span className="leading-snug">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <MagneticButton>
                                <button className={`w-full py-4 rounded-full font-bold text-white bg-white/5 border border-white/10 hover:bg-${accentColor} hover:border-${accentColor} transition-all duration-300 flex items-center justify-center gap-2 group/btn`}>
                                    Initiate Project
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </MagneticButton>
                        </div>
                    </div>
                  </TiltCard>
              </motion.div>
              );
            })
        )}
      </div>
    </section>
  );
};

export default Services;
