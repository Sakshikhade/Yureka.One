import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowRight, Search, Sparkles, X, ChevronDown, 
  ArrowRightLeft, Star, Zap, Info, Shield, 
  ZapOff, CheckCircle2, AlertCircle, Loader2
} from 'lucide-react';
import { getCards } from '../services/supabaseService';
import { Card } from '../types';
import SEO from './SEO';

const POPULAR_COMPARISONS = [
  {
    id: '1',
    title: 'HDFC Infinia Metal vs. ICICI Emeralde Private Metal',
    category: 'Kings of Credit Cards',
    cards: [
      { name: 'HDFC Infinia', image: 'https://images.unsplash.com/photo-1589750670744-dc9633e0f9c7?auto=format&fit=crop&q=80&w=400' },
      { name: 'ICICI Emeralde', image: 'https://images.unsplash.com/photo-1613243555988-441166d4d6fd?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: '2',
    title: 'Axis Atlas vs. Axis Magnus vs. HDFC Regalia Gold',
    category: 'Premium Rewards',
    cards: [
      { name: 'Axis Atlas', image: 'https://images.unsplash.com/photo-1556742049-02e49f9d2a10?auto=format&fit=crop&q=80&w=400' },
      { name: 'Axis Magnus', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400' },
      { name: 'Regalia Gold', image: 'https://images.unsplash.com/photo-1589750670744-dc9633e0f9c7?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    id: '3',
    title: 'Amex Platinum Travel vs. Amex Membership Rewards',
    category: 'Amex Duo',
    cards: [
      { name: 'Amex Platinum', image: 'https://images.unsplash.com/photo-1613243555988-441166d4d6fd?auto=format&fit=crop&q=80&w=400' },
      { name: 'Amex MRCC', image: 'https://images.unsplash.com/photo-1556742049-02e49f9d2a10?auto=format&fit=crop&q=80&w=400' }
    ]
  }
];

const ComparePage: React.FC = () => {
  const navigate = useNavigate();
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCards, setSelectedCards] = useState<string[]>(['', '', '']);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  useEffect(() => {
    const unsub = getCards((cards) => {
      setAllCards(cards);
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleSelect = (index: number, cardId: string) => {
    const newSelected = [...selectedCards];
    newSelected[index] = cardId;
    setSelectedCards(newSelected);
    setActiveDropdown(null);
  };

  const handleCompare = () => {
    const validIds = selectedCards.filter(id => id !== '');
    if (validIds.length < 2) return;
    
    // Create a slug like hdfc-infinia-vs-axis-magnus
    const slugs = validIds.map(id => {
      const card = allCards.find(c => c.id === id);
      return card?.slug || id;
    });
    
    navigate(`/compare/${slugs.join('-vs-')}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32">
      <SEO 
        title="Credit Card Comparisons | Side-by-Side Analysis" 
        description="Compare up to 3 credit cards side-by-side. Deep-dive into fees, rewards, and eligibility to find your perfect match."
      />

      {/* Hero Header */}
      <section className="relative pt-20 pb-16 overflow-hidden px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl mb-8"
           >
             <ArrowRightLeft size={14} className="text-blue-400" />
             <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Neural Comparison Engine</span>
           </motion.div>

           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-4xl md:text-6xl font-heading font-black text-white tracking-tighter uppercase"
           >
             Credit Card <span className="text-blue-400">Comparisons</span>
           </motion.h1>
        </div>
      </section>

      {/* Comparison Tool */}
      <section className="max-w-7xl mx-auto px-6 -mt-4 relative z-20">
         <div className="bg-[#111] border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 space-y-12">
               <div className="space-y-2">
                  <h2 className="text-2xl font-heading font-black text-white uppercase">Choose Your Own Comparison</h2>
                  <p className="text-white/40 text-sm">Select up to 3 cards to compare side by side</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="space-y-3 relative">
                       <label className="text-[10px] font-black text-white/20 uppercase tracking-widest block ml-1">
                          Card {i + 1} {i === 2 && <span className="text-white/10 lowercase tracking-normal">(Optional)</span>}
                       </label>
                       
                       <div className="relative">
                          <button 
                            onClick={() => setActiveDropdown(activeDropdown === i ? null : i)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-left flex items-center justify-between group hover:border-white/20 transition-all backdrop-blur-xl"
                          >
                             <span className={`text-sm font-bold uppercase tracking-tight ${selectedCards[i] ? 'text-white' : 'text-white/20'}`}>
                                {selectedCards[i] ? allCards.find(c => c.id === selectedCards[i])?.name : 'Select a card'}
                             </span>
                             <ChevronDown size={18} className={`text-white/20 group-hover:text-white transition-transform duration-500 ${activeDropdown === i ? 'rotate-180' : ''}`} />
                          </button>

                          <AnimatePresence>
                             {activeDropdown === i && (
                               <motion.div 
                                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                 animate={{ opacity: 1, y: 0, scale: 1 }}
                                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                 className="absolute top-full left-0 right-0 mt-3 z-[100] bg-[#1a1a1a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-3xl"
                               >
                                  <div className="max-h-72 overflow-y-auto custom-scrollbar p-2">
                                     {loading ? (
                                       <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-blue-400" /></div>
                                     ) : (
                                       allCards.map(card => (
                                         <button
                                           key={card.id}
                                           onClick={() => handleSelect(i, card.id)}
                                           className="w-full text-left p-4 rounded-2xl hover:bg-white/5 flex items-center gap-4 group/item transition-colors"
                                         >
                                            <div className="w-12 h-8 rounded bg-white/5 overflow-hidden shrink-0">
                                               <img src={card.image} alt="" className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all" />
                                            </div>
                                            <div className="flex flex-col">
                                               <span className="text-[11px] font-black text-white uppercase tracking-wider">{card.name}</span>
                                               <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{card.bank}</span>
                                            </div>
                                         </button>
                                       ))
                                     )}
                                  </div>
                               </motion.div>
                             )}
                          </AnimatePresence>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="flex justify-end pt-4 border-t border-white/5">
                  <button 
                    onClick={handleCompare}
                    disabled={selectedCards.filter(id => id !== '').length < 2}
                    className="bg-blue-600 disabled:bg-white/5 text-white disabled:text-white/20 px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group shadow-2xl shadow-blue-600/20"
                  >
                     Compare Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* Popular Comparisons Grid */}
      <section className="max-w-7xl mx-auto px-6 mt-24 space-y-12">
         <div className="space-y-2 text-center">
            <h2 className="text-3xl font-heading font-black text-white uppercase tracking-tight">Popular Comparisons</h2>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">Expert curated neural matchups</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {POPULAR_COMPARISONS.map((comp, idx) => (
               <motion.div
                 key={comp.id}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="group bg-[#111]/60 backdrop-blur-xl border border-white/5 rounded-[3rem] p-8 md:p-10 hover:border-blue-400/20 transition-all duration-700 overflow-hidden"
               >
                  <div className="space-y-10 relative z-10">
                     <div className="space-y-1">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1">{comp.title}</h3>
                        <p className="text-[10px] font-bold text-[#34d399] uppercase tracking-widest">{comp.category}</p>
                     </div>

                     <div className="flex items-center justify-center gap-4 md:gap-8">
                        {comp.cards.map((card, i) => (
                           <React.Fragment key={i}>
                              <div className="relative group/card flex flex-col items-center gap-3">
                                 <div className="w-32 md:w-44 aspect-[1.6/1] rounded-xl overflow-hidden shadow-2xl transform group-hover/card:scale-105 transition-transform duration-500">
                                    <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                                 </div>
                                 <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{card.name}</span>
                              </div>
                              {i < comp.cards.length - 1 && (
                                <div className="text-xl md:text-2xl font-black text-white/10 group-hover:text-blue-400/40 transition-colors">VS</div>
                              )}
                           </React.Fragment>
                        ))}
                     </div>

                     <button className="w-full bg-white/5 border border-white/10 text-white/60 py-5 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 group/btn">
                        View Detailed Comparison <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                  </div>
               </motion.div>
            ))}
         </div>
      </section>

      {/* Value Prop */}
      <section className="max-w-7xl mx-auto px-6 mt-32">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {[
               { icon: Shield, title: 'Unbiased Data', desc: 'Direct from bank records with no affiliate bias in neural scoring.' },
               { icon: Zap, title: 'Real-time Sync', desc: 'Fees, rewards and eligibility sync directly from our card matrix.' },
               { icon: Sparkles, title: 'AI Insights', desc: 'Deep-dive analysis of hidden terms and reward capping.' }
            ].map((prop, i) => (
               <div key={i} className="space-y-4 group">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-500">
                     <prop.icon className="text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight">{prop.title}</h4>
                  <p className="text-white/40 text-sm leading-relaxed">{prop.desc}</p>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default ComparePage;
