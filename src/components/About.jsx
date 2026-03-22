import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Typewriter from './Typewriter';
import ThreeIcon from './ThreeIcons';
import MagneticButton from './MagneticButton';
import TextReveal from './TextReveal';
import GlitchText from './GlitchText';

const MotionLink = motion(Link);

const About = () => {
  const marketingSkills = [
    { title: "SEO Optimization", type: "seo" },
    { title: "Growth Hacking", type: "growth" },
    { title: "Data Analytics", type: "data" }
  ];

  const devSkills = [
    { title: "Full-Stack React", type: "react" },
    { title: "3D Web Experiences", type: "3d" },
    { title: "Performance Tuning", type: "perf" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <section id="about" className="py-24 px-6 relative w-full bg-brand-black/0 text-white z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 inline-block w-full"
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-4 inline-block text-white"
          >
            <GlitchText text="The Duality of My Work" />
          </motion.h2>
          
          <div className="text-gray-400 max-w-3xl mx-auto text-xl md:text-3xl font-medium leading-relaxed min-h-[5rem] mb-12">
             <TextReveal>I don't just build websites; I build digital engines. By merging the technical depth of web development with the strategic edge of digital marketing, I create platforms that don't just exist—they perform.</TextReveal>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Developer Card */}
          <motion.div animate={{ y: [-15, 15, -15] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="h-full">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              className="flex flex-col glass rounded-3xl p-8 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-shadow duration-500 border-t border-brand-violet/20 h-full"
            >
              <div className="inline-flex items-center justify-center p-2 mb-6 self-start">
                 <span className="bg-brand-violet/10 p-3 rounded-2xl text-brand-violet font-bold tracking-widest uppercase text-xs">// Developer Phase</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                <Typewriter text="Web Developer" delay={0.2} speed={0.05} />
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed flex-grow min-h-[4rem]">
                <Typewriter text="Architecting scalable, modern web applications. From intricate frontend 3D experiences to robust backends, I write code that brings ambitious designs to life." delay={0.8} speed={0.02} />
              </p>
              <div className="space-y-4 mb-8 relative z-10">
                {devSkills.map((skill, index) => (
                  <motion.div key={index} variants={itemVariants} className="flex items-center p-2 bg-white/5 rounded-xl border border-white/5 pr-6 h-20">
                    <ThreeIcon type={skill.type} />
                    <span className="ml-2 font-medium">{skill.title}</span>
                  </motion.div>
                ))}
              </div>
              <MagneticButton className="mt-auto relative z-20 w-full">
                <MotionLink 
                  to="/web-projects" 
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(139,92,246, 0.8)", textShadow: "0px 0px 8px rgba(139,92,246,0.8)", backgroundColor: "rgba(139,92,246,1)", color: "#ffffff" }}
                  transition={{ type: "spring", stiffness: 500, damping: 10 }}
                  className="block text-center w-full px-6 py-4 bg-brand-violet/10 border border-brand-violet/30 text-brand-violet rounded-xl font-bold pointer-events-auto cursor-pointer"
                >
                  View Projects
                </MotionLink>
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Marketer Card */}
          <motion.div animate={{ y: [15, -15, 15] }} transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }} className="h-full">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              className="flex flex-col glass rounded-3xl p-8 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] transition-shadow duration-500 border-t border-brand-orange/20 h-full"
            >
              <div className="inline-flex items-center justify-center p-2 mb-6 self-start">
                 <span className="bg-brand-orange/10 p-3 rounded-2xl text-brand-orange font-bold tracking-widest uppercase text-xs"># Marketing Phase</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                <Typewriter text="Digital Marketer" delay={0.2} speed={0.05} />
              </h3>
              <p className="text-gray-400 mb-8 leading-relaxed flex-grow min-h-[4rem]">
                 <Typewriter text="Ensuring pixel-perfect products reach the right audience. Through data analysis, SEO, and growth hacking, I turn traffic into tangible value." delay={0.8} speed={0.02} />
              </p>
              <div className="space-y-4 mb-8 relative z-10">
                {marketingSkills.map((skill, index) => (
                  <motion.div key={index} variants={itemVariants} className="flex items-center p-2 bg-white/5 rounded-xl border border-white/5 pr-6 h-20">
                    <ThreeIcon type={skill.type} />
                    <span className="ml-2 font-medium">{skill.title}</span>
                  </motion.div>
                ))}
              </div>
              <MagneticButton className="mt-auto relative z-20 w-full">
                <MotionLink 
                  to="/marketing-projects" 
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(249,115,22, 0.8)", textShadow: "0px 0px 8px rgba(249,115,22,0.8)", backgroundColor: "rgba(249,115,22,1)", color: "#ffffff" }}
                  transition={{ type: "spring", stiffness: 500, damping: 10 }}
                  className="block text-center w-full px-6 py-4 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange rounded-xl font-bold pointer-events-auto cursor-pointer"
                >
                  View Projects
                </MotionLink>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
