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
import { useNavigate } from 'react-router-dom';
import SEO from './SEO';
import { transferMatrix } from '../data/transferMatrix';

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

const ProgramIcon: React.FC<{ name: string | null, fallbackColor?: string, size?: string }> = ({ name, fallbackColor = 'bg-blue-500', size = 'w-8 h-8' }) => {
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
      <div className={`${size} rounded bg-white flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm shrink-0`}>
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

  const navigate = useNavigate();
  const fromDropdownRef = useRef<HTMLDivElement>(null);
  const toDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const access = localStorage.getItem('yureka_points_access');
    if (!access) navigate('/yureka-os');
  }, [navigate]);

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
      froms.add(row["Transfer From"]);
      tos.add(row["Transfer To"]);
    });

    let fList = Array.from(froms);
    let tList = Array.from(tos);

    if (selectedFrom) {
      const valid = new Set(transferMatrix.filter(r => r["Transfer From"] === selectedFrom).map(r => r["Transfer To"]));
      tList = tList.filter(t => valid.has(t));
    }
    if (selectedTo) {
      const valid = new Set(transferMatrix.filter(r => r["Transfer To"] === selectedTo).map(r => r["Transfer From"]));
      fList = fList.filter(f => valid.has(f));
    }

    return { fromPrograms: fList.sort(), toPrograms: tList.sort() };
  }, [selectedFrom, selectedTo]);

  const results = useMemo(() => {
    if (!selectedFrom && !selectedTo) return [];
    let filtered = transferMatrix;
    if (selectedFrom) filtered = filtered.filter(row => row["Transfer From"] === selectedFrom);
    if (selectedTo) filtered = filtered.filter(row => row["Transfer To"] === selectedTo);
    
    // Sort by yield (highest to lowest)
    return filtered.sort((a, b) => (1 / (a["Ratio Float"] || 1)) - (1 / (b["Ratio Float"] || 1))).reverse();
  }, [selectedFrom, selectedTo]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [selectedFrom, selectedTo, showBonusesOnly]);

  const displayedResults = useMemo(() => {
    const base = results.filter(item => !showBonusesOnly || (item["Transfer To"].length % 2 === 0));
    return base.slice(0, visibleCount);
  }, [results, showBonusesOnly, visibleCount]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      <SEO title="Transfer Calculator | Yureka" description="Optimize your rewards transfers with precision." />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        
        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 items-end">
            
            {/* Transfer From */}
            <div className="md:col-span-4 relative" ref={fromDropdownRef}>
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">Transfer From</label>
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => setIsFromOpen(!isFromOpen)}
                  className="flex-1 h-[54px] sm:h-[60px] bg-white border border-slate-200 rounded-xl px-4 flex items-center justify-between cursor-pointer hover:border-slate-400 transition-all group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <ProgramIcon name={selectedFrom} fallbackColor="bg-blue-500" />
                    <span className={`text-sm font-semibold truncate ${selectedFrom ? 'text-slate-900' : 'text-slate-400'}`}>
                      {selectedFrom || 'Select source'}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${isFromOpen ? 'rotate-180' : ''}`} />
                </div>
                {selectedFrom && (
                  <button 
                    onClick={() => setSelectedFrom(null)}
                    className="w-10 h-[54px] sm:w-12 sm:h-[60px] border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {isFromOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 right-0 z-[60] mt-2 bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden min-w-[280px]"
                  >
                    <div className="p-3 border-b border-slate-100">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          autoFocus type="text" placeholder="Search programs..." 
                          value={fromSearchQuery} onChange={e => setFromSearchQuery(e.target.value)}
                          className="w-full bg-slate-50 rounded-lg pl-10 pr-4 py-2 text-sm outline-none"
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto max-h-[300px]">
                      {fromPrograms.filter(p => p.toLowerCase().includes(fromSearchQuery.toLowerCase())).length > 0 ? (
                        fromPrograms.filter(p => p.toLowerCase().includes(fromSearchQuery.toLowerCase())).map(p => (
                          <div 
                            key={p} onClick={() => { setSelectedFrom(p); setIsFromOpen(false); setFromSearchQuery(''); }}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors"
                          >
                            <ProgramIcon name={p} fallbackColor="bg-blue-400" />
                            <span className="text-sm font-medium text-slate-700">{p}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-slate-400 text-xs">No matching programs found.</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Transfer To */}
            <div className="md:col-span-4 relative" ref={toDropdownRef}>
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">Transfer To</label>
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => setIsToOpen(!isToOpen)}
                  className="flex-1 h-[54px] sm:h-[60px] bg-white border border-slate-200 rounded-xl px-4 flex items-center justify-between cursor-pointer hover:border-slate-400 transition-all group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <ProgramIcon name={selectedTo} fallbackColor="bg-indigo-600" />
                    <span className={`text-sm font-semibold truncate ${selectedTo ? 'text-slate-900' : 'text-slate-400'}`}>
                      {selectedTo || 'Select target'}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform ${isToOpen ? 'rotate-180' : ''}`} />
                </div>
                {selectedTo && (
                  <button 
                    onClick={() => setSelectedTo(null)}
                    className="w-10 h-[54px] sm:w-12 sm:h-[60px] border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <AnimatePresence>
                {isToOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 right-0 z-[60] mt-2 bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden min-w-[280px]"
                  >
                    <div className="p-3 border-b border-slate-100">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          autoFocus type="text" placeholder="Search targets..." 
                          value={toSearchQuery} onChange={e => setToSearchQuery(e.target.value)}
                          className="w-full bg-slate-50 rounded-lg pl-10 pr-4 py-2 text-sm outline-none"
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto max-h-[300px]">
                      {toPrograms.filter(p => p.toLowerCase().includes(toSearchQuery.toLowerCase())).length > 0 ? (
                        toPrograms.filter(p => p.toLowerCase().includes(toSearchQuery.toLowerCase())).map(p => (
                          <div 
                            key={p} onClick={() => { setSelectedTo(p); setIsToOpen(false); setToSearchQuery(''); }}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors"
                          >
                            <ProgramIcon name={p} fallbackColor="bg-indigo-400" />
                            <span className="text-sm font-medium text-slate-700">{p}</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-slate-400 text-xs">No matching targets found.</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Points */}
            <div className="md:col-span-4">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">Transfer Points</label>
              <div className="h-[54px] sm:h-[60px] bg-white border border-slate-200 rounded-xl px-4 flex items-center gap-2 focus-within:border-blue-500 transition-all">
                <input 
                  type="number" 
                  value={amount || ''} 
                  onFocus={(e) => e.target.select()}
                  onChange={e => setAmount(Math.max(0, Number(e.target.value)))}
                  className="flex-1 bg-transparent border-none outline-none text-lg sm:text-xl font-bold text-slate-900 text-center"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Login Banner */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-8 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="text-sm">Login to view your balances</span>
          </div>
          <ArrowRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform mr-2" />
        </div>

        {/* Results Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-1">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {results.length} <span className="font-normal text-slate-400 text-sm sm:text-base ml-1">Transfer To Options</span>
          </h2>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            <button 
              onClick={() => setShowBonusesOnly(!showBonusesOnly)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold border transition-all flex items-center gap-2 shrink-0 ${showBonusesOnly ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Zap size={12} className={showBonusesOnly ? 'fill-amber-600' : ''} />
              Show Bonus Only
            </button>
            <button className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-full text-[10px] sm:text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shrink-0">
              <SlidersHorizontal size={12} />
              Sort by Value
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          <AnimatePresence mode='popLayout'>
            {displayedResults.length === 0 ? (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                 className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 flex flex-col items-center gap-4"
               >
                  <TrendingUp size={40} strokeWidth={1.5} className="text-slate-200" />
                  <p className="text-sm font-medium">Select a source bank or airline to view conversion routes.</p>
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
                    layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    key={itemId}
                    className="bg-white rounded-3xl sm:rounded-[2rem] border border-slate-200 p-5 sm:p-8 hover:shadow-xl hover:border-slate-300 transition-all group overflow-hidden relative"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                      
                      {/* Program Logo & Info */}
                      <div className="lg:col-span-5 flex items-start gap-4 sm:gap-6">
                        <ProgramIcon name={item["Transfer To"]} fallbackColor="bg-indigo-900" size="w-12 h-12 sm:w-14 sm:h-14" />
                        <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-tight truncate">{item["Transfer To"]}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <span>{item["Ratio"]} ratio</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="text-blue-500">via {item["Via"] || 'Direct'}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full sm:block hidden" />
                            <span className="sm:block hidden">{item["Transfer Time"] || 'Up to 3 days'}</span>
                          </div>
                          {hasBonus && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 mt-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 w-fit">
                               <Zap size={10} className="fill-emerald-600" />
                               50% Bonus Applied • until Apr 23
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Favorite Heart */}
                      <div className="lg:col-span-1 flex justify-center absolute top-4 right-4 lg:relative lg:top-0 lg:right-0">
                        <button 
                          onClick={() => {
                             const next = new Set(favorites);
                             if (next.has(itemId)) next.delete(itemId); else next.add(itemId);
                             setFavorites(next);
                          }}
                          className={`p-2 sm:p-3 rounded-full transition-all ${isFavorite ? 'text-rose-500 bg-rose-50' : 'text-slate-200 hover:text-slate-400 hover:bg-slate-50'}`}
                        >
                          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} className={isFavorite ? 'scale-110' : ''} />
                        </button>
                      </div>

                      {/* Values Grid */}
                      <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-12 lg:pl-6 lg:border-l border-slate-100 mt-2 lg:mt-0">
                        {/* Origin Info */}
                        <div className="space-y-1">
                          <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">If you transfer</div>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                             <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-slate-900 text-[5px] sm:text-[6px] text-white font-bold flex items-center justify-center shrink-0">SR</div>
                             <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">{formatNumber(amount)}</span>
                          </div>
                          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400">est. ₹{formatNumber(estSourceVal)}</div>
                        </div>

                        {/* Target Info */}
                        <div className="space-y-1">
                          <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">You'll receive</div>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                             <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-indigo-600 text-[5px] sm:text-[6px] text-white font-bold flex items-center justify-center shrink-0">TR</div>
                             <span className="text-lg sm:text-xl font-bold text-indigo-600 tracking-tight">{formatNumber(yieldValue)}</span>
                          </div>
                          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400">est. ₹{formatNumber(estTargetVal)}</div>
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
            <div className="pt-8 flex justify-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 20)}
                className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                <History size={18} />
                Load More Opportunities
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RewardsTransferCalculator;
