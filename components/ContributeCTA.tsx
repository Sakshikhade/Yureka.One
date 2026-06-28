import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const ContributeCTA: React.FC = () => {
  return (
    <div className="px-6 md:px-12 py-20 lg:py-32 bg-cream relative overflow-hidden flex justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full bg-white/[0.02] border border-white/10 rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl backdrop-blur-xl group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-clay/0 via-clay/5 to-clay/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto bg-clay/10 text-clay rounded-2xl flex items-center justify-center mb-8 border border-clay/20">
            <Sparkles size={28} />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white uppercase tracking-tight mb-4">
            Is the Matrix <span className="text-clay italic serif">Incomplete?</span>
          </h2>
          
          <p className="text-white/50 text-sm md:text-base max-w-lg mx-auto font-medium leading-relaxed mb-10">
            Yureka is powered by collective intelligence. If you notice a missing card or outdated rewards structure, help us refine the system.
          </p>
          
          <Link 
            to="/contribute"
            className="inline-flex h-14 px-10 items-center justify-center bg-clay text-cream rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#00933b] hover:-translate-y-1 transition-all shadow-xl shadow-clay/20 gap-3"
          >
            Contribute Intelligence <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ContributeCTA;
