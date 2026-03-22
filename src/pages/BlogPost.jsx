import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchCollection } from '../lib/appwrite';
import { ArrowLeft } from 'lucide-react';
import MagneticButton from '../components/MagneticButton';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchCollection(import.meta.env.VITE_APPWRITE_BLOGS_COLLECTION_ID || 'PENDING_BLOGS_ID');
        let found = data?.find(item => item.$id === id);
        
        // Ensure static visual fallback testing identically maps structure natively
        if (!found) {
            const fallback = [
               { $id: "1", title: "The Future of React and 3D Web", date: "Oct 24, 2026", readTime: "5 min read", category: "Development", desc: "Exploring the bleeding edge of WebGL integration with React Three Fiber.", content: "<p>This is a comprehensive deep dive into React Three Fiber. WebGL represents the ultimate frontier of spatial mapping.</p><br/><p>When integrating physics into the DOM, we must bypass the native render cycle.</p>" },
               { $id: "2", title: "SEO Optimization Secrets", date: "Sep 15, 2026", readTime: "8 min read", category: "Marketing", desc: "A robust guide on core web vitals and semantic structure mapping.", content: "<p>Core web vitals are tracking metrics injected by Google search indexing rendering bots...</p><br/><p>Total blocking time (TBT) dictates native interaction parsing capabilities.</p>" },
               { $id: "3", title: "Why Framer Motion is the Best Animation Library", date: "Aug 02, 2026", readTime: "4 min read", category: "Development", desc: "A deep dive into declarative spring physics for modern interfaces.", content: "<p>Spring physics simulate real-world physical momentum perfectly overriding CSS explicit duration transitions seamlessly linking UX flow states.</p>" }
            ];
            found = fallback.find(item => item.$id === id) || fallback[0];
        }
        setPost(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-40 px-6 text-center text-gray-400 font-mono">Loading Data Matrix...</div>;
  if (!post) return <div className="min-h-screen pt-40 px-6 text-center text-red-500 font-mono">Document Record Terminated</div>;

  return (
    <article className="min-h-screen pt-32 px-6 w-full max-w-4xl mx-auto z-10 relative pb-40">
      
      <Link to="/blog" className="inline-block mb-12">
        <MagneticButton>
           <motion.div className="flex items-center gap-2 text-brand-violet hover:text-white transition-colors cursor-pointer bg-brand-violet/10 px-5 py-3 rounded-full border border-brand-violet/30 shadow-[0_0_15px_rgba(139,92,246,0.2)] hover:shadow-[0_0_20px_rgba(139,92,246,0.6)]">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-bold text-sm tracking-wide">Back to Archive</span>
           </motion.div>
        </MagneticButton>
      </Link>
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
         
         <div className="flex items-center gap-4 mb-6">
            <span className="text-brand-orange font-bold uppercase tracking-[0.2em] text-sm bg-brand-orange/10 px-3 py-1 rounded-sm border border-brand-orange/20">{post.category}</span>
            <span className="text-gray-400 text-sm font-mono tracking-wider">• {post.readTime}</span>
         </div>
         
         <h1 className="text-3xl md:text-6xl font-black text-white mb-8 leading-[1.1] tracking-tight drop-shadow-md">{post.title}</h1>
         
         <div className="flex items-center gap-4 mb-16 border-b border-white/10 pb-8">
            <div className="w-12 h-12 rounded-full bg-brand-violet/20 border border-brand-violet/40 overflow-hidden flex items-center justify-center font-bold text-brand-violet text-xl shadow-[0_0_15px_rgba(139,92,246,0.4)]">
               T
            </div>
            <div>
               <p className="text-white font-bold tracking-wide">Teja</p>
               <p className="text-gray-500 text-sm font-mono">{post.date}</p>
            </div>
         </div>

         {/* Article Markdown Render Box */}
         <div className="prose prose-invert prose-lg md:prose-xl max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-brand-violet prose-a:no-underline hover:prose-a:underline leading-relaxed tracking-wide space-y-8 relative z-20">
            {post.content ? (
               <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
               <>
                 <p className="text-2xl text-white font-medium leading-relaxed mb-6 border-l-2 border-brand-orange pl-6 my-8">{post.desc}</p>
                 <p className="text-gray-400 mt-8">This article is currently being documented via the Appwrite Matrix. Architectural schemas and extensive research logs will be deployed here soon natively.</p>
               </>
            )}
         </div>

      </motion.div>
    </article>
  );
};
export default BlogPost;
