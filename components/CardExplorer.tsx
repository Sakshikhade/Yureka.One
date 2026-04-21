import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Search, ChevronDown, Check, ArrowRight, ArrowLeft,
    Plane, ShoppingBag, Landmark, Coffee, Fuel, CreditCard, 
    Hotel, Briefcase, Armchair, Smartphone, Popcorn, Star,
    Percent, HelpCircle, LayoutGrid, ListFilter
} from 'lucide-react';
import ImageWithLoader from './ImageWithLoader';
import { useSupabase } from './SupabaseProvider';
import { SkeletonCard } from './SkeletonLoaders';
import { motion, AnimatePresence } from 'motion/react';

// ─── Constants & Master Lists ────────────────────────────────────────────────
const ALL_BANKS = [
    'HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Yes Bank', 'RBL', 'Amex',
    'IndusInd', 'BOB', 'SC', 'Indian', 'PNB', 'IDFC', 'Canara', 'HSBC',
    'DBS', 'IDBI', 'AU', 'Equitas', 'CSB', 'Federal', 'SBM', 'South Indian'
];

const ALL_CATEGORIES = [
    { name: 'Travel',            icon: <Plane size={16} /> },
    { name: 'Cashback',          icon: <Percent size={16} /> },
    { name: 'Shopping',          icon: <ShoppingBag size={16} /> },
    { name: 'Dining',            icon: <Coffee size={16} /> },
    { name: 'Fuel',              icon: <Fuel size={16} /> },
    { name: 'Lounge Access',     icon: <Armchair size={16} /> },
    { name: 'UPI',               icon: <Smartphone size={16} /> },
    { name: 'Business',          icon: <Briefcase size={16} /> }
];

const REWARD_TYPES = ['Points', 'Cashback', 'Airmiles', 'Vouchers'];

