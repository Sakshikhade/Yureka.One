import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative w-full min-h-[95vh] flex items-center justify-center pt-24 pb-20 bg-[#0a0a0a] overflow-hidden scroll-mt-32">
      
      {/* Dynamic Background Mesh / Glows */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-glow blur-[120px] rounded-full opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-glow blur-[150px] rounded-full opacity-20"></div>
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-0 items-center">
        
        {/* Left Content: Bold Typography */}
        <div className="flex flex-col items-start text-left lg:pr-10 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[1px] bg-purple-light/30 w-12"></div>
            <span className="text-purple-light font-black text-[10px] md:text-[11px] uppercase tracking-[0.5em]">The Automation of Wealth</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl xl:text-[9.5rem] leading-[0.82] font-heading font-black text-white uppercase tracking-tighter mb-10"
          >
            Money <br />
            <span className="text-purple italic font-serif lowercase tracking-normal px-2 relative inline-block">
                Your
                <div className="absolute bottom-4 left-0 w-full h-1 bg-purple/30 -rotate-2"></div>
            </span> <br />
            Way.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-xl font-sans font-medium text-white/50 mb-14 max-w-md leading-relaxed uppercase tracking-[0.2em] px-1"
          >
            Precision auditing of <span className="text-white">200+ elite credit cards</span>. <br className="hidden md:block" />
            Automating your path to maximum rewards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-8 w-full sm:w-auto"
          >
            <Link 
              to="/yureka-ai" 
              className="group relative px-10 py-6 md:px-14 md:py-7 bg-white text-black overflow-hidden rounded-full w-full sm:w-auto transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] text-center"
            >
              <div className="absolute inset-0 w-full h-full bg-purple translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10 font-black text-[11px] md:text-[12px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 group-hover:text-white transition-colors">
                <Sparkles size={18} className="text-purple group-hover:text-white transition-colors animate-pulse" /> Find Your Perfect Card
              </span>
            </Link>
            
            <Link 
              to="/cards" 
              className="group flex items-center gap-5 px-10 py-6 text-white/30 hover:text-white transition-all text-[11px] md:text-[12px] font-black uppercase tracking-[0.4em]"
            >
              Explore Intelligence <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-500" />
            </Link>
          </motion.div>
        </div>

        {/* Right Content: The Visual Asset */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 5, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="relative flex justify-center lg:justify-end order-1 lg:order-2"
        >
          {/* Decorative Glow behind phone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-purple blur-[120px] opacity-20 rounded-full animate-pulse"></div>
          
          <div className="relative z-10 max-w-[450px] md:max-w-[550px] xl:max-w-[750px] group">
            {/* Main Phone Image */}
            <motion.img 
              whileHover={{ y: -20, rotateY: -10, rotateX: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              src="/assets/hero_v2/hero_mobile.png" 
              alt="Yureka Intelligence Interface" 
              className="w-full h-auto drop-shadow-[0_80px_150px_rgba(0,0,0,0.9)] relative z-20 cursor-pointer"
            />
            
            {/* Interactive Floating Badge 1 */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -left-12 glass-dark p-8 rounded-[2.5rem] border border-white/10 hidden xl:block z-30 shadow-2xl"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-purple/20 rounded-2xl flex items-center justify-center text-purple shadow-inner">
                  <Sparkles size={28} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Intelligence Rank</span>
                  <span className="text-3xl font-black text-white italic tracking-tighter">ELITE V.2</span>
                </div>
              </div>
            </motion.div>

            {/* Interactive Floating Badge 2 */}
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -right-10 glass-dark p-8 rounded-[2.5rem] border border-white/10 hidden xl:block z-30 shadow-2xl"
            >
              <div className="flex items-center gap-5">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-1">Sync Status</span>
                  <span className="text-3xl font-black text-clay italic tracking-tighter">OPTIMAL</span>
                </div>
                <div className="w-14 h-14 bg-clay/20 rounded-2xl flex items-center justify-center text-clay shadow-inner">
                  <div className="w-3 h-3 bg-clay rounded-full animate-ping"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 hidden md:flex"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-white/20 to-transparent"></div>
        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 vertical-text">Scroll to Decrypt</span>
      </motion.div>

    </section>
  );
};

export default Hero;