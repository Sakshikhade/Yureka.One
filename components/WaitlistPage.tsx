import React, { useState, useEffect, useMemo } from 'react';
import { 
    ArrowLeft, User, Building, Check, ArrowRight, Plus, Minus, 
    LayoutGrid, Rocket, ShieldCheck, Gift, Sparkles, HelpCircle, 
    Loader2, CreditCard, Landmark, Share2, Twitter, Instagram, 
    Send, MessageCircle, Copy, Globe, ChevronDown, Calendar, 
    Mail, Phone, Trash2
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { joinWaitlist, fetchCardsPublic } from '../services/supabaseService';
import { useSupabase } from './SupabaseProvider';
import { motion, AnimatePresence } from 'motion/react';

// ─── MASTER DATA ───
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

const DISCOVERY_SOURCES = [
    'Linkedin', 'Instagram', 'WhatsApp', 'Referral', 'Youtube', 'Reddit', 'Product Hunt', 'Telegram', 'Twitter', 'Other'
];

const SPEND_BRACKETS = [
    '0-25K', '25K-50K', '50K-1 Lac', '1 Lac to 2.5Lac', '2.5 Lac to 5 Lac', 'More than 5 Lac'
];

const USAGE_CATEGORIES = ['Dining', 'Fuels', 'Shopping', 'Travel', 'UPI'];

const WaitlistPage: React.FC = () => {
    const { supabase, user, session, cards: allCards } = useSupabase();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [step, setStep] = useState(1);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<{ rank: number; referralCode: string } | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        dateOfBirth: '',
        gender: '',
        creditCardsCount: 1,
        creditCards: [{ bank: '', card: '' }],
        mostUsedFor: ['Dining'] as string[],
        monthlySpend: '0-25K',
        referralCode: '',
        sourceChannel: 'Linkedin',
        otherSource: ''
    });

    const [openBankDropdown, setOpenBankDropdown] = useState<number | null>(null);

    // ─── REFERRAL PREFILLING ───
    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) {
            setFormData(prev => ({ ...prev, referralCode: ref }));
        }
    }, [searchParams]);

    // ─── STEP 1: GOOGLE AUTH ───
    const handleGoogleSignup = async () => {
        setIsLoadingData(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'https://www.googleapis.com/auth/user.phonenumbers.read https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read',
                redirectTo: window.location.origin + '/join-waitlist'
            }
        });
        if (error) setError(error.message);
        setIsLoadingData(false);
    };

    // ─── DATA EXTRACTION ───
    useEffect(() => {
        if (user && step === 1) {
            extractUserData();
        }
    }, [user]);

    const extractUserData = async () => {
        setIsLoadingData(true);
        try {
            // Basic data from Supabase user metadata
            const metadata = user?.user_metadata;
            const fullName = metadata?.full_name || '';
            const [first, ...lastParts] = fullName.split(' ');
            
            setFormData(prev => ({
                ...prev,
                firstName: first || '',
                lastName: lastParts.join(' ') || '',
                email: user?.email || '',
            }));

            // Fetch extra data from People API if token is available
            const providerToken = session?.provider_token;
            if (providerToken) {
                const response = await fetch('https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,phoneNumbers,birthdays,genders', {
                    headers: { Authorization: `Bearer ${providerToken}` }
                });
                const data = await response.json();
                
                if (data.phoneNumbers?.[0]?.value) {
                    setFormData(prev => ({ ...prev, mobileNumber: data.phoneNumbers[0].value }));
                }
                
                if (data.birthdays?.[0]?.date) {
                    const { year, month, day } = data.birthdays[0].date;
                    const dob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    setFormData(prev => ({ ...prev, dateOfBirth: dob }));
                }

                if (data.genders?.[0]?.value) {
                    setFormData(prev => ({ ...prev, gender: data.genders[0].value }));
                }
            }

            setStep(2); // Move to Profile Completion
        } catch (err) {
            console.error("Failed to extract data:", err);
            setStep(2); // Continue anyway
        } finally {
            setIsLoadingData(false);
        }
    };

    // ─── CARD LOGIC ───
    const handleCardCountChange = (count: number) => {
        const newCards = [...formData.creditCards];
        if (count > newCards.length) {
            for (let i = newCards.length; i < count; i++) {
                newCards.push({ bank: '', card: '' });
            }
        } else {
            newCards.splice(count);
        }
        setFormData({ ...formData, creditCardsCount: count, creditCards: newCards });
    };

    const updateCardDetail = (index: number, field: 'bank' | 'card', value: string) => {
        const newCards = [...formData.creditCards];
        newCards[index][field] = value;
        if (field === 'bank') newCards[index].card = ''; // Reset card when bank changes
        setFormData({ ...formData, creditCards: newCards });
    };

    const filteredCardsForBank = (bank: string) => {
        if (!bank) return [];
        const searchBank = bank.toLowerCase();
        return allCards.filter(c => {
            const issuer = (c.issuer || '').toLowerCase();
            const cardBank = (c.bank || '').toLowerCase();
            return issuer.includes(searchBank) || cardBank.includes(searchBank) || searchBank.includes(issuer) || searchBank.includes(cardBank);
        });
    };

    const toggleUsageCategory = (cat: string) => {
        setFormData(prev => {
            const current = prev.mostUsedFor;
            if (current.includes(cat)) {
                if (current.length === 1) return prev; // Min 1
                return { ...prev, mostUsedFor: current.filter(c => c !== cat) };
            } else {
                if (current.length === 3) return prev; // Max 3
                return { ...prev, mostUsedFor: [...current, cat] };
            }
        });
    };

    // ─── SUBMISSION ───
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const entry = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                mobile_number: formData.mobileNumber,
                date_of_birth: formData.dateOfBirth,
                gender: formData.gender,
                credit_cards_count: formData.creditCardsCount,
                credit_cards_details: formData.creditCards,
                most_used_for: formData.mostUsedFor.join(', '),
                monthly_spend: formData.monthlySpend,
                referral_code: formData.referralCode,
                source_channel: formData.sourceChannel === 'Other' ? formData.otherSource : formData.sourceChannel,
                role: 'user',
                status: 'pending'
            };

            const result = await joinWaitlist(entry);
            setSuccessData({
                rank: result.rank,
                referralCode: result.personal_referral_code
            });
            setStep(5);
        } catch (err: any) {
            setError(err.message || "Failed to join waitlist. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── SHARE LOGIC ───
    const shareLink = `https://yureka.money/join-waitlist?ref=${successData?.referralCode}`;
    const shareText = "I just joined the Yureka.Money waitlist! Use my referral code to get priority access.";

    const shareOnSocial = (platform: string) => {
        const urls: any = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareLink)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareLink)}`,
            reddit: `https://www.reddit.com/submit?title=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareLink)}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(shareText)}`,
        };
        if (urls[platform]) window.open(urls[platform], '_blank');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        alert("Link copied to clipboard!");
    };

    // ─── RENDERERS ───

    const renderStep1 = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="w-20 h-20 bg-clay/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Sparkles size={40} className="text-clay" />
            </div>
            <h2 className="text-4xl md:text-5xl italic tracking-tighter text-white mb-6">Begin Your Journey</h2>
            <p className="text-white/40 text-lg mb-12 max-w-md mx-auto">Link your Gmail to unlock priority access and prefill your profile.</p>
            
            <button 
                onClick={handleGoogleSignup}
                disabled={isLoadingData}
                className="w-full max-w-md bg-white text-cream py-6 rounded-2xl flex items-center justify-center gap-4 group hover:bg-clay transition-all shadow-2xl active:scale-95 disabled:opacity-50 mx-auto"
            >
                {isLoadingData ? <Loader2 className="animate-spin" size={20} /> : <Globe size={20} />}
                <span className="text-xs font-black uppercase tracking-[0.3em]">Sign Up with Google</span>
            </button>
            <p className="mt-8 text-[10px] font-bold uppercase tracking-widest text-white/20">Secure OAuth 2.0 Encryption</p>
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
            <div className="text-center mb-12">
                <h3 className="text-3xl italic text-white mb-2">Refine Your Identity</h3>
                <p className="text-white/40 text-sm">We've prefilled what we could from your Google account.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">First Name</label>
                    <input 
                        type="text" value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-clay transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Last Name</label>
                    <input 
                        type="text" value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-clay transition-all"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Associated Mobile Number</label>
                <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                        type="tel" value={formData.mobileNumber} placeholder="+91 XXXXX XXXXX"
                        onChange={e => setFormData({...formData, mobileNumber: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-16 pr-6 py-4 text-white outline-none focus:border-clay transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Date of Birth</label>
                    <div className="relative">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                            type="date" value={formData.dateOfBirth}
                            onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-16 pr-6 py-4 text-white outline-none focus:border-clay transition-all appearance-none"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Gender</label>
                    <select 
                        value={formData.gender}
                        onChange={e => setFormData({...formData, gender: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-clay transition-all appearance-none"
                    >
                        <option value="" className="bg-black">Select Gender</option>
                        <option value="male" className="bg-black">Male</option>
                        <option value="female" className="bg-black">Female</option>
                        <option value="other" className="bg-black">Other</option>
                    </select>
                </div>
            </div>

            <button 
                onClick={() => setStep(3)}
                className="w-full bg-clay text-cream py-5 rounded-2xl flex items-center justify-center gap-4 group shadow-xl active:scale-95 transition-all"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Continue to Financials</span>
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </button>
        </motion.div>
    );

    const renderStep3 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
            <div className="text-center mb-12">
                <h3 className="text-3xl italic text-white mb-2">Credit Portfolio</h3>
                <p className="text-white/40 text-sm">Help us understand your current credit reach.</p>
            </div>

            <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Number of Credit Cards</label>
                <div className="flex flex-wrap gap-3">
                    {[1, 2, 3, 4, 5, '6+'].map(n => (
                        <button 
                            key={n}
                            onClick={() => handleCardCountChange(typeof n === 'string' ? 6 : n)}
                            className={`px-6 py-4 rounded-xl border text-sm font-black transition-all ${formData.creditCardsCount === (typeof n === 'string' ? 6 : n) ? 'bg-clay border-clay text-cream shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-8">
                {formData.creditCards.map((card, idx) => (
                    <div key={idx} className="p-6 bg-white/[0.03] rounded-2xl border border-white/5 space-y-6 relative">
                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-clay text-cream rounded-lg flex items-center justify-center text-[10px] font-black shadow-lg">0{idx + 1}</div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2 relative">
                                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Select Bank</label>
                                <button 
                                    onClick={() => setOpenBankDropdown(openBankDropdown === idx ? null : idx)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-clay transition-all text-xs flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        {card.bank && BANK_LOGOS[card.bank] ? (
                                            <img src={BANK_LOGOS[card.bank]} alt="" className="w-5 h-5 object-contain" />
                                        ) : (
                                            <Landmark size={14} className="text-white/20" />
                                        )}
                                        <span>{card.bank || 'Choose Bank'}</span>
                                    </div>
                                    <ChevronDown size={14} className={`text-white/20 transition-transform ${openBankDropdown === idx ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {openBankDropdown === idx && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setOpenBankDropdown(null)} />
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                                className="absolute top-full left-0 right-0 mt-2 bg-cream border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto no-scrollbar"
                                            >
                                                {ALL_BANKS.map(bank => (
                                                    <button 
                                                        key={bank}
                                                        onClick={() => { updateCardDetail(idx, 'bank', bank); setOpenBankDropdown(null); }}
                                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-white transition-colors text-xs"
                                                    >
                                                        <div className="w-6 h-6 bg-white rounded-full p-1 flex items-center justify-center overflow-hidden border border-white/10">
                                                            <img src={BANK_LOGOS[bank]} alt="" className="w-full h-full object-contain" />
                                                        </div>
                                                        <span className="font-bold tracking-tight">{bank}</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Select Card</label>
                                <select 
                                    disabled={!card.bank}
                                    value={card.card}
                                    onChange={e => updateCardDetail(idx, 'card', e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-clay transition-all text-xs disabled:opacity-30"
                                >
                                    <option value="" className="bg-black">Choose Card</option>
                                    {filteredCardsForBank(card.bank).map(c => <option key={c.id} value={c.name} className="bg-black">{c.name}</option>)}
                                    <option value="Other" className="bg-black">Other / Not Listed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 border border-white/10 text-white/40 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/5 transition-all">Back</button>
                <button onClick={() => setStep(4)} className="flex-[2] bg-clay text-cream py-5 rounded-2xl flex items-center justify-center gap-4 group shadow-xl active:scale-95 transition-all">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Next Step</span>
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
        </motion.div>
    );

    const renderStep4 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
            <div className="text-center mb-12">
                <h3 className="text-3xl italic text-white mb-2">Spending DNA</h3>
                <p className="text-white/40 text-sm">Tell us how you use your capital.</p>
            </div>

            <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Primary Credit Use Case (Min 1, Max 3)</label>
                <div className="flex flex-wrap gap-3">
                    {USAGE_CATEGORIES.map(cat => {
                        const isSelected = formData.mostUsedFor.includes(cat);
                        return (
                            <button 
                                key={cat}
                                onClick={() => toggleUsageCategory(cat)}
                                className={`px-6 py-4 rounded-xl border text-xs font-black uppercase tracking-widest transition-all ${isSelected ? 'bg-clay border-clay text-cream shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Monthly Average Spend</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SPEND_BRACKETS.map(bracket => (
                        <button 
                            key={bracket}
                            onClick={() => setFormData({...formData, monthlySpend: bracket})}
                            className={`px-4 py-4 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all ${formData.monthlySpend === bracket ? 'bg-clay border-clay text-cream shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}
                        >
                            {bracket}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Discovery Channel</label>
                    <select 
                        value={formData.sourceChannel}
                        onChange={e => setFormData({...formData, sourceChannel: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-clay transition-all appearance-none text-xs"
                    >
                        {DISCOVERY_SOURCES.map(s => <option key={s} value={s} className="bg-black">{s}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Referral Code (Optional)</label>
                    <input 
                        type="text" placeholder="YUREKA-XXXX"
                        value={formData.referralCode}
                        onChange={e => setFormData({...formData, referralCode: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-clay transition-all text-xs"
                    />
                </div>
            </div>

            {formData.sourceChannel === 'Other' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Please Specify Source</label>
                    <input 
                        type="text" placeholder="e.g. Newspaper, Billboard..."
                        value={formData.otherSource}
                        onChange={e => setFormData({...formData, otherSource: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-clay transition-all text-xs"
                    />
                </motion.div>
            )}

            <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-white text-cream py-6 rounded-2xl flex items-center justify-center gap-6 group shadow-2xl active:scale-95 transition-all disabled:opacity-50"
            >
                <span className="text-[11px] font-black uppercase tracking-[0.4em]">{isSubmitting ? 'Securing Spot...' : 'Join the Inner Circle'}</span>
                {!isSubmitting && <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />}
            </button>
        </motion.div>
    );

    const renderStep5 = () => (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-24 h-24 bg-clay text-cream rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl animate-pulse">
                <Check size={48} strokeWidth={2} />
            </div>
            
            <h2 className="text-5xl md:text-7xl italic tracking-tighter text-white mb-6 leading-none">Confirmed.</h2>
            <p className="text-xl text-white/40 mb-12 italic">You've secured your place in the future of credit.</p>

            <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 mb-12 max-w-lg mx-auto relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-clay/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="relative z-10 space-y-10">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 mb-4">Overall Global Rank</p>
                        <p className="text-7xl md:text-8xl font-heading font-black text-white tracking-tighter leading-none">#{successData?.rank}</p>
                    </div>
                    
                    <div className="pt-10 border-t border-white/5">
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 mb-6">Personal Referral Core</p>
                        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5">
                            <span className="flex-1 font-mono text-lg font-bold text-clay tracking-wider pl-4">{successData?.referralCode}</span>
                            <button onClick={copyToClipboard} className="w-12 h-12 bg-clay text-cream rounded-xl flex items-center justify-center hover:scale-105 transition-transform"><Copy size={18} /></button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <p className="text-sm italic text-white/40">Higher referral density correlates with accelerated approval rates.</p>
                
                <div className="flex justify-center gap-4 flex-wrap">
                    {[
                        { icon: Twitter, color: 'hover:bg-[#1DA1F2]', action: () => shareOnSocial('twitter') },
                        { icon: MessageCircle, color: 'hover:bg-[#25D366]', action: () => shareOnSocial('whatsapp') },
                        { icon: Instagram, color: 'hover:bg-[#E4405F]', action: () => shareOnSocial('instagram') },
                        { icon: Send, color: 'hover:bg-[#0088cc]', action: () => shareOnSocial('telegram') },
                        { icon: Share2, color: 'hover:bg-white hover:text-black', action: copyToClipboard }
                    ].map((btn, i) => (
                        <button 
                            key={i} 
                            onClick={btn.action}
                            className={`w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white transition-all ${btn.color} hover:scale-110 active:scale-95`}
                        >
                            <btn.icon size={20} />
                        </button>
                    ))}
                </div>
            </div>

            <Link to="/" className="inline-block mt-16 text-[10px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-clay transition-all">Back to Archive</Link>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-cream pt-24 md:pt-32 pb-40 px-6 relative overflow-hidden font-serif selection:bg-clay/20">
            {/* Ambient background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="fixed top-1/4 -left-1/4 w-[60%] h-[60%] bg-clay/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-1/4 -right-1/4 w-[60%] h-[60%] bg-clay/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Progress Bar */}
                {step < 5 && (
                    <div className="mb-16 md:mb-24">
                        <div className="flex justify-between items-end mb-4">
                            <p className="text-clay font-bold text-[10px] uppercase tracking-[0.5em]">Phase 0{step}</p>
                            <p className="text-white/20 font-bold text-[9px] uppercase tracking-[0.3em]">Step {step} of 4</p>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(step / 4) * 100}%` }}
                                className="h-full bg-clay shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                            />
                        </div>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                    {step === 5 && renderStep5()}
                </AnimatePresence>

                {error && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                        <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{error}</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default WaitlistPage;