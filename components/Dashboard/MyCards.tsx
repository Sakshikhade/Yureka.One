import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Plus, Trash2, Search, CreditCard, Landmark, 
    ChevronDown, Loader2, Sparkles, AlertCircle
} from 'lucide-react';
import { useSupabase } from '../SupabaseProvider';
import { fetchUserCards, addUserCard, removeUserCard } from '../../services/supabaseService';

const BANK_LOGOS: Record<string, string> = {
    'HDFC': '/assets/banks/hdfc.png', 'SBI': '/assets/banks/sbi.png', 'Axis': '/assets/banks/axis.png',
    'ICICI': '/assets/banks/icici.png', 'Kotak': '/assets/banks/kotak.png', 'Yes Bank': '/assets/banks/yesbank.png',
    'Amex': '/assets/banks/amex.png', 'IDFC': '/assets/banks/idfc.png', 'HSBC': '/assets/banks/hsbc.png',
    'RBL': '/assets/banks/rbl.png', 'IndusInd': '/assets/banks/indusind.png', 'BOB': '/assets/banks/bob.png',
    'SC': '/assets/banks/sc.png', 'Indian': '/assets/banks/indian.png', 'PNB': '/assets/banks/pnb.png',
    'Canara': '/assets/banks/canara.png', 'DBS': '/assets/banks/dbs.png', 'IDBI': '/assets/banks/idbi.png',
    'AU': '/assets/banks/au.png', 'Equitas': '/assets/banks/equitas.png', 'CSB': '/assets/banks/csb.png',
    'Federal': '/assets/banks/federal.png', 'SBM': '/assets/banks/sbm.png', 'South Indian': '/assets/banks/southindian.png',
    'Utkarsh Bank': '/assets/banks/utkarsh.png', 'Suryoday Bank': '/assets/banks/suryoday.png', 'Union Bank': '/assets/banks/union.png',
    'Unity SFB': '/assets/banks/unity.png', 'DCB': '/assets/banks/dcb.png', 'Bank Of India': '/assets/banks/boi.png',
    'J&K Bank': '/assets/banks/jk.png', 'CUB': '/assets/banks/cub.png', 'Slice SFB': '/assets/banks/slice.png',
    'Dhanlaxmi Bank': '/assets/banks/dhanlaxmi.png', 'Indian Overseas Bank': '/assets/banks/iob.png'
};

const ALL_BANKS = Object.keys(BANK_LOGOS).sort();

