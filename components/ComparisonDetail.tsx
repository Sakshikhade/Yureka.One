import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Check, X, Shield, Zap, Sparkles, Loader2, Star, 
  Award, TrendingUp, Plane, ShoppingBag, Utensils, 
  ChevronRight, ExternalLink, Info, Globe, CreditCard,
  Gift, Percent, Wallet, MousePointer2
} from 'lucide-react';
import { getCards } from '../services/supabaseService';
import { Card } from '../types';
import SEO from './SEO';

const ComparisonDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = getCards((allCards) => {
      const cardSlugs = slug?.split('-vs-') || [];
      const matchedCards = cardSlugs.map(s => 
        allCards.find(c => c.slug === s || c.id === s)
      ).filter((c): c is Card => !!c);
      
      setCards(matchedCards);
      setLoading(false);
    });
    return unsub;
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-blue-400" size={48} />
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Aggregating Neural Data...</span>
      </div>
    );
  }

  // Helper to extract unique keys from all cards for dynamic comparison
  const getAllKeys = (type: 'grid_fees' | 'grid_benefits') => {
    const keysSet = new Set<string>();
    cards.forEach(card => {
      (card[type] || []).forEach(item => keysSet.add(item.title));
    });
    return Array.from(keysSet);
  };

  const dynamicFees = getAllKeys('grid_fees');
  const dynamicBenefits = getAllKeys('grid_benefits');

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32">
      <SEO 
        title={`Comparison: ${cards.map(c => c.name).join(' vs ')}`} 
        description="Side-by-side analysis of features, rewards, and eligibility."
      />

      {/* Hero Header */}
      <section className="relative pt-12 pb-24 overflow-hidden bg-blue-600">
         <div className="absolute inset-0 bg-gradient-to-r from-blue-700/50 to-transparent pointer-events-none" />
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <Link to="/compare" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] mb-12">
               <ArrowLeft size={14} /> Back to Selection
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
               <motion.h1 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="text-3xl md:text-5xl font-heading font-black text-white tracking-tighter uppercase max-w-3xl leading-[1.1]"
               >
                  {cards.map((c, i) => (
                    <React.Fragment key={c.id}>
                       {c.name}
                       {i < cards.length - 1 && <span className="text-white/40 mx-2 text-2xl md:text-3xl">vs</span>}
                    </React.Fragment>
                  ))}
               </motion.h1>
            </div>
         </div>
      </section>

      {/* Comparison Sections */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 space-y-20">
         
         {/* Top Level Cards */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, i) => (
               <motion.div 
                 key={card.id}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 className="bg-[#111] border border-white/10 rounded-[2.5rem] p-6 space-y-8 flex flex-col hover:border-blue-400/30 transition-all group"
               >
                  <div className="flex flex-wrap gap-2">
                     {(card.tags || [card.category, card.type]).filter(Boolean).map((tag, j) => (
                       <span key={j} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-white/60 uppercase tracking-widest">
                          {tag}
                       </span>
                     ))}
                  </div>

                  <div className="space-y-4">
                     <div className="aspect-[1.6/1] rounded-2xl overflow-hidden shadow-2xl bg-white/5 border border-white/5">
                        <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex justify-between items-start">
                        <div>
                           <h3 className="text-xl font-heading font-black text-white uppercase leading-none">{card.name}</h3>
                           <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">{card.bank}</p>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-400/10 rounded-lg">
                           <Star size={12} className="fill-amber-400 text-amber-400" />
                           <span className="text-xs font-black text-amber-400">{card.rating}</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4 flex-1">
                     <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Top Benefits</h4>
                     <ul className="space-y-3">
                        {(card.benefits || []).slice(0, 4).map((benefit, j) => (
                           <li key={j} className="flex items-start gap-3">
                              <Check size={14} className="text-[#34d399] mt-0.5 shrink-0" />
                              <span className="text-xs text-white/70 leading-relaxed">{benefit}</span>
                           </li>
                        ))}
                     </ul>
                  </div>

                  <Link to={`/cards/${card.slug || card.id}`} className="w-full bg-blue-600 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 transition-all">
                     Read Full Review <ChevronRight size={14} />
                  </Link>
               </motion.div>
            ))}
         </div>

         {/* Fees & Charges Matrix (Dynamic from Supabase) */}
         <section className="space-y-10">
            <div className="flex items-center gap-4">
               <h2 className="text-2xl font-heading font-black text-white uppercase tracking-tight">Fees & Charges</h2>
               <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {cards.map((card) => (
                  <div key={card.id} className="bg-white/5 border border-white/5 rounded-[2rem] p-8 space-y-8">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                           <img src={card.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-wider">{card.name}</span>
                     </div>

                     <div className="space-y-6">
                        <div className="flex justify-between items-end border-b border-white/5 pb-4">
                           <div className="space-y-1">
                              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Joining Fee</span>
                              <p className="text-lg font-bold text-white leading-none">{card.joining_fee}</p>
                           </div>
                           <span className="text-[8px] font-bold text-white/20 uppercase">+ GST</span>
                        </div>
                        <div className="flex justify-between items-end border-b border-white/5 pb-4">
                           <div className="space-y-1">
                              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Annual Fee</span>
                              <p className="text-lg font-bold text-white leading-none">{card.annual_fee}</p>
                           </div>
                           <span className="text-[8px] font-bold text-white/20 uppercase">+ GST</span>
                        </div>
                        
                        {/* Dynamic Grid Fees from Supabase */}
                        {(card.grid_fees || []).map((fee, idx) => (
                           <div key={idx} className="flex justify-between items-end border-b border-white/5 pb-4">
                              <div className="space-y-1">
                                 <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{fee.title}</span>
                                 <p className="text-lg font-bold text-blue-400 leading-none">{fee.value}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* Rewards & Features Program (Dynamic from Supabase) */}
         <section className="space-y-10">
            <div className="flex items-center gap-4">
               <h2 className="text-2xl font-heading font-black text-white uppercase tracking-tight">Rewards & Features</h2>
               <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {cards.map((card) => (
                  <div key={card.id} className="bg-white/5 border border-white/5 rounded-[2rem] p-8 space-y-10 flex flex-col">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                           <img src={card.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-wider">{card.name}</span>
                     </div>

                     <div className="space-y-8 flex-1">
                        {/* Rewards Rate */}
                        <div className="space-y-4">
                           <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Neural Efficiency</span>
                           <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                              <div className="flex items-center gap-2 mb-1">
                                 <Zap size={14} className="text-blue-400" />
                                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Base Rate</span>
                              </div>
                              <p className="text-xl font-black text-white">{card.rewards_rate || 'N/A'}</p>
                              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">Direct from product manifest</p>
                           </div>
                        </div>

                        {/* Grid Benefits from Supabase */}
                        <div className="space-y-4">
                           <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Key Levers</span>
                           <div className="space-y-2">
                              {(card.grid_benefits || []).map((benefit, idx) => (
                                 <div key={idx} className="flex justify-between items-start py-3 border-b border-white/[0.03]">
                                    <span className="text-xs text-white/60 pr-4">{benefit.title}</span>
                                    <span className="text-xs font-black text-white text-right">{benefit.value}</span>
                                 </div>
                              ))}
                              {/* Fallback if no grid benefits */}
                              {(!card.grid_benefits || card.grid_benefits.length === 0) && (
                                card.product_details?.slice(0, 3).map((detail, idx) => (
                                  <div key={idx} className="flex items-start gap-3 py-2">
                                     <Check size={12} className="text-blue-400 mt-1" />
                                     <span className="text-[11px] text-white/60">{detail}</span>
                                  </div>
                                ))
                              )}
                           </div>
                        </div>

                        {/* Welcome Benefits */}
                        {card.welcome_benefits && (
                          <div className="space-y-4 pt-4">
                             <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Onboarding Perks</span>
                             <div className="flex items-start gap-3 p-4 bg-[#34d399]/5 border border-[#34d399]/10 rounded-2xl">
                                <Gift size={16} className="text-[#34d399] shrink-0" />
                                <span className="text-[11px] text-[#34d399] leading-relaxed font-bold uppercase tracking-tight">{card.welcome_benefits}</span>
                             </div>
                          </div>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* Detailed Matrix Table (Pulling all card properties) */}
         <section className="space-y-10 pt-10">
            <div className="text-center space-y-2">
               <h2 className="text-3xl font-heading font-black text-white uppercase tracking-tight">Comprehensive Matrix</h2>
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Synced Neural Synchronization</p>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
               <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                           <th className="p-8 text-[11px] font-black text-white/40 uppercase tracking-widest w-64">Neural Vector</th>
                           {cards.map(card => (
                              <th key={card.id} className="p-8 text-[11px] font-black text-white uppercase tracking-widest text-center min-w-[280px]">
                                 {card.name}
                              </th>
                           ))}
                           {Array.from({ length: 3 - cards.length }).map((_, i) => (
                              <th key={i} className="p-8 min-w-[280px]" />
                           ))}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {[
                           { label: 'Neural Score', val: (c: Card) => `${c.rating} / 5` },
                           { label: 'Primary Focus', key: 'best_for' },
                           { label: 'Annual Fee', key: 'annual_fee' },
                           { label: 'Joining Fee', key: 'joining_fee' },
                           { label: 'Reward Engine', key: 'rewards_rate' },
                           { label: 'Intro Offer', key: 'intro_offer' },
                           { label: 'Savings Factor', key: 'projected_savings' },
                           { label: 'Elite Tier', val: (c: Card) => c.elite_rating ? `Tier ${c.elite_rating}` : 'Standard' },
                        ].map((row, idx) => (
                           <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-8 border-r border-white/5 bg-white/[0.01]">
                                 <span className="text-xs font-black text-white uppercase tracking-wider">{row.label}</span>
                              </td>
                              {cards.map(card => (
                                 <td key={card.id} className="p-8 text-center border-r border-white/5 last:border-r-0">
                                    <span className="text-sm font-bold text-white/60">
                                       {row.key ? ((card as any)[row.key] || 'N/A') : (row.val ? row.val(card) : 'N/A')}
                                    </span>
                                 </td>
                              ))}
                              {Array.from({ length: 3 - cards.length }).map((_, i) => (
                                 <td key={i} className="p-8" />
                              ))}
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </section>

         {/* Action Hub */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
               <div key={card.id} className="flex flex-col gap-3">
                  {card.apply_link && (
                    <a href={card.apply_link} target="_blank" rel="noopener noreferrer" className="w-full bg-[#34d399] text-black py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-[#34d399]/10">
                       Apply Securely <MousePointer2 size={16} />
                    </a>
                  )}
                  <Link to={`/cards/${card.slug || card.id}`} className="w-full bg-white/5 border border-white/10 text-white/60 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all">
                     View Deep Dive <ExternalLink size={16} />
                  </Link>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default ComparisonDetail;
