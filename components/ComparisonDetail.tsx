import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Check, X, Shield, Zap, Sparkles, Loader2, Star, 
  Award, TrendingUp, Plane, ShoppingBag, Utensils, 
  ChevronRight, ExternalLink, Info, Globe, CreditCard
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32">
      <SEO 
        title={`Comparison: ${cards.map(c => c.name).join(' vs ')}`} 
        description="Side-by-side analysis of features, rewards, and eligibility."
      />

      {/* Modern Banner Header (Inspired by Image 2) */}
      <section className="relative pt-12 pb-24 overflow-hidden">
         <div className="absolute inset-0 bg-blue-600 z-0" />
         <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-transparent z-0 opacity-50" />
         
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
                       {i < cards.length - 1 && <span className="text-white/40 mx-2">vs</span>}
                    </React.Fragment>
                  ))}
               </motion.h1>

               <div className="hidden lg:block relative shrink-0">
                  <div className="w-48 h-32 bg-white/20 rounded-2xl rotate-12 absolute -top-4 -right-4 backdrop-blur-xl border border-white/20" />
                  <div className="w-48 h-32 bg-white/10 rounded-2xl -rotate-6 backdrop-blur-xl border border-white/20" />
                  <CreditCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/40" size={64} />
               </div>
            </div>
         </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 space-y-20">
         
         {/* Top Card Cards (Image 2 Middle) */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, i) => (
               <motion.div 
                 key={card.id}
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-[#111] border border-white/10 rounded-[2.5rem] p-6 space-y-8 flex flex-col hover:border-blue-400/30 transition-all group"
               >
                  <div className="flex flex-wrap gap-2">
                     <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[8px] font-black text-blue-400 uppercase tracking-widest">
                        <Plane size={10} /> Travel
                     </span>
                     <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[8px] font-black text-purple-400 uppercase tracking-widest">
                        <Award size={10} /> Premium
                     </span>
                  </div>

                  <div className="space-y-4">
                     <div className="aspect-[1.6/1] rounded-2xl overflow-hidden shadow-2xl bg-white/5 border border-white/5 transform group-hover:scale-[1.02] transition-transform duration-700">
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
                     <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Highlights</h4>
                     <ul className="space-y-3">
                        {card.benefits?.slice(0, 5).map((benefit, j) => (
                           <li key={j} className="flex items-start gap-3">
                              <Check size={14} className="text-[#34d399] mt-0.5 shrink-0" />
                              <span className="text-xs text-white/70 leading-relaxed">{benefit}</span>
                           </li>
                        ))}
                     </ul>
                  </div>

                  <Link to={`/cards/${card.slug || card.id}`} className="w-full bg-blue-600 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/10">
                     Read Full Review <ChevronRight size={14} />
                  </Link>
               </motion.div>
            ))}
         </div>

         {/* Fees & Charges Section (Image 2 Bottom) */}
         <section className="space-y-8">
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
                        <div className="flex justify-between items-end border-b border-white/5 pb-4">
                           <div className="space-y-1">
                              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Forex Markup</span>
                              <p className="text-lg font-bold text-blue-400 leading-none">2%</p>
                           </div>
                           <span className="text-[8px] font-bold text-white/20 uppercase">International</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* Rewards Program (Image 3 Top) */}
         <section className="space-y-8">
            <div className="flex items-center gap-4">
               <h2 className="text-2xl font-heading font-black text-white uppercase tracking-tight">Rewards Program</h2>
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

                     <div className="space-y-6 flex-1">
                        <div className="space-y-4">
                           <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Earning Rates</span>
                           <div className="space-y-2">
                              {[
                                 { label: 'Travel', val: '2% - 5%' },
                                 { label: 'Dining', val: '2.5%' },
                                 { label: 'Others', val: '1.5%' }
                              ].map((row, idx) => (
                                 <div key={idx} className="flex justify-between items-center py-2 border-b border-white/[0.03]">
                                    <span className="text-xs text-white/60">{row.label}</span>
                                    <span className="text-xs font-black text-white">{row.val}</span>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-4 pt-4">
                           <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Milestones</span>
                           <div className="space-y-3">
                              {['₹1.5L Spend: 1k Bonus', '₹3L Spend: 2.5k Bonus', '₹6L Spend: Annual Waiver'].map((m, idx) => (
                                 <div key={idx} className="flex items-start gap-3">
                                    <div className="w-4 h-4 rounded bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                       <Check size={10} className="text-blue-400" />
                                    </div>
                                    <span className="text-[11px] text-white/60 leading-tight">{m}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* Quick Comparison Table (Image 4) */}
         <section className="space-y-10 pt-10">
            <div className="text-center space-y-2">
               <h2 className="text-3xl font-heading font-black text-white uppercase tracking-tight">Quick Comparison</h2>
               <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Feature Grid Overview</p>
            </div>

            <div className="bg-[#111] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
               <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                           <th className="p-8 text-[11px] font-black text-white/40 uppercase tracking-widest w-64">Feature</th>
                           {cards.map(card => (
                              <th key={card.id} className="p-8 text-[11px] font-black text-white uppercase tracking-widest text-center min-w-[240px]">
                                 {card.name}
                              </th>
                           ))}
                           {Array.from({ length: 3 - cards.length }).map((_, i) => (
                              <th key={i} className="p-8 min-w-[240px]" />
                           ))}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {[
                           { label: 'Annual Fee', key: 'annual_fee' },
                           { label: 'Joining Fee', key: 'joining_fee' },
                           { label: 'Reward Rate', val: '2% → 36%' },
                           { label: 'Intro Offers', key: 'best_for' },
                           { label: 'Lounge Access', val: 'Domestic: 12/yr | Intl: Unlimited' },
                           { label: 'Milestone Bonus', val: 'Up to ₹25,000 yearly benefits' }
                        ].map((row, idx) => (
                           <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-8 border-r border-white/5">
                                 <span className="text-xs font-black text-white uppercase tracking-wider">{row.label}</span>
                              </td>
                              {cards.map(card => (
                                 <td key={card.id} className="p-8 text-center border-r border-white/5 last:border-r-0">
                                    <span className="text-sm font-bold text-white/60">
                                       {row.key ? (card as any)[row.key] : row.val}
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

         {/* Insight Section */}
         <section className="bg-gradient-to-r from-blue-600/10 to-transparent border border-white/5 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12">
            <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl shadow-blue-600/40 transform -rotate-12">
               <Sparkles size={40} className="text-white" />
            </div>
            <div className="space-y-4">
               <h2 className="text-2xl md:text-3xl font-heading font-black text-white uppercase tracking-tight">Intelligence Verdict</h2>
               <p className="text-white/40 text-sm max-w-2xl leading-relaxed">
                  Our Neural Engine evaluates cards based on real-world spending patterns. While rewards are primary, we also factor in <span className="text-blue-400">capping limits</span>, <span className="text-blue-400">redemption friction</span>, and <span className="text-blue-400">annual fee waiver viability</span>.
               </p>
            </div>
         </section>
      </div>
    </div>
  );
};

export default ComparisonDetail;
