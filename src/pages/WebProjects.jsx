import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from '../components/Typewriter';
import MagneticButton from '../components/MagneticButton';
import Modal from '../components/Modal';
import { CardSkeleton } from '../components/Skeleton';
import { fetchCollection } from '../lib/appwrite';
import TiltCard from '../components/TiltCard';
import MagneticText from '../components/MagneticText';

const WebProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCollection(import.meta.env.VITE_APPWRITE_WEB_COLLECTION_ID || 'PENDING_WEB_ID');
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setProjects([
            { title: "E-Commerce Platform", tech: "React, Node.js, Stripe", desc: "A full-scale e-commerce solution with dynamic cart and checkout.", image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=800", link: "#" },
            { title: "3D Product Configurator", tech: "Three.js, React Three Fiber", desc: "Interactive WebGL experience for customizing products in real-time.", image: "https://images.unsplash.com/photo-1531297172864-d041cce643ff?q=80&w=800", link: "#" },
            { title: "Real-time Dashboard", tech: "Vue.js, Firebase, Tailwind", desc: "Analytics dashboard with live data streaming and dark mode.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800", link: "#" }
          ]);
        }
      } catch (err) {
        setProjects([]);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
    loadData();
  }, []);

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <section 
        onMouseMove={handleMouseMove} 
        className="min-h-screen pt-32 px-6 w-full max-w-5xl mx-auto z-10 relative pb-32"
      >
        {/* Absolute Floating Image Follower */}
        <AnimatePresence>
          {hoveredImage && !selectedProject && (
            <motion.img
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
                x: mousePos.x + 20, 
                y: mousePos.y + 20 
              }}
              exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.5 }}
              src={hoveredImage}
              alt="Project Preview"
              className="fixed top-0 left-0 w-72 h-44 object-cover rounded-2xl shadow-[0_0_40px_rgba(139,92,246,0.6)] z-50 pointer-events-none border border-white/20"
            />
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            whileHover={{ scale: 1.05, textShadow: "0px 0px 20px rgba(139,92,246,0.5)" }}
            transition={{ type: "spring", stiffness: 500, damping: 10 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-brand-violet inline-block origin-left"
          >
            <MagneticText text="Web Development" />
          </motion.h1>

          <p className="text-gray-400 mb-12 text-lg min-h-[3rem]">
            <Typewriter text="A selection of my recent frontend and full-stack engineering work." delay={1.4} speed={0.03} />
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                    <motion.div key={idx} initial={{opacity:0}} animate={{opacity:1}} transition={{delay: idx*0.1}}>
                      <CardSkeleton />
                    </motion.div>
                ))
            ) : (
                projects.map((proj, idx) => (
                <motion.div 
                    key={idx}
                    animate={{ y: [idx % 2 === 0 ? -12 : 12, idx % 2 === 0 ? 12 : -12, idx % 2 === 0 ? -12 : 12] }} 
                    transition={{ repeat: Infinity, duration: 7 + (idx * 0.5), ease: "easeInOut" }}
                    className="h-full"
                >
                    <TiltCard className="h-full">
                      <motion.div 
                      onMouseEnter={() => proj.image && setHoveredImage(proj.image)}
                      onMouseLeave={() => setHoveredImage(null)}
                      onClick={() => setSelectedProject(proj)}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.03, boxShadow: "0px 0px 30px rgba(139,92,246, 0.3)", borderColor: "rgba(139,92,246, 0.4)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 12, delay: idx * 0.1 }}
                      className="glass p-8 rounded-3xl group h-full flex flex-col relative z-20 cursor-pointer"
                      >
                      <h2 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">{proj.title}</h2>
                      <span className="text-sm font-mono text-brand-orange mb-4 block">{proj.tech}</span>
                      <p className="text-gray-400 flex-grow pointer-events-none">{proj.desc}</p>
                      
                      <div className="mt-8 pt-6 border-t border-white/10 pointer-events-auto">
                          <MagneticButton>
                          <motion.div
                              whileHover={{ scale: 1.05, textShadow: "0px 0px 10px rgba(139,92,246, 0.8)" }}
                              transition={{ type: "spring", stiffness: 500, damping: 10 }}
                              className="text-brand-violet font-semibold inline-block cursor-pointer"
                          >
                              View Project Details →
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

      {/* Global Project Modal */}
      <Modal 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        data={selectedProject} 
      />
    </>
  );
};

export default WebProjects;
