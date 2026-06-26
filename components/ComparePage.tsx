import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, X, ChevronDown, 
  ArrowRightLeft, Star, Zap, Info, Shield, 
  ZapOff, CheckCircle2, AlertCircle, Loader2, CreditCard
} from 'lucide-react';
import { api, isApiError } from '../lib/api/client';
import { fromApiCard } from '../lib/api/mappers';
import type { Card as ApiCard } from '../lib/api/types';
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
    category: 'Entry-Level Cashback Heroes',
    cards: [
      { name: 'Amazon Pay ICICI', image: 'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards/icici-bank-amazon-pay-icici.png', slug: 'amazon-pay-icici-icici-bank' },
      { name: 'Swiggy HDFC', image: 'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards/hdfc-bank-swiggy-hdfc-bank.jpeg', slug: 'swiggy-hdfc-bank-hdfc-bank' },
      { name: 'Airtel Axis', image: 'https://rvqtlvgaqlgylipsaktm.supabase.co/storage/v1/object/public/media/cards/axis-bank-airtel-axis-bank.jpeg', slug: 'airtel-axis-bank-axis-bank' }
    ]
  }
];

const ComparePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const basePath = isDashboard ? '/dashboard' : '';
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCards, setSelectedCards] = useState<string[]>(['', '', '']);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  useEffect(() => {
    api.get<ApiCard[]>('/api/v1/cms/cards', { skipAuth: true }).then(res => {
      if (!isApiError(res)) setAllCards((res.data ?? []).map(fromApiCard));
      setLoading(false);
    });
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
    
    const slugs = validIds.map(id => {
      const card = allCards.find(c => c.id === id);
      return card?.slug || id;
    });
    
    navigate(`${basePath}/compare/${slugs.join('-vs-')}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32 overflow-hidden selection:bg-clay selection:text-black">
      <SEO 
        title="Credit Card Comparisons | Side-by-Side Analysis" 
        description="Compare up to 3 credit cards side-by-side. Deep-dive into fees, rewards, and eligibility to find your perfect match."
      />

      {/* Hero Header */}
      <section className="relative pt-24 pb-16 overflow-hidden px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.04)_0%,transparent_75%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left mt-8">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl mb-8"
           >
             <ArrowRightLeft size={14} className="text-clay" />
             <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em] font-mono">Neural Comparison Engine</span>
           </motion.div>

           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-4xl md:text-7xl font-sans font-extrabold text-white tracking-tighter uppercase mb-4"
           >
             Credit Card <span className="text-clay relative italic">Comparisons<span className="absolute -bottom-1 left-0 w-full h-1 bg-clay/20" /></span>
           </motion.h1>
           <p className="text-white/60 text-sm md:text-base max-w-xl leading-relaxed font-sans">
             Institutional analysis of premium benefits, exclusion mapping, and net yield metrics.
           </p>
        </div>
      </section>

      {/* Comparison Tool */}
      <section className="max-w-7xl mx-auto px-6 mt-4 relative z-20">
         <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative backdrop-blur-xl">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-clay/5 blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 space-y-12">
               <div className="space-y-2 border-b border-white/5 pb-6">
                  <h2 className="text-2xl font-sans font-extrabold text-white uppercase">Choose Your Own Comparison</h2>
                  <p className="text-white/50 text-sm">Select up to 3 cards to compare side by side</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={`space-y-4 relative ${activeDropdown === i ? 'z-[100]' : 'z-10'}`}>
                       <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block ml-1 font-mono">
                          Slot {i + 1} {i === 2 && <span className="text-white/20 lowercase tracking-normal">(Optional)</span>}
                       </label>
                       
                       <div className="relative">
                          <button 
                            onClick={() => setActiveDropdown(activeDropdown === i ? null : i)}
                            className="w-full bg-[#111111] border border-white/10 rounded-2xl p-5 text-left flex items-center justify-between group hover:border-white/20 transition-all backdrop-blur-xl shadow-lg"
                          >
                             <span className={`text-sm font-bold uppercase tracking-tight ${selectedCards[i] ? 'text-white font-black' : 'text-white/35'}`}>
                                {selectedCards[i] ? allCards.find(c => c.id === selectedCards[i])?.name : 'Select a card'}
                             </span>
                             <ChevronDown size={18} className={`text-white/30 group-hover:text-white transition-transform duration-500 ${activeDropdown === i ? 'rotate-180' : ''}`} />
                          </button>

                          {/* Visual Slot Feedback */}
                          <div className="mt-4">
                            {selectedCards[i] ? (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-[1.58/1] w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl group bg-[#111111] flex items-center justify-center group-hover:border-clay/35 transition-colors"
                              >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                                <img 
                                  src={allCards.find(c => c.id === selectedCards[i])?.image} 
                                  alt="" 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                />
                                <span className="absolute bottom-4 left-4 z-20 text-[9px] font-black text-white uppercase tracking-widest font-mono bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                                  {allCards.find(c => c.id === selectedCards[i])?.bank}
                                </span>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleSelect(i, ''); }}
                                  className="absolute top-3 right-3 z-20 w-7 h-7 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/30 transition-all text-white/70 hover:text-red-400"
                                >
                                  <X size={12} />
                                </button>
                              </motion.div>
                            ) : (
                              <div 
                                onClick={() => setActiveDropdown(activeDropdown === i ? null : i)}
                                className="aspect-[1.58/1] w-full rounded-2xl border border-white/5 border-dashed bg-white/[0.01] flex flex-col items-center justify-center text-white/15 hover:border-white/10 hover:bg-white/[0.02] cursor-pointer transition-all duration-300"
                              >
                                <CreditCard size={28} className="opacity-20 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-35 font-mono">Empty Slot</span>
                              </div>
                            )}
                          </div>

                          <AnimatePresence>
                             {activeDropdown === i && (
                               <motion.div 
                                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                 animate={{ opacity: 1, y: 0, scale: 1 }}
                                 exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                 className="absolute top-full left-0 right-0 mt-3 z-[100] bg-[#111111] border border-white/15 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-3xl"
                               >
                                  <div className="max-h-72 overflow-y-auto custom-scrollbar p-2">
                                     {loading ? (
                                       <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-clay" /></div>
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
                                               <span className="text-[9px] font-bold text-white/25 uppercase tracking-widest">{card.bank}</span>
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

               <div className="flex justify-between items-center pt-8 border-t border-white/5">
                  <div className="text-[10px] text-white/30 font-bold uppercase tracking-wider font-mono">
                    {selectedCards.filter(id => id !== '').length} of 3 cards selected
                  </div>
                  <button 
                    onClick={handleCompare}
                    disabled={selectedCards.filter(id => id !== '').length < 2}
                    className="bg-clay disabled:bg-white/5 text-black disabled:text-white/20 px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group shadow-2xl shadow-clay/20"
                  >
                     Compare Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* Popular Comparisons Grid */}
      <section className="max-w-7xl mx-auto px-6 mt-32 space-y-12">
         <div className="space-y-2 text-center">
            <h2 className="text-3xl font-sans font-extrabold text-white uppercase tracking-tight">Popular Comparisons</h2>
            <p className="text-white/35 text-[10px] font-black uppercase tracking-[0.4em] font-mono">Expert curated neural matchups</p>
         </div>

         <div className="flex flex-col gap-8">
            {POPULAR_COMPARISONS.map((comp, idx) => (
               <motion.div
                 key={comp.id}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="group relative bg-gradient-to-b from-white/[0.02] to-transparent border border-white/10 rounded-[3rem] p-8 md:p-10 hover:border-clay/30 transition-all duration-700 shadow-2xl"
               >
                  <div className="flex flex-col space-y-8">
                     {/* Header */}
                     <div className="space-y-1">
                        <h3 className="text-xl font-sans font-bold text-white tracking-tight">{comp.title}</h3>
                        <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] font-mono">{comp.category}</p>
                     </div>
 
                     {/* Comparison Visualization */}
                     <div className="flex items-center justify-between gap-6 py-4 overflow-x-auto no-scrollbar">
                        {comp.cards.map((cardRef, i) => {
                           const cardData = allCards.find(c => c.slug === cardRef.slug);
                           const displayImage = cardData?.image || cardRef.image;
                           
                           return (
                              <React.Fragment key={i}>
                                 <div className="flex flex-col items-center gap-4 min-w-[150px] flex-1">
                                    <div className="relative w-full aspect-[1.58/1] rounded-2xl overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-transform duration-700 bg-white/5 border border-white/5">
                                       <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                                       <img 
                                         src={displayImage} 
                                         alt={cardRef.name} 
                                         className="w-full h-full object-cover transition-opacity duration-500"
                                         onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                                       />
                                    </div>
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">{cardRef.name}</span>
                                 </div>
                                 {i < comp.cards.length - 1 && (
                                   <div className="text-sm font-black text-clay/50 px-2 italic shrink-0 font-serif">VS</div>
                                 )}
                              </React.Fragment>
                           );
                        })}
                     </div>
  
                     {/* Action Button */}
                     <Link 
                       to={`${basePath}/compare/${comp.cards.map(c => c.slug).join('-vs-')}`}
                       className="w-full bg-white/5 border border-white/10 text-white/80 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-clay hover:text-black transition-all duration-500 flex items-center justify-center gap-3 shadow-xl hover:shadow-clay/20 font-mono"
                     >
                        View Comparison <ArrowRight size={18} />
                     </Link>
                  </div>
               </motion.div>
            ))}
         </div>
      </section>

      {/* Value Prop */}
      <section className="max-w-7xl mx-auto px-6 mt-32 border-t border-white/5 pt-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            {[
               { icon: Shield, title: 'Unbiased Data', desc: 'Direct from bank records with no affiliate bias in neural scoring.' },
               { icon: Zap, title: 'Real-time Sync', desc: 'Fees, rewards and eligibility sync directly from our card matrix.' },
               { icon: Sparkles, title: 'AI Insights', desc: 'Deep-dive analysis of hidden terms and reward capping.' }
            ].map((prop, i) => (
               <div key={i} className="space-y-4 group">
                  <div className="w-12 h-12 bg-clay/10 rounded-2xl flex items-center justify-center group-hover:bg-clay transition-colors duration-500">
                     <prop.icon className="text-clay group-hover:text-black transition-colors" size={20} />
                  </div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight">{prop.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{prop.desc}</p>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default ComparePage;
