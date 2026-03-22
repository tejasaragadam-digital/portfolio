import { motion } from 'framer-motion';

const Background = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-brand-black">
      {/* Base Dark Grid rendering natively */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Ambient Color Dodge Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-violet opacity-20 blur-[120px] mix-blend-screen animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-orange opacity-20 blur-[120px] mix-blend-screen animate-pulse-slow font-delay-1000" />
      
      {/* Foreground Depth Blur */}
      <div className="absolute inset-0 backdrop-blur-[4px] bg-brand-black/40 pointer-events-none z-0" />
    </div>
  );
};

export default Background;

