import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Send, Smartphone, MoreHorizontal, Smile, Plus, Camera, Instagram, Globe } from 'lucide-react';

const messages = [
  { 
    id: 1, 
    sender: "Kabir", 
    text: "Guys, need suggestions for a new card. Amazon Pay vs HDFC Swiggy? Too confused. 😵‍💫", 
    color: "bg-blue-500", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir" 
  },
  { 
    id: 2, 
    sender: "Zoya", 
    text: "Wait, did you see this reel? This influencer is saying Axis Magnus is dead now...", 
    color: "bg-purple-500", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoya",
    isReel: true 
  },
  { 
    id: 3, 
    sender: "Arjun", 
    text: "Forget the reels and 'hacks'. Kabir, just check Yureka.money. It audits your actual spend and gives the best match based on math, not hype.", 
    color: "bg-indigo-600", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun" 
  },
  { 
    id: 4, 
    sender: "Kabir", 
    text: "Wait, Yureka.money? Checking it out now...", 
    color: "bg-blue-500", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir" 
  },
  { 
    id: 5, 
    sender: "Zoya", 
    text: "Is it actually free? I'm tired of those hidden subscription tools.", 
    color: "bg-purple-500", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoya" 
  },
  { 
    id: 6, 
    sender: "Arjun", 
    text: "Completely free. It's the financial absolute. No BS.", 
    color: "bg-indigo-600", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun" 
  },
];

