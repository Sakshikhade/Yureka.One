import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Share2, MessageSquareShare, Star, CheckCircle2, 
    Zap, Info, ExternalLink, ShieldCheck, CreditCard, Landmark,
    ArrowRight, Bookmark, Clock, Sparkles, Percent, Armchair,
    Hotel, Plane, ShoppingBag, Smartphone
} from 'lucide-react';
import { getCardBySlug } from '../services/supabaseService';
import { Card } from '../types';
import ImageWithLoader from './ImageWithLoader';
import { motion, AnimatePresence } from 'motion/react';
import SEO from './SEO';

const CardDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [card, setCard] = useState<Card | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        const fetchCard = async () => {
            const data = await getCardBySlug(slug);
            setCard(data);
            setIsLoading(false);
        };
        fetchCard();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="text-clay"
                    >
                        <Landmark size={48} />
                    </motion.div>
                    <p className="text-[10px] font-bold text-ink/30 uppercase tracking-[0.5em] animate-pulse">Decrypting instrument protocol...</p>
                </div>
            </div>
        );
    }

    if (!card) {
        return (
            <div className="min-h-screen bg-[#FDFCF9] flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl md:text-6xl font-serif text-ink mb-6 uppercase tracking-tighter">Instrument <br /><span className="italic font-light text-ink/30">not found</span></h1>
                <Link to="/cards" className="text-clay font-bold uppercase tracking-[0.4em] text-[10px] border-b border-clay/30 pb-1">
                    Return to Archives
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCF9] font-serif selection:bg-clay selection:text-white pb-32">
            <SEO 
                title={`${card.name} | Archives | Yureka`}
                description={card.description || `Detailed analysis of the ${card.name} by ${card.bank || card.issuer}.`}
            />

            {/* ── Fixed Editorial Navbar ── */}
            <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#FDFCF9]/80 backdrop-blur-xl border-b border-ink/5">
                <div className="max-w-[1700px] mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <button 
                            onClick={() => navigate('/cards')}
                            className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white border border-ink/10 rounded-full hover:border-clay/30 transition-all group"
                        >
                            <ArrowLeft size={20} className="text-ink group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div className="hidden md:block">
                            <p className="text-[9px] font-bold text-ink/20 uppercase tracking-[0.4em] mb-1">Source Repository</p>
                            <Link to="/" className="text-sm font-heading font-black tracking-tighter text-ink uppercase">
                                YUREKA<span className="text-clay">.</span>MONEY
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="hidden md:flex items-center gap-2 px-6 h-14 text-ink/40 hover:text-ink text-[10px] font-bold uppercase tracking-widest transition-colors">
                            <Share2 size={14} /> Share Archive
                        </button>
                        {card.apply_link && (
                            <a href={card.apply_link} target="_blank" rel="noopener noreferrer" className="px-8 md:px-12 h-12 md:h-14 bg-ink text-white rounded-full flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-clay transition-colors group">
                                Apply Now <ArrowRight size={14} className="ml-3 group-hover:translate-x-1 transition-transform" />
                            </a>
                        )}
                    </div>
                </div>
            </nav>

            {/* ── Main Detail Content ── */}
            <main className="max-w-[1700px] mx-auto px-6 pt-32 md:pt-48">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
                    
                    {/* Left Column: Fixed Info Pane */}
                    <div className="lg:col-span-5 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative aspect-[1.58/1] rounded-[3rem] overflow-hidden bg-white shadow-2xl border border-ink/5 p-12 md:p-16 flex items-center justify-center"
                        >
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                            <ImageWithLoader 
                                src={card.image} 
                                alt={card.name} 
                                className="w-full h-full object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.25)]"
                            />
                        </motion.div>

                        <div className="grid grid-cols-2 gap-8 pt-8">
                             <div className="space-y-1">
                                <p className="text-[10px] font-bold text-ink/20 uppercase tracking-[0.4em]">Introductory Yield</p>
                                <p className="text-xl md:text-2xl font-serif italic text-ink tracking-tight">{card.intro_offer || 'Premium Access'}</p>
                             </div>
                             <div className="space-y-1">
                                <p className="text-[10px] font-bold text-ink/20 uppercase tracking-[0.4em]">Annual Portfolio Fee</p>
                                <p className="text-xl md:text-2xl font-serif italic text-ink tracking-tight">₹{card.annual_fee?.replace(/[^0-9]/g, '') || '0'}</p>
                             </div>
                        </div>

                        <div className="p-8 md:p-10 bg-white border border-ink/5 rounded-[2.5rem] shadow-sm space-y-8">
                            <h3 className="text-[11px] font-bold text-ink uppercase tracking-[0.4em] border-b border-ink/5 pb-6">Neural Compatibility</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Reward Structure</span>
                                    <span className="text-lg font-serif italic text-ink">{card.rewards_rate || 'Peak-Tier'}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Best For</span>
                                    <span className="text-lg font-serif italic text-ink">{card.best_for || 'Elite Lifestyles'}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">Rating Tier</span>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-0.5">
                                            {[1,2,3,4,5].map(i => <Star key={i} size={10} className={`${i <= (card.rating || 4) ? 'fill-clay text-clay' : 'fill-ink/5 text-ink/5'}`} />)}
                                        </div>
                                        <span className="text-lg font-serif italic text-ink">{card.rating?.toFixed(1) || '4.5'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Scrolling Detail */}
                    <div className="lg:col-span-7 space-y-20 md:space-y-32">
                        
                        {/* Heading Section */}
                        <motion.section 
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-clay rounded-full" />
                                <span className="text-[11px] font-bold text-clay uppercase tracking-[0.5em]">{card.issuer || card.bank}</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-ink leading-[0.85] tracking-tighter uppercase">
                                {card.name.split(' ').slice(0, 2).join(' ')}<br />
                                <span className="italic font-light text-ink/40">{card.name.split(' ').slice(2).join(' ')}</span>
                            </h1>
                            <p className="text-lg md:text-2xl font-serif italic text-ink/50 leading-relaxed max-w-2xl border-l-2 border-ink/5 pl-8">
                                {card.description || `A detailed performance analysis of the ${card.name} within our rewards transfer matrix.`}
                            </p>
                        </motion.section>

                        {/* Benefits Grid */}
                        <section className="space-y-12">
                            <h2 className="text-[11px] font-bold text-ink/20 uppercase tracking-[0.5em] flex items-center gap-4">
                                The Advantage <div className="h-px flex-1 bg-ink/5" />
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                                {(card.benefit_items || []).length > 0 ? card.benefit_items?.map((benefit, i) => (
                                    <div key={i} className="space-y-6 group">
                                        <div className="w-12 h-12 bg-cream border border-ink/5 rounded-2xl flex items-center justify-center group-hover:bg-ink group-hover:text-white transition-all duration-500">
                                            {i % 4 === 0 ? <Percent size={20} /> : i % 4 === 1 ? <Smartphone size={20} /> : i % 4 === 2 ? <Hotel size={20} /> : <Plane size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-bold text-ink/30 uppercase tracking-[0.3em] mb-2">{benefit.heading}</h4>
                                            <p className="text-2xl font-serif text-ink tracking-tight italic leading-tight">{benefit.subheading}</p>
                                        </div>
                                    </div>
                                )) : (card.benefits || []).map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-6 group">
                                        <div className="w-10 h-10 bg-cream rounded-xl flex items-center justify-center shrink-0 border border-ink/5 mt-1">
                                            <CheckCircle2 size={16} className="text-clay" />
                                        </div>
                                        <p className="text-xl font-serif italic text-ink leading-snug">{benefit}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* The Verdict Page Section */}
                        <section className="relative pt-20">
                             <div className="bg-[#1A1A2E] rounded-[3rem] md:rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
                                 {/* Grid Pattern */}
                                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                                 
                                 <div className="relative z-10 space-y-12">
                                     <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 rounded-full border border-white/10">
                                        <Sparkles size={14} className="text-clay" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-clay">Final Audit</span>
                                     </div>
                                     <h2 className="text-4xl md:text-6xl font-serif italic text-white/50 leading-none tracking-tighter uppercase">
                                        The <br /><span className="text-white font-normal not-italic">Verdict.</span>
                                     </h2>
                                     <div className="space-y-8">
                                         <p className="text-lg md:text-2xl font-serif italic text-white/70 leading-relaxed border-l-2 border-clay pl-8">
                                            "{card.verdict || `The analysis concludes that this instrument holds a unique position in the current market, specifically for portfolios focused on travel liquidity and lifestyle leverage.`}"
                                         </p>
                                         <div className="flex items-center gap-6 pt-6 opacity-40">
                                             <div className="flex -space-x-4">
                                                 {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1A1A2E] bg-white opacity-80" />)}
                                             </div>
                                             <span className="text-[10px] font-bold uppercase tracking-widest italic">Verified by Council 09.</span>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                        </section>

                    </div>
                </div>
            </main>

            {/* Redirection / Navigation Context Footer */}
            <section className="mt-48 px-6 md:px-12 lg:px-20 border-t border-ink/5 pt-32">
                <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                     <div className="max-w-xl text-center md:text-left">
                        <h3 className="text-3xl md:text-4xl font-serif text-ink tracking-tighter uppercase leading-[0.85] mb-6">
                            Continue <br /><span className="italic font-light text-ink/40">the exploration.</span>
                        </h3>
                        <p className="text-ink/50 font-serif italic text-lg lg:max-w-md">Our archives are live-updated. Discover another instrument that might offer higher neural yield.</p>
                     </div>
                     <div className="flex flex-col sm:flex-row gap-6">
                        <Link to="/cards" className="h-16 px-10 bg-white border border-ink/10 rounded-full flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-ink hover:text-white transition-all shadow-sm">
                            Card Archives
                        </Link>
                        <Link to="/rewards-calculator" className="h-16 px-10 bg-[#1A1A2E] text-white rounded-full flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-clay transition-all shadow-xl">
                            Audit Another Pair
                        </Link>
                     </div>
                </div>
            </section>
        </div>
    );
};

export default CardDetail;
