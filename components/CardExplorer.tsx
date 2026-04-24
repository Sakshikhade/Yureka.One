import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowUpRight, Zap, ShieldCheck, Plane, Search, Filter as FilterIcon, 
    X, ChevronRight, Info, Star, MessageSquareShare, AlertCircle,
    ShoppingBag, Landmark, Coffee, Fuel, CreditCard, Hotel, Briefcase, 
    Armchair, GraduationCap, Popcorn, Smartphone, Heart, Home, GraduationCap as Education,
    ChevronDown, Check, ArrowRight, Calculator
} from 'lucide-react';
import ImageWithLoader from './ImageWithLoader';
import { getCards } from '../services/supabaseService';
import { Card } from '../types';
import { featuredCards } from '../data';
import { motion, AnimatePresence } from 'motion/react';

// --- CUSTOM 3D-STYLE CATEGORY ICON COMPONENT ---
const CategoryIcon = ({ type }: { type: string }) => {
    switch(type) {
        case 'Travel': return <Plane className="text-blue-500" size={32} />;
        case 'Shopping': return <ShoppingBag className="text-pink-500" size={32} />;
        case 'Cashback': return <Landmark className="text-purple-500" size={32} />;
        case 'Fuel': return <Fuel className="text-emerald-500" size={32} />;
        case 'Dining': return <Coffee className="text-red-500" size={32} />;
        case 'Business': return <Briefcase className="text-blue-500" size={32} />;
        case 'Lounge Access': return <Armchair className="text-teal-500" size={32} />;
        default: return <CreditCard className="text-gray-500" size={32} />;
    }
};

// ─── Shared master lists (synced with AdminDashboard) ───────────────────────
const ALL_BANKS = [
    'HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Yes Bank', 'RBL', 'Amex',
    'IndusInd', 'BOB', 'SC', 'Indian', 'PNB', 'IDFC', 'Canara', 'HSBC',
    'DBS', 'IDBI', 'AU', 'Equitas', 'CSB', 'Federal', 'SBM', 'South Indian',
    'Utkarsh Bank', 'Suryoday Bank', 'Union Bank', 'Unity SFB', 'DCB',
    'Bank Of India', 'J&K Bank', 'CUB', 'Slice SFB', 'Dhanlaxmi Bank', 'Indian Overseas Bank'
];

const ALL_CATEGORIES = [
    { name: 'Travel',            icon: <Plane /> },
    { name: 'Hotels',            icon: <Hotel /> },
    { name: 'Cashback',          icon: <Landmark /> },
    { name: 'Brand Voucher',     icon: <ShoppingBag /> },
    { name: 'Fuel',              icon: <Fuel /> },
    { name: 'Catalogue Products',icon: <Briefcase /> },
    { name: 'Travel Bookings',   icon: <Plane /> },
    { name: 'Brand Wallet',      icon: <CreditCard /> },
    { name: 'Experience',        icon: <Popcorn /> },
    { name: 'Shopping',          icon: <ShoppingBag /> },
    { name: 'Dining',            icon: <Coffee /> },
    { name: 'Lounge Access',     icon: <Armchair /> },
    { name: 'Lifetime Free',     icon: <CreditCard /> },
    { name: 'Business',          icon: <Briefcase /> },
    { name: 'UPI',               icon: <Smartphone /> },
];
// ─────────────────────────────────────────────────────────────────────────────

