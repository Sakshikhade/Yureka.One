import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, PlusCircle, AlertTriangle, Trash2, 
  ArrowRight, Sparkles, X, Loader2, Upload, Image as ImageIcon,
  Check, Plus, Zap, Lock
} from 'lucide-react';
import SEO from './SEO';
import { submitCardContribution } from '../services/supabaseService';
import { useSupabase } from './SupabaseProvider';

type TabType = 'add' | 'update' | 'remove';

const ALL_BANKS = [
    'HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Yes Bank', 'RBL', 'Amex',
    'IndusInd', 'BOB', 'SC', 'Indian', 'PNB', 'IDFC', 'Canara', 'HSBC',
    'DBS', 'IDBI', 'AU', 'Equitas', 'CSB', 'Federal', 'SBM', 'South Indian',
    'Utkarsh Bank', 'Suryoday Bank', 'Union Bank', 'Unity SFB', 'DCB',
    'Bank Of India', 'J&K Bank', 'CUB', 'Slice SFB', 'Dhanlaxmi Bank', 'Indian Overseas Bank'
];

const ALL_CATEGORIES = [
    'Travel', 'Hotels', 'Cashback', 'Shopping', 'Dining', 'Lounge Access', 'UPI'
];

const ContributePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('add');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { cards } = useSupabase();
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [selectedCardId, setSelectedCardId] = useState<string>('');

  // Unified state for the giant Add Card form
  const [form, setForm] = useState<any>({
    name: '', bank: '', category: '', annual_fee: '', joining_fee: '',
    apply_link: '', author: '', benefit_items: [], best_for: '', cons: [], description: '',
    elite_rating: 4.5, rating: 4.5, intro_offer: '', issuer: '', image: null,
    type: 'Rewards', color: 'from-blue-600 to-indigo-700', benefits: [], categories: [],
    grid_benefits: [
      {title: 'MOVIE & DINING', value: ''}, {title: 'REWARDS RATE', value: ''},
      {title: 'REWARD REDEMPTION', value: ''}, {title: 'TRAVEL', value: ''},
      {title: 'LOUNGE ACCESS', value: ''}, {title: 'INSURANCE BENEFITS', value: ''}
    ], 
    grid_fees: [
      {title: 'SPEND-BASED WAIVER', value: ''}, {title: 'REWARDS REDEMPTION FEE', value: ''},
      {title: 'FOREIGN CURRENCY MARKUP', value: ''}, {title: 'FUEL SURCHARGE WAIVER', value: ''},
      {title: 'CASH ADVANCE CHARGES', value: ''}, {title: 'INTEREST RATES', value: ''}
    ],
    latest_news: [], product_details: [], projected_savings: '', pros: [],
    redemption_table: [
      {category: 'PRODUCT CATALOG', value: ''}, {category: 'FLIGHTS/HOTELS', value: ''},
      {category: 'CASHBACK', value: ''}, {category: 'AIRMILES', value: ''}
    ],
    reward_type: '', rewards_rate: '', slug: '', verdict: ''
  });

  const [inaccuracyDetails, setInaccuracyDetails] = useState('');
  const [removalReason, setRemovalReason] = useState('');
  const [email, setEmail] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedCardId && (activeTab === 'update' || activeTab === 'remove')) {
      const card = cards?.find(c => c.id === selectedCardId);
      if (card) {
        // Deep clone and ensure arrays are not null
        const cardData = JSON.parse(JSON.stringify(card));
        const safeCard = {
          ...cardData,
          benefit_items: cardData.benefit_items || [],
          grid_benefits: cardData.grid_benefits || [],
          grid_fees: cardData.grid_fees || [],
          latest_news: cardData.latest_news || [],
          product_details: cardData.product_details || [],
          pros: cardData.pros || [],
          cons: cardData.cons || [],
          redemption_table: cardData.redemption_table || [],
        };
        setForm(safeCard);
      }
    } else if (activeTab === 'add') {
      // Keep empty form
    }
  }, [selectedCardId, activeTab, cards]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let payload: any = {};
      
      if (activeTab === 'add') {
        payload = { ...form };
      } else if (activeTab === 'update') {
        payload = { ...form, id: selectedCardId, inaccuracyDetails };
      } else if (activeTab === 'remove') {
        payload = { id: selectedCardId, removalReason, card_name: form.name };
      }
      
      await submitCardContribution({
        type: activeTab,
        status: 'pending',
        card_name: form.name,
        email: email,
        payload: payload
      });
      
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to submit contribution:', err);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({...form, image: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = (name: string, bank: string) => {
    const safeBank = bank ? bank.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
    const safeName = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
    return `${safeBank}-${safeName}`.replace(/^-+|-+$/g, '');
  };

  if (!cards) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="text-clay animate-spin" size={48} />
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'add', label: 'Missing Card', icon: <PlusCircle size={18} />, desc: 'Suggest a card we haven\'t added yet.' },
    { id: 'update', label: 'Update Details', icon: <AlertTriangle size={18} />, desc: 'Report incorrect fees, rewards, or perks.' },
    { id: 'remove', label: 'Remove Card', icon: <Trash2 size={18} />, desc: 'Request removal of a discontinued card.' },
  ];

  return (
    <>
      <SEO 
        title="Contribute | Yureka Matrix" 
        description="Help us improve the Yureka credit card matrix. Submit missing cards, report inaccurate details, or request card removals."
      />

      <div className="min-h-screen bg-cream selection:bg-clay/30 pt-10 pb-24 px-4 md:px-12 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-clay/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 pt-16 md:pt-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 mb-6 bg-white/5 border border-white/10 rounded-full shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-clay animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Community Intel</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tighter text-white uppercase leading-[0.9]">
              Refine The <span className="text-clay italic font-thin serif">Matrix.</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="relative bg-white/5 w-full rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col border border-white/10"
          >
            {/* Modal Header Replica */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-clay/10 rounded-xl flex items-center justify-center text-clay border border-clay/20">
                   <div className="w-2.5 h-2.5 bg-clay rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-black text-white uppercase tracking-tight">
                    {activeTab === 'add' ? 'Initialize Product' : activeTab === 'update' ? 'Modify Configuration' : 'Decommission Node'}
                  </h2>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">Status: Configuration Active</p>
                </div>
              </div>
              <Link to="/cards" className="p-3 text-white/20 hover:text-white hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5">
                <X size={20} />
              </Link>
            </div>

            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center text-center py-16"
                  >
                    <div className="w-24 h-24 bg-clay/10 border border-clay/20 rounded-full flex items-center justify-center mb-8 relative">
                      <div className="absolute inset-0 bg-clay/20 blur-xl rounded-full" />
                      <CheckCircle2 size={48} className="text-clay relative z-10" />
                    </div>
                    <h3 className="text-3xl font-heading font-bold text-white uppercase tracking-tight mb-4">Intelligence <span className="text-clay">Received</span></h3>
                    <p className="text-white/50 max-w-md mx-auto text-sm md:text-base leading-relaxed mb-10">
                      Thank you for contributing to the Yureka Matrix. Our neural review team will verify the details and update the system shortly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={() => setIsSuccess(false)} className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                        Submit Another
                      </button>
                      <Link to="/cards" className="px-8 py-4 bg-clay text-cream rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-[#2bc28a] transition-colors shadow-lg shadow-clay/20">
                        Return to Matrix
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {/* Tabs */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-12">
                      {tabs?.map((t) => (
                        <button
                          key={t.id} onClick={() => setActiveTab(t.id)} type="button"
                          className={`flex-1 flex flex-col items-start p-4 rounded-2xl border transition-all duration-300 ${
                            activeTab === t.id ? 'bg-clay/10 border-clay/30 shadow-lg shadow-clay/5' : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]'
                          }`}
                        >
                          <div className={`p-2 rounded-xl mb-3 ${activeTab === t.id ? 'bg-clay text-cream' : 'bg-white/5 text-white/40'}`}>
                            {t.icon}
                          </div>
                          <div className={`text-[12px] font-bold uppercase tracking-widest mb-1 ${activeTab === t.id ? 'text-clay' : 'text-white/60'}`}>
                            {t.label}
                          </div>
                          <div className="text-[10px] text-white/30 text-left leading-relaxed">{t.desc}</div>
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 admin-forms-dark">
                      
                      {/* CARD SELECTOR FOR UPDATE / REMOVE */}
                      {(activeTab === 'update' || activeTab === 'remove') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Select Bank <span className="text-red-500">*</span></label>
                            <select 
                              required 
                              value={selectedBank} 
                              onChange={(e) => {
                                setSelectedBank(e.target.value);
                                setSelectedCardId(''); // Reset card selection when bank changes
                              }} 
                              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white appearance-none"
                            >
                              <option value="" className="bg-cream">Choose Bank</option>
                              {Array.from(new Set((cards || []).filter(Boolean).map(c => c.bank).filter(Boolean))).sort().map(bank => (
                                <option key={bank} value={bank} className="bg-cream">{bank}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Select Card <span className="text-red-500">*</span></label>
                            <select 
                              required 
                              disabled={!selectedBank}
                              value={selectedCardId} 
                              onChange={(e) => setSelectedCardId(e.target.value)} 
                              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <option value="" className="bg-cream">{selectedBank ? 'Choose a card from the database' : 'Select a bank first'}</option>
                              {(cards || []).filter(Boolean).filter(c => c.bank === selectedBank).map(c => (
                                <option key={c.id} value={c.id} className="bg-cream">{c.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* ADD / UPDATE CARD FORM REPLICA */}
                      {(activeTab === 'add' || (activeTab === 'update' && selectedCardId)) && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-8">
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Card Designation</label>
                                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white placeholder:text-white/10" placeholder="Entity Name" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Financial Node</label>
                                  <select required value={form.bank} onChange={e => setForm({...form, bank: e.target.value, issuer: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white appearance-none">
                                    <option value="" className="bg-cream">Select Issuer</option>
                                    {ALL_BANKS?.map(b => <option key={b} value={b} className="bg-cream">{b}</option>)}
                                  </select>
                                </div>
                              </div>
                              <div>
                                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1 flex items-center justify-between">
                                      Identification Slug 
                                      <button type="button" onClick={() => setForm({...form, slug: generateSlug(form.name, form.bank)})} className="text-[9px] text-clay hover:underline uppercase font-black tracking-widest">Auto-Compute</button>
                                  </label>
                                  <input type="text" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white font-mono text-xs" placeholder="system-generated-slug" />
                              </div>
                                <div>
                                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Issuer Name</label>
                                  <input type="text" required value={form.issuer} onChange={e => setForm({...form, issuer: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white" />
                                </div>
                                {activeTab === 'update' && (
                                  <>
                                    <div>
                                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Standard Rating</label>
                                      <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({...form, rating: parseFloat(e.target.value)})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white font-bold" />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-black uppercase tracking-widest text-clay mb-2 ml-1">Elite Alpha</label>
                                      <input type="number" step="0.1" min="0" max="5" value={form.elite_rating} onChange={e => setForm({...form, elite_rating: parseFloat(e.target.value)})} className="w-full bg-clay/10 border border-clay/20 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-clay font-black" />
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Core Classification</label>
                                  <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white appearance-none">
                                    <option value="" className="bg-cream">Select Sector</option>
                                    {ALL_CATEGORIES?.map(c => <option key={c} value={c} className="bg-cream">{c}</option>)}
                                  </select>
                                </div>
                                {activeTab === 'update' && (
                                  <div>
                                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Yield Potential</label>
                                      <input type="text" placeholder="e.g. 5% Accelerator" value={form.rewards_rate} onChange={e => setForm({...form, rewards_rate: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white" />
                                  </div>
                                )}
                              </div>

                              <div className="space-y-8">
                              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Visual Identity Asset</label>
                              <div className="relative aspect-[1.6/1] rounded-[2rem] overflow-hidden bg-white/5 border-2 border-dashed border-white/10 group flex items-center justify-center">
                                {form.image ? (
                                  <img src={form.image} alt="Preview" className="w-full h-full object-contain p-8 drop-shadow-2xl" />
                                ) : (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/10">
                                    <ImageIcon size={64} strokeWidth={1} />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-4">Awaiting Asset Deployment</p>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-cream/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                                  <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-white text-cream p-5 rounded-full hover:scale-110 transition-transform shadow-2xl active:scale-95">
                                    <Upload size={24} />
                                  </button>
                                </div>
                              </div>
                              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                              <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">Recommendation: Use high-fidelity PNG or SVG assets with transparent backgrounds for maximum elite aesthetic depth.</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Annual Overhead</label>
                              <input type="text" required value={form.annual_fee} onChange={e => setForm({...form, annual_fee: e.target.value.replace(/^₹/, '')})} placeholder="Numerical value" className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white font-bold" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Onboarding Fee</label>
                              <input type="text" required value={form.joining_fee} onChange={e => setForm({...form, joining_fee: e.target.value.replace(/^₹/, '')})} placeholder="Numerical value" className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white font-bold" />
                            </div>
                            {activeTab === 'update' && (
                              <>
                                <div>
                                  <label className="block text-[10px] font-black uppercase tracking-widest text-clay mb-2 ml-1">Intro Incentive</label>
                                  <input type="text" placeholder="Exclusive offer text" value={form.intro_offer} onChange={e => setForm({...form, intro_offer: e.target.value})} className="w-full bg-clay/10 border border-clay/20 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all font-black text-clay placeholder:text-clay/30" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Alpha Savings</label>
                                  <input type="text" placeholder="Estimated ₹ yield" value={form.projected_savings} onChange={e => setForm({...form, projected_savings: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white" />
                                </div>
                              </>
                            )}
                          </div>

                          {activeTab === 'update' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Optimal Utility Case</label>
                                  <input type="text" placeholder="e.g. High-Velocity Travel" value={form.best_for} onChange={e => setForm({...form, best_for: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white" />
                              </div>
                              <div>
                                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Application Protocol Link</label>
                                  <input type="text" placeholder="https://external-node.com/..." value={form.apply_link} onChange={e => setForm({...form, apply_link: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white font-mono text-xs" />
                              </div>
                            </div>
                          )}

                          <div className="space-y-10 pt-10 border-t border-white/5">
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-6 ml-1">Benefits Portfolio Architecture</label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {(form?.benefit_items || []).map((benefit: any, idx: number) => (
                                    <div key={idx} className="flex items-start gap-4 bg-white/5 p-6 rounded-[2rem] relative group/item border border-white/5">
                                      <div className="flex-1 space-y-4">
                                          <input type="text" placeholder="Core Proposition" value={benefit.heading} onChange={e => { const newItems = [...form.benefit_items]; newItems[idx].heading = e.target.value; setForm({...form, benefit_items: newItems}); }} className="w-full bg-cream border border-white/10 rounded-xl p-3.5 text-sm font-black text-white focus:ring-2 focus:ring-clay outline-none placeholder:text-white/10" />
                                          <input type="text" placeholder="Technical Detail" value={benefit.subheading} onChange={e => { const newItems = [...form.benefit_items]; newItems[idx].subheading = e.target.value; setForm({...form, benefit_items: newItems}); }} className="w-full bg-transparent border border-white/5 rounded-xl p-3.5 text-xs text-white/50 focus:ring-2 focus:ring-clay outline-none placeholder:text-white/5" />
                                      </div>
                                      <button type="button" onClick={() => setForm({...form, benefit_items: form.benefit_items.filter((_:any, i:number) => i !== idx)})} className="text-red-500 hover:bg-red-500/10 p-3 rounded-xl opacity-0 group-hover/item:opacity-100 transition-all">
                                        <Trash2 size={18} />
                                      </button>
                                    </div>
                                  ))}
                                  <button type="button" onClick={() => setForm({...form, benefit_items: [...form.benefit_items, {heading: '', subheading: ''}]})} className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2rem] p-8 hover:border-clay/50 transition-all group hover:bg-clay/5">
                                      <Plus className="text-white/10 group-hover:text-clay mb-3 transition-colors" size={32} />
                                      <span className="text-clay font-black text-[11px] uppercase tracking-[0.2em]">Deploy Benefit Node</span>
                                  </button>
                              </div>
                            </div>
                          </div>

                          {activeTab === 'update' && (
                            <>
                              <div className="space-y-10 pt-10 border-t border-white/5">
                                <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
                                  <div className="absolute top-0 right-0 w-64 h-64 bg-clay/5 blur-[80px] rounded-full -mr-32 -mt-32" />
                                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-clay mb-10 flex items-center gap-3">
                                    <Sparkles size={20} className="animate-pulse" /> Master Intelligence Analysis
                                  </h3>
                                  <div className="space-y-10 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                      <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Lead Analyst</label>
                                        <input type="text" value={form.author} onChange={e => setForm({...form, author: e.target.value})} className="w-full bg-cream border border-white/10 rounded-2xl p-4 text-sm text-white focus:ring-2 focus:ring-clay outline-none transition-all font-bold" />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Asset Class Reward</label>
                                        <input type="text" value={form.reward_type} onChange={e => setForm({...form, reward_type: e.target.value})} className="w-full bg-cream border border-white/10 rounded-2xl p-4 text-sm text-white focus:ring-2 focus:ring-clay outline-none transition-all font-bold" />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Executive Summary (Intel Core)</label>
                                      <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-cream border border-white/10 rounded-2xl p-5 text-sm text-white/80 focus:ring-2 focus:ring-clay outline-none transition-all h-32 leading-relaxed font-serif italic" placeholder="Support Markdown formatting for high-fidelity technical reports..." />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                      <div className="space-y-6">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-clay flex items-center gap-2"><Check size={14} /> Yield Parameters</label>
                                        <div className="space-y-3">
                                          {(form?.grid_benefits || []).map((b: any, idx: number) => (
                                            <div key={idx} className="flex gap-3">
                                              <div className="w-1/3 bg-white/5 border border-white/5 rounded-xl p-3 text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center">{b.title}</div>
                                              <input type="text" value={b.value} onChange={e => { const next = [...form.grid_benefits]; next[idx].value = e.target.value; setForm({...form, grid_benefits: next}); }} className="w-2/3 bg-cream border border-white/10 rounded-xl p-3 text-xs text-white font-bold focus:ring-1 focus:ring-clay outline-none" />
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="space-y-6">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-clay flex items-center gap-2"><Zap size={14} /> Protocol Fees</label>
                                        <div className="space-y-3">
                                          {(form?.grid_fees || []).map((f: any, idx: number) => (
                                            <div key={idx} className="flex gap-3">
                                              <div className="w-1/3 bg-white/5 border border-white/5 rounded-xl p-3 text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center">{f.title}</div>
                                              <input type="text" value={f.value} onChange={e => { const next = [...form.grid_fees]; next[idx].value = e.target.value; setForm({...form, grid_fees: next}); }} className="w-2/3 bg-cream border border-white/10 rounded-xl p-3 text-xs text-white font-bold focus:ring-1 focus:ring-clay outline-none" />
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                      <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-clay">Accelerator Assets (Pros)</label>
                                          <button type="button" onClick={() => setForm({...form, pros: [...form.pros, '']})} className="text-clay hover:scale-125 transition-transform"><Plus size={18} /></button>
                                        </div>
                                        <div className="space-y-3">
                                          {(form?.pros || []).map((p: string, i: number) => (
                                            <div key={i} className="flex gap-3 group">
                                              <input type="text" value={p} onChange={e => { const next = [...form.pros]; next[i] = e.target.value; setForm({...form, pros: next}); }} className="flex-1 bg-cream border border-clay/20 rounded-xl p-3.5 text-xs text-white" />
                                              <button type="button" onClick={() => setForm({...form, pros: form.pros.filter((_:any, j:number) => i!==j)})} className="text-white/20 hover:text-red-500 transition-colors"><X size={16} /></button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Inhibition Factors (Cons)</label>
                                          <button type="button" onClick={() => setForm({...form, cons: [...form.cons, '']})} className="text-red-500 hover:scale-125 transition-transform"><Plus size={18} /></button>
                                        </div>
                                        <div className="space-y-3">
                                          {(form?.cons || []).map((p: string, i: number) => (
                                            <div key={i} className="flex gap-3 group">
                                              <input type="text" value={p} onChange={e => { const next = [...form.cons]; next[i] = e.target.value; setForm({...form, cons: next}); }} className="flex-1 bg-cream border border-red-500/20 rounded-xl p-3.5 text-xs text-white" />
                                              <button type="button" onClick={() => setForm({...form, cons: form.cons.filter((_:any, j:number) => i!==j)})} className="text-white/20 hover:text-red-500 transition-colors"><X size={16} /></button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-6">
                                      <div className="flex justify-between items-center">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-clay">Technical Specifications</label>
                                        <button type="button" onClick={() => setForm({...form, product_details: [...form.product_details, '']})} className="text-clay hover:scale-125 transition-transform"><Plus size={18} /></button>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(form?.product_details || []).map((p: string, i: number) => (
                                          <div key={i} className="flex gap-3 group">
                                            <input type="text" value={p} onChange={e => { const next = [...form.product_details]; next[i] = e.target.value; setForm({...form, product_details: next}); }} className="flex-1 bg-cream border border-white/10 rounded-xl p-3 text-xs text-white/80" />
                                            <button type="button" onClick={() => setForm({...form, product_details: form.product_details.filter((_:any, j:number) => i!==j)})} className="text-white/20 hover:text-red-500 transition-colors"><X size={16} /></button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="space-y-6">
                                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-clay">Redemption Equilibrium Values</label>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {(form?.redemption_table || []).map((r: any, i: number) => (
                                          <div key={i} className="bg-cream border border-white/10 rounded-2xl p-4 space-y-2">
                                            <div className="text-[9px] font-black uppercase tracking-widest text-white/30">{r.category}</div>
                                            <input type="text" value={r.value} onChange={el => { const next = [...form.redemption_table]; next[i].value = el.target.value; setForm({...form, redemption_table: next}); }} className="w-full bg-transparent border-none p-0 text-sm text-white font-bold focus:ring-0 outline-none" />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="space-y-6">
                                      <div className="flex justify-between items-center">
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-clay">Signal Intelligence (Updates)</label>
                                        <button type="button" onClick={() => setForm({...form, latest_news: [...form.latest_news, '']})} className="text-clay hover:scale-125 transition-transform"><Plus size={18} /></button>
                                      </div>
                                      <div className="space-y-3">
                                        {(form?.latest_news || []).map((n: string, i: number) => (
                                          <div key={i} className="flex gap-3 group">
                                            <div className="w-2 h-2 rounded-full bg-clay mt-4 shrink-0" />
                                            <input type="text" value={n} onChange={e => { const next = [...form.latest_news]; next[i] = e.target.value; setForm({...form, latest_news: next}); }} className="flex-1 bg-transparent border-b border-white/10 py-2 text-sm text-white/60 focus:text-white focus:border-clay outline-none transition-all" />
                                            <button type="button" onClick={() => setForm({...form, latest_news: form.latest_news.filter((_:any, j:number) => i!==j)})} className="text-white/20 hover:text-red-500 transition-colors"><X size={16} /></button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-8 pt-10 border-t border-white/5">
                                <div>
                                    <div className="flex items-center justify-between mb-4 ml-1">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-white/30">Editorial Verdict (Neural Core)</label>
                                    </div>
                                    <textarea value={form.verdict} onChange={e => setForm({...form, verdict: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-[2rem] p-8 focus:ring-2 focus:ring-clay outline-none transition-all h-40 text-[15px] leading-relaxed text-white placeholder:text-white/10 font-serif italic" placeholder="Deploy AI synthesis or craft manual executive verdict..." />
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {/* UPDATE / REMOVE FIELDS */}
                      {((activeTab === 'update' || activeTab === 'remove') && selectedCardId) && (
                        <div className="grid grid-cols-1 gap-10 mt-8 border-t border-white/5 pt-8">
                          {activeTab === 'update' && (
                            <div className="space-y-2">
                              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Update Notes (Optional)</label>
                              <textarea 
                                value={inaccuracyDetails} onChange={(e) => setInaccuracyDetails(e.target.value)} placeholder="e.g. Changed the lounge access from 4 to 2." 
                                rows={2} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white placeholder:text-white/10 resize-none"
                              />
                            </div>
                          )}

                          {activeTab === 'remove' && (
                            <div className="space-y-2">
                              <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Reason for Removal <span className="text-red-500">*</span></label>
                              <textarea 
                                required value={removalReason} onChange={(e) => setRemovalReason(e.target.value)} placeholder="e.g. This card has been officially discontinued and replaced by..." 
                                rows={3} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white placeholder:text-white/10 resize-none"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {(activeTab === 'add' || (activeTab === 'update' && selectedCardId) || (activeTab === 'remove' && selectedCardId)) && (
                        <div className="space-y-2 mt-8 pt-8 border-t border-white/5">
                          <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 ml-1">Your Email (Optional)</label>
                          <input 
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="To notify you when we update it" 
                            className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-clay outline-none transition-all text-white placeholder:text-white/10"
                          />
                        </div>
                      )}

                      {/* Common Footer */}
                      <div className="flex justify-between items-center pt-10 border-t border-white/5 mt-10">
                        <div className="flex items-center gap-3 text-white/30 text-[10px] uppercase tracking-widest font-bold">
                          <Lock size={12} />
                          Data encrypted & verified
                        </div>
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="bg-white text-cream px-16 py-5 rounded-[2rem] font-black hover:bg-clay hover:text-white transition-all shadow-2xl disabled:opacity-50 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] shrink-0 active:scale-95"
                        >
                          {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Zap size={22} className="fill-current" />}
                          {isSubmitting ? 'TRANSMITTING...' : 'COMMIT INTELLIGENCE'}
                        </button>
                      </div>

                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ContributePage;
