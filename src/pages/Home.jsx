import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from '../components/Hero';
import About from '../components/About';
import Experience from '../components/Experience';
import Reviews from '../components/Reviews';
import Contact from '../components/Contact';
import Marquee from '../components/Marquee';

const Home = () => {
  const { scrollYProgress } = useScroll();
  const x1 = useTransform(scrollYProgress, [0, 1], [0, -1000]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 1000]);

  return (
    <div className="relative w-full min-h-screen">
      {/* Massive Parallax Backgrounds — only on md+ to avoid mobile overflow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 hidden md:flex flex-col justify-between py-32 items-center opacity-[0.45]">
        <motion.h1 
          style={{ x: x1 }} 
          className="text-[20rem] font-black tracking-tighter text-brand-violet/20 whitespace-nowrap origin-center drop-shadow-[0_0_50px_rgba(139,92,246,0.3)] mix-blend-screen"
        >
          DEVELOPER
        </motion.h1>
        <motion.h1 
          style={{ x: x2, WebkitTextStroke: '4px rgba(249,115,22,0.3)' }} 
          className="text-[20rem] font-black tracking-tighter text-transparent whitespace-nowrap origin-center mix-blend-screen drop-shadow-[0_0_50px_rgba(249,115,22,0.5)]"
        >
          MARKETER
        </motion.h1>
      </div>

      <div className="relative z-10 w-full">
        <Hero />
        <About />
        <Marquee baseVelocity={-2.5} direction="left">DIGITAL MARKETING • WEB DEVELOPMENT • BRAND STRATEGY • </Marquee>
        <Experience />
        <Reviews />
        <Marquee baseVelocity={2.5} direction="right">REACT • NODE • TAILWIND • FRAMER MOTION • APPWRITE • </Marquee>
        <Contact />
      </div>
    </div>
  );
};

export default Home;
