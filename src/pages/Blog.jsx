import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Typewriter from '../components/Typewriter';
import Modal from '../components/Modal';
import { CardSkeleton } from '../components/Skeleton';
import { fetchCollection } from '../lib/appwrite';
import TiltCard from '../components/TiltCard';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCollection(import.meta.env.VITE_APPWRITE_BLOGS_COLLECTION_ID || 'PENDING_BLOGS_ID');
        if (data && data.length > 0) {
          setBlogs(data);
        } else {
          setBlogs([
            { $id: "1", title: "The Future of React and 3D Web", date: "Oct 24, 2026", readTime: "5 min read", category: "Development", excerpt: "Exploring the bleeding edge of WebGL integration with React Three Fiber." },
            { $id: "2", title: "SEO Optimization Secrets", date: "Sep 15, 2026", readTime: "8 min read", category: "Marketing", excerpt: "A robust guide on core web vitals and semantic structure mapping." },
            { $id: "3", title: "Why Framer Motion is the Best Animation Library", date: "Aug 02, 2026", readTime: "4 min read", category: "Development", excerpt: "A deep dive into declarative spring physics for modern interfaces." },
          ]);
        }
      } catch (err) {
        setBlogs([]);
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
            whileHover={{ scale: 1.05, textShadow: "0px 0px 20px rgba(139,92,246,0.5)" }}
            transition={{ type: "spring", stiffness: 500, damping: 10 }}
            className="text-5xl md:text-6xl font-bold mb-4 inline-block origin-left"
          >
            <Typewriter text="The Blog" speed={0.1} />
          </motion.h1>
          
          <p className="text-gray-400 mb-12 text-lg min-h-[3rem]">
            <Typewriter text="Insights, tutorials, and thoughts on web development and digital marketing." delay={0.6} speed={0.03} />
          </p>
          
          <div className="grid grid-cols-1 gap-6">
            {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                    <motion.div key={idx} initial={{opacity:0}} animate={{opacity:1}} transition={{delay: idx*0.1}}>
                      <CardSkeleton />
                    </motion.div>
                ))
            ) : (
                blogs.map((blog, idx) => (
                <motion.div 
                    key={idx}
                    animate={{ y: [idx % 2 === 0 ? -8 : 8, idx % 2 === 0 ? 8 : -8, idx % 2 === 0 ? -8 : 8] }} 
                    transition={{ repeat: Infinity, duration: 6 + (idx * 0.5), ease: "easeInOut" }}
                >
                    <TiltCard>
                      <motion.div 
                      onClick={() => setSelectedProject(blog)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02, boxShadow: "0px 0px 25px rgba(139,92,246, 0.4)", borderColor: "rgba(139,92,246, 0.5)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 12, delay: idx * 0.1 }}
                      className="glass p-6 md:p-8 rounded-3xl cursor-pointer group pointer-events-auto"
                      >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                          <span className="text-brand-orange text-sm font-semibold uppercase tracking-wider mb-2 block">{blog.category || 'Article'}</span>
                          <h2 className="text-2xl font-bold group-hover:text-brand-violet transition-colors">{blog.title}</h2>
                          </div>
                          <div className="text-gray-400 text-sm whitespace-nowrap">
                          {blog.$createdAt ? new Date(blog.$createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : blog.date} • {blog.readTime || '5 min read'}
                          </div>
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

export default Blog;