// Helper to generate a slug in case one isn't present
const generateSlug = (name: string, bank: string) => {
    return `${name}-${bank}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

const BANK_LOGOS: Record<string, string> = {
    'HDFC': '/assets/banks/hdfc.png',
    'SBI': '/assets/banks/sbi.png',
    'Axis': '/assets/banks/axis.png',
    'ICICI': '/assets/banks/icici.png',
    'Kotak': '/assets/banks/kotak.png',
    'Yes Bank': '/assets/banks/yesbank.png',
    'RBL': '/assets/banks/rbl.png',
    'Amex': '/assets/banks/amex.png',
    'IndusInd': '/assets/banks/indusind.png',
    'BOB': '/assets/banks/bob.png',
    'SC': '/assets/banks/sc.png',
    'Indian': '/assets/banks/indian.png',
    'PNB': '/assets/banks/pnb.png',
    'IDFC': '/assets/banks/idfc.png',
    'Canara': '/assets/banks/canara.png',
    'HSBC': '/assets/banks/hsbc.png',
    'DBS': '/assets/banks/dbs.png',
    'IDBI': '/assets/banks/idbi.png',
    'AU': '/assets/banks/au.png',
    'Equitas': '/assets/banks/equitas.png',
    'CSB': '/assets/banks/csb.png',
    'Federal': '/assets/banks/federal.png',
    'SBM': '/assets/banks/sbm.png',
    'South Indian': '/assets/banks/southindian.png',
    'Utkarsh Bank': '/assets/banks/utkarsh.png',
    'Suryoday Bank': '/assets/banks/suryoday.png',
    'Union Bank': '/assets/banks/union.png',
    'Unity SFB': '/assets/banks/unity.png',
    'DCB': '/assets/banks/dcb.png',
    'Bank Of India': '/assets/banks/boi.png',
    'J&K Bank': '/assets/banks/jk.png',
    'CUB': '/assets/banks/cub.png',
    'Slice SFB': '/assets/banks/slice.png',
    'Dhanlaxmi Bank': '/assets/banks/dhanlaxmi.png',
    'Indian Overseas Bank': '/assets/banks/iob.png'
};

import { useSupabase } from './SupabaseProvider';
import { SkeletonCard } from './SkeletonLoaders';

const CardExplorer: React.FC = () => {
    const { cards: cardsList, isLoading } = useSupabase();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [cardType, setCardType] = useState('All Types');
    const [isBankMenuOpen, setIsBankMenuOpen] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState<'featured' | 'rewards' | 'fees' | 'rating'>('featured');

    const filteredCards = useMemo(() => {
        let result = cardsList.filter(card => {
            const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                card.issuer.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesBank = selectedBanks.length === 0 || selectedBanks.some(b => card.issuer.includes(b));
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(c => card.category?.includes(c));
            
            const matchesType = cardType === 'All Types' || (cardType === 'Premium' && card.annual_fee?.includes('₹')) || true;

            return matchesSearch && matchesBank && matchesCategory && matchesType;
        });

        switch(sortBy) {
            case 'rewards':
                return [...result].sort((a, b) => {
                    const aRate = parseFloat(a.rewards_rate?.replace(/[^0-9.]/g, '') || '0');
                    const bRate = parseFloat(b.rewards_rate?.replace(/[^0-9.]/g, '') || '0');
                    return bRate - aRate;
                });
            case 'fees':
                return [...result].sort((a, b) => {
                    const aFee = parseFloat(a.annual_fee?.replace(/[^0-9.]/g, '') || '0');
                    const bFee = parseFloat(b.annual_fee?.replace(/[^0-9.]/g, '') || '0');
                    return aFee - bFee;
                });
            case 'rating':
                return [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
            default:
                return result;
        }
    }, [cardsList, searchQuery, selectedBanks, selectedCategories, cardType, sortBy]);

    const toggleBank = (bank: string) => {
        if (bank === 'All Banks') {
            setSelectedBanks([]);
        } else {
            setSelectedBanks(prev => prev.includes(bank) ? prev.filter(b => b !== bank) : [...prev, bank]);
        }
    };

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    };

    if (isLoading && cardsList.length === 0) {
        return (
            <div className="min-h-screen bg-cream pt-32 px-6">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F2EFE9] pb-20 overflow-x-hidden font-sans">
            
            {/* ─── HERO SECTION ─── */}
            <div className="relative pt-20 pb-32 md:pt-32 md:pb-48 bg-cream overflow-hidden border-b border-ink/5">
                {/* Interlocking Pattern Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                    style={{ 
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c0-16.569-13.431-30-30-30v60c16.569 0 30-13.431 30-30zm0 0c0 16.569 13.431 30 30 30V0c-16.569 0-30 13.431-30 30z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px' 
                    }} 
                />
                
                <div className="max-w-[1440px] mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-heading font-black text-[#242424] tracking-tight mb-6 leading-none">
                            Start your <br className="md:hidden" /> <span className="text-[#047857] italic serif font-light">search</span> here
                        </h1>
                        <p className="text-[#242424]/60 text-base md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-12 md:mb-16 px-4">
                            Choose your preferences and spend habits to see the <br className="hidden md:block" /> absolute best credit instruments available.
                        </p>
                    </motion.div>

                    {/* ─── HORIZONTAL FILTER BAR ─── */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="max-w-5xl mx-auto"
                    >
                        <div className="bg-[#242424] rounded-[2rem] md:rounded-full p-4 md:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-2 shadow-2xl relative">
                            {/* Bank Selection (Custom Dropdown) */}
                            <div className="flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-cream/10 text-left relative group">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream/40 mb-1 block">Bank / Issuer</label>
                                <button 
                                    onClick={() => setIsBankMenuOpen(!isBankMenuOpen)}
                                    className="flex items-center justify-between w-full text-cream font-bold text-left outline-none"
                                >
                                    <span className="truncate">
                                        {selectedBanks.length === 0 ? 'All Banks' : 
                                         selectedBanks.length === 1 ? selectedBanks[0] : 
                                         `${selectedBanks.length} Selected`}
                                    </span>
                                    <ChevronDown className={`text-cream/20 transition-transform duration-300 ${isBankMenuOpen ? 'rotate-180' : ''}`} size={16} />
                                </button>

                                {/* Premium Bank Dropdown Popover */}
                                <AnimatePresence>
                                    {isBankMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setIsBankMenuOpen(false)} />
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute top-full left-0 mt-4 w-72 bg-cream rounded-3xl shadow-2xl overflow-hidden z-50 border border-ink/5"
                                            >
                                                <div className="max-h-80 overflow-y-auto p-2 no-scrollbar">
                                                    <button 
                                                        onClick={() => { setSelectedBanks([]); setIsBankMenuOpen(false); }}
                                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${selectedBanks.length === 0 ? 'bg-[#047857]/5 text-[#047857]' : 'text-[#242424]/60 hover:bg-[#242424]/5'}`}
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-[#242424]/5 flex items-center justify-center">
                                                            <Landmark size={14} />
                                                        </div>
                                                        <span className="text-xs font-bold uppercase tracking-widest">All Banks</span>
                                                        {selectedBanks.length === 0 && <Check size={14} className="ml-auto" />}
                                                    </button>
                                                    
                                                    {ALL_BANKS.map(bank => {
                                                        const isSelected = selectedBanks.includes(bank);
                                                        return (
                                                            <button 
                                                                key={bank}
                                                                onClick={() => toggleBank(bank)}
                                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${isSelected ? 'bg-[#047857]/5 text-[#047857]' : 'text-[#242424]/60 hover:bg-[#242424]/5'}`}
                                                            >
                                                                <div className="w-8 h-8 rounded-full bg-cream border border-ink/5 overflow-hidden flex items-center justify-center p-1">
                                                                    {BANK_LOGOS[bank] ? (
                                                                        <img src={BANK_LOGOS[bank]} alt={bank} className="w-full h-full object-contain" />
                                                                    ) : (
                                                                        <span className="font-bold text-[10px] text-[#047857]/40">{bank[0]}</span>
                                                                    )}
                                                                </div>
                                                                <span className="text-xs font-bold uppercase tracking-widest">{bank}</span>
                                                                {isSelected && <Check size={14} className="ml-auto" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Reward Category */}
                            <div className="flex-1 px-6 py-3 border-b md:border-b-0 md:border-r border-cream/10 text-left relative group">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream/40 mb-1 block">Category</label>
                                <select 
                                    value={selectedCategories[0] || 'All Categories'}
                                    onChange={(e) => setSelectedCategories(e.target.value === 'All Categories' ? [] : [e.target.value])}
                                    className="bg-transparent text-cream font-bold appearance-none outline-none w-full cursor-pointer pr-8"
                                >
                                    <option className="bg-[#242424]">All Categories</option>
                                    {ALL_CATEGORIES.map(cat => (
                                        <option key={cat.name} className="bg-[#242424]">{cat.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-cream/20 pointer-events-none" size={16} />
                            </div>

                            {/* Card Type */}
                            <div className="flex-1 px-6 py-3 text-left relative group">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream/40 mb-1 block">Card Type</label>
                                <select 
                                    value={cardType}
                                    onChange={(e) => setCardType(e.target.value)}
                                    className="bg-transparent text-cream font-bold appearance-none outline-none w-full cursor-pointer pr-8"
                                >
                                    <option className="bg-[#242424]">All Types</option>
                                    <option className="bg-[#242424]">Premium</option>
                                    <option className="bg-[#242424]">Lifestyle</option>
                                    <option className="bg-[#242424]">Entry-level</option>
                                </select>
                                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-cream/20 pointer-events-none" size={16} />
                            </div>

                            {/* Toggles Mobile Hidden */}
                            <div className="hidden lg:flex items-center gap-3 px-6 shrink-0">
                                <div className="flex items-center gap-3 bg-cream/10 px-5 py-3 rounded-full border border-cream/5">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-cream/80">LTF Only</span>
                                    <div className="w-8 h-4 bg-cream/10 rounded-full relative">
                                        <div className="absolute left-1 top-1 w-2 h-2 bg-cream rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Integration Banner (Flenting vs Renting Style) */}
                        <div className="mt-8">
                             <div className="max-w-2xl mx-auto bg-cream border border-ink/10 rounded-3xl p-4 md:px-8 md:py-5 flex items-center justify-between shadow-lg group hover:border-clay/30 transition-all cursor-pointer">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                                        <Calculator className="text-emerald-500" size={24} />
                                    </div>
                                    <div className="text-left flex-1 min-w-0">
                                        <h4 className="text-lg sm:text-2xl font-heading font-black text-[#242424] leading-tight uppercase truncate">Yureka vs Standard</h4>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#242424]/40 truncate">Guaranteed rewards delta.</p>
                                    </div>
                                </div>
                                <button className="bg-[#242424] text-cream px-6 py-3 rounded-2xl text-[9px] font-bold uppercase tracking-[0.2em] shadow-xl group-hover:bg-[#047857] transition-all whitespace-nowrap">
                                    Calculate
                                </button>
                             </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ─── SEARCH & SORT CONTROLS ─── */}
            <div className="max-w-[1440px] mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                    <div className="relative w-full max-w-md group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#242424]/20 group-focus-within:text-[#047857] transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Quick search issuer or card..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-cream border border-ink/10 rounded-2xl outline-none focus:border-clay/30 transition-all text-lg shadow-sm"
                        />
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <span className="text-[11px] font-bold text-[#242424]/30 uppercase tracking-[0.3em]">Sort Archives:</span>
                        <div className="flex bg-cream p-1 rounded-2xl border border-ink/5 shadow-sm">
                            {(['featured', 'rewards', 'fees'] as const).map((s) => (
                                <button 
                                    key={s}
                                    onClick={() => setSortBy(s)}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${sortBy === s ? 'bg-[#242424] text-cream shadow-lg' : 'text-[#242424]/40 hover:text-[#242424]'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ─── CARD ARCHIVE GRID ─── */}
                <AnimatePresence mode="popLayout">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredCards.map((card, index) => {
                            const cardSlug = card.slug || generateSlug(card.name, card.issuer);
                            return (
                                <motion.div 
                                    key={card.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: index * 0.05 }}
                                    className="group relative"
                                >
                                    <div className="bg-cream rounded-[3rem] border border-ink/5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 h-full flex flex-col">
                                        
                                        {/* Card Visual Header */}
                                        <div className="relative p-6 pb-0">
                                            <div className="relative aspect-[1.6/1] rounded-[2rem] overflow-hidden shadow-2xl border border-ink/5 z-10 group-hover:scale-[1.03] transition-transform duration-700">
                                                <ImageWithLoader 
                                                    src={card.image} 
                                                    alt={card.name}
                                                    className="w-full h-full object-contain p-4 bg-slate-50"
                                                />
                                                {/* Location/Bank Tag */}
                                                <div className="absolute top-4 right-4 bg-paper/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-cream flex items-center gap-2 shadow-xl">
                                                    <div className="w-2 h-2 rounded-full bg-[#047857]" />
                                                    <span className="text-[10px] font-bold text-[#242424] uppercase tracking-wider">{card.issuer || 'Prime'}</span>
                                                </div>
                                            </div>
                                            {/* Decorative blob */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#047857]/5 blur-3xl -z-0 rounded-full" />
                                        </div>

                                        {/* Meta Information */}
                                        <div className="p-10 pt-8 flex-1 flex flex-col">
                                            <h3 className="text-3xl font-heading font-black text-[#242424] mb-4 group-hover:text-[#047857] transition-colors uppercase leading-[0.9] tracking-tighter">
                                                {card.name.length > 20 ? card.name.substring(0, 20) + '...' : card.name}
                                            </h3>
                                            
                                            <div className="flex items-center gap-2 mb-8">
                                                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full">
                                                    <Zap size={10} className="text-emerald-500" />
                                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Available Now</span>
                                                </div>
                                            </div>

                                            {/* Specs Grid */}
                                            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-auto pb-10 border-b border-ink/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#242424]/5 flex items-center justify-center text-[#242424]/30">
                                                        <ShieldCheck size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#242424]/40 leading-none mb-1">LTF Potential</p>
                                                        <p className="text-xs font-semibold text-[#242424]">Conditional</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#242424]/5 flex items-center justify-center text-[#242424]/30">
                                                        <Star size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#242424]/40 leading-none mb-1">Rating</p>
                                                        <p className="text-xs font-semibold text-[#242424]">{card.rating?.toFixed(1) || '4.2'} / 5.0</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#242424]/5 flex items-center justify-center text-[#242424]/30">
                                                        <Landmark size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#242424]/40 leading-none mb-1">Annual Fee</p>
                                                        <p className="text-xs font-semibold text-[#242424]">₹{String(card.annual_fee).replace(/[^0-9]/g, '')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#242424]/5 flex items-center justify-center text-[#242424]/30">
                                                        <ArrowUpRight size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#242424]/40 leading-none mb-1">Net Yield</p>
                                                        <p className="text-xs font-semibold text-[#242424]">{card.rewards_rate || 'Peak'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Yield Metric */}
                                            <div className="pt-8 flex items-end justify-between">
                                                <div>
                                                    <p className="text-[10px] font-bold text-[#242424]/40 uppercase tracking-[0.2em] mb-1">Expected Yield</p>
                                                    <p className="text-3xl font-heading font-black text-[#242424] tracking-tight">
                                                        ₹12,400 <span className="text-xs font-serif italic text-[#242424]/30 font-medium lowercase">/annual</span>
                                                    </p>
                                                </div>
                                                <Link to={`/cards/${cardSlug}`}>
                                                    <button className="w-14 h-14 bg-[#242424] text-cream rounded-[1.5rem] flex items-center justify-center hover:bg-[#047857] hover:scale-105 transition-all shadow-xl shadow-ink/10 cursor-pointer">
                                                        <ArrowRight size={24} />
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </AnimatePresence>

                {filteredCards.length === 0 && (
                    <div className="text-center py-48">
                        <AlertCircle size={64} className="text-[#242424]/5 mx-auto mb-8" />
                        <h2 className="text-4xl font-heading font-black text-[#242424]/20 uppercase tracking-tighter">No Instruments Found</h2>
                        <button 
                            onClick={() => { setSelectedBanks([]); setSelectedCategories([]); setSearchQuery(''); setMonthlySpend('Any Budget'); setCardType('All Types'); }}
                            className="mt-8 text-[#047857] font-bold uppercase tracking-[0.3em] text-[10px] hover:border-b border-clay pb-1 transition-all"
                        >Clear All Constraints</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardExplorer;
