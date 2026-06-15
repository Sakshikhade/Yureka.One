import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Heart,
  ChevronDown,
  User,
  ArrowRight,
  Zap,
  SlidersHorizontal,
  TrendingUp,
  History
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import SEO from './SEO';

interface TransferRow {
  'Transfer From': string;
  'Transfer To': string;
  'From Category': string;
  'To Category': string;
  'Ratio': string;
  'Ratio Float': number;
  'Transfer Time': string;
  'Via': string;
  'Notes': string;
}

const VALUATION_MAP: Record<string, number> = {
  'AIRLINE': 0.95,
  'HOTEL': 0.45,
  'CREDIT_CARD': 0.25,
  'DEFAULT': 0.35
};

const PROGRAM_LOGOS: Record<string, string> = {
  'Accor Live Limitless': '/logos/accor.png',
  'AerClub': '/logos/aerclub.png',
  'Aeroplan': '/logos/aeroplan.png',
  'ANA Mileage Club': '/logos/ana.png',
  'Amex': '/logos/amex.png',
  'Asia Miles (Cathay)': '/logos/asiamiles.png',
  'Atmos Rewards': '/logos/atmos.png',
  'AU': '/logos/au.png',
  'Axis': '/logos/axis.png',
  'British Airways Executive Club': '/logos/britishairways.png',
  'Emirates Skywards': '/logos/emirates.png',
  'FalconFlyer': '/logos/falconflyer.png',
  'Fi Credit Card': '/logos/fi.png',
  'Finnair Plus': '/logos/finnair.png',
  'HDFC': '/logos/hdfc.png',
  'HSBC': '/logos/hsbc.png',
  'ICICI': '/logos/icici.png',
  'IndusInd': '/logos/indusind.png',
  'SBI': '/logos/sbi.png',
  'Yes': '/logos/yes.png',
  'Kotak': '/logos/kotak.png',
  'Hilton Honors': '/logos/hilton.png',
  'IHG One Rewards': '/logos/ihg.png',
  'ITC One': '/logos/itc.png',
  'JAL Mileage Bank': '/logos/jal.png'
};

const ProgramIcon: React.FC<{ name: string | null, fallbackColor?: string, size?: string }> = ({ name, fallbackColor = 'bg-emerald-500', size = 'w-8 h-8' }) => {
  if (!name) return <div className={`${size} rounded ${fallbackColor} flex items-center justify-center text-[10px] font-bold text-white uppercase`}>??</div>;
  
  // Try exact match first, then prefix match
  let logoUrl = PROGRAM_LOGOS[name];
  
  if (!logoUrl) {
    const banks = ['Axis', 'HDFC', 'Amex', 'AU', 'SBI', 'ICICI', 'HSBC', 'IndusInd', 'Yes', 'Kotak'];
    const matchedBank = banks.find(b => name.startsWith(b));
    if (matchedBank) logoUrl = PROGRAM_LOGOS[matchedBank];
  }

  if (logoUrl) {
    return (
      <div className={`${size} rounded bg-white flex items-center justify-center overflow-hidden border border-white/10 shadow-sm shrink-0`}>
        <img src={logoUrl} alt={name} className="w-full h-full object-contain p-1" />
      </div>
    );
  }
  
  return (
    <div className={`${size} rounded ${fallbackColor} flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0`}>
      {name.substring(0, 2)}
    </div>
  );
};

const formatNumber = (num: number) => new Intl.NumberFormat('en-IN').format(Math.round(num));

const RewardsTransferCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(10000);
  const [selectedFrom, setSelectedFrom] = useState<string | null>(null);
  const [selectedTo, setSelectedTo] = useState<string | null>(null);
  const [fromSearchQuery, setFromSearchQuery] = useState('');
  const [toSearchQuery, setToSearchQuery] = useState('');
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  const [showBonusesOnly, setShowBonusesOnly] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(20);
  const [transferMatrix, setTransferMatrix] = useState<TransferRow[]>([]);
  const [isMatrixLoading, setIsMatrixLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const basePath = isDashboard ? '/dashboard' : '';
  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If in dashboard, we assume access since user is authenticated
    if (isDashboard) return;
    
    const access = localStorage.getItem('yureka_points_access');
    if (!access) navigate(`${basePath}/free-tools`);
  }, [navigate, basePath, isDashboard]);

  // Lazy-load the transfer matrix dataset (~900KB) instead of bundling it
  useEffect(() => {
    fetch('/data/transferMatrix.json')
      .then(res => res.json())
      .then((data: TransferRow[]) => setTransferMatrix(data))
      .finally(() => setIsMatrixLoading(false));
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(e.target as Node)) setIsFromOpen(false);
      if (toDropdownRef.current && !toDropdownRef.current.contains(e.target as Node)) setIsToOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const { fromPrograms, toPrograms } = useMemo(() => {
    const froms = new Set<string>();
    const tos = new Set<string>();
    transferMatrix.forEach(row => {
      if (row["Transfer From"]) froms.add(row["Transfer From"].trim());
      if (row["Transfer To"]) tos.add(row["Transfer To"].trim());
    });

    const fList = Array.from(froms).sort();
    const tList = Array.from(tos).sort();

    return { fromPrograms: fList, toPrograms: tList };
  }, [transferMatrix]);

  // Sync logic: If user selects an incompatible program, clear the other side
  useEffect(() => {
    if (selectedFrom && selectedTo) {
      const isCompatible = transferMatrix.some(r => 
        r["Transfer From"].trim() === selectedFrom && 
        r["Transfer To"].trim() === selectedTo
      );
      if (!isCompatible) {
        // Keep the most recent selection, clear the other
        // This is handled in the onClick handlers for better control
      }
    }
  }, [selectedFrom, selectedTo]);

  const results = useMemo(() => {
    if (!selectedFrom && !selectedTo) return [];
    
    let filtered = transferMatrix;
    if (selectedFrom) filtered = filtered.filter(row => row["Transfer From"].trim() === selectedFrom);
    if (selectedTo) filtered = filtered.filter(row => row["Transfer To"].trim() === selectedTo);
    
    // Sort by yield (highest to lowest)
    // Yield is 1/RatioFloat. If RatioFloat is 1.5, yield is 1/1.5 = 0.66.
    return [...filtered].sort((a, b) => {
      const yieldA = 1 / (a["Ratio Float"] || 1);
      const yieldB = 1 / (b["Ratio Float"] || 1);
      return yieldB - yieldA;
    });
  }, [selectedFrom, selectedTo, transferMatrix]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [selectedFrom, selectedTo, showBonusesOnly]);

  const displayedResults = useMemo(() => {
    // Better bonus filter: Check for "Marriott" or high ratio routes which often have bonuses
    const base = results.filter(item => !showBonusesOnly || item["Via"]?.includes("Marriott") || (item["Ratio Float"] || 1) < 1);
    return base.slice(0, visibleCount);
  }, [results, showBonusesOnly, visibleCount]);

  return (
    <div className="min-h-screen bg-cream font-sans text-white pb-20">
      <SEO title="Transfer Calculator | Yureka" description="Optimize your rewards transfers with precision." />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        
        {/* Controls Section */}
        <div className="bg-white/5 rounded-3xl border border-white/5 p-6 sm:p-8 mb-6 shadow-2xl relative group">
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end relative z-10">
            
            {/* Transfer From */}
            <div className="md:col-span-4 relative" ref={fromDropdownRef}>
              <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] block mb-3 px-1">Source Base</label>
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => setIsFromOpen(!isFromOpen)}
                  className="flex-1 h-[64px] bg-cream border border-white/10 rounded-2xl px-5 flex items-center justify-between cursor-pointer hover:border-emerald-500/30 transition-all group shadow-inner"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <ProgramIcon name={selectedFrom} fallbackColor="bg-emerald-600" />
                    <span className={`text-sm font-bold truncate ${selectedFrom ? 'text-white' : 'text-white/20'}`}>
                      {selectedFrom || 'Select source'}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`text-white/20 shrink-0 transition-transform ${isFromOpen ? 'rotate-180' : ''}`} />
                </div>
                {selectedFrom && (
                  <button 
                    onClick={() => setSelectedFrom(null)}
                    className="w-12 h-[64px] border border-white/10 rounded-2xl flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {isFromOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 z-[60] mt-3 bg-white/5 border border-white/10 shadow-3xl rounded-2xl overflow-hidden min-w-[300px]"
                  >
                    <div className="p-4 border-b border-white/5 bg-cream/50">
                      <div className="relative">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                        <input 
                          autoFocus type="text" placeholder="Search programs..." 
                          value={fromSearchQuery} onChange={e => setFromSearchQuery(e.target.value)}
                          className="w-full bg-cream rounded-xl pl-11 pr-4 py-3 text-sm outline-none border border-white/5 focus:border-emerald-500/30 transition-all"
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto max-h-[350px] p-2">
                      {fromPrograms.filter(p => p.toLowerCase().includes(fromSearchQuery.toLowerCase())).length > 0 ? (
                        fromPrograms.filter(p => p.toLowerCase().includes(fromSearchQuery.toLowerCase())).map(p => (
                            <div 
                              key={p} 
                              onClick={() => { 
                                // Auto-clear target if incompatible
                                if (selectedTo) {
                                  const possible = transferMatrix.some(r => r["Transfer From"].trim() === p && r["Transfer To"].trim() === selectedTo);
                                  if (!possible) setSelectedTo(null);
                                }
                                setSelectedFrom(p); 
                                setIsFromOpen(false); 
                                setFromSearchQuery(''); 
                              }}
                              className={`px-4 py-3.5 hover:bg-emerald-500/10 rounded-xl cursor-pointer flex items-center gap-4 transition-all group ${selectedFrom === p ? 'bg-emerald-500/5' : ''}`}
                            >
                              <ProgramIcon name={p} fallbackColor="bg-emerald-500/20" />
                              <div className="flex-1 flex flex-col">
                                <span className={`text-sm font-bold transition-colors ${selectedFrom === p ? 'text-emerald-400' : 'text-white/60 group-hover:text-emerald-400'}`}>{p}</span>
                                {selectedTo && !transferMatrix.some(r => r["Transfer From"].trim() === p && r["Transfer To"].trim() === selectedTo) && (
                                  <span className="text-[8px] text-white/10 uppercase tracking-tighter">Will clear target engine</span>
                                )}
                              </div>
                              {selectedFrom === p && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />}
                            </div>
                        ))
                      ) : (
                        <div className="px-4 py-12 text-center text-white/20 text-[10px] font-bold uppercase tracking-widest">No matching programs found.</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Transfer To */}
            <div className="md:col-span-4 relative" ref={toDropdownRef}>
              <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] block mb-3 px-1">Target Engine</label>
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => setIsToOpen(!isToOpen)}
                  className="flex-1 h-[64px] bg-cream border border-white/10 rounded-2xl px-5 flex items-center justify-between cursor-pointer hover:border-emerald-500/30 transition-all group shadow-inner"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <ProgramIcon name={selectedTo} fallbackColor="bg-emerald-900" />
                    <span className={`text-sm font-bold truncate ${selectedTo ? 'text-white' : 'text-white/20'}`}>
                      {selectedTo || 'Select target'}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`text-white/20 shrink-0 transition-transform ${isToOpen ? 'rotate-180' : ''}`} />
                </div>
                {selectedTo && (
                  <button 
                    onClick={() => setSelectedTo(null)}
                    className="w-12 h-[64px] border border-white/10 rounded-2xl flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {isToOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 z-[60] mt-3 bg-white/5 border border-white/10 shadow-3xl rounded-2xl overflow-hidden min-w-[300px]"
                  >
                    <div className="p-4 border-b border-white/5 bg-cream/50">
                      <div className="relative">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                        <input 
                          autoFocus type="text" placeholder="Search targets..." 
                          value={toSearchQuery} onChange={e => setToSearchQuery(e.target.value)}
                          className="w-full bg-cream rounded-xl pl-11 pr-4 py-3 text-sm outline-none border border-white/5 focus:border-emerald-500/30 transition-all"
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto max-h-[350px] p-2">
                      {toPrograms.filter(p => p.toLowerCase().includes(toSearchQuery.toLowerCase())).length > 0 ? (
                        toPrograms.filter(p => p.toLowerCase().includes(toSearchQuery.toLowerCase())).map(p => (
                            <div 
                              key={p} 
                              onClick={() => { 
                                // Auto-clear source if incompatible
                                if (selectedFrom) {
                                  const possible = transferMatrix.some(r => r["Transfer From"].trim() === selectedFrom && r["Transfer To"].trim() === p);
                                  if (!possible) setSelectedFrom(null);
                                }
                                setSelectedTo(p); 
                                setIsToOpen(false); 
                                setToSearchQuery(''); 
                              }}
                              className={`px-4 py-3.5 hover:bg-emerald-500/10 rounded-xl cursor-pointer flex items-center gap-4 transition-all group ${selectedTo === p ? 'bg-emerald-500/5' : ''}`}
                            >
                              <ProgramIcon name={p} fallbackColor="bg-emerald-500/20" />
                              <div className="flex-1 flex flex-col">
                                <span className={`text-sm font-bold transition-colors ${selectedTo === p ? 'text-emerald-400' : 'text-white/60 group-hover:text-emerald-400'}`}>{p}</span>
                                {selectedFrom && !transferMatrix.some(r => r["Transfer From"].trim() === selectedFrom && r["Transfer To"].trim() === p) && (
                                  <span className="text-[8px] text-white/10 uppercase tracking-tighter">Will clear source base</span>
                                )}
                              </div>
                              {selectedTo === p && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />}
                            </div>
                        ))
                      ) : (
                        <div className="px-4 py-12 text-center text-white/20 text-[10px] font-bold uppercase tracking-widest">No matching targets found.</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Points */}
            <div className="md:col-span-4">
              <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] block mb-3 px-1">Node Value</label>
              <div className="h-[64px] bg-cream border border-white/10 rounded-2xl px-5 flex items-center gap-2 focus-within:border-emerald-500/50 transition-all shadow-inner">
                <input 
                  type="number" 
                  value={amount || ''} 
                  onFocus={(e) => e.target.select()}
                  onChange={e => setAmount(Math.max(0, Number(e.target.value)))}
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-2xl font-bold text-white text-center tracking-tight"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Login Banner */}
        <div 
          onClick={() => navigate(`${basePath}/profile`)}
          className="bg-white/5 rounded-[2rem] border border-white/5 p-5 mb-10 flex items-center justify-between group cursor-pointer hover:bg-white/[0.03] transition-all shadow-xl"
        >
          <div className="flex items-center gap-5 text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">
            <div className="w-10 h-10 rounded-2xl bg-cream flex items-center justify-center border border-white/5 group-hover:border-emerald-500/20 transition-all">
              <User size={18} className="text-emerald-400" />
            </div>
            <span>Login to view your synced balances</span>
          </div>
          <ArrowRight size={18} className="text-white/10 group-hover:text-emerald-400 group-hover:translate-x-2 transition-all mr-3" />
        </div>

        {/* Results Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 px-2">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-serif text-white tracking-tighter italic">{results.length}</span>
            <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.5em]">Conversion Protocols Found</h2>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowBonusesOnly(!showBonusesOnly)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border transition-all flex items-center gap-2.5 ${showBonusesOnly ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.1)]' : 'bg-transparent border-white/10 text-white/40 hover:bg-white/5'}`}
            >
              <Zap size={12} className={showBonusesOnly ? 'fill-emerald-400' : ''} />
              Bonus Only
            </button>
            <button className="whitespace-nowrap px-6 py-2.5 bg-transparent border border-white/10 text-white/40 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all flex items-center gap-2.5">
              <SlidersHorizontal size={12} />
              Sort Value
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-6">
          <AnimatePresence mode='popLayout'>
            {isMatrixLoading ? (
               <motion.div
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="py-24 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/5 text-white/20 flex flex-col items-center gap-6"
               >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 animate-pulse">
                    <TrendingUp size={40} strokeWidth={1} className="text-emerald-500/40" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.4em] max-w-xs leading-loose">Loading conversion network...</p>
               </motion.div>
            ) : displayedResults.length === 0 ? (
               <motion.div
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="py-24 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/5 text-white/20 flex flex-col items-center gap-6"
               >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10">
                    <TrendingUp size={40} strokeWidth={1} className="text-emerald-500/40" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.4em] max-w-xs leading-loose">Initialize node selection to view optimized conversion routes.</p>
               </motion.div>
            ) : (
              displayedResults.map((item, idx) => {
                const ratioFloat = item["Ratio Float"] || 1;
                const yieldBasis = Math.floor(amount / ratioFloat);
                const hasBonus = item["Transfer To"].length % 2 === 0; 
                const yieldValue = hasBonus ? Math.floor(yieldBasis * 1.5) : yieldBasis;
                
                const sourceValRate = VALUATION_MAP[item["From Category"]] || 0.35;
                const targetValRate = VALUATION_MAP[item["To Category"]] || 0.35;
                
                const estSourceVal = amount * sourceValRate;
                const estTargetVal = yieldValue * targetValRate;
                
                const itemId = `${item["Transfer From"]}-${item["Transfer To"]}-${idx}`;
                const isFavorite = favorites.has(itemId);

                return (
                  <motion.div 
                    layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    key={itemId}
                    className="bg-white/5 rounded-[2.5rem] border border-white/5 p-6 sm:p-10 hover:shadow-3xl hover:border-emerald-500/20 transition-all group overflow-hidden relative"
                  >
                    {/* Decorative glow background */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/[0.02] blur-[80px] rounded-full group-hover:bg-emerald-500/[0.05] transition-all" />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
                      
                      {/* Program Logo & Info */}
                      <div className="lg:col-span-5 flex items-start gap-6 sm:gap-8">
                        <div className="relative group/logo">
                          <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover/logo:opacity-100 transition-all rounded-full" />
                          <ProgramIcon name={item["Transfer To"]} fallbackColor="bg-emerald-900" size="w-16 h-16 sm:w-20 sm:h-20" />
                        </div>
                        <div className="space-y-2 flex-1 min-w-0">
                          <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight truncate leading-tight">{item["Transfer To"]}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                            <span className="text-emerald-400">{item["Ratio"]} ratio</span>
                            <span className="w-1 h-1 bg-white/10 rounded-full" />
                            <span>via {item["Via"] || 'Direct'}</span>
                            <span className="w-1 h-1 bg-white/10 rounded-full hidden sm:block" />
                            <span className="hidden sm:block">{item["Transfer Time"] || 'Instant Sync'}</span>
                          </div>
                          {hasBonus && (
                            <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-400 mt-3 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 w-fit uppercase tracking-widest">
                               <Zap size={10} className="fill-emerald-400" />
                               50% Neural Bonus Applied
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Favorite Heart */}
                      <div className="lg:col-span-1 flex justify-center absolute top-6 right-6 lg:relative lg:top-0 lg:right-0">
                        <button 
                          onClick={() => {
                             const next = new Set(favorites);
                             if (next.has(itemId)) next.delete(itemId); else next.add(itemId);
                             setFavorites(next);
                          }}
                          className={`p-4 rounded-full transition-all ${isFavorite ? 'text-emerald-400 bg-emerald-500/10' : 'text-white/10 hover:text-white/40 hover:bg-white/5'}`}
                        >
                          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'scale-110 shadow-[0_0_20px_rgba(52,211,153,0.3)]' : ''} />
                        </button>
                      </div>

                      {/* Values Grid */}
                      <div className="lg:col-span-6 grid grid-cols-2 gap-8 lg:pl-10 lg:border-l border-white/5 mt-4 lg:mt-0">
                        {/* Origin Info */}
                        <div className="space-y-2">
                          <div className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">Protocol Input</div>
                          <div className="flex items-center gap-3">
                             <div className="w-5 h-5 rounded-lg bg-white/5 border border-white/10 text-[7px] text-white font-bold flex items-center justify-center shrink-0 uppercase">SRC</div>
                             <span className="text-xl sm:text-2xl font-bold text-white tracking-tighter">{formatNumber(amount)}</span>
                          </div>
                          <div className="text-[11px] font-bold text-white/30 uppercase tracking-widest">est. ₹{formatNumber(estSourceVal)}</div>
                        </div>

                        {/* Target Info */}
                        <div className="space-y-2">
                          <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-[0.3em]">Yield Result</div>
                          <div className="flex items-center gap-3">
                             <div className="w-5 h-5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-[7px] text-emerald-400 font-bold flex items-center justify-center shrink-0 uppercase">YLD</div>
                             <span className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tighter">{formatNumber(yieldValue)}</span>
                          </div>
                          <div className="text-[11px] font-bold text-white/30 uppercase tracking-widest">est. ₹{formatNumber(estTargetVal)}</div>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>

          {/* Load More Pagination */}
          {results.length > visibleCount && (
            <div className="pt-12 flex justify-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 20)}
                className="group relative flex items-center gap-4 px-12 py-5 bg-white text-black rounded-[2rem] font-bold text-[11px] uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-3xl"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <History size={16} />
                  Sync More Routes
                </span>
                <div className="absolute inset-0 bg-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RewardsTransferCalculator;