const GroupChatAudit: React.FC = () => {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const animateNextMessage = (index: number) => {
      if (index < messages.length) {
        // First show typing indicator for at least 3 seconds
        setTypingUser(messages[index].sender);
        
        timeout = setTimeout(() => {
          setTypingUser(null);
          setVisibleMessages(prev => [...prev, messages[index].id]);
          
          // Wait a bit after message appears before starting next typing
          timeout = setTimeout(() => {
            animateNextMessage(index + 1);
          }, 1000); 
        }, 3000);
      } else {
        // Reset after final message
        timeout = setTimeout(() => {
          setVisibleMessages([]);
          setTypingUser(null);
          animateNextMessage(0);
        }, 5000);
      }
    };

    animateNextMessage(0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [visibleMessages]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-[320px] aspect-[9/18.5] bg-ink rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[8px] border-[#222] relative overflow-hidden flex flex-col"
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#222] rounded-b-2xl z-50 flex items-center justify-center">
            <div className="w-10 h-1 bg-white/10 rounded-full" />
        </div>

        <div className="pt-10 pb-6 px-6 bg-white/[0.03] backdrop-blur-3xl border-b border-white/10 flex flex-col items-center gap-3 shrink-0 relative overflow-hidden">
          {/* Subtle Shine */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-clay/20 blur-[60px] rounded-full" />
          
          <div className="flex -space-x-2.5 mb-1 relative z-10">
             {messages.slice(0, 3).map((m, i) => (
               <motion.div 
                 key={m.id} 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ delay: i * 0.1 }}
                 className={`w-10 h-10 rounded-full border-2 border-ink overflow-hidden shadow-2xl relative`}
               >
                 <img src={m.avatar} alt={m.sender} className="w-full h-full object-cover bg-slate-200" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
               </motion.div>
             ))}
          </div>
          <div className="text-center relative z-10">
            <h4 className="text-white text-[13px] font-medium tracking-tight mb-0.5">The Yield Syndicate</h4>
            <div className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-[pulse_2s_infinite]" />
                <span className="text-white/40 text-[9px] font-medium uppercase tracking-[0.2em]">
                    3 Members Active
                </span>
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide flex flex-col pt-8"
        >
          <AnimatePresence mode="popLayout">
            {messages.filter(m => visibleMessages.includes(m.id)).map((msg) => (
              <motion.div 
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
                className={`flex flex-col ${msg.sender === 'Arjun' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1.5 px-1">
                    <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-white/20">{msg.sender}</span>
                </div>
                
                {msg.isReel ? (
                  <div className="w-[200px] group cursor-pointer relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-clay/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative rounded-[1.8rem] overflow-hidden border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
                        <div className="aspect-[9/16] bg-slate-900 rounded-[1.4rem] relative overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=400" 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[3s]" 
                            />
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20"
                                >
                                    <Instagram size={24} className="text-white" />
                                </motion.div>
                            </div>
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                                <div className="px-2 py-0.5 bg-red-500 rounded-md text-[8px] font-bold text-white tracking-widest animate-pulse">REEL</div>
                            </div>
                        </div>
                        <div className="p-3">
                            <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                              {msg.text}
                            </p>
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className={`
                    max-w-[85%] rounded-[1.8rem] px-5 py-3.5 text-[12px] font-medium leading-relaxed shadow-2xl transition-all
                    ${msg.sender === 'Arjun' 
                        ? 'bg-clay text-white rounded-tr-[0.4rem] shadow-clay/20' 
                        : 'bg-white/5 text-white/90 rounded-tl-[0.4rem] border border-white/10 backdrop-blur-2xl'
                    }
                  `}>
                    {msg.text}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {typingUser && (
              <motion.div 
                initial={{ opacity: 0, x: -10, filter: "blur(5px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -5, filter: "blur(5px)" }}
                className={`flex flex-col ${typingUser === 'Arjun' ? 'items-end' : 'items-start'}`}
              >
                 <span className="text-[9px] font-medium uppercase tracking-widest text-white/20 mb-2 ml-1 italic">{typingUser} is composing...</span>
                 <div className="bg-white/5 border border-white/10 rounded-full px-5 py-2.5 flex gap-1.5 items-center backdrop-blur-xl shadow-xl">
                    <motion.div animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.1, 0.8] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-1.5 h-1.5 bg-clay rounded-full" />
                    <motion.div animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.1, 0.8] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                    <motion.div animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.1, 0.8] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-4 shrink-0" />
        </div>

        {/* Input Bar */}
        <div className="p-6 pt-2 bg-white/[0.03] backdrop-blur-3xl border-t border-white/10 flex items-center gap-4 shrink-0">
          <motion.div whileHover={{ scale: 1.1 }} className="p-2 text-white/20 hover:text-clay/80 transition-colors cursor-pointer">
            <Plus size={20} />
          </motion.div>
          <div className="flex-1 h-11 bg-white/5 rounded-2xl px-5 flex items-center border border-white/5 shadow-inner backdrop-blur-md">
            <span className="text-[11px] text-white/20 font-medium tracking-wide">Enter the Syndicate...</span>
          </div>
          <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 bg-clay/10 text-clay rounded-2xl flex items-center justify-center border border-clay/20 shadow-lg shadow-clay/5 cursor-pointer">
            <Smile size={20} />
          </motion.div>
        </div>

        <div className="h-8 w-full shrink-0 flex items-center justify-center">
           <div className="w-32 h-1.5 bg-white/10 rounded-full" />
        </div>
      </motion.div>

      {/* Hero Atmosphere Glow */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
          <div className="w-[400px] h-[700px] bg-clay/5 blur-[120px] rounded-full" />
      </div>

      {/* Floating Card Detail */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        animate={{ 
            y: [0, -15, 0],
            rotate: [5, 3, 5]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-12 top-1/3 hidden xl:block z-50"
      >
        <div className="bg-white/80 backdrop-blur-xl p-5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-ink/5 rotate-3 rounded-2xl w-56">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-clay/10 rounded-xl flex items-center justify-center">
                    <Globe size={16} className="text-clay" />
                </div>
                <div className="space-y-1">
                    <div className="w-16 h-2 bg-ink/10 rounded-full" />
                    <div className="w-10 h-1.5 bg-ink/5 rounded-full" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="w-full h-1.5 bg-ink/5 rounded-full" />
                <div className="w-full h-1.5 bg-ink/5 rounded-full" />
                <div className="w-2/3 h-1.5 bg-ink/5 rounded-full" />
            </div>
            <div className="mt-4 pt-4 border-t border-ink/5 flex justify-between items-center">
                <div className="w-8 h-8 bg-ink/5 rounded-full" />
                <div className="w-12 h-4 bg-clay/20 rounded-lg" />
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GroupChatAudit;
