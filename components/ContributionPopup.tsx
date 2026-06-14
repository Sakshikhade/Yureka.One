import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquarePlus, AlertCircle, FileEdit, ArrowRight, Globe, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NAMES = ['Mainak', 'Sakshi', 'Krutika', 'Akash', 'Anwesh', 'Anirudhha', 'Sansrite', 'Jacqueline', 'Aniket', 'Ankit', 'Piyush', 'Sagar'];
const ACTIONS = ['recommended a card', 'requested a card specs change', 'reported a dead card'];
const LOCATIONS = ['Mumbai - India', 'Bangalore - India', 'Gurgaon - India', 'Arizona - USA', 'Colchester - UK', 'Indore - India'];

const ContributionPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const navigate = useNavigate();

  // Activity Feed Logic
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentActivityIndex((prev) => (prev + 1) % NAMES.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // Trigger Logic
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrolled / totalHeight) * 100;

      if (!hasTriggered && scrollPercentage >= 30) {
        setIsVisible(true);
        setHasTriggered(true);
      }
    };

    const timer = setTimeout(() => {
      if (!hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
      }
    }, 30000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [hasTriggered]);

  const handleAction = (anchor?: string) => {
    setIsVisible(false);
    navigate(anchor ? `/contribute#${anchor}` : '/contribute');
    if (anchor) {
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="fixed bottom-8 right-8 z-[100] w-full max-w-md p-1"
        >
          <div className="bg-[#0A0A0A]/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-6 pb-0 flex justify-between items-start">
              <div className="bg-clay/10 p-3 rounded-2xl">
                <MessageSquarePlus className="text-clay" size={24} />
              </div>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-white/20 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 pt-6">
              <h3 className="text-xl font-bold text-white mb-4 leading-tight">
                Your expertise fuels <span className="text-clay">Elite Intelligence</span>
              </h3>
              <p className="text-white/40 text-sm font-serif italic mb-8 leading-relaxed">
                Since we are just starting out, your contribution means a lot. Would you like to recommend a missing card, suggest a spec change, or report a discontinued card?
              </p>

              <div className="space-y-3">
                <button 
                  onClick={() => handleAction('missing-card')}
                  className="w-full flex items-center justify-between bg-white/5 border border-white/10 hover:bg-white hover:text-black p-4 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquarePlus size={18} className="text-clay group-hover:text-black transition-colors" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Recommend Missing Card</span>
                  </div>
                  <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => handleAction('update-specs')}
                  className="w-full flex items-center justify-between bg-white/5 border border-white/10 hover:bg-white hover:text-black p-4 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <FileEdit size={18} className="text-clay group-hover:text-black transition-colors" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Update Information</span>
                  </div>
                  <ArrowRight size={16} />
                </button>
                <button 
                  onClick={() => handleAction('dead-card')}
                  className="w-full flex items-center justify-between bg-white/5 border border-white/10 hover:bg-white hover:text-black p-4 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle size={18} className="text-clay group-hover:text-black transition-colors" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Report Dead Card</span>
                  </div>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="bg-clay/5 border-t border-white/5 p-4 overflow-hidden relative h-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentActivityIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-clay/20 flex items-center justify-center shrink-0">
                    <User size={14} className="text-clay" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-white/80 font-bold">
                      <span className="text-clay">{NAMES[currentActivityIndex]}</span> {ACTIONS[currentActivityIndex % ACTIONS.length]}
                    </p>
                    <div className="flex items-center gap-1 text-[8px] text-white/20 uppercase tracking-widest mt-1">
                      <Globe size={10} />
                      {LOCATIONS[currentActivityIndex % LOCATIONS.length]}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Live</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContributionPopup;
