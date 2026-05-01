import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Check, X, Shield, Zap, Sparkles, Loader2, Star, Award, TrendingUp } from 'lucide-react';
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

  const features = [
    { label: 'Neural Score', key: 'rating', icon: Star },
    { label: 'Annual Fee', key: 'annual_fee', icon: Shield },
    { label: 'Joining Fee', key: 'joining_fee', icon: Award },
    { label: 'Reward Rate', key: 'rewards_rate', icon: Zap },
    { label: 'Best For', key: 'best_for', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32">
      <SEO 
        title={`Comparison: ${cards.map(c => c.name).join(' vs ')}`} 
        description="Side-by-side analysis of features, rewards, and eligibility."
      />

      {/* Header */}
      <section className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
           <Link to="/compare" className="inline-flex items-center gap-2 text-white/40 hover:text-blue-400 transition-colors text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <ArrowLeft size={14} /> Back to Selection
           </Link>
           
           <h1 className="text-3xl md:text-5xl font-heading font-black text-white tracking-tighter uppercase leading-none">
              Side-By-Side <br />
              <span className="text-blue-400">Neural Matchup</span>
           </h1>
        </div>
      </section>

      {/* Comparison Matrix */}
      <section className="max-w-7xl mx-auto px-6 overflow-x-auto custom-scrollbar">
         <div className="min-w-[800px] space-y-1">
            {/* Card Headers */}
            <div className="grid grid-cols-4 gap-4 mb-8">
               <div className="flex items-end pb-4">
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Feature Matrix</div>
               </div>
               {cards.map((card, i) => (
                  <motion.div 
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-4"
                  >
                     <div className="aspect-[1.6/1] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                        <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                     </div>
                     <div className="text-center space-y-1">
                        <h3 className="text-sm font-black text-white uppercase tracking-tight">{card.name}</h3>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{card.bank}</p>
                     </div>
                  </motion.div>
               ))}
               {/* Placeholder for empty 3rd slot if needed */}
               {Array.from({ length: 3 - cards.length }).map((_, i) => (
                  <div key={i} className="bg-white/5 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-[10px] font-black text-white/10 uppercase tracking-widest">
                     Slot {cards.length + i + 1} Empty
                  </div>
               ))}
            </div>

            {/* Feature Rows */}
            {features.map((feature, idx) => (
               <div key={idx} className="grid grid-cols-4 gap-4 py-8 border-b border-white/5 hover:bg-white/[0.02] transition-colors group px-4 rounded-xl">
                  <div className="flex items-center gap-3">
                     <feature.icon size={16} className="text-blue-400" />
                     <span className="text-[11px] font-black text-white uppercase tracking-wider">{feature.label}</span>
                  </div>
                  {cards.map((card) => (
                     <div key={card.id} className="flex items-center justify-center text-center">
                        <span className="text-sm font-bold text-white/60">
                           {feature.key === 'rating' ? (
                             <div className="flex items-center gap-1">
                                <Star size={14} className="fill-amber-400 text-amber-400" />
                                <span>{card.rating}</span>
                             </div>
                           ) : (card as any)[feature.key]}
                        </span>
                     </div>
                  ))}
                  {Array.from({ length: 3 - cards.length }).map((_, i) => (
                     <div key={i} />
                  ))}
               </div>
            ))}

            {/* Benefits Row */}
            <div className="grid grid-cols-4 gap-4 py-12 px-4">
               <div className="flex flex-col gap-2">
                  <div className="text-[11px] font-black text-white uppercase tracking-wider">Top Benefits</div>
                  <p className="text-[9px] text-white/20 uppercase font-bold tracking-widest leading-relaxed">Neural analysis of primary reward levers</p>
               </div>
               {cards.map((card) => (
                  <div key={card.id} className="space-y-4">
                     <div className="flex flex-col gap-2">
                        {card.benefits?.slice(0, 4).map((benefit, i) => (
                           <div key={i} className="flex items-start gap-2">
                              <div className="w-4 h-4 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                 <Check size={10} className="text-emerald-400" />
                              </div>
                              <span className="text-[11px] text-white/60 leading-tight">{benefit}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
               {Array.from({ length: 3 - cards.length }).map((_, i) => (
                  <div key={i} />
               ))}
            </div>

            {/* Actions Row */}
            <div className="grid grid-cols-4 gap-4 py-12 px-4">
               <div />
               {cards.map((card) => (
                  <div key={card.id} className="flex flex-col gap-3">
                     <Link to={`/cards/${card.slug || card.id}`} className="w-full bg-blue-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                        Card Details
                     </Link>
                     <Link to="/yureka-ai" className="w-full bg-white/5 border border-white/10 text-white/40 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all">
                        Consult AI
                     </Link>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Neural Insight Footer */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
         <div className="bg-gradient-to-r from-blue-600/10 to-transparent border border-white/5 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12">
            <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl shadow-blue-600/40 transform -rotate-12">
               <Sparkles size={40} className="text-white" />
            </div>
            <div className="space-y-4">
               <h2 className="text-2xl md:text-3xl font-heading font-black text-white uppercase tracking-tight">Intelligence Verdict</h2>
               <p className="text-white/40 text-sm max-w-2xl leading-relaxed">
                  Our Neural Engine evaluates cards based on real-world spending patterns. While rewards are primary, we also factor in <span className="text-blue-400">capping limits</span>, <span className="text-blue-400">redemption friction</span>, and <span className="text-blue-400">annual fee waiver viability</span>.
               </p>
            </div>
         </div>
      </section>
    </div>
  );
};

export default ComparisonDetail;