const MyCards: React.FC = () => {
    const { user, cards: allCards } = useSupabase();
    const [ownedCards, setOwnedCards] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedBank, setSelectedBank] = useState('');
    const [selectedCardId, setSelectedCardId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openBankDropdown, setOpenBankDropdown] = useState(false);

    useEffect(() => {
        if (user) loadCards();
    }, [user]);

    const loadCards = async () => {
        try {
            const data = await fetchUserCards(user!.id);
            setOwnedCards(data || []);
        } catch (err) {
            console.error("Failed to load cards:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCard = async () => {
        if (!selectedBank || !selectedCardId) return;
        setIsSubmitting(true);
        try {
            const cardDetail = allCards.find(c => c.id === selectedCardId);
            const payload = {
                user_id: user!.id,
                card_id: selectedCardId === 'Other' ? null : selectedCardId,
                bank_name: selectedBank,
                card_name: selectedCardId === 'Other' ? 'Other Card' : cardDetail?.name || 'Unknown Card',
                card_image: cardDetail?.image || null
            };
            await addUserCard(payload);
            await loadCards();
            setIsAdding(false);
            setSelectedBank('');
            setSelectedCardId('');
        } catch (err) {
            alert("Failed to add card. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCard = async (id: string) => {
        if (!confirm("Are you sure you want to remove this card?")) return;
        try {
            await removeUserCard(id);
            setOwnedCards(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            alert("Failed to delete card.");
        }
    };

    const filteredCards = allCards.filter(c => {
        const searchBank = selectedBank.toLowerCase();
        const issuer = (c.issuer || '').toLowerCase();
        const bank = (c.bank || '').toLowerCase();
        return issuer.includes(searchBank) || bank.includes(searchBank) || searchBank.includes(issuer) || searchBank.includes(bank);
    });

    if (isLoading) return (
        <div className="flex items-center justify-center py-40">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-t-2 border-clay rounded-full"
            />
        </div>
    );

    return (
        <div className="space-y-16">
            {/* Portfolio Health Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-[2rem] p-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-2 bg-clay rounded-full animate-pulse" />
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Portfolio Density</p>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="text-6xl font-black italic text-white tracking-tighter leading-none">{ownedCards.length}</span>
                        <span className="text-white/20 text-xs font-bold uppercase tracking-widest">Active Assets</span>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="glass-card rounded-[2rem] p-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Sparkles size={12} className="text-clay" />
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Yield Optimization</p>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="text-6xl font-black italic text-clay tracking-tighter leading-none">15%</span>
                        <span className="text-white/20 text-xs font-bold uppercase tracking-widest">Avg. Cashback</span>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="glass-card rounded-[2rem] p-8 hidden lg:block"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <AlertCircle size={12} className="text-white/20" />
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Security Status</p>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-black italic text-white tracking-tighter leading-none">ELITE</span>
                        <span className="text-clay text-[8px] font-black uppercase tracking-widest">Encrypted</span>
                    </div>
                </motion.div>

                <button 
                    onClick={() => setIsAdding(true)}
                    className="bg-clay text-black rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all group shadow-[0_20px_40px_rgba(52,211,153,0.2)]"
                >
                    <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Expand Portfolio</span>
                </button>
            </div>

            {/* Owned Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <AnimatePresence>
                    {ownedCards.map((card, idx) => (
                        <motion.div 
                            key={card.id}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -10 }}
                            className="group relative"
                        >
                            <div className="glass-card rounded-[2.5rem] p-8 hover:border-white/20 overflow-hidden relative">
                                {/* Decorative Gradient */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-clay/5 blur-[60px] rounded-full pointer-events-none" />
                                
                                <motion.div 
                                    className="aspect-[1.58/1] bg-black/40 rounded-2xl overflow-hidden mb-8 relative preserve-3d"
                                    whileHover={{ rotateY: 15, rotateX: -5 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    {card.card_image ? (
                                        <img src={card.card_image} alt={card.card_name} className="w-full h-full object-contain p-6 drop-shadow-2xl" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
                                            <CreditCard size={64} className="text-white/5" />
                                        </div>
                                    )}
                                    <div className="absolute top-6 left-6 w-10 h-10 bg-white rounded-xl p-2 shadow-2xl border border-white/20">
                                        <img src={BANK_LOGOS[card.bank_name] || '/assets/logo.png'} alt="" className="w-full h-full object-contain" />
                                    </div>
                                </motion.div>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-clay">{card.bank_name}</p>
                                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                                            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Credit Asset</p>
                                        </div>
                                        <h4 className="text-lg font-black text-white tracking-tight italic leading-tight">{card.card_name}</h4>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteCard(card.id)}
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-red-400/20 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Card Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-3xl"
                            onClick={() => setIsAdding(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="glass-dark border border-white/10 w-full max-w-xl rounded-[3rem] p-12 relative z-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
                                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-clay shadow-[0_0_20px_rgba(52,211,153,1)]" />
                            </div>

                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 bg-clay/10 rounded-2xl flex items-center justify-center border border-clay/20">
                                    <Plus className="text-clay" size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-clay mb-1">Authorization Phase</p>
                                    <h3 className="text-4xl italic tracking-tighter text-white font-black leading-none">Register Asset</h3>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-4 relative">
                                    <label className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30 ml-1">Establish Issuer</label>
                                    <button 
                                        onClick={() => setOpenBankDropdown(!openBankDropdown)}
                                        className="w-full glass-card rounded-2xl px-8 py-5 text-white text-left flex items-center justify-between group hover:border-white/30 transition-all shadow-inner"
                                    >
                                        <div className="flex items-center gap-4">
                                            {selectedBank ? (
                                                <div className="w-8 h-8 bg-white rounded-lg p-1.5 border border-white/20">
                                                    <img src={BANK_LOGOS[selectedBank]} className="w-full h-full object-contain" alt="" />
                                                </div>
                                            ) : <Landmark size={20} className="text-white/20" />}
                                            <span className="text-sm font-black uppercase tracking-[0.2em]">{selectedBank || 'Select Financial Entity'}</span>
                                        </div>
                                        <ChevronDown size={20} className={`text-white/20 transition-transform duration-500 ${openBankDropdown ? 'rotate-180' : ''}`} />
                                    </button>

                                    {openBankDropdown && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                            className="absolute top-full left-0 right-0 mt-4 glass-dark border border-white/10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-[110] max-h-72 overflow-y-auto dashboard-scroll p-3"
                                        >
                                            {ALL_BANKS.map(bank => (
                                                <button 
                                                    key={bank}
                                                    onClick={() => { setSelectedBank(bank); setOpenBankDropdown(false); setSelectedCardId(''); }}
                                                    className="w-full flex items-center gap-5 px-6 py-4 hover:bg-white/5 rounded-2xl text-white transition-all group"
                                                >
                                                    <div className="w-10 h-10 bg-white rounded-xl p-2 group-hover:scale-110 transition-transform">
                                                        <img src={BANK_LOGOS[bank]} className="w-full h-full object-contain" alt="" />
                                                    </div>
                                                    <span className="text-xs font-black tracking-[0.1em] uppercase">{bank}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30 ml-1">Select Variant</label>
                                    <div className="relative">
                                        <select 
                                            disabled={!selectedBank}
                                            value={selectedCardId}
                                            onChange={e => setSelectedCardId(e.target.value)}
                                            className="w-full glass-card rounded-2xl px-8 py-5 text-white outline-none focus:border-clay/50 transition-all appearance-none text-sm font-black uppercase tracking-[0.1em] disabled:opacity-30 cursor-pointer"
                                        >
                                            <option value="" className="bg-[#0f0f0f]">Calibrating Variants...</option>
                                            {filteredCards.map(c => (
                                                <option key={c.id} value={c.id} className="bg-[#0f0f0f]">{c.name}</option>
                                            ))}
                                            <option value="Other" className="bg-[#0f0f0f]">Custom Identifier / Not Listed</option>
                                        </select>
                                        <ChevronDown size={20} className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="flex gap-6 pt-6">
                                    <button 
                                        onClick={() => setIsAdding(false)}
                                        className="flex-1 glass-card text-white/30 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/5 hover:text-white transition-all"
                                    >
                                        Terminate
                                    </button>
                                    <button 
                                        onClick={handleAddCard}
                                        disabled={isSubmitting || !selectedCardId}
                                        className="flex-[2] bg-white text-black py-6 rounded-2xl flex items-center justify-center gap-4 group shadow-2xl active:scale-95 transition-all disabled:opacity-30"
                                    >
                                        <span className="text-[11px] font-black uppercase tracking-[0.4em]">{isSubmitting ? 'Syncing...' : 'Authorize Integration'}</span>
                                        {!isSubmitting && <Sparkles size={22} className="group-hover:rotate-12 transition-transform duration-500" />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyCards;
