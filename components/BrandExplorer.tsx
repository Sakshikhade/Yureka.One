import React, { useState, useMemo } from 'react';
import {
    Search, Tag, X, LayoutGrid, Zap, Sparkle, Store, Gem, UtensilsCrossed,
    ShoppingBasket, ShoppingCart, Flame, Plane, BedDouble, Shirt, Sparkles,
    Gamepad2, Watch, Film, Crown, Smartphone, Sofa, Dumbbell, Glasses,
    Baby, Pill, Footprints, Tv, ShoppingBag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SEO from './SEO';
import { brands, BRAND_CATEGORIES } from '../brandsData';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    'All': LayoutGrid,
    'Quick Commerce': Zap,
    'New Brands': Sparkle,
    'Instore Brands': Store,
    'Jewellery': Gem,
    'Food': UtensilsCrossed,
    'Grocery': ShoppingBasket,
    'E-Commerce': ShoppingCart,
    'Hot Deals': Flame,
    'Travel & Transport': Plane,
    'Hotels': BedDouble,
    'Fashion': Shirt,
    'Beauty': Sparkles,
    'Gaming': Gamepad2,
    'Watches': Watch,
    'Entertainment': Film,
    'Luxury': Crown,
    'Electronics': Smartphone,
    'Furnishing': Sofa,
    'Fitness': Dumbbell,
    'Accessories': Glasses,
    'Kids': Baby,
    'Pharmacy': Pill,
    'Footwear': Footprints,
    'OTT': Tv,
    'Hand Bags': ShoppingBag,
};

const STATS = [
    { label: `${brands.length} Brand Partners`, icon: Store },
    { label: `${BRAND_CATEGORIES.length - 1} Categories`, icon: LayoutGrid },
    { label: 'Up to 20% Cashback', icon: Flame },
];

const BrandExplorer: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { All: brands.length };
        BRAND_CATEGORIES.slice(1).forEach(cat => {
            counts[cat] = brands.filter(b => b.categories.includes(cat)).length;
        });
        return counts;
    }, []);

    const filteredBrands = useMemo(() => {
        return brands.filter(brand => {
            const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'All' || brand.categories.includes(activeCategory);
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    const hasActiveFilters = activeCategory !== 'All' || searchQuery !== '';
    const resetFilters = () => { setSearchQuery(''); setActiveCategory('All'); };

    return (
        <div className="min-h-screen bg-mesh pb-32 overflow-x-hidden text-white/90 selection:bg-clay selection:text-cream">
            <SEO title="Brand Explorer | Discover Reward Partners" description="Browse 80+ partner brands across shopping, travel, food, and lifestyle to maximize your card rewards and cashback." />

            {/* ── HERO ── */}
            <div className="relative pt-24 md:pt-40 pb-20 border-b border-white/5">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30c0-16.569-13.431-30-30-30v60c16.569 0 30-13.431 30-30zm0 0c0 16.569 13.431 30 30 30V0c-16.569 0-30 13.431-30 30z' fill='%23fff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
                />

                <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-clay mb-6">Reward Partners & Brands</p>
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-cirka font-medium text-white leading-[0.95] tracking-tighter mb-8">
                            Shop Smarter.<br /><span className="text-clay italic font-light">Earn More.</span>
                        </h1>
                        <p className="text-white/70 text-base md:text-xl font-serif italic max-w-2xl mx-auto leading-relaxed mb-10">
                            Explore {brands.length} brand partners offering exclusive cashback, discounts, and rewards.
                        </p>

                        {/* ── STATS ── */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
                            {STATS.map(({ label, icon: Icon }) => (
                                <div key={label} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                                    <Icon size={12} className="text-clay" />
                                    {label}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── CATEGORY FILTER BAR ── */}
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-6xl mx-auto px-4">
                        <div className="bg-cream/60 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-5 shadow-2xl relative group/bar">
                            <div className="absolute inset-0 bg-gradient-to-r from-clay/5 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity duration-1000 rounded-[3rem] pointer-events-none" />

                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-3 px-3 text-left">Filter By Category</p>

                            <div
                                className="flex items-center gap-2 overflow-x-auto no-scrollbar px-2 py-1 relative"
                                style={{
                                    maskImage: 'linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)',
                                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)',
                                }}
                            >
                                {BRAND_CATEGORIES.map(cat => {
                                    const Icon = CATEGORY_ICONS[cat] || Tag;
                                    const isActive = activeCategory === cat;
                                    return (
                                        <button key={cat} onClick={() => setActiveCategory(cat)}
                                            className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${isActive ? 'bg-clay text-cream border-clay shadow-lg shadow-clay/20 scale-[1.03]' : 'text-white/60 border-transparent hover:text-white hover:bg-white/5 hover:border-white/10'}`}
                                        >
                                            <Icon size={13} className={isActive ? 'text-cream' : 'text-white/30'} />
                                            {cat}
                                            <span className={`text-[8px] font-bold rounded-full px-1.5 py-0.5 ${isActive ? 'bg-cream/20 text-cream' : 'bg-white/5 text-white/30'}`}>{categoryCounts[cat]}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── CONTROLS ── */}
            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
                    <div className="relative w-full max-w-md group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-clay transition-colors" size={18} />
                        <input type="text" placeholder="Search brands..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-clay transition-all text-sm text-white"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        {activeCategory !== 'All' && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-clay/10 border border-clay/20 text-[10px] font-bold uppercase tracking-[0.2em] text-clay">
                                {activeCategory}
                                <button onClick={() => setActiveCategory('All')} className="hover:text-white transition-colors">
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] whitespace-nowrap">
                            {filteredBrands.length} {filteredBrands.length === 1 ? 'Brand' : 'Brands'}
                        </p>
                    </div>
                </div>

                {/* ── GRID ── */}
                <AnimatePresence mode="popLayout">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBrands.map((brand, index) => (
                            <motion.div key={brand.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: (index % 4) * 0.05 }} className="group">
                                <div className="bg-white/5 rounded-[2.5rem] border border-white/5 p-2 h-full flex flex-col hover:border-clay/30 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-500 shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-clay/5">
                                    <div
                                        className={`relative aspect-video md:aspect-[1.6/1] rounded-[2rem] overflow-hidden mb-4 flex items-center justify-center ${brand.image && brand.bgColor ? '' : 'bg-white/[0.03]'}`}
                                        style={brand.image && brand.bgColor ? { backgroundColor: brand.bgColor } : undefined}
                                    >
                                        {!(brand.image && brand.bgColor) && (
                                            <div className={`absolute w-28 h-28 rounded-full bg-gradient-to-br ${brand.color} opacity-10 blur-3xl group-hover:opacity-30 transition-opacity duration-700`} />
                                        )}
                                        {brand.image ? (
                                            <img src={brand.image} alt={brand.name} className="relative w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${brand.color} flex items-center justify-center text-white font-black text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                                {brand.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-sm font-sans font-bold text-white text-center px-4 pb-6 uppercase tracking-wider group-hover:text-clay transition-colors">{brand.name}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>

                {filteredBrands.length === 0 && (
                    <div className="text-center py-48">
                        <Tag className="mx-auto mb-6 text-white/20" size={40} />
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/40 italic">No brands found matching criteria</p>
                        <button onClick={resetFilters}
                            className="mt-8 text-clay text-[11px] font-bold uppercase tracking-widest hover:underline">Reset Filters</button>
                    </div>
                )}

                {hasActiveFilters && filteredBrands.length > 0 && (
                    <div className="text-center mt-16">
                        <button onClick={resetFilters}
                            className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] hover:text-clay transition-colors">Clear Filters</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandExplorer;
