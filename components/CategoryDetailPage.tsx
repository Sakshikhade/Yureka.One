import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Sparkles, Star, Zap, Info, ChevronRight, 
  MessageSquare, ExternalLink, AlertCircle, Loader2
} from 'lucide-react';
import { getCards } from '../services/supabaseService';
import { Card } from '../types';
import SEO from './SEO';

const CATEGORY_META: Record<string, any> = {
  'travel': { name: 'Travel', icon: '✈️', color: 'from-blue-500/20', benefits: ['Rewards on flights and hotels', 'Airport lounge access', 'Free hotel nights', 'Complimentary food vouchers', 'Free room upgrades'] },
  'shopping': { name: 'Shopping', icon: '🛍️', color: 'from-pink-500/20', benefits: ['Online shopping cashback', 'Retail store discounts', 'Milestone gift vouchers', 'No-cost EMIs', 'Brand-specific perks'] },
  'cashback': { name: 'Cashback', icon: '💰', color: 'from-emerald-500/20', benefits: ['Direct statement credit', 'Unlimited base cashback', 'Accelerated online earnings', 'Utility bill savings', 'Minimal redemption fees'] },
  'fuel': { name: 'Fuel', icon: '⛽', color: 'from-amber-500/20', benefits: ['1% fuel surcharge waiver', 'Accelerated fuel points', 'Vehicle maintenance offers', 'Roadside assistance', 'Emission test vouchers'] },
  'lifetime-free': { name: 'Lifetime Free', icon: '🏷️', color: 'from-purple-500/20', benefits: ['Zero joining fees', 'Zero annual fees forever', 'Basic reward structure', 'Standard lounge access', 'Easy approval process'] },
  'premium': { name: 'Premium', icon: '⭐', color: 'from-yellow-500/20', benefits: ['24/7 Dedicated concierge', 'Elite hotel memberships', 'Highest reward multipliers', 'Golf course access', 'Global lounge programs'] }
};

const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const basePath = isDashboard ? '/dashboard' : '';
  
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const meta = CATEGORY_META[slug || ''] || { name: slug?.replace('-', ' '), icon: '💳', color: 'from-emerald-500/20', benefits: ['Optimized rewards', 'Curated benefits'] };

  useEffect(() => {
    const unsub = getCards((allCards) => {
      const filtered = allCards.filter(c => 
        c.category?.toLowerCase().includes(slug?.replace('-', ' ') || '') || 
        c.benefits?.some(b => b.toLowerCase().includes(slug?.replace('-', ' ') || ''))
      );
      setCards(filtered);
      setLoading(false);
    });
    return unsub;
  }, [slug]);

  return (
    <div className="min-h-screen bg-cream pb-20">
      <SEO 
        title={`${meta.name} Credit Cards | Best of ${new Date().getFullYear()}`} 
        description={`Compare the best ${meta.name} credit cards in India. Maximize your ${slug} rewards with our expert analysis.`}
      />

      {/* Dynamic Hero Section */}
      <section className={`relative pt-16 pb-20 px-6 overflow-hidden bg-gradient-to-b ${meta.color} to-transparent`}>
         <div className="max-w-7xl mx-auto relative z-10">
            <Link to={`${basePath}/categories`} className="inline-flex items-center gap-2 text-white/40 hover:text-clay transition-colors text-[10px] font-black uppercase tracking-[0.3em] mb-12 group">
               <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
               Back to Categories
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <span className="text-4xl md:text-6xl">{meta.icon}</span>
                     <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-6xl font-heading font-black text-white tracking-tighter uppercase"
                     >
                        {meta.name} <span className="text-white/20">Credit Cards</span>
                     </motion.h1>
                  </div>

                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Cards in this category help you:</p>
                     <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        {meta.benefits.map((benefit: string, i: number) => (
                           <li key={i} className="flex items-center gap-2 text-white/60 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-clay/40" />
                              {benefit}
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>

               {/* Stats Card */}
               <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 hidden lg:block min-w-[280px]">
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
                        <span>Analysis Status</span>
                        <span className="text-clay">Live</span>
                     </div>
                     <div className="text-3xl font-heading font-black text-white">{cards.length}</div>
                     <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">Verified cards matched for your <br />{meta.name} profile.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Cards Listing */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-clay" size={40} />
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Syncing Neural Data...</span>
          </div>
        ) : cards.length > 0 ? (
          <div className="space-y-6">
            {cards.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white/5/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-6 md:p-8 hover:border-clay/30 transition-all duration-700"
              >
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                  {/* Card Visual */}
                  <div className="w-full lg:w-72 shrink-0">
                    <div className="relative group/img overflow-hidden rounded-2xl shadow-2xl">
                      <img 
                        src={card.image} 
                        alt={card.name} 
                        className="w-full aspect-[1.6/1] object-cover transition-transform duration-700 group-hover/img:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-wrap items-center gap-2">
                       {/* Tags */}
                       {card.category && (
                         <div className="flex items-center gap-1.5 px-3 py-1 bg-clay/10 border border-clay/20 rounded-full">
                           <Zap size={10} className="text-clay" />
                           <span className="text-[8px] font-black text-clay uppercase tracking-widest">{card.category}</span>
                         </div>
                       )}
                       <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                         <Star size={10} className="text-amber-400 fill-amber-400" />
                         <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">{card.rating} / 5</span>
                       </div>
                    </div>

                    <div className="space-y-1">
                       <h2 className="text-2xl md:text-3xl font-heading font-black text-white uppercase tracking-tight">{card.name}</h2>
                       <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{card.bank}</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-white/5 rounded-3xl border border-white/5">
                       <div className="space-y-1">
                          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Intro Offer</span>
                          <p className="text-[11px] font-bold text-white leading-tight">{card.best_for || 'Standard Rewards'}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Annual Fees</span>
                          <p className="text-[11px] font-bold text-white">{card.annual_fee}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Joining Fees</span>
                          <p className="text-[11px] font-bold text-white">{card.joining_fee}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Reward Rate</span>
                          <p className="text-[11px] font-black text-clay">{card.rewards_rate || 'Upto 5%'}</p>
                       </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="w-full lg:w-48 flex flex-col gap-3">
                    <Link to={`${basePath}/cards/${card.slug || card.id}`} className="w-full bg-clay text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                       Read More <ExternalLink size={14} />
                    </Link>
                    <Link to="/yureka-ai" className="w-full bg-white/5 text-white/60 hover:text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 transition-all group">
                       <Sparkles size={14} className="group-hover:text-clay transition-colors" />
                       Ask AI
                    </Link>
                    <button className="text-[8px] font-bold text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors text-center pt-2">
                       Report data issue
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/5 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center space-y-6">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                <AlertCircle size={32} className="text-white/20" />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-heading font-black text-white uppercase">Neural Gap Detected</h3>
                <p className="text-white/40 max-w-sm mx-auto text-sm">We currently don't have enough verified cards for this category. Our engine is actively auditing new products.</p>
             </div>
             <Link to={`${basePath}/categories`} className="text-clay text-[10px] font-black uppercase tracking-widest hover:underline">
                Back to all categories
             </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryDetailPage;
