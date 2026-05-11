import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Plus, AlertTriangle, Trash2, MapPin, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NAMES = ['Mainak', 'Sakshi', 'Krutika', 'Akash', 'Anwesh', 'Anirudhha', 'Sansrite', 'Jacqueline', 'Aniket', 'Ankit', 'Piyush', 'Sagar'];
const ACTIONS = [
  'recommended a card', 
  'Requested a card specs change', 
  'reported a dead card'
];
const LOCATIONS = [
  'Mumbai - India', 'Bangalore - India', 'Gurgaon - India', 
  'Arizona - USA', 'Colchester - UK', 'Indore - India'
];

const ContributionModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [canClose, setCanClose] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if user is new and hasn't seen this before
    const hasSeen = localStorage.getItem('yureka_contribution_modal_seen');
    const isNewUser = !hasSeen;

    if (!isNewUser) return;

    let timeTriggered = false;
    let scrollTriggered = false;

    const triggerModal = () => {
      if (isOpen) return;
      setIsOpen(true);
      localStorage.setItem('yureka_contribution_modal_seen', 'true');
    };

    // Time trigger: 30 seconds
    const timer = setTimeout(() => {
      timeTriggered = true;
      triggerModal();
    }, 30000);

    // Scroll trigger: 30%
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = (scrolled / height) * 100;

      if (percentage >= 30 && !scrollTriggered) {
        scrollTriggered = true;
        triggerModal();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (isOpen && countdown === 0) {
      setCanClose(true);
    }
  }, [isOpen, countdown]);

  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % NAMES.length);
    }, 4000);
    return () => clearInterval(tickerInterval);
  }, []);

  const handleCTA = (tab: string) => {
    setIsOpen(false);
    navigate(`/contribute?tab=${tab}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-md"
            onClick={() => canClose && setIsOpen(false)}
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-[#111111] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          >
            {/* Social Proof Ticker */}
            <div className="bg-clay/10 border-b border-white/5 py-3 px-8 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={tickerIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-clay/80"
                >
                  <MapPin size={12} className="shrink-0" />
                  <span>{NAMES[tickerIndex]}</span>
                  <span className="text-white/40">{ACTIONS[tickerIndex % ACTIONS.length]}</span>
                  <span className="text-white/20">from</span>
                  <span>{LOCATIONS[tickerIndex % LOCATIONS.length]}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Close Button */}
            <div className="absolute top-8 right-8 z-20">
              <button 
                onClick={() => canClose && setIsOpen(false)}
                className={`relative group p-3 rounded-full transition-all ${canClose ? 'bg-white/5 hover:bg-white/10 cursor-pointer' : 'bg-white/5 cursor-not-allowed opacity-50'}`}
              >
                {canClose ? <X size={20} className="text-white" /> : (
                  <div className="relative">
                    <X size={20} className="text-white/20" />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-clay">
                      {countdown}
                    </span>
                  </div>
                )}
                {canClose && (
                  <motion.div 
                    layoutId="timer-circle"
                    className="absolute inset-0 border-2 border-clay rounded-full" 
                  />
                )}
              </button>
            </div>

            <div className="p-10 sm:p-14 space-y-10 relative">
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-clay/10 blur-[100px] rounded-full -z-10" />

              <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-clay/20 border border-clay/30 text-clay text-[10px] font-black uppercase tracking-widest mb-4">
                  <Sparkles size={14} /> Community Insights
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  Help us build the <span className="text-clay">Database.</span>
                </h2>
                <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-medium italic">
                  "Since we are just starting out, your contribution means a lot. Would you like to recommend a missing card to be added in our repository, or feel like some key information is missing of a particular card or you found out a discontinued card and report the same?"
                </p>
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => handleCTA('add')}
                  className="group relative bg-white/5 border border-white/10 hover:border-clay/50 p-6 rounded-3xl transition-all hover:bg-clay/5 text-left"
                >
                  <Plus size={24} className="text-clay mb-4 group-hover:scale-125 transition-transform" />
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Missing Card</div>
                  <div className="text-xs font-bold text-white">Recommend New</div>
                </button>

                <button 
                  onClick={() => handleCTA('update')}
                  className="group relative bg-white/5 border border-white/10 hover:border-yellow-500/50 p-6 rounded-3xl transition-all hover:bg-yellow-500/5 text-left"
                >
                  <AlertTriangle size={24} className="text-yellow-500 mb-4 group-hover:scale-125 transition-transform" />
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Inaccuracy</div>
                  <div className="text-xs font-bold text-white">Update Details</div>
                </button>

                <button 
                  onClick={() => handleCTA('remove')}
                  className="group relative bg-white/5 border border-white/10 hover:border-red-500/50 p-6 rounded-3xl transition-all hover:bg-red-500/5 text-left"
                >
                  <Trash2 size={24} className="text-red-500 mb-4 group-hover:scale-125 transition-transform" />
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Discontinued</div>
                  <div className="text-xs font-bold text-white">Report Removal</div>
                </button>
              </div>

              {/* Progress Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
                  <Zap size={14} className="text-clay animate-pulse" />
                  Powered by Community Insights
                </div>
                {!canClose && (
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-clay/50">
                    Exit available in {countdown}s
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContributionModal;
