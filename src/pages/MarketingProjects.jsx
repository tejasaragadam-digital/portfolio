import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Typewriter from '../components/Typewriter';
import MagneticButton from '../components/MagneticButton';
import Modal from '../components/Modal';
import { CardSkeleton } from '../components/Skeleton';
import { fetchCollection } from '../lib/appwrite';
import TiltCard from '../components/TiltCard';
import MagneticText from '../components/MagneticText';

const MarketingProjects = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCollection(import.meta.env.VITE_APPWRITE_MARKETING_COLLECTION_ID || 'PENDING_MARKETING_ID');
        if (data && data.length > 0) {
          setCampaigns(data);
        } else {
          setCampaigns([
            { title: "SaaS Launch Campaign", metric: "+300% MRR", desc: "End-to-end go-to-market strategy including SEO, content, and paid social.", link: "#" },
            { title: "Organic Growth Revamp", metric: "2M+ Views", desc: "Technical SEO overhaul and content silos restructure resulting in massive traffic spikes.", link: "#" },
            { title: "B2B Lead Generation", metric: "500+ Leads", desc: "Highly targeted LinkedIn Ads and optimized landing page funnels.", link: "#" }
          ]);
        }
      } catch (err) {
        setCampaigns([]);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    loadData();
  }, []);

  return (
    <>
      <section className="min-h-screen pt-32 px-6 w-full max-w-5xl mx-auto z-10 relative pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            whileHover={{ scale: 1.05, textShadow: "0px 0px 20px rgba(249,115,22,0.5)" }}
            transition={{ type: "spring", stiffness: 500, damping: 10 }}
            className="text-5xl md:text-6xl font-bold mb-4 text-brand-orange inline-block origin-left"
          >
            <MagneticText text="Digital Marketing" />
          </motion.h1>

          <p className="text-gray-400 mb-12 text-lg min-h-[3rem]">
            <Typewriter text="Case studies showcasing measurable growth and optimized funnels." delay={1.8} speed={0.03} />
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                    <motion.div key={idx} initial={{opacity:0}} animate={{opacity:1}} transition={{delay: idx*0.1}}>
                      <CardSkeleton />
                    </motion.div>
                ))
            ) : (
                campaigns.map((camp, idx) => (
                <motion.div 
                    key={idx}
                    animate={{ y: [idx % 2 === 0 ? 10 : -10, idx % 2 === 0 ? -10 : 10, idx % 2 === 0 ? 10 : -10] }} 
                    transition={{ repeat: Infinity, duration: 6 + (idx * 0.4), ease: "easeInOut" }}
                    className="h-full"
                >
                    <TiltCard className="h-full">
                      <motion.div 
                      onClick={() => setSelectedProject(camp)}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(249,115,22, 0.2)", borderColor: "rgba(249,115,22, 0.4)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 12, delay: idx * 0.1 }}
                      className="glass p-8 rounded-3xl group h-full flex flex-col relative z-20 cursor-pointer"
                      >
                      <span className="text-sm font-bold text-green-400 mb-2 block">{camp.metric}</span>
                      <h2 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">{camp.title}</h2>
                      <p className="text-gray-400 flex-grow pointer-events-none">{camp.desc}</p>
                      
                      <div className="mt-8 pt-6 border-t border-white/10 pointer-events-auto">
                          <MagneticButton>
                          <motion.div
                              whileHover={{ scale: 1.05, textShadow: "0px 0px 10px rgba(249,115,22, 0.8)" }}
                              transition={{ type: "spring", stiffness: 500, damping: 10 }}
                              className="text-brand-orange font-semibold inline-block cursor-pointer"
                          >
                              Read Case Study →
                          </motion.div>
                          </MagneticButton>
                      </div>
                      </motion.div>
                    </TiltCard>
                </motion.div>
                ))
            )}
          </div>
        </motion.div>
      </section>

      <Modal 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        data={selectedProject} 
      />
    </>
  );
};

export default MarketingProjects;
