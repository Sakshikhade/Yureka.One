import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    ArrowLeft, Share2, Star, CheckCircle2, 
    Zap, ExternalLink, ShieldCheck, CreditCard,
    ArrowRight, Clock, Sparkles, ChevronRight,
    TrendingUp, AlertCircle, Info, ChevronDown
} from 'lucide-react';
import { getCardBySlug } from '../services/supabaseService';
import { Card } from '../types';
import ImageWithLoader from './ImageWithLoader';
import { motion, AnimatePresence } from 'motion/react';
import SEO from './SEO';

const CardDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [card, setCard] = useState<Card | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        benefits: true,
        fees: true,
        details: true,
        proscons: true
    });

    useEffect(() => {
        if (!slug) return;
        const fetchCard = async () => {
            const data = await getCardBySlug(slug);
            setCard(data);
            setIsLoading(false);
        };
        fetchCard();
    }, [slug]);

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-sm font-bold uppercase tracking-widest text-slate-400">Analyzing Instrument...</div>
                </div>
            </div>
        );
    }

    if (!card) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Instrument Not Found</h1>
                <p className="text-slate-500 mb-8 max-w-md">The financial node you are looking for may have been delisted or archived.</p>
                <Link to="/cards" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg">
                    Return to Explorer
                </Link>
            </div>
        );
    }

    // Fallback data for empty fields
    const updatedOn = card.updated_on || new Date(card.updated_at || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const author = card.author || 'Yureka Research Team';
    
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
            <SEO 
                title={`${card.name} | Review & Analysis`}
                description={card.description || `Comprehensive review of ${card.name} by ${card.bank}. Analyze rewards, fees, and eligibility.`}
            />

            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/cards" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Back</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors"><Share2 size={18} /></button>
                        <a href={card.apply_link || "#"} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
                            Apply Now
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pt-12 md:pt-16">
                
                {/* 1. Main Header */}
                <header className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                        {card.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                        <div className="flex items-center gap-2">
                            <span>Updated On:</span>
                            <span className="text-blue-600">{updatedOn}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Published by:</span>
                            <span className="text-blue-600">{author}</span>
                        </div>
                    </div>
                </header>

                {/* 2. Intro Description */}
                <div className="prose prose-slate max-w-none mb-12">
                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                        {card.description || `The ${card.name} by ${card.bank} is a powerful ${card.type.toLowerCase()} tool designed for modern users. With an annual fee of ${card.annual_fee}, it offers a balanced approach to rewards and benefits.`}
                    </p>
                    {card.verdict && (
                        <p className="text-lg text-slate-600 leading-relaxed font-medium mt-4">
                            {card.verdict}
                        </p>
                    )}
                </div>

                {/* 3. Summary Card (Main Card Widget) */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-100 overflow-hidden mb-16">
                    <div className="p-8 md:p-10 border-b border-slate-100 flex flex-wrap items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-extrabold text-slate-900">{card.name}</h2>
                            <div className="flex items-center gap-3">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill={i < Math.floor(card.rating || 4.5) ? "currentColor" : "none"} />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-slate-400">( {card.rating || '4.8'} / 5 )</span>
                            </div>
                        </div>
                        <a href={card.apply_link || "#"} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-3 group">
                            Apply Now <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        {/* Card Image */}
                        <div className="lg:col-span-4 flex justify-center">
                            <div className="w-full max-w-[340px] aspect-[1.58/1] rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-100">
                                <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                            </div>
                        </div>

                        {/* Summary Details Table */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="grid grid-cols-2 gap-y-4">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600/60">Joining Fee</span>
                                <span className="text-[13px] font-bold text-slate-900 text-right">₹{String(card.joining_fee || card.annual_fee).replace(/[^0-9,]/g, '')} + GST</span>
                                
                                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600/60">Annual Fee</span>
                                <span className="text-[13px] font-bold text-slate-900 text-right">₹{String(card.annual_fee).replace(/[^0-9,]/g, '')} + GST</span>
                                
                                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600/60">Best Suited For</span>
                                <span className="text-[13px] font-bold text-slate-900 text-right">{card.best_for}</span>
                                
                                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600/60">Reward Type</span>
                                <span className="text-[13px] font-bold text-slate-900 text-right">{card.reward_type || card.type}</span>
                            </div>
                        </div>

                        {/* Summary Rewards Column */}
                        <div className="lg:col-span-4 space-y-8 pl-0 lg:pl-12 lg:border-l border-slate-100">
                            <div className="space-y-2">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-blue-600">Rewards Rate</h4>
                                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                    {card.rewards_rate || "Accelerated reward structure across key merchant categories and travel spend."}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-blue-600">Welcome Benefits</h4>
                                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                    {card.welcome_benefits || "Premium vouchers and membership activation upon fee payment."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Rewards and Benefits Grid Section */}
                <div className="mb-8 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                    <button 
                        onClick={() => toggleSection('benefits')}
                        className="w-full px-8 py-6 bg-slate-50 flex items-center justify-between group"
                    >
                        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Rewards and Benefits</h3>
                        <ChevronRight className={`text-slate-400 transition-transform duration-300 ${openSections.benefits ? 'rotate-90' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {openSections.benefits && (
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden bg-white"
                            >
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                    {(card.grid_benefits || [
                                        { title: 'Movie & Dining', value: 'Accelerated savings on entertainment platforms and partner restaurants.' },
                                        { title: 'Rewards Rate', value: card.rewards_rate || 'Standard base rewards with 5X boosters on select partners.' },
                                        { title: 'Reward Redemption', value: 'Flexible redemption via portal for travel or direct statement credit.' },
                                        { title: 'Travel', value: 'Complimentary access to premium travel networks.' },
                                        { title: 'Lounge Access', value: 'Domestic and International lounge protocols included.' },
                                        { title: 'Insurance Benefits', value: 'Comprehensive air accident and fraud liability cover.' }
                                    ]).map((benefit, i) => (
                                        <div key={i} className="space-y-1.5">
                                            <h4 className="text-sm font-bold text-blue-600">{benefit.title}</h4>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{benefit.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 5. Fees & Charges Section */}
                <div className="mb-16 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                    <button 
                        onClick={() => toggleSection('fees')}
                        className="w-full px-8 py-6 bg-slate-50 flex items-center justify-between group"
                    >
                        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Fees & Charges</h3>
                        <ChevronRight className={`text-slate-400 transition-transform duration-300 ${openSections.fees ? 'rotate-90' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {openSections.fees && (
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden bg-white"
                            >
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
                                    {(card.grid_fees || [
                                        { title: 'Spend-Based Waiver', value: `Annual fee waived on spends exceeding ${card.projected_savings || '₹1,00,000'} per year.` },
                                        { title: 'Rewards Redemption Fee', value: '₹99 + GST per redemption request.' },
                                        { title: 'Foreign Currency Markup', value: '3.5% + GST on international transactions.' },
                                        { title: 'Fuel Surcharge Waiver', value: '1% waiver on transactions between ₹400 and ₹5,000.' },
                                        { title: 'Cash Advance Charges', value: '2.5% of the transaction amount (Min ₹500).' },
                                        { title: 'Interest Rates', value: '3.6% per month (43.2% Annually).' }
                                    ]).map((fee, i) => (
                                        <div key={i} className="space-y-1.5">
                                            <h4 className="text-sm font-bold text-blue-600">{fee.title}</h4>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{fee.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 6. Product Details (Bullets) */}
                <div className="mb-16 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                    <button 
                        onClick={() => toggleSection('details')}
                        className="w-full px-8 py-6 bg-slate-50 flex items-center justify-between group"
                    >
                        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Product Details</h3>
                        <ChevronRight className={`text-slate-400 transition-transform duration-300 ${openSections.details ? 'rotate-90' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {openSections.details && (
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden bg-white"
                            >
                                <div className="p-8">
                                    <ul className="space-y-4">
                                        {(card.product_details || [
                                            "Accelerated 5X points on top-tier online merchant categories.",
                                            "Complimentary quarterly lounge access across major domestic hubs.",
                                            "Annual fee waiver mechanism based on incremental spend milestones.",
                                            "Integration with digital payment stacks for seamless reward tracking.",
                                            "Exclusive access to partner-led fine dining and entertainment events."
                                        ]).map((detail, i) => (
                                            <li key={i} className="flex gap-4 text-sm text-slate-600 font-medium leading-relaxed">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0"></div>
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 7. Pros & Cons Section */}
                <div className="mb-24 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                    <button 
                        onClick={() => toggleSection('proscons')}
                        className="w-full px-8 py-6 bg-slate-50 flex items-center justify-between group"
                    >
                        <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Pros / Cons</h3>
                        <ChevronRight className={`text-slate-400 transition-transform duration-300 ${openSections.proscons ? 'rotate-90' : ''}`} />
                    </button>
                    <AnimatePresence>
                        {openSections.proscons && (
                            <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="overflow-hidden bg-white"
                            >
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {/* Pros */}
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-black uppercase tracking-widest text-emerald-600">Pros</h4>
                                        <ul className="space-y-4">
                                            {(card.pros || [
                                                "Excellent rewards on online shopping and dining.",
                                                "Easy to achieve annual fee waiver.",
                                                "Modern app integration for instant redemptions."
                                            ]).map((pro, i) => (
                                                <li key={i} className="flex gap-4 text-sm text-slate-600 font-medium leading-relaxed">
                                                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                    </div>
                                                    {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {/* Cons */}
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-black uppercase tracking-widest text-rose-600">Cons</h4>
                                        <ul className="space-y-4">
                                            {(card.cons || [
                                                "Limited lounge access frequency compared to elite cards.",
                                                "High interest rates on revolving credit.",
                                                "Reward points capped on specific merchant categories."
                                            ]).map((con, i) => (
                                                <li key={i} className="flex gap-4 text-sm text-slate-600 font-medium leading-relaxed">
                                                    <div className="w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                                                    </div>
                                                    {con}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 8. Detailed Features & Benefits Section (Subheaded) */}
                <section className="mb-24">
                    <div className="pl-4 border-l-4 border-blue-600 mb-12">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {card.name} Features and Benefits
                        </h2>
                    </div>
                    
                    <div className="space-y-12">
                        {(card.detailed_features || [
                            { title: 'Welcome Benefits', content: 'Receive premium activation vouchers and membership tiers upon successful payment of joining fees and first transaction.' },
                            { title: 'Dining Benefits', content: 'Enjoy up to 20% savings at partner restaurants through the dedicated lifestyle concierge platform.' },
                            { title: 'Quarterly Spend Benefit', content: 'Unlock milestone rewards including travel vouchers worth ₹1,000 for every ₹1 Lakh spent in a calendar quarter.' },
                            { title: 'Fuel Surcharge Waiver', content: 'Maximize savings at all petrol stations with a 1% waiver capped at ₹250 per statement cycle.' }
                        ]).map((feature, i) => (
                            <div key={i} className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                                <p className="text-base text-slate-500 font-medium leading-relaxed">
                                    {feature.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 9. Redemption Table Section */}
                <section className="mb-24">
                    <div className="pl-4 border-l-4 border-blue-600 mb-12">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Reward Point Redemption Value
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                        <div className="bg-blue-600 px-6 py-4 text-center">
                            <span className="text-[11px] font-bold text-white uppercase tracking-widest">Value of Points on Redemption</span>
                        </div>
                        <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-100">
                            {['Product Catalog', 'Travel / Hotel', 'Cashback', 'Airmiles'].map(h => (
                                <div key={h} className="p-4 text-center border-r border-slate-100 last:border-r-0">
                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{h}</span>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-4 bg-white">
                            {(card.redemption_table || [
                                { category: 'Catalog', value: '₹0.25' },
                                { category: 'Travel', value: '₹0.30' },
                                { category: 'Cash', value: '₹1.00' },
                                { category: 'Miles', value: '0.30 Miles' }
                            ]).map((r, i) => (
                                <div key={i} className="p-6 text-center border-r border-slate-100 last:border-r-0">
                                    <span className="text-sm font-bold text-slate-900">{r.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mt-8 space-y-4">
                        <ul className="space-y-2">
                             {(card.exclusions || [
                                "A minimum of 500 Reward Points are required for redemption against statement balance.",
                                "Points are valid for a maximum of 2 years from date of accrual.",
                                "A nominal fee of ₹99 is applicable on every redemption request."
                             ]).map((ex, i) => (
                                 <li key={i} className="flex gap-3 text-sm text-slate-400 font-medium leading-relaxed">
                                     <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-2 shrink-0"></div>
                                     {ex}
                                 </li>
                             ))}
                        </ul>
                    </div>
                </section>

                {/* 10. Eligibility Section */}
                <section className="mb-24">
                    <div className="pl-4 border-l-4 border-blue-600 mb-12">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Eligibility Criteria
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                        <div className="grid grid-cols-3 bg-blue-600">
                            <div className="p-4 border-r border-white/10 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Criteria</span>
                            </div>
                            <div className="p-4 border-r border-white/10 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Salaried</span>
                            </div>
                            <div className="p-4 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Self-Employed</span>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {(card.eligibility_criteria || [
                                { criteria: 'Age', salaried: '21 – 60 Years', self_employed: '21 – 65 Years' },
                                { criteria: 'Income', salaried: '₹25,000 / Month', self_employed: '₹6,00,000 / Annum' }
                            ]).map((e, i) => (
                                <div key={i} className="grid grid-cols-3 bg-white">
                                    <div className="p-6 text-center border-r border-slate-100 bg-slate-50/50">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{e.criteria}</span>
                                    </div>
                                    <div className="p-6 text-center border-r border-slate-100">
                                        <span className="text-sm font-bold text-slate-900">{e.salaried}</span>
                                    </div>
                                    <div className="p-6 text-center">
                                        <span className="text-sm font-bold text-slate-900">{e.self_employed}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 11. Final Review Section */}
                <section className="mb-16">
                     <div className="pl-4 border-l-4 border-blue-600 mb-12">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            The Final Verdict
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-100 aspect-video relative group">
                            <img 
                                src={card.final_review_image || card.image} 
                                alt="Final Review" 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                        </div>
                        <div className="space-y-8">
                            <p className="text-lg text-slate-500 font-medium leading-relaxed italic">
                                {card.final_verdict_text || `The ${card.name} stands as a definitive instrument for high-yield rewards. After rigorous audit, Yureka classifies this as a "Tier-1" asset for lifestyle optimization.`}
                            </p>
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-full border-4 border-blue-100 overflow-hidden">
                                    <img src="https://i.pravatar.cc/150?u=yureka" alt="Chief Analyst" />
                                </div>
                                <div>
                                    <p className="text-sm font-black uppercase tracking-widest text-slate-900">Rajat Gaur</p>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">Chief Investment Analyst</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Footer */}
                <div className="mt-32 p-12 bg-slate-900 rounded-[3rem] text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full"></div>
                    <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none uppercase">
                            Ready to <br /> <span className="text-blue-500 italic font-thin serif">Optimize?</span>
                        </h2>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-[0.3em] leading-relaxed">
                            Deploy the RewardX engine to unlock hidden yield paths for this instrument.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                            <a href={card.apply_link || "#"} className="bg-blue-600 text-white px-12 py-5 rounded-full font-bold text-xs uppercase tracking-[0.3em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/20">
                                Apply Now
                            </a>
                            <button className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-full font-bold text-xs uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
                                Request Demo
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CardDetail;
CardDetail;
