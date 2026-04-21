import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowUpRight, Zap, ShieldCheck, Plane, Search, Filter as FilterIcon, 
    X, ChevronRight, Info, Star, MessageSquareShare, AlertCircle,
    ShoppingBag, Landmark, Coffee, Fuel, CreditCard, Hotel, Briefcase, 
    Armchair, GraduationCap, Popcorn, Smartphone, Heart, Home, GraduationCap as Education,
    ChevronDown, Check, ArrowRight
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
        case 'Fuel': return <Fuel className="text-orange-500" size={32} />;
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
    const { cards: cardsList, isLoading, syncStatus } = useSupabase();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [showAllBanks, setShowAllBanks] = useState(false);
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [showAllPillCategories, setShowAllPillCategories] = useState(false);
    const [sortBy, setSortBy] = useState<'featured' | 'rewards' | 'fees' | 'rating'>('featured');

    const BANKS_INITIAL_COUNT = 10;
    const CATEGORIES_INITIAL_COUNT = 6;
    const PILL_CATEGORIES_INITIAL_COUNT = 9;

    const categories = ALL_CATEGORIES;
    const banks = ALL_BANKS;
    const visibleBanks = showAllBanks ? banks : banks.slice(0, BANKS_INITIAL_COUNT);
    const visibleCategories = showAllCategories ? categories : categories.slice(0, CATEGORIES_INITIAL_COUNT);
    const visiblePillCategories = showAllPillCategories ? categories : categories.slice(0, PILL_CATEGORIES_INITIAL_COUNT);

    const filteredCards = useMemo(() => {
        let result = cardsList.filter(card => {
            const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                card.issuer.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesBank = selectedBanks.length === 0 || selectedBanks.some(b => card.issuer.includes(b));
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(c => card.category?.includes(c));
            return matchesSearch && matchesBank && matchesCategory;
        });

        // Sorting Logic
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
    }, [cardsList, searchQuery, selectedBanks, selectedCategories, sortBy]);

    const toggleBank = (bank: string) => {
        setSelectedBanks(prev => prev.includes(bank) ? prev.filter(b => b !== bank) : [...prev, bank]);
    };

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    };

    if (isLoading && cardsList.length === 0) {
        return (
            <div className="min-h-screen bg-white pt-32 px-6">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-3 space-y-8"><div className="h-96 bg-slate-50 rounded-3xl animate-pulse" /></div>
                    <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCF9] pt-0 pb-20 overflow-x-hidden font-sans">
            {/* --- PAGE HERO (NEW) --- */}
            <div className="max-w-[1440px] mx-auto px-6 pt-6 md:pt-12 pb-10 md:pb-16 border-b border-ink/10 mb-8 md:mb-12">
                <div className="flex flex-col lg:flex-row justify-between items-end gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 bg-clay rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-mono font-bold tracking-[0.5em] uppercase text-ink/40">The Curated Catalog</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-tight text-ink mb-4 md:mb-6">
                            Precision <br />
                            <span className="text-clay">Instruments</span>
                        </h1>
                        <p className="text-lg md:text-xl font-sans font-medium text-ink/60 max-w-2xl leading-relaxed">
                            Data-driven matching for the top 1% of Indian credit portfolios. We scan 200+ cards to optimize your financial yield.
                        </p>
                    </div>
                    <div className="w-full lg:w-auto flex flex-col gap-4 items-end">
                        <div className="relative group w-full lg:w-[400px]">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-clay/40 group-focus-within:text-clay transition-colors" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search our archives..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-16 pr-8 py-6 bg-white border-2 border-ink/5 rounded-3xl outline-none focus:border-clay/20 transition-all font-sans text-xl shadow-sm"
                            />
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-ink/30 px-6">
                            <span>Catalog Index: {cardsList.length} Entries</span>
                            <span className="opacity-20">•</span>
                            <span>Last Updated: Today</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- TOP CATEGORY GRID --- */}
            <div className="max-w-[1440px] mx-auto px-6 mb-12">
                <div className="flex gap-2 md:gap-4 overflow-x-auto no-scrollbar pb-2 md:pb-4 -mx-2 px-2">
                    {categories.map((cat, i) => {
                        const isSelected = selectedCategories.includes(cat.name);
                        return (
                            <button 
                                key={i}
                                onClick={() => toggleCategory(cat.name)}
                                className={`flex flex-col items-center justify-center min-w-[80px] md:min-w-[120px] p-3 md:p-6 bg-white rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 border-2 shrink-0 ${isSelected ? 'border-clay/30 bg-paper' : 'border-ink/5'}`}
                            >
                                <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-3 transition-all duration-500 shadow-inner ${isSelected ? 'bg-clay text-white rotate-6' : 'bg-cream text-clay/60'}`}>
                                    {React.cloneElement(cat.icon as React.ReactElement<any>, { size: 18 })}
                                </div>
                                <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider md:tracking-widest text-center leading-tight transition-colors ${isSelected ? 'text-ink' : 'text-ink/40'}`}>
                                    {cat.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- SIDEBAR FILTERS (SCREENSHOT 2 & 3) --- */}
                <div className="hidden lg:block lg:col-span-3 space-y-8 bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-ink/5 h-fit sticky top-32">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-heading font-black text-ink leading-none">Filter</h2>
                        <button 
                            onClick={() => { setSelectedBanks([]); setSelectedCategories([]); }}
                            className="text-clay text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2 bg-clay/5 rounded-full hover:bg-clay hover:text-white transition-all duration-300"
                        >Reset All</button>
                    </div>

                    {/* Bank Name Filter */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[11px] font-bold text-ink uppercase tracking-[0.3em]">Issuers</h3>

                            {selectedBanks.length > 0 && (
                                <button onClick={() => setSelectedBanks([])} className="text-[9px] font-bold text-clay uppercase tracking-widest hover:underline">Clear</button>
                            )}
                        </div>
                        <div className="space-y-4 pr-2">
                            {visibleBanks.map(bank => (
                                <label key={bank} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-cream border border-ink/5 flex items-center justify-center overflow-hidden group-hover:border-clay/20 transition-all shrink-0">
                                            {BANK_LOGOS[bank] ? (
                                                <img src={BANK_LOGOS[bank]} alt={bank} loading="lazy" className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <span className="font-bold text-[10px] text-clay/60">{bank[0]}</span>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-ink/60 group-hover:text-ink transition-colors">{bank}</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedBanks.includes(bank)}
                                        onChange={() => toggleBank(bank)}
                                        className="w-4 h-4 rounded border-ink/10 text-clay focus:ring-clay cursor-pointer bg-cream shrink-0"
                                    />
                                </label>
                            ))}
                        </div>
                        {banks.length > BANKS_INITIAL_COUNT && (
                            <button
                                onClick={() => setShowAllBanks(v => !v)}
                                className="text-clay text-[9px] font-bold uppercase tracking-widest mt-2 hover:opacity-70 transition-opacity"
                            >
                                {showAllBanks ? '− View Less' : `+ View ${banks.length - BANKS_INITIAL_COUNT} More Banks`}
                            </button>
                        )}
                    </div>

                    {/* Categories Filter */}
                    <div className="pt-10 border-t border-ink/5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-[11px] font-bold text-ink uppercase tracking-[0.3em]">Categories</h3>

                            {selectedCategories.length > 0 && (
                                <button onClick={() => setSelectedCategories([])} className="text-[9px] font-bold text-clay uppercase tracking-widest hover:underline">Clear</button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {visibleCategories.map(cat => (
                                <label key={cat.name} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="text-ink/20 group-hover:text-clay/60 transition-colors shrink-0">
                                            {React.cloneElement(cat.icon as React.ReactElement<any>, { size: 16 })}
                                        </div>
                                        <span className="text-sm font-medium text-ink/60 group-hover:text-ink transition-colors">{cat.name}</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedCategories.includes(cat.name)}
                                        onChange={() => toggleCategory(cat.name)}
                                        className="w-4 h-4 rounded border-ink/10 text-clay focus:ring-clay cursor-pointer bg-cream shrink-0"
                                    />
                                </label>
                            ))}
                        </div>
                        {categories.length > CATEGORIES_INITIAL_COUNT && (
                            <button
                                onClick={() => setShowAllCategories(v => !v)}
                                className="text-clay text-[9px] font-bold uppercase tracking-widest mt-6 hover:opacity-70 transition-opacity"
                            >
                                {showAllCategories ? '− View Less' : `+ View ${categories.length - CATEGORIES_INITIAL_COUNT} More Options`}
                            </button>
                        )}
                    </div>
                </div>

                {/* --- CARD RESULTS (SCREENSHOT 4) --- */}
                <div className="lg:col-span-9 space-y-8">
                    {/* Results Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-ink/10">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-heading font-black text-ink tracking-tight">Archives</h2>
                            <span className="px-3 py-1 bg-clay text-white text-[10px] font-bold rounded-full uppercase tracking-widest">{filteredCards.length} Found</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Sort By:</span>
                            <div className="relative group">
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="appearance-none bg-white border border-ink/10 px-6 py-2.5 pr-12 rounded-full text-[10px] font-bold uppercase tracking-widest text-ink outline-none focus:border-clay/40 transition-all cursor-pointer shadow-sm"
                                >
                                    <option value="featured">Featured First</option>
                                    <option value="rewards">Highest Rewards</option>
                                    <option value="fees">Lowest Fees</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/30 pointer-events-none" size={14} />
                            </div>
                        </div>
                    </div>

                    {/* Search Bar Mobile */}
                    <div className="lg:hidden mb-8 flex gap-4">
                         <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={16} />
                            <input 
                                type="text" placeholder="Search curated cards..." 
                                className="w-full pl-12 pr-6 py-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-ink/5 outline-none focus:border-clay/30 transition-all font-sans text-ink"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                         </div>
                         <button 
                            onClick={() => setIsMobileFilterOpen(true)}
                            className="bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-ink/5"
                        >
                             <FilterIcon size={18} className="text-ink/60" />
                         </button>
                    </div>

                    <AnimatePresence mode="popLayout">
                        <motion.div 
                            layout
                            className="space-y-8"
                        >
                            {filteredCards.map((card, index) => {
                                const cardSlug = card.slug || generateSlug(card.name, card.issuer);
                                return (
                                <motion.div 
                                    key={card.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    className="relative group"
                                >
                                    <motion.div 
                                        whileHover={{ scale: 1.02 }}
                                        className="relative bg-white rounded-[2.5rem] shadow-sm border border-ink/5 overflow-hidden group hover:shadow-[0_20px_60px_-15px_rgba(36,36,36,0.10)] transition-transform duration-300"
                                    >
                                        {/* Premium background gradient on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-paper via-transparent to-paper opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
                                        
                                        {/* Main Info Section */}
                                        <div className="p-6 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 relative z-10">
                                            {/* Card Image Wrapper with dynamic shadow */}
                                            <div className="w-full md:w-[320px] shrink-0">
                                                <div className="relative aspect-[1.58/1] rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-700 border border-ink/5">
                                                    <ImageWithLoader 
                                                        src={card.image} 
                                                        alt={card.name} 
                                                        className="w-full h-full object-cover transition-all duration-1000"
                                                    />
                                                </div>
                                            </div>

                                            {/* Content Center */}
                                            <div className="flex-1 space-y-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {card.tags?.map((tag, i) => (
                                                        <div key={i} className="flex items-center gap-1.5 bg-ink/5 px-4 py-1.5 rounded-full group/tag cursor-pointer hover:bg-clay hover:text-white transition-all duration-500">
                                                            <div className="w-1 h-1 rounded-full bg-clay group-hover/tag:bg-white transition-colors"></div>
                                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{tag}</span>
                                                        </div>
                                                    )) || (
                                                        <div className="flex items-center gap-1.5 bg-ink/5 px-4 py-1.5 rounded-full">
                                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{card.category}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <h3 className="text-3xl md:text-5xl font-heading font-black text-ink leading-none tracking-tighter group-hover:text-clay transition-colors uppercase">
                                                    {card.name}
                                                </h3>

                                                <p className="text-lg md:text-xl font-sans font-medium text-ink/40 mt-2 italic">
                                                    {card.issuer || card.bank} • {card.category} Portfolio
                                                </p>
                                            </div>

                                            {/* Actions Right */}
                                            <div className="w-full md:w-56 flex flex-col gap-3 justify-start pt-4">
                                                <Link to={`/cards/${cardSlug}`} className="w-full">
                                                    <button className="w-full bg-ink text-white font-bold py-4 rounded-3xl flex items-center justify-center gap-3 transition-all shadow-xl hover:bg-clay active:scale-95 text-[10px] uppercase tracking-[0.3em] cursor-pointer">
                                                        View analysis <ArrowRight size={14} className="opacity-60" />
                                                    </button>
                                                </Link>
                                                <button className="w-full bg-white border border-ink/10 hover:border-clay/30 text-ink font-bold py-4 rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-95 text-[10px] uppercase tracking-[0.3em] shadow-sm">
                                                    Consult AI <MessageSquareShare size={14} className="text-clay" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Stats Row Bottom - Factual Data Sheet Style */}
                                        <div className="bg-[#F9F8F4] px-6 md:px-16 py-8 md:py-10 grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 border-t border-ink/5 overflow-x-auto no-scrollbar relative z-10">
                                            <div className="space-y-2 border-r border-ink/5 pr-4">
                                                <p className="text-ink text-[11px] font-bold uppercase tracking-[0.2em]">Introductory Offer</p>
                                                <p className="text-xs font-semibold text-ink leading-relaxed">{card.intro_offer || 'Data Pending'}</p>
                                            </div>
                                            <div className="space-y-2 border-r border-ink/5 pr-4">
                                                <p className="text-ink text-[11px] font-bold uppercase tracking-[0.2em]">Annual Fixed Fee</p>
                                                <p className="text-sm font-light text-ink">₹{String(card.annual_fee).replace(/^₹/, '')} <span className="text-[10px] opacity-40 font-sans font-bold">+ GST</span></p>
                                            </div>
                                            <div className="space-y-2 border-r border-ink/5 pr-4">
                                                <p className="text-ink text-[11px] font-bold uppercase tracking-[0.2em]">Joining Premium</p>
                                                <p className="text-sm font-light text-ink">₹{String(card.joining_fee || card.annual_fee).replace(/^₹/, '')} <span className="text-[10px] opacity-40 font-sans font-bold">+ GST</span></p>
                                            </div>
                                            <div className="space-y-2 border-r border-ink/5 pr-4">
                                                <p className="text-ink text-[11px] font-bold uppercase tracking-[0.2em]">Yield Potential</p>
                                                <p className="text-sm font-bold text-clay tracking-tight">{card.rewards_rate || '2% → 30%'}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-ink text-[11px] font-bold uppercase tracking-[0.2em]">Market Rating</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-black text-ink">{card.rating?.toFixed(1) || '4.0'}</p>
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={8} className={`${i < Math.floor(card.rating || 4) ? 'fill-clay text-clay' : 'fill-ink/5 text-ink/5'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </motion.div>
                                </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>

                    {filteredCards.length === 0 && (
                        <div className="text-center py-32 bg-white/40 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-ink/10">
                             <AlertCircle size={48} className="text-ink/10 mx-auto mb-6" />
                             <h3 className="text-3xl font-heading font-black text-ink/30 tracking-tighter">No matching instruments</h3>
                             <p className="text-ink/40 mt-4 font-medium">Adjust filters to discover new rewards.</p>
                             <button 
                                onClick={() => { setSelectedBanks([]); setSelectedCategories([]); setSearchQuery(''); }}
                                className="mt-10 text-clay font-bold uppercase tracking-[0.3em] text-[10px] hover:opacity-70 transition-opacity border-b-2 border-clay/20 pb-1"
                            >Clear All Constraints</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filter Modal */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-[95] bg-ink/60 backdrop-blur-md lg:hidden">
                    <div className="absolute right-0 bottom-0 top-[80px] w-full max-w-[400px] bg-cream rounded-t-[2.5rem] shadow-[0_-20px_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
                        <div className="p-8 pb-4 flex justify-between items-center bg-white border-b border-ink/5">
                            <div className="space-y-1">
                                    <h2 className="text-[11px] font-heading font-black uppercase tracking-[0.2em] text-ink">Refine Catalog</h2>
                                    <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-ink/30 mt-1">Found {filteredCards.length} instruments</p>
                            </div>
                            <button onClick={() => setIsMobileFilterOpen(false)} className="w-10 h-10 flex items-center justify-center bg-ink text-white rounded-full shadow-lg transition-transform active:scale-90">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-12">
                        {/* Repeat sidebar content for mobile */}
                        <div className="space-y-12">
                             <div className="flex justify-between items-center border-b border-ink/5 pb-4">
                                <span className="text-ink/40 font-bold uppercase tracking-[0.2em] text-[10px]">Refine Catalog</span>
                                <button onClick={() => { setSelectedBanks([]); setSelectedCategories([]); }} className="text-clay font-bold uppercase tracking-[0.2em] text-[10px]">Reset All</button>
                             </div>
                             <div>
                                <h3 className="font-serif italic text-2xl text-ink mb-6">Banks</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {(showAllBanks ? banks : banks.slice(0, BANKS_INITIAL_COUNT)).map(bank => (
                                        <button 
                                            key={bank}
                                            onClick={() => toggleBank(bank)}
                                            className={`py-3 px-4 rounded-2xl border text-[10px] font-bold tracking-widest transition-all flex items-center justify-center gap-2 ${selectedBanks.includes(bank) ? 'bg-clay border-clay text-white shadow-xl scale-[1.02]' : 'bg-white border-ink/5 text-ink/40 hover:border-ink/10'}`}
                                        >
                                            {BANK_LOGOS[bank] && (
                                                <img src={BANK_LOGOS[bank]} alt={bank} loading="lazy" className={`w-4 h-4 object-contain ${selectedBanks.includes(bank) ? 'brightness-0 invert' : ''}`} />
                                            )}
                                            {bank}
                                        </button>
                                    ))}
                                </div>
                                {banks.length > BANKS_INITIAL_COUNT && (
                                    <button
                                        onClick={() => setShowAllBanks(v => !v)}
                                        className="text-clay text-[9px] font-bold uppercase tracking-widest mt-4 hover:opacity-70 transition-opacity"
                                    >
                                        {showAllBanks ? '− View Less' : `+ View ${banks.length - BANKS_INITIAL_COUNT} More`}
                                    </button>
                                )}
                             </div>

                             <div>
                                <h3 className="font-serif italic text-2xl text-ink mb-6">Categories</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {(showAllCategories ? categories : categories.slice(0, CATEGORIES_INITIAL_COUNT)).map(cat => (
                                        <button 
                                            key={cat.name}
                                            onClick={() => toggleCategory(cat.name)}
                                            className={`py-3 px-4 rounded-2xl border text-[10px] font-bold tracking-widest text-left transition-all ${selectedCategories.includes(cat.name) ? 'bg-clay border-clay text-white shadow-xl scale-[1.02]' : 'bg-white border-ink/5 text-ink/40 hover:border-ink/10'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                                {categories.length > CATEGORIES_INITIAL_COUNT && (
                                    <button
                                        onClick={() => setShowAllCategories(v => !v)}
                                        className="text-clay text-[9px] font-bold uppercase tracking-widest mt-4 hover:opacity-70 transition-opacity"
                                    >
                                        {showAllCategories ? '− View Less' : `+ View ${categories.length - CATEGORIES_INITIAL_COUNT} More`}
                                    </button>
                                )}
                             </div>
                             
                            <button 
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="w-full bg-ink text-white font-bold py-6 rounded-3xl shadow-[0_20px_50px_rgba(36,36,36,0.3)] mt-12 mb-8 uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-3 active:scale-95 transition-all"
                            >
                                Show {filteredCards.length} Matches <ArrowRight size={14} className="opacity-40" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};

export default CardExplorer;
