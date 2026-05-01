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
    title: 'Axis Atlas vs. ICICI Emeralde Private Metal vs. HDFC Regalia Gold',
    category: 'Premium Rewards Tier',
    cards: [
      { name: 'Axis Atlas', image: 'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards/axis-bank-atlas.jpeg', slug: 'axis-bank-atlas' },
      { name: 'ICICI Emeralde', image: 'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards/icici-bank-emeralde-private-metal.jpeg', slug: 'icici-emeralde-private-metal-icici-bank' },
      { name: 'Regalia Gold', image: 'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards/hdfc-bank-regalia-gold.jpeg', slug: 'hdfc-regalia-gold-hdfc-bank' }
    ]
  },
  {
    id: '2',
    title: 'Axis Atlas vs. Axis Magnus vs. Tata Neu Infinity HDFC',
    category: 'Travel & Lifestyle Matchup',
    cards: [
      { name: 'Axis Atlas', image: 'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards/axis-bank-atlas.jpeg', slug: 'axis-bank-atlas' },
      { name: 'Axis Magnus', image: 'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards/axis-bank-magnus.jpeg', slug: 'magnus-axis-bank' },
      { name: 'Tata Neu Infinity', image: 'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards/hdfc-bank-tata-neu-infinity.jpeg', slug: 'hdfc-tata-neu-infinity-hdfc-bank' }
    ]
  },
  {
    id: '3',
    title: 'Amazon Pay ICICI vs. Swiggy HDFC vs. Airtel Axis Bank',
    category: 'Entry-Level Cashback Heros',
    cards: [
      { name: 'Amazon Pay ICICI', image: 'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards/icici-bank-amazon-pay-icici.png', slug: 'amazon-pay-icici-icici-bank' },
      { name: 'Swiggy HDFC', image: 'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards/hdfc-bank-swiggy-hdfc-bank.jpeg', slug: 'swiggy-hdfc-bank-hdfc-bank' },
      { name: 'Airtel Axis', image: 'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards/axis-bank-airtel-axis-bank.jpeg', slug: 'airtel-axis-bank-axis-bank' }
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#34d399]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl mb-8"
           >
             <ArrowRightLeft size={14} className="text-[#34d399]" />
             <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Neural Comparison Engine</span>
           </motion.div>

           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-4xl md:text-6xl font-heading font-black text-white tracking-tighter uppercase"
           >
             Credit Card <span className="text-[#34d399]">Comparisons</span>
           </motion.h1>
        </div>
      </section>

      {/* Comparison Tool */}
      <section className="max-w-7xl mx-auto px-6 -mt-4 relative z-20">
         <div className="bg-[#111] border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl relative">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#34d399]/5 blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 space-y-12">
               <div className="space-y-2">
                  <h2 className="text-2xl font-heading font-black text-white uppercase">Choose Your Own Comparison</h2>
                  <p className="text-white/40 text-sm">Select up to 3 cards to compare side by side</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={`space-y-3 relative ${activeDropdown === i ? 'z-[100]' : 'z-10'}`}>
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
                                       <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#34d399]" /></div>
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
                    className="bg-[#34d399] disabled:bg-white/5 text-black disabled:text-white/20 px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group shadow-2xl shadow-[#34d399]/20"
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

         <div className="flex flex-col gap-6">
            {POPULAR_COMPARISONS.map((comp, idx) => (
               <motion.div
                 key={comp.id}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="group relative bg-[#111]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-10 hover:border-[#34d399]/30 transition-all duration-700"
               >
                  <div className="flex flex-col space-y-8">
                     {/* Header */}
                     <div className="space-y-1">
                        <h3 className="text-xl font-heading font-bold text-white tracking-tight">{comp.title}</h3>
                        <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em]">{comp.category}</p>
                     </div>
 
                     {/* Comparison Visualization */}
                     <div className="flex items-center justify-between gap-4 py-4 overflow-x-auto no-scrollbar">
                        {comp.cards.map((cardRef, i) => {
                           const cardData = allCards.find(c => c.slug === cardRef.slug);
                           const displayImage = cardData?.image || cardRef.image;
                           
                           return (
                              <React.Fragment key={i}>
                                 <div className="flex flex-col items-center gap-4 min-w-[140px] flex-1">
                                    <div className="relative w-full aspect-[1.6/1] rounded-2xl overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-transform duration-700 bg-white/5">
                                       <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                                       <img 
                                         src={displayImage} 
                                         alt={cardRef.name} 
                                         className="w-full h-full object-cover transition-opacity duration-500"
                                         onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                                       />
                                    </div>
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{cardRef.name}</span>
                                 </div>
                                 {i < comp.cards.length - 1 && (
                                   <div className="text-sm font-black text-[#34d399]/40 px-2 italic shrink-0">VS</div>
                                 )}
                              </React.Fragment>
                           );
                        })}
                     </div>
 
                     {/* Action Button */}
                     <Link 
                       to={`/compare/${comp.cards.map(c => c.slug).join('-vs-')}`}
                       className="w-full bg-white/5 border border-white/10 text-white/80 py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] hover:bg-[#34d399] hover:text-black transition-all duration-500 flex items-center justify-center gap-3 shadow-xl hover:shadow-[#34d399]/20"
                     >
                        View Comparison <ArrowRight size={18} />
                     </Link>
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
                  <div className="w-12 h-12 bg-[#34d399]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#34d399] transition-colors duration-500">
                     <prop.icon className="text-[#34d399] group-hover:text-black transition-colors" />
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