// Helper for card slugs
const generateSlug = (name: string, bank: string) => {
    return `${name}-${bank}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// ─── Custom Dropdown Component ───────────────────────────────────────────────
const CustomSelect = ({ label, value, options, onChange, placeholder }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative group flex-1">
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mb-1.5 ml-1">{label}</p>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-14 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl px-5 flex items-center justify-between text-white transition-all group-hover:border-white/30"
            >
                <span className={`text-sm font-medium ${value ? 'text-white' : 'text-white/40'}`}>
                    {value || placeholder}
                </span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            style={{ zIndex: 9999 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A2E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
                        >
                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                <button 
                                    onClick={() => { onChange(''); setIsOpen(false); }}
                                    className="w-full px-5 py-3 text-left text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                                >
                                    All {label}
                                </button>
                                {options.map((opt: string) => (
                                    <button 
                                        key={opt}
                                        onClick={() => { onChange(opt); setIsOpen(false); }}
                                        className={`w-full px-5 py-3 text-left text-sm transition-colors flex items-center justify-between ${value === opt ? 'bg-clay text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {opt}
                                        {value === opt && <Check size={14} />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Card Explorer Component ─────────────────────────────────────────────────
const CardExplorer: React.FC = () => {
    const navigate = useNavigate();
    const { cards: cardsList, isLoading } = useSupabase();
    
    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedRewardType, setSelectedRewardType] = useState('');
    
    // Toggles
    const [premiumOnly, setPremiumOnly] = useState(false);
    const [showLTF, setShowLTF] = useState(false);

    // Filtering Logic
    const filteredCards = useMemo(() => {
        return cardsList.filter(card => {
            const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 card.issuer.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesBank = !selectedBank || card.issuer.includes(selectedBank);
            const matchesCategory = !selectedCategory || card.category?.includes(selectedCategory);
            // Simulating Reward Type match as it might be in features
            const matchesReward = !selectedRewardType || JSON.stringify(card.features).includes(selectedRewardType);
            
            // Simulating toggles
            const matchesPremium = !premiumOnly || parseFloat(card.annual_fee?.replace(/[^0-9.]/g, '') || '0') > 5000;
            const matchesLTF = !showLTF || card.annual_fee === '0' || card.annual_fee?.includes('Free');

            return matchesSearch && matchesBank && matchesCategory && matchesReward && matchesPremium && matchesLTF;
        });
    }, [cardsList, searchQuery, selectedBank, selectedCategory, selectedRewardType, premiumOnly, showLTF]);

    if (isLoading && cardsList.length === 0) {
        return (
            <div className="min-h-screen bg-[#FDFCF9] pt-32 px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="h-48 bg-slate-100 rounded-[3rem] animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <SkeletonCard /><SkeletonCard /><SkeletonCard />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCF9] pb-32">
            
            {/* ── Navbar ── */}
            <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#FDFCF9]/80 backdrop-blur-xl border-b border-ink/5">
                <div className="max-w-[1700px] mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <button 
                            onClick={() => navigate(-1)}
                            className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white border border-ink/10 rounded-full hover:border-clay/30 transition-all group"
                        >
                            <ArrowLeft size={20} className="text-ink group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <Link to="/" className="text-xl md:text-2xl font-heading font-black tracking-tighter text-ink">
                            YUREKA<span className="text-clay">.</span>MONEY
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center bg-white border border-ink/5 rounded-full p-1 shadow-sm">
                        <Link to="/cards" className="px-6 py-2.5 rounded-full bg-ink text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">All Cards</Link>
                        <Link to="/manifesto" className="px-6 py-2.5 rounded-full text-ink/40 hover:text-ink text-[10px] font-bold uppercase tracking-widest transition-colors">Our Story</Link>
                        <Link to="/rewards-calculator" className="px-6 py-2.5 rounded-full text-ink/40 hover:text-ink text-[10px] font-bold uppercase tracking-widest transition-colors">Neural Hub</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/join-waitlist" className="px-6 md:px-10 h-12 md:h-14 bg-[#1A1A2E] text-white rounded-full flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-clay transition-colors group">
                            Join Waitlist <ArrowRight size={14} className="ml-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── Hero Section ── */}
            <section className="pt-40 pb-16 md:pt-48 md:pb-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif text-ink leading-[0.9] tracking-tighter mb-6 uppercase">
                            Start your <br />
                            <span className="italic font-light text-clay">search here.</span>
                        </h1>
                        <p className="text-lg md:text-xl font-serif italic text-ink/50 max-w-2xl mx-auto">
                            Decode 200+ instruments to find the one that fits your life perfectly.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Control Center (The Indigo Bar) ── */}
            <section className="px-4 md:px-10 lg:px-20 mb-16 relative z-[60]">
                <div className="max-w-[1700px] mx-auto">
                    {/* The Interlocking Circle Pattern Background */}
                    <div className="bg-[#1A1A2E] rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 shadow-2xl relative overflow-visible group">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-[2.5rem] md:rounded-[4rem] overflow-hidden" 
                             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm10 10c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm-10 10c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")` }} 
                        />
                        
                        <div className="relative z-10 flex flex-col xl:flex-row items-center gap-8 md:gap-10">
                            {/* Desktop Filters */}
                            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                                <CustomSelect 
                                    label="Primary Issuer" 
                                    value={selectedBank} 
                                    options={ALL_BANKS} 
                                    onChange={setSelectedBank} 
                                    placeholder="All Banks" 
                                />
                                <CustomSelect 
                                    label="Spend Category" 
                                    value={selectedCategory} 
                                    options={ALL_CATEGORIES.map(c => c.name)} 
                                    onChange={setSelectedCategory} 
                                    placeholder="All Categories" 
                                />
                                <CustomSelect 
                                    label="Reward Matrix" 
                                    value={selectedRewardType} 
                                    options={REWARD_TYPES} 
                                    onChange={setSelectedRewardType} 
                                    placeholder="All Rewards" 
                                />
                            </div>

                            {/* Toggles */}
                            <div className="w-full xl:w-auto flex flex-col md:flex-row items-center gap-6 md:gap-10 border-t xl:border-t-0 xl:border-l border-white/10 pt-8 xl:pt-0 xl:pl-10">
                                <div className="flex items-center gap-4 cursor-pointer" onClick={() => setPremiumOnly(!premiumOnly)}>
                                    <div 
                                        className={`w-14 h-8 rounded-full transition-all relative ${premiumOnly ? 'bg-clay' : 'bg-white/10'}`}
                                    >
                                        <motion.div 
                                            animate={{ x: premiumOnly ? 28 : 4 }}
                                            className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg" 
                                        />
                                    </div>
                                    <span className="text-[11px] font-bold text-white uppercase tracking-widest whitespace-nowrap select-none">Premium Only</span>
                                </div>
                                <div className="flex items-center gap-4 cursor-pointer" onClick={() => setShowLTF(!showLTF)}>
                                    <div 
                                        className={`w-14 h-8 rounded-full transition-all relative ${showLTF ? 'bg-clay' : 'bg-white/10'}`}
                                    >
                                        <motion.div 
                                            animate={{ x: showLTF ? 28 : 4 }}
                                            className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg" 
                                        />
                                    </div>
                                    <span className="text-[11px] font-bold text-white uppercase tracking-widest whitespace-nowrap select-none">Lifetime Free</span>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar - Integrated */}
                        <div className="mt-10 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center gap-6">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-clay transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Deep search by name, features, or perks..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-8 text-white placeholder:text-white/20 outline-none focus:border-clay/40 transition-all font-serif italic text-lg"
                                />
                            </div>
                            <div className="flex items-center gap-4 text-white/40 grayscale opacity-50 hidden md:flex">
                                <LayoutGrid size={20} />
                                <ListFilter size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Calculator Sub-Banner */}
                    <div className="mt-8 px-4 md:px-0">
                        <div className="bg-white border border-ink/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm group hover:border-clay/20 transition-all group overflow-hidden relative">
                             {/* Neural Pattern */}
                             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                             
                             <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                <div className="w-16 h-16 bg-cream border border-clay/10 rounded-2xl flex items-center justify-center shrink-0">
                                    <motion.div 
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                        className="text-clay"
                                    >
                                        <Landmark size={28} />
                                    </motion.div>
                                </div>
                                <div className="text-center md:text-left">
                                    <h4 className="text-2xl font-serif text-ink italic leading-tight">Yureka vs Standard</h4>
                                    <p className="text-[11px] font-bold text-ink/30 uppercase tracking-[0.2em] mt-1">We uncover hidden yields. See for yourself.</p>
                                </div>
                             </div>

                             <button 
                                onClick={() => navigate('/rewards-calculator')}
                                className="px-10 h-14 bg-ink text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-clay transition-colors relative z-10"
                             >
                                Calculate Neural Yield
                             </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Card Archives Grid ── */}
            <section className="px-6 md:px-12 lg:px-20">
                <div className="max-w-[1700px] mx-auto">
                    {/* Catalog Header */}
                    <div className="flex justify-between items-end mb-16 md:mb-20 border-b border-ink/5 pb-8">
                        <div>
                           <h2 className="text-4xl md:text-6xl font-serif text-ink leading-[0.9] tracking-tighter uppercase">
                                The <br />
                                <span className="italic font-light text-ink/50">Archives</span>
                           </h2>
                           <p className="text-[11px] font-bold text-ink/20 uppercase tracking-[0.3em] mt-4">Verified Repositories / {filteredCards.length} Matches</p>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] font-bold text-ink opacity-20 uppercase tracking-[0.4em] mb-2">Sorted By: Data Priority</p>
                            <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(i => <div key={i} className={`w-3 h-1 rounded-full ${i===1 ? 'bg-clay' : 'bg-ink/5'}`} />)}
                            </div>
                        </div>
                    </div>

                    <AnimatePresence mode="popLayout">
                        <motion.div 
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-x-10 md:gap-y-16"
                        >
                            {filteredCards.map((card, index) => {
                                const cardSlug = card.slug || generateSlug(card.name, card.issuer);
                                return (
                                    <motion.div
                                        key={card.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: (index % 3) * 0.1 }}
                                        className="group"
                                    >
                                        <Link to={`/cards/${cardSlug}`} className="block h-full">
                                            {/* Editorial Card Component */}
                                            <div className="relative h-full overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] bg-paper shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-700 flex flex-col border border-ink/5">
                                                
                                                {/* Category/Location-style Tag */}
                                                <div className="absolute top-8 left-8 z-20">
                                                    <div className="bg-[#FFE4E4] text-[#823A3A] px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
                                                        <Landmark size={12} /> {card.issuer}
                                                    </div>
                                                </div>

                                                {/* Premium Card Image */}
                                                <div className="h-[250px] md:h-[300px] w-full relative overflow-hidden bg-white shrink-0">
                                                    <ImageWithLoader 
                                                        src={card.image} 
                                                        alt={card.name} 
                                                        className="w-full h-full object-contain p-12 md:p-16 transition-transform duration-1000 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper/20" />
                                                </div>

                                                {/* Content Area */}
                                                <div className="p-8 md:p-10 flex-1 flex flex-col justify-between bg-white border-t border-ink/5">
                                                    <div>
                                                        <h3 className="text-3xl md:text-4xl font-serif text-ink tracking-tighter leading-[0.9] uppercase mb-6 h-[80px] line-clamp-2">
                                                            {card.name.split(' ').slice(0, 2).join(' ')}<br />
                                                            <span className="italic font-light text-ink/40">{card.name.split(' ').slice(2).join(' ')}</span>
                                                        </h3>
                                                        <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8">
                                                            <div className="flex items-center gap-2">
                                                                <Percent size={14} className="text-clay/40" />
                                                                <span className="text-[10px] font-bold text-ink uppercase tracking-wider">{card.rewards_rate || 'Peak Yield'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Landmark size={14} className="text-clay/40" />
                                                                <span className="text-[10px] font-bold text-ink uppercase tracking-wider">{card.category}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Star size={14} className="text-clay/40" />
                                                                <span className="text-[10px] font-bold text-ink uppercase tracking-wider">{card.rating?.toFixed(1) || 'Elite'} Rating</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-8 flex items-end justify-between border-t border-ink/5 mt-auto">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-ink/20 uppercase tracking-[0.3em] mb-1">Portfolio Tier</p>
                                                            <div className="flex items-baseline gap-1">
                                                                <span className="text-sm font-bold text-ink uppercase">Fees:</span>
                                                                <span className="text-2xl font-serif text-ink tracking-tight italic">₹{card.annual_fee?.replace(/[^0-9]/g, '') || '0'}</span>
                                                                <span className="text-[10px] text-ink/30 font-bold ml-1">/ YEAR</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center group-hover:bg-ink group-hover:text-white transition-all duration-500">
                                                            <ArrowRight size={20} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>

                    {/* Empty State */}
                    {filteredCards.length === 0 && (
                        <div className="text-center py-40">
                            <h3 className="text-4xl font-serif text-ink/20 italic mb-8">No instruments found in current vault.</h3>
                            <button 
                                onClick={() => { setSelectedBank(''); setSelectedCategory(''); setSearchQuery(''); }}
                                className="text-clay font-bold uppercase tracking-[0.4em] text-[10px] border-b border-clay/30 pb-1"
                            >Reset Constraints</button>
                        </div>
                    )}
                </div>
            </section>

            {/* --- FAQS Section Link --- */}
            <section className="mt-32 md:mt-48 px-6 text-center">
                 <div className="max-w-xl mx-auto space-y-8">
                    <div className="flex justify-center">
                        <HelpCircle size={40} className="text-clay animate-pulse" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif text-ink tracking-tighter uppercase leading-tight">
                        Still navigating <br />
                        <span className="italic font-light text-ink/40">the decision?</span>
                    </h2>
                    <p className="text-ink/60 font-serif italic text-lg leading-relaxed">
                        Our neural engine is trained on 200+ card variations. If you're stuck, use the comparison tool or consult the manifesto.
                    </p>
                    <div className="pt-6">
                        <Link to="/calculator" className="inline-flex items-center gap-4 text-clay font-bold uppercase tracking-[0.3em] text-[11px] group">
                           Launch Audit Tool <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                 </div>
            </section>
        </div>
    );
};

export default CardExplorer;
